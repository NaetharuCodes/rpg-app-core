package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type AdventureHandler struct {
	DB *gorm.DB
}

func NewAdventureHandler(db *gorm.DB) *AdventureHandler {
	return &AdventureHandler{DB: db}
}

// POST /adventures - requires authentication
func (h *AdventureHandler) CreateAdventure(c *gin.Context) {
	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var adventure models.Adventure
	if err := c.ShouldBindJSON(&adventure); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set user ownership
	adventure.UserID = &user.ID

	// Create adventure
	if err := h.DB.Create(&adventure).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create adventure"})
		return
	}

	// Auto-create default first episode
	defaultEpisode := models.Episode{
		AdventureID: adventure.ID,
		Order:       1,
		Title:       "Episode 1",
		Description: "",
	}
	if err := h.DB.Create(&defaultEpisode).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create default episode"})
		return
	}

	// Return adventure with episodes
	h.DB.Preload("Episodes").First(&adventure, adventure.ID)
	c.JSON(http.StatusCreated, adventure)
}

// GET /adventures
func (h *AdventureHandler) GetAdventures(c *gin.Context) {
	var adventures []models.Adventure
	query := h.DB.Preload("Episodes")

	user, isAuthenticated := middleware.GetCurrentUser(c)
	if isAuthenticated {
		query = query.Where("user_id = ?", user.ID)
	} else {
		// For non-authenticated users, only show official adventures
		query = query.Where("user_id IS NULL")
	}

	if err := query.Find(&adventures).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch adventures"})
		return
	}

	c.JSON(http.StatusOK, adventures)
}

// GET /adventures/:id
func (h *AdventureHandler) GetAdventure(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var adventure models.Adventure
	query := h.DB.Preload("Episodes.Scenes")

	user, isAuthenticated := middleware.GetCurrentUser(c)
	if isAuthenticated {
		query = query.Where("(user_id = ? OR user_id IS NULL) AND id = ?", user.ID, id)
	} else {
		query = query.Where("user_id IS NULL AND id = ?", id)
	}

	if err := query.First(&adventure).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found"})
		return
	}

	c.JSON(http.StatusOK, adventure)
}

// PATCH /adventures/:id
func (h *AdventureHandler) UpdateAdventure(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var adventure models.Adventure
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, id).First(&adventure).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	if err := c.ShouldBindJSON(&adventure); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure ownership doesn't change
	adventure.UserID = &user.ID

	if err := h.DB.Save(&adventure).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update adventure"})
		return
	}

	c.JSON(http.StatusOK, adventure)
}

// DELETE /adventures/:id
func (h *AdventureHandler) DeleteAdventure(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var adventure models.Adventure
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, id).First(&adventure).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	// Start a transaction to ensure all deletes succeed or none do
	tx := h.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Delete scenes first (they reference episodes)
	if err := tx.Exec("DELETE FROM scenes WHERE episode_id IN (SELECT id FROM episodes WHERE adventure_id = ?)", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete scenes"})
		return
	}

	// Delete episodes
	if err := tx.Where("adventure_id = ?", id).Delete(&models.Episode{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete episodes"})
		return
	}

	// Delete title page if exists
	tx.Where("adventure_id = ?", id).Delete(&models.TitlePage{})

	// Delete epilogue and related data if exists
	tx.Exec("DELETE FROM epilogue_outcomes WHERE epilogue_id IN (SELECT id FROM epilogues WHERE adventure_id = ?)", id)
	tx.Exec("DELETE FROM follow_up_hooks WHERE epilogue_id IN (SELECT id FROM epilogues WHERE adventure_id = ?)", id)
	tx.Where("adventure_id = ?", id).Delete(&models.Epilogue{})

	// Finally delete the adventure
	if err := tx.Delete(&adventure).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete adventure"})
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Adventure deleted successfully"})
}

// TITLE PAGE ENDPOINTS

// GET /adventures/:id/title-page
func (h *AdventureHandler) GetTitlePage(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	// Verify user has access to this adventure
	if !h.hasAdventureAccess(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var titlePage models.TitlePage
	if err := h.DB.Where("adventure_id = ?", adventureID).First(&titlePage).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Title page not found"})
		return
	}

	c.JSON(http.StatusOK, titlePage)
}

// POST /adventures/:id/title-page
func (h *AdventureHandler) CreateTitlePage(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	// Check if title page already exists
	var existingCount int64
	h.DB.Model(&models.TitlePage{}).Where("adventure_id = ?", adventureID).Count(&existingCount)
	if existingCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Title page already exists"})
		return
	}

	var titlePage models.TitlePage
	if err := c.ShouldBindJSON(&titlePage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	titlePage.AdventureID = uint(adventureID)

	if err := h.DB.Create(&titlePage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create title page"})
		return
	}

	c.JSON(http.StatusCreated, titlePage)
}

// PATCH /adventures/:id/title-page
func (h *AdventureHandler) UpdateTitlePage(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var titlePage models.TitlePage
	if err := h.DB.Where("adventure_id = ?", adventureID).First(&titlePage).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Title page not found"})
		return
	}

	if err := c.ShouldBindJSON(&titlePage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Don't allow changing adventure_id
	titlePage.AdventureID = uint(adventureID)

	if err := h.DB.Save(&titlePage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update title page"})
		return
	}

	c.JSON(http.StatusOK, titlePage)
}

