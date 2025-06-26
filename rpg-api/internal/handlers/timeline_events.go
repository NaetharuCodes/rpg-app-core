package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type TimelineEventHandler struct {
	DB *gorm.DB
}

func NewTimelineEventHandler(db *gorm.DB) *TimelineEventHandler {
	return &TimelineEventHandler{DB: db}
}

// GET /worlds/:id/timeline-events
func (h *TimelineEventHandler) GetTimelineEvents(c *gin.Context) {
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

	var events []models.TimelineEvent
	if err := h.DB.Where("world_id = ?", worldID).Order("sort_order ASC").Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch timeline events"})
		return
	}

	c.JSON(http.StatusOK, events)
}

// POST /worlds/:id/timeline-events
func (h *TimelineEventHandler) CreateTimelineEvent(c *gin.Context) {
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

	var event models.TimelineEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event.WorldID = uint(worldID)
	event.UserID = &user.ID

	if err := h.DB.Create(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create timeline event"})
		return
	}

	c.JSON(http.StatusCreated, event)
}

// PATCH /worlds/:worldId/timeline-events/:eventId
func (h *TimelineEventHandler) UpdateTimelineEvent(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	eventID, err := strconv.Atoi(c.Param("eventId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var event models.TimelineEvent
	if err := h.DB.Where("id = ? AND world_id = ?", eventID, worldID).First(&event).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Timeline event not found"})
		return
	}

	// Check if user owns this event or is admin
	if event.UserID == nil || *event.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var updates models.TimelineEvent
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Model(&event).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update timeline event"})
		return
	}

	c.JSON(http.StatusOK, event)
}

// DELETE /worlds/:worldId/timeline-events/:eventId
func (h *TimelineEventHandler) DeleteTimelineEvent(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	eventID, err := strconv.Atoi(c.Param("eventId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var event models.TimelineEvent
	if err := h.DB.Where("id = ? AND world_id = ?", eventID, worldID).First(&event).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Timeline event not found"})
		return
	}

	// Check if user owns this event or is admin
	if event.UserID == nil || *event.UserID != user.ID && !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	if err := h.DB.Delete(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete timeline event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Timeline event deleted successfully"})
}
