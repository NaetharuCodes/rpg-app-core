package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type WorldHandler struct {
	DB *gorm.DB
}

func NewWorldHandler(db *gorm.DB) *WorldHandler {
	return &WorldHandler{DB: db}
}

// GET /worlds
func (h *WorldHandler) GetWorlds(c *gin.Context) {
	var worlds []models.World

	// Get current user (may be nil for unauthenticated requests)
	user, _ := middleware.GetCurrentUser(c)

	query := h.DB.Preload("User")

	// If user is not authenticated or not admin, only show official/reviewed content and user's own content
	if user == nil {
		query = query.Where("is_official = ? OR reviewed = ?", true, true)
	} else if !user.IsAdmin {
		query = query.Where("is_official = ? OR reviewed = ? OR user_id = ?", true, true, user.ID)
	}

	if err := query.Find(&worlds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch worlds"})
		return
	}

	c.JSON(http.StatusOK, worlds)
}

// GET /worlds/:id
func (h *WorldHandler) GetWorld(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	var world models.World
	user, _ := middleware.GetCurrentUser(c)

	query := h.DB.Preload("User")

	// Apply same visibility rules
	if user == nil {
		query = query.Where("id = ? AND (is_official = ? OR reviewed = ?)", id, true, true)
	} else if !user.IsAdmin {
		query = query.Where("id = ? AND (is_official = ? OR reviewed = ? OR user_id = ?)", id, true, true, user.ID)
	} else {
		query = query.Where("id = ?", id)
	}

	if err := query.First(&world).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	c.JSON(http.StatusOK, world)
}

// POST /worlds
func (h *WorldHandler) CreateWorld(c *gin.Context) {
	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var world models.World
	if err := c.ShouldBindJSON(&world); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set user ID and ensure user can't set official status
	world.UserID = &user.ID
	if !user.IsAdmin {
		world.IsOfficial = false
		world.Reviewed = false
	}

	if err := h.DB.Create(&world).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create world"})
		return
	}

	// Load the created world with user
	h.DB.Preload("User").First(&world, world.ID)

	c.JSON(http.StatusCreated, world)
}

// PATCH /worlds/:id
func (h *WorldHandler) UpdateWorld(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var world models.World
	if err := h.DB.First(&world, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	// Check if user owns this world or is admin
	if world.UserID == nil || *world.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var updates models.World
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Prevent non-admin users from setting official status
	if !user.IsAdmin {
		updates.IsOfficial = world.IsOfficial
		updates.Reviewed = world.Reviewed
	}

	if err := h.DB.Model(&world).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update world"})
		return
	}

	// Return updated world
	h.DB.Preload("User").First(&world, world.ID)
	c.JSON(http.StatusOK, world)
}

// DELETE /worlds/:id
func (h *WorldHandler) DeleteWorld(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var world models.World
	if err := h.DB.First(&world, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "World not found"})
		return
	}

	// Check if user owns this world or is admin
	if world.UserID == nil || *world.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Start a transaction to ensure all deletes succeed or none do
	tx := h.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Delete timeline events first
	if err := tx.Where("world_id = ?", id).Delete(&models.TimelineEvent{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete timeline events"})
		return
	}

	// Delete world eras
	if err := tx.Where("world_id = ?", id).Delete(&models.WorldEra{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete world eras"})
		return
	}

	// Finally delete the world
	if err := tx.Delete(&world).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete world"})
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "World deleted successfully"})
}