// DELETE /adventures/:id/title-page
func (h *AdventureHandler) DeleteTitlePage(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var titlePage models.TitlePage
	if err := h.DB.Where("adventure_id = ?", adventureID).First(&titlePage).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Title page not found"})
		return
	}

	// Delete title page
	if err := h.DB.Delete(&titlePage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete title page"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Title page deleted successfully"})
}

// EPISODE ENDPOINTS

// GET /adventures/:id/episodes
func (h *AdventureHandler) GetEpisodes(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	// Verify user has access to this adventure
	if !h.hasAdventureAccess(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var episodes []models.Episode
	if err := h.DB.Where("adventure_id = ?", adventureID).Order("\"order\" ASC").Find(&episodes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch episodes"})
		return
	}

	c.JSON(http.StatusOK, episodes)
}

// POST /adventures/:id/episodes
func (h *AdventureHandler) CreateEpisode(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var episode models.Episode
	if err := c.ShouldBindJSON(&episode); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get next order number
	var maxOrder int
	h.DB.Model(&models.Episode{}).Where("adventure_id = ?", adventureID).Select(`COALESCE(MAX("order"), 0)`).Scan(&maxOrder)

	episode.AdventureID = uint(adventureID)
	episode.Order = maxOrder + 1

	if err := h.DB.Create(&episode).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create episode"})
		return
	}

	c.JSON(http.StatusCreated, episode)
}

// PATCH /adventures/:id/episodes/:episodeId
func (h *AdventureHandler) UpdateEpisode(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	episodeID, err := strconv.Atoi(c.Param("episodeId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid episode ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var episode models.Episode
	if err := h.DB.Where("id = ? AND adventure_id = ?", episodeID, adventureID).First(&episode).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Episode not found"})
		return
	}

	if err := c.ShouldBindJSON(&episode); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Don't allow changing adventure_id or order through update
	episode.AdventureID = uint(adventureID)

	if err := h.DB.Save(&episode).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update episode"})
		return
	}

	c.JSON(http.StatusOK, episode)
}

// DELETE /adventures/:id/episodes/:episodeId
func (h *AdventureHandler) DeleteEpisode(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	episodeID, err := strconv.Atoi(c.Param("episodeId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid episode ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	// Check if this is the last episode
	var episodeCount int64
	h.DB.Model(&models.Episode{}).Where("adventure_id = ?", adventureID).Count(&episodeCount)
	if episodeCount <= 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete the last episode"})
		return
	}

	// Get the episode to delete
	var episode models.Episode
	if err := h.DB.Where("id = ? AND adventure_id = ?", episodeID, adventureID).First(&episode).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Episode not found"})
		return
	}

	// Delete episode (scenes will be cascade deleted by foreign key constraint)
	if err := h.DB.Delete(&episode).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete episode"})
		return
	}

	// Reorder remaining episodes
	h.DB.Model(&models.Episode{}).Where("adventure_id = ? AND order > ?", adventureID, episode.Order).
		Update("order", gorm.Expr("order - 1"))

	c.JSON(http.StatusOK, gin.H{"message": "Episode deleted successfully"})
}

// SCENE ENDPOINTS

// GET /adventures/:id/episodes/:episodeId/scenes
func (h *AdventureHandler) GetScenes(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	episodeID, err := strconv.Atoi(c.Param("episodeId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid episode ID"})
		return
	}

	// Verify user has access to this adventure
	if !h.hasAdventureAccess(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	// Verify episode belongs to adventure
	var episode models.Episode
	if err := h.DB.Where("id = ? AND adventure_id = ?", episodeID, adventureID).First(&episode).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Episode not found"})
		return
	}

	var scenes []models.Scene
	if err := h.DB.Where("episode_id = ?", episodeID).Order("\"order\" ASC").Find(&scenes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch scenes"})
		return
	}

	c.JSON(http.StatusOK, scenes)
}

// POST /adventures/:id/episodes/:episodeId/scenes
func (h *AdventureHandler) CreateScene(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	episodeID, err := strconv.Atoi(c.Param("episodeId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid episode ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure and episode exists
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var episode models.Episode
	if err := h.DB.Where("id = ? AND adventure_id = ?", episodeID, adventureID).First(&episode).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Episode not found"})
		return
	}

	var scene models.Scene
	if err := c.ShouldBindJSON(&scene); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get next order number within this episode
	var maxOrder int
	h.DB.Model(&models.Scene{}).Where("episode_id = ?", episodeID).Select(`COALESCE(MAX("order"), 0)`).Scan(&maxOrder)

	scene.EpisodeID = uint(episodeID)
	scene.Order = maxOrder + 1

	if err := h.DB.Create(&scene).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create scene"})
		return
	}

	c.JSON(http.StatusCreated, scene)
}

