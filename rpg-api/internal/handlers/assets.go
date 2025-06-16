package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type AssetHandler struct {
	DB *gorm.DB
}

func NewAssetHandler(db *gorm.DB) *AssetHandler {
	return &AssetHandler{DB: db}
}

// POST /assets - requires authentication
func (h *AssetHandler) CreateAsset(c *gin.Context) {
	// Get current user from middleware
	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var asset models.Asset
	if err := c.ShouldBindJSON(&asset); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set user ownership and ensure it's not official
	asset.UserID = &user.ID
	asset.IsOfficial = user.IsAdmin

	if err := h.DB.Create(&asset).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create asset"})
		return
	}

	c.JSON(http.StatusCreated, asset)
}

// GET /assets - returns official assets + user's assets if authenticated
func (h *AssetHandler) GetAssets(c *gin.Context) {
	var assets []models.Asset
	query := h.DB

	// Get current user if authenticated (optional auth)
	user, isAuthenticated := middleware.GetCurrentUser(c)

	if isAuthenticated {
		// For authenticated users: show official assets + their own assets
		query = query.Where("is_official = ? OR user_id = ?", true, user.ID)
		if user.IsAdmin {
			// Admins see official assets + ALL their own assets (official and personal)
			query = query.Where("is_official = ? OR user_id = ?", true, user.ID)
		} else {
			// Regular users see official assets + their own personal assets
			query = query.Where("is_official = ? OR user_id = ?", true, user.ID)
		}
	} else {
		// For anonymous users: only show official assets
		query = query.Where("is_official = ?", true)
	}

	if err := query.Find(&assets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch assets"})
		return
	}

	c.JSON(http.StatusOK, assets)
}

// GET /assets/:id - can view official assets or own assets
func (h *AssetHandler) GetAsset(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var asset models.Asset
	query := h.DB

	// Get current user if authenticated
	user, isAuthenticated := middleware.GetCurrentUser(c)

	if isAuthenticated {
		// Authenticated users can see official assets or their own
		query = query.Where("(is_official = ? OR user_id = ?) AND id = ?", true, user.ID, id)
	} else {
		// Anonymous users can only see official assets
		query = query.Where("is_official = ? AND id = ?", true, id)
	}

	if err := query.First(&asset).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	c.JSON(http.StatusOK, asset)
}

// PATCH /assets/:id - requires authentication and ownership
func (h *AssetHandler) UpdateAsset(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Get current user from middleware
	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var asset models.Asset
	// Users can only update their own assets (not official ones)
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, id).First(&asset).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found or access denied"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Bind the updated data
	if err := c.ShouldBindJSON(&asset); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure they can't change ownership or make it official
	asset.UserID = &user.ID
	asset.IsOfficial = false

	if err := h.DB.Save(&asset).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update asset"})
		return
	}

	c.JSON(http.StatusOK, asset)
}

// DELETE /assets/:id - requires authentication and ownership
func (h *AssetHandler) DeleteAsset(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Get current user from middleware
	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var asset models.Asset
	// Users can only delete their own assets (not official ones)
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, id).First(&asset).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found or access denied"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	if err := h.DB.Delete(&asset).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete asset"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Asset deleted successfully"})
}
