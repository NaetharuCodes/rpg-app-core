package models

import (
	"crypto/rand"
	"encoding/hex"
	"time"
)

type EmailVerificationToken struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null;index"`
	Token     string    `json:"token" gorm:"not null;uniqueIndex"`
	ExpiresAt time.Time `json:"expires_at" gorm:"not null"`
	Used      bool      `json:"used" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`

	// Relationship
	User User `json:"user" gorm:"foreignKey:UserID"`
}

type PasswordResetToken struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null;index"`
	Token     string    `json:"token" gorm:"not null;uniqueIndex"`
	ExpiresAt time.Time `json:"expires_at" gorm:"not null"`
	Used      bool      `json:"used" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`

	// Relationship
	User User `json:"user" gorm:"foreignKey:UserID"`
}

// Generate a secure random token
func GenerateSecureToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// Create email verification token (24 hours expiry)
func CreateEmailVerificationToken(userID uint) (*EmailVerificationToken, error) {
	token, err := GenerateSecureToken()
	if err != nil {
		return nil, err
	}

	return &EmailVerificationToken{
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}, nil
}

// Create password reset token (2 hours expiry)
func CreatePasswordResetToken(userID uint) (*PasswordResetToken, error) {
	token, err := GenerateSecureToken()
	if err != nil {
		return nil, err
	}

	return &PasswordResetToken{
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(2 * time.Hour),
	}, nil
}