// PATCH /adventures/:id/episodes/:episodeId/scenes/:sceneId
func (h *AdventureHandler) UpdateScene(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	episodeID, err := strconv.Atoi(c.Param("episodeId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid episode ID"})
		return
	}

	sceneID, err := strconv.Atoi(c.Param("sceneId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid scene ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	// Find scene and verify it belongs to the episode
	var scene models.Scene
	if err := h.DB.Joins("JOIN episodes ON scenes.episode_id = episodes.id").
		Where("scenes.id = ? AND scenes.episode_id = ? AND episodes.adventure_id = ?", sceneID, episodeID, adventureID).
		First(&scene).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Scene not found"})
		return
	}

	if err := c.ShouldBindJSON(&scene); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Don't allow changing episode_id or order through update
	scene.EpisodeID = uint(episodeID)

	if err := h.DB.Save(&scene).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update scene"})
		return
	}

	c.JSON(http.StatusOK, scene)
}

// DELETE /adventures/:id/episodes/:episodeId/scenes/:sceneId
func (h *AdventureHandler) DeleteScene(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	episodeID, err := strconv.Atoi(c.Param("episodeId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid episode ID"})
		return
	}

	sceneID, err := strconv.Atoi(c.Param("sceneId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid scene ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	// Find scene and verify it belongs to the episode
	var scene models.Scene
	if err := h.DB.Joins("JOIN episodes ON scenes.episode_id = episodes.id").
		Where("scenes.id = ? AND scenes.episode_id = ? AND episodes.adventure_id = ?", sceneID, episodeID, adventureID).
		First(&scene).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Scene not found"})
		return
	}

	// Delete scene
	if err := h.DB.Delete(&scene).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete scene"})
		return
	}

	// Reorder remaining scenes in the episode
	h.DB.Model(&models.Scene{}).Where("episode_id = ? AND order > ?", episodeID, scene.Order).
		Update("order", gorm.Expr("order - 1"))

	c.JSON(http.StatusOK, gin.H{"message": "Scene deleted successfully"})
}

// EPILOGUE ENDPOINTS

// GET /adventures/:id/epilogue
func (h *AdventureHandler) GetEpilogue(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	// Verify user has access to this adventure
	if !h.hasAdventureAccess(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var epilogue models.Epilogue
	if err := h.DB.Preload("Outcomes").Preload("FollowUpHooks").Where("adventure_id = ?", adventureID).First(&epilogue).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Epilogue not found"})
		return
	}

	c.JSON(http.StatusOK, epilogue)
}

// POST /adventures/:id/epilogue
func (h *AdventureHandler) CreateEpilogue(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	// Check if epilogue already exists
	var existingCount int64
	h.DB.Model(&models.Epilogue{}).Where("adventure_id = ?", adventureID).Count(&existingCount)
	if existingCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Epilogue already exists"})
		return
	}

	var epilogue models.Epilogue
	if err := c.ShouldBindJSON(&epilogue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	epilogue.AdventureID = uint(adventureID)

	if err := h.DB.Create(&epilogue).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create epilogue"})
		return
	}

	c.JSON(http.StatusCreated, epilogue)
}

// PATCH /adventures/:id/epilogue
func (h *AdventureHandler) UpdateEpilogue(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var epilogue models.Epilogue
	if err := h.DB.Where("adventure_id = ?", adventureID).First(&epilogue).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Epilogue not found"})
		return
	}

	if err := c.ShouldBindJSON(&epilogue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Don't allow changing adventure_id
	epilogue.AdventureID = uint(adventureID)

	if err := h.DB.Save(&epilogue).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update epilogue"})
		return
	}

	c.JSON(http.StatusOK, epilogue)
}

// DELETE /adventures/:id/epilogue
func (h *AdventureHandler) DeleteEpilogue(c *gin.Context) {
	adventureID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid adventure ID"})
		return
	}

	_, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Verify user owns this adventure
	if !h.ownsAdventure(c, uint(adventureID)) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found or access denied"})
		return
	}

	var epilogue models.Epilogue
	if err := h.DB.Where("adventure_id = ?", adventureID).First(&epilogue).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Epilogue not found"})
		return
	}

	// Delete epilogue (outcomes and hooks will be cascade deleted by foreign key constraint)
	if err := h.DB.Delete(&epilogue).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete epilogue"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Epilogue deleted successfully"})
}

// HELPER METHODS

// Check if user has access to view adventure (owns it or it's official)
func (h *AdventureHandler) hasAdventureAccess(c *gin.Context, adventureID uint) bool {
	user, isAuthenticated := middleware.GetCurrentUser(c)

	var count int64
	query := h.DB.Model(&models.Adventure{}).Where("id = ?", adventureID)

	if isAuthenticated {
		query = query.Where("user_id = ? OR user_id IS NULL", user.ID)
	} else {
		query = query.Where("user_id IS NULL")
	}

	query.Count(&count)
	return count > 0
}

// Check if user owns the adventure (for modification operations)
func (h *AdventureHandler) ownsAdventure(c *gin.Context, adventureID uint) bool {
	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		return false
	}

	var count int64
	h.DB.Model(&models.Adventure{}).Where("id = ? AND user_id = ?", adventureID, user.ID).Count(&count)
	return count > 0
}
