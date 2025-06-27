package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type WorldEraHandler struct {
	DB *gorm.DB
}

func NewWorldEraHandler(db *gorm.DB) *WorldEraHandler {
	return &WorldEraHandler{DB: db}
}

// GET /worlds/:id/eras
func (h *WorldEraHandler) GetEras(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	// Check if world exists and user has access
	var world models.World
	user, _ := middleware.GetCurrentUser(c)

	query := h.DB
	if user == nil {
		query = query.Where("id = ? AND (is_official = ? OR reviewed = ?)", worldID, true, true)
	} else if !user.IsAdmin {
		query = query.Where("id = ? AND (is_official = ? OR reviewed = ? OR user_id = ?)", worldID, true, true, user.ID)
	} else {
		query = query.Where("id = ?", worldID)
	}

	if err := query.First(&world).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	var eras []models.WorldEra
	if err := h.DB.Where("world_id = ?", worldID).Order("sort_order ASC").Find(&eras).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch eras"})
		return
	}

	c.JSON(http.StatusOK, eras)
}

// POST /worlds/:id/eras
func (h *WorldEraHandler) CreateEra(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Check if world exists and user has access to edit
	var world models.World
	if err := h.DB.First(&world, worldID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	// Check if user owns this world or is admin
	if world.UserID == nil || *world.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var era models.WorldEra
	if err := c.ShouldBindJSON(&era); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	era.WorldID = uint(worldID)

	// Check for duplicate name
	var existingCount int64
	h.DB.Model(&models.WorldEra{}).Where("world_id = ? AND name = ?", worldID, era.Name).Count(&existingCount)
	if existingCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Era with this name already exists"})
		return
	}

	if err := h.DB.Create(&era).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create era"})
		return
	}

	c.JSON(http.StatusCreated, era)
}

// PATCH /worlds/:worldId/eras/:eraId
func (h *WorldEraHandler) UpdateEra(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	eraID, err := strconv.Atoi(c.Param("eraId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid era ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Find the era and verify it belongs to the world
	var era models.WorldEra
	if err := h.DB.Where("id = ? AND world_id = ?", eraID, worldID).First(&era).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Era not found"})
		return
	}

	// Check if user owns this world or is admin
	var world models.World
	if err := h.DB.First(&world, worldID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	if world.UserID == nil || *world.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var updates models.WorldEra
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check for duplicate name if name is being changed
	if updates.Name != "" && updates.Name != era.Name {
		var existingCount int64
		h.DB.Model(&models.WorldEra{}).Where("world_id = ? AND name = ? AND id != ?", worldID, updates.Name, eraID).Count(&existingCount)
		if existingCount > 0 {
			c.JSON(http.StatusConflict, gin.H{"error": "Era with this name already exists"})
			return
		}
	}

	if err := h.DB.Model(&era).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update era"})
		return
	}

	c.JSON(http.StatusOK, era)
}

// DELETE /worlds/:worldId/eras/:eraId
func (h *WorldEraHandler) DeleteEra(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	eraID, err := strconv.Atoi(c.Param("eraId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid era ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Find the era and verify it belongs to the world
	var era models.WorldEra
	if err := h.DB.Where("id = ? AND world_id = ?", eraID, worldID).First(&era).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Era not found"})
		return
	}

	// Check if user owns this world or is admin
	var world models.World
	if err := h.DB.First(&world, worldID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	if world.UserID == nil || *world.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Check if era is being used by timeline events
	var eventCount int64
	h.DB.Model(&models.TimelineEvent{}).Where("world_id = ? AND era = ?", worldID, era.Name).Count(&eventCount)
	if eventCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Cannot delete era that is used by timeline events"})
		return
	}

	if err := h.DB.Delete(&era).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete era"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Era deleted successfully"})
}

// POST /worlds/:id/eras/reorder
func (h *WorldEraHandler) ReorderEras(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Check if user owns this world or is admin
	var world models.World
	if err := h.DB.First(&world, worldID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	if world.UserID == nil || *world.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var request struct {
		EraIDs []uint `json:"era_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start transaction
	tx := h.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Update sort orders
	for i, eraID := range request.EraIDs {
		if err := tx.Model(&models.WorldEra{}).Where("id = ? AND world_id = ?", eraID, worldID).Update("sort_order", i).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update era order"})
			return
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	// Return updated eras
	var eras []models.WorldEra
	if err := h.DB.Where("world_id = ?", worldID).Order("sort_order ASC").Find(&eras).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated eras"})
		return
	}

	c.JSON(http.StatusOK, eras)
}
