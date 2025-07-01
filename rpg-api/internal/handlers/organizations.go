package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type OrganizationHandler struct {
	DB *gorm.DB
}

func NewOrganizationHandler(db *gorm.DB) *OrganizationHandler {
	return &OrganizationHandler{DB: db}
}

// GET /worlds/:id/organizations
func (h *OrganizationHandler) GetOrganizations(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
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

	// Get organizations for this world
	var orgs []models.Organization
	if err := h.DB.Where("world_id = ?", worldID).
		Preload("Ranks").
		Find(&orgs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch organizations"})
		return
	}

	c.JSON(http.StatusOK, orgs)
}

// GET /worlds/:id/organizations/:orgId
func (h *OrganizationHandler) GetOrganization(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	orgID, err := strconv.Atoi(c.Param("orgId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
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

	// Get specific organization
	var org models.Organization
	if err := h.DB.Where("world_id = ? AND id = ?", worldID, orgID).
		Preload("Ranks").
		Preload("Members.NPC").
		Preload("Members.Rank").
		First(&org).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Organization not found"})
		return
	}

	c.JSON(http.StatusOK, org)
}

// POST /worlds/:id/organizations
func (h *OrganizationHandler) CreateOrganization(c *gin.Context) {
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

	var org models.Organization
	if err := c.ShouldBindJSON(&org); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	org.WorldID = uint(worldID)

	if err := h.DB.Create(&org).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create organization"})
		return
	}

	// Load with relationships
	h.DB.Preload("Ranks").First(&org, org.ID)

	c.JSON(http.StatusCreated, org)
}

// PATCH /worlds/:id/organizations/:orgId
func (h *OrganizationHandler) UpdateOrganization(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	orgID, err := strconv.Atoi(c.Param("orgId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
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

	// Get existing organization
	var org models.Organization
	if err := h.DB.Where("world_id = ? AND id = ?", worldID, orgID).First(&org).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Organization not found"})
		return
	}

	// Update with new data
	if err := c.ShouldBindJSON(&org); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure world ID doesn't change
	org.WorldID = uint(worldID)

	if err := h.DB.Save(&org).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update organization"})
		return
	}

	// Load with relationships
	h.DB.Preload("Ranks").First(&org, org.ID)

	c.JSON(http.StatusOK, org)
}

// DELETE /worlds/:id/organizations/:orgId
func (h *OrganizationHandler) DeleteOrganization(c *gin.Context) {
	worldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid world ID"})
		return
	}

	orgID, err := strconv.Atoi(c.Param("orgId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid organization ID"})
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

	// Delete organization (this will cascade to ranks and memberships due to foreign keys)
	if err := h.DB.Where("world_id = ? AND id = ?", worldID, orgID).Delete(&models.Organization{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete organization"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Organization deleted successfully"})
}
