package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/auth"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type AuthMiddleware struct {
	DB *gorm.DB
}

func NewAuthMiddleware(db *gorm.DB) *AuthMiddleware {
	return &AuthMiddleware{DB: db}
}

// RequireAuth middleware - requires valid JWT token
func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := m.getAuthenticatedUser(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

// OptionalAuth middleware - sets user if token is valid, but doesn't require it
func (m *AuthMiddleware) OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, _ := m.getAuthenticatedUser(c)
		if user != nil {
			c.Set("user", user)
		}
		c.Next()
	}
}

// Helper function to extract and validate user from JWT token
func (m *AuthMiddleware) getAuthenticatedUser(c *gin.Context) (*models.User, bool) {
	// Get token from Authorization header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return nil, false
	}

	// Check for Bearer token format
	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return nil, false
	}

	tokenString := tokenParts[1]

	// Validate JWT token
	claims, err := auth.ValidateJWT(tokenString)
	if err != nil {
		return nil, false
	}

	// Get user from database
	var user models.User
	if err := m.DB.First(&user, claims.UserID).Error; err != nil {
		return nil, false
	}

	// Check if user is active
	if !user.IsActive {
		return nil, false
	}

	return &user, true
}

// Helper function to get current user from context
func GetCurrentUser(c *gin.Context) (*models.User, bool) {
	user, exists := c.Get("user")
	if !exists {
		return nil, false
	}

	userModel, ok := user.(*models.User)
	return userModel, ok
}
