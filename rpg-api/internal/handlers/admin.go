package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type AdminHandler struct {
	DB *gorm.DB
}

type AdminStats struct {
	TotalUsers          int64 `json:"total_users"`
	TotalAssets         int64 `json:"total_assets"`
	TotalAdventures     int64 `json:"total_adventures"`
	RecentRegistrations int64 `json:"recent_registrations"`
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{DB: db}
}

// GET /admin/stats - requires admin auth
func (h *AdminHandler) GetStats(c *gin.Context) {
	// Get current user and verify admin
	user, exists := middleware.GetCurrentUser(c)
	if !exists || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	var stats AdminStats

	// Count total users
	h.DB.Model(&models.User{}).Count(&stats.TotalUsers)

	// Count total assets
	h.DB.Model(&models.Asset{}).Count(&stats.TotalAssets)

	// Count total adventures
	h.DB.Model(&models.Adventure{}).Count(&stats.TotalAdventures)

	// Count recent registrations (last 7 days)
	sevenDaysAgo := time.Now().AddDate(0, 0, -7)
	h.DB.Model(&models.User{}).Where("created_at >= ?", sevenDaysAgo).Count(&stats.RecentRegistrations)

	c.JSON(http.StatusOK, stats)
}

func (h *AdminHandler) GetUsers(c *gin.Context) {
	// Get current user and verify admin
	user, exists := middleware.GetCurrentUser(c)
	if !exists || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	var users []models.User
	if err := h.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, users)
}

// PATCH /admin/users/:id/status - ban/unban user
func (h *AdminHandler) UpdateUserStatus(c *gin.Context) {
	// Get current user and verify admin
	user, exists := middleware.GetCurrentUser(c)
	if !exists || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	userID := c.Param("id")

	var request struct {
		IsActive bool `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Model(&models.User{}).Where("id = ?", userID).Update("is_active", request.IsActive).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User status updated"})
}

// PATCH /admin/users/:id/promote - promote user to admin
func (h *AdminHandler) PromoteUser(c *gin.Context) {
	// Get current user and verify admin
	user, exists := middleware.GetCurrentUser(c)
	if !exists || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	userID := c.Param("id")

	if err := h.DB.Model(&models.User{}).Where("id = ?", userID).Update("is_admin", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to promote user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User promoted to admin"})
}

// GET /admin/content/unreviewed - get all unreviewed user content
func (h *AdminHandler) GetUnreviewedContent(c *gin.Context) {
	// Get current user and verify admin
	user, exists := middleware.GetCurrentUser(c)
	if !exists || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	var assets []models.Asset
	var adventures []models.Adventure

	// Get unreviewed user assets (not official, not reviewed)
	h.DB.Where("is_official = ? AND reviewed = ?", false, false).
		Preload("User").Find(&assets)

	// Get unreviewed user adventures (not official, not reviewed)
	h.DB.Where("is_official = ? AND reviewed = ?", false, false).
		Preload("User").Find(&adventures)

	response := gin.H{
		"assets":     assets,
		"adventures": adventures,
	}

	c.JSON(http.StatusOK, response)
}

// PATCH /admin/content/assets/:id/review - mark asset as reviewed
func (h *AdminHandler) MarkAssetReviewed(c *gin.Context) {
	// Get current user and verify admin
	user, exists := middleware.GetCurrentUser(c)
	if !exists || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	assetID := c.Param("id")

	if err := h.DB.Model(&models.Asset{}).Where("id = ?", assetID).Update("reviewed", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark asset as reviewed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Asset marked as reviewed"})
}

// PATCH /admin/content/adventures/:id/review - mark adventure as reviewed
func (h *AdminHandler) MarkAdventureReviewed(c *gin.Context) {
	// Get current user and verify admin
	user, exists := middleware.GetCurrentUser(c)
	if !exists || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	adventureID := c.Param("id")

	if err := h.DB.Model(&models.Adventure{}).Where("id = ?", adventureID).Update("reviewed", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark adventure as reviewed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Adventure marked as reviewed"})
}
