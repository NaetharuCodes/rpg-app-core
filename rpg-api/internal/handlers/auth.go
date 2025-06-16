package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/auth"
	"github.com/naetharu/rpg-api/internal/models"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB           *gorm.DB
	GoogleConfig *oauth2.Config
}

type GoogleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	googleConfig := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("OAUTH_REDIRECT_URL"),
		Scopes:       []string{"openid", "profile", "email"},
		Endpoint:     google.Endpoint,
	}

	return &AuthHandler{
		DB:           db,
		GoogleConfig: googleConfig,
	}
}

// GET /auth/google
func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	// Generate a random state for security
	state := "random-state-string" // In production, generate a proper random state
	url := h.GoogleConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// GET /auth/google/callback
func (h *AuthHandler) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing authorization code"})
		return
	}

	// Exchange code for token
	token, err := h.GoogleConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	// Get user info from Google
	client := h.GoogleConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}
	defer resp.Body.Close()

	var googleUser GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode user info"})
		return
	}

	// Find or create user in database
	var user models.User
	result := h.DB.Where("provider = ? AND provider_id = ?", "google", googleUser.ID).First(&user)

	if result.Error == gorm.ErrRecordNotFound {
		// Create new user
		user = models.User{
			Email:      googleUser.Email,
			Name:       googleUser.Name,
			Avatar:     googleUser.Picture,
			Provider:   "google",
			ProviderID: googleUser.ID,
			IsActive:   true,
		}

		if err := h.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
	} else if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	} else {
		// Update existing user info
		user.Name = googleUser.Name
		user.Avatar = googleUser.Picture
		h.DB.Save(&user)
	}

	// Generate JWT
	jwtToken, err := auth.GenerateJWT(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Redirect to frontend with token
	frontendURL := os.Getenv("FRONTEND_URL")
	redirectURL := fmt.Sprintf("%s/auth/callback?token=%s", frontendURL, jwtToken)
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

// POST /auth/verify
func (h *AuthHandler) VerifyToken(c *gin.Context) {
	var request struct {
		Token string `json:"token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	claims, err := auth.ValidateJWT(request.Token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Get fresh user data from database
	var user models.User
	if err := h.DB.First(&user, claims.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if !user.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Account deactivated"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":     user.ID,
			"email":  user.Email,
			"name":   user.Name,
			"avatar": user.Avatar,
		},
		"valid": true,
	})
}

// POST /auth/login
func (h *AuthHandler) EmailLogin(c *gin.Context) {
	var request struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user by email
	var user models.User
	result := h.DB.Where("email = ? AND provider = ?", request.Email, "email").First(&user)

	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	} else if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Check password
	if !auth.CheckPassword(request.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Check if user is active and email verified
	if !user.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Account deactivated"})
		return
	}

	if !user.EmailVerified {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please verify your email address"})
		return
	}

	// Generate JWT
	jwtToken, err := auth.GenerateJWT(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user": gin.H{
			"id":     user.ID,
			"email":  user.Email,
			"name":   user.Name,
			"avatar": user.Avatar,
		},
	})
}
