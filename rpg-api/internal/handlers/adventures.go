package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type AdventureHandler struct {
	DB *gorm.DB
}

func NewAdventureHandler(db *gorm.DB) *AdventureHandler {
	return &AdventureHandler{DB: db}
}

// POST /adventures
func (h *AdventureHandler) CreateAdventure(c *gin.Context) {
	var adventure models.Adventure

	if err := c.ShouldBindJSON(&adventure); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Create(&adventure).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create adventure"})
		return
	}

	c.JSON(http.StatusCreated, adventure)
}

// GET /adventures
func (h *AdventureHandler) GetAdventures(c *gin.Context) {
	var adventures []models.Adventure

	if err := h.DB.Find(&adventures).Error; err != nil {
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
	if err := h.DB.First(&adventure, id).Error; err != nil {
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

	var adventure models.Adventure
	if err := h.DB.First(&adventure, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adventure not found"})
		return
	}

	if err := c.ShouldBindJSON(&adventure); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Save(&adventure).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update adventure"})
		return
	}

	c.JSON(http.StatusOK, adventure)
}
