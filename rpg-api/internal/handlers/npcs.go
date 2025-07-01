package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/generators"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type NPCHandler struct {
	DB *gorm.DB
}

func NewNPCHandler(db *gorm.DB) *NPCHandler {
	return &NPCHandler{DB: db}
}

// GET /worlds/:id/npcs
func (h *NPCHandler) GetNPCs(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	// Check world access (same logic as your other world handlers)
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

	// Get NPCs for this world
	var npcs []models.NPC
	if err := h.DB.Where("world_id = ?", worldID).
		Preload("Location").
		Preload("Memberships.Organization").
		Preload("Memberships.Rank").
		Find(&npcs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch NPCs"})
		return
	}

	c.JSON(http.StatusOK, npcs)
}

// GET /worlds/:id/npcs/:npcId
func (h *NPCHandler) GetNPC(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	npcID, err := strconv.Atoi(c.Param("npcId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid NPC ID"})
		return
	}

	// Check world access
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

	// Get specific NPC
	var npc models.NPC
	if err := h.DB.Where("world_id = ? AND id = ?", worldID, npcID).
		Preload("Location").
		Preload("Memberships.Organization").
		Preload("Memberships.Rank").
		First(&npc).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "NPC not found"})
		return
	}

	c.JSON(http.StatusOK, npc)
}

// POST /worlds/:id/npcs
func (h *NPCHandler) CreateNPC(c *gin.Context) {
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

	var npc models.NPC
	if err := c.ShouldBindJSON(&npc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	npc.WorldID = uint(worldID)

	if err := h.DB.Create(&npc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create NPC"})
		return
	}

	// Load with relationships
	h.DB.Preload("Location").
		Preload("Memberships.Organization").
		Preload("Memberships.Rank").
		First(&npc, npc.ID)

	c.JSON(http.StatusCreated, npc)
}

// PATCH /worlds/:id/npcs/:npcId
func (h *NPCHandler) UpdateNPC(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	npcID, err := strconv.Atoi(c.Param("npcId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid NPC ID"})
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

	// Get existing NPC
	var npc models.NPC
	if err := h.DB.Where("world_id = ? AND id = ?", worldID, npcID).First(&npc).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "NPC not found"})
		return
	}

	// Update with new data
	if err := c.ShouldBindJSON(&npc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure world ID doesn't change
	npc.WorldID = uint(worldID)

	if err := h.DB.Save(&npc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update NPC"})
		return
	}

	// Load with relationships
	h.DB.Preload("Location").
		Preload("Memberships.Organization").
		Preload("Memberships.Rank").
		First(&npc, npc.ID)

	c.JSON(http.StatusOK, npc)
}

// DELETE /worlds/:id/npcs/:npcId
func (h *NPCHandler) DeleteNPC(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	npcID, err := strconv.Atoi(c.Param("npcId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid NPC ID"})
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

	// Delete NPC (this will cascade to relationships due to foreign keys)
	if err := h.DB.Where("world_id = ? AND id = ?", worldID, npcID).Delete(&models.NPC{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete NPC"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "NPC deleted successfully"})
}

// POST /worlds/:id/generate-npcs
func (h *NPCHandler) GenerateNPCs(c *gin.Context) {
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

	// Parse generation parameters
	var request struct {
		PopulationSize    int     `json:"population_size"`
		OrganizationCount int     `json:"organization_count"`
		FamilyDensity     float64 `json:"family_density"`
		Seed              *int64  `json:"seed"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set defaults
	if request.PopulationSize == 0 {
		request.PopulationSize = 50
	}
	if request.OrganizationCount == 0 {
		request.OrganizationCount = 4
	}
	if request.FamilyDensity == 0 {
		request.FamilyDensity = 0.3
	}
	if request.Seed == nil {
		seed := time.Now().UnixNano()
		request.Seed = &seed
	}

	// Create generator and run generation
	generator := generators.NewNPCGenerator(h.DB)
	config := generators.GenerationConfig{
		WorldID:           uint(worldID),
		PopulationSize:    request.PopulationSize,
		OrganizationCount: request.OrganizationCount,
		FamilyDensity:     request.FamilyDensity,
		Seed:              *request.Seed,
	}

	if err := generator.GeneratePopulation(config); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate NPCs: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "NPCs generated successfully",
		"config":  config,
	})
}
