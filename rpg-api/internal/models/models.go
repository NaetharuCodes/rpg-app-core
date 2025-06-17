package models

import (
	"time"

	"github.com/lib/pq"
)

type User struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Email         string    `json:"email" gorm:"uniqueIndex;not null"`
	Name          string    `json:"name" gorm:"not null"`
	Avatar        string    `json:"avatar"`
	Provider      string    `json:"provider" gorm:"not null"`      // "google", "email"
	ProviderID    string    `json:"provider_id" gorm:"index"`      // OAuth provider user ID
	PasswordHash  string    `json:"-" gorm:"column:password_hash"` // Hidden from JSON
	EmailVerified bool      `json:"email_verified" gorm:"default:false"`
	IsActive      bool      `json:"is_active" gorm:"default:true"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	IsAdmin       bool      `json:"is_admin" gorm:"default:false"`

	// Relationships
	Assets     []Asset     `json:"assets,omitempty" gorm:"foreignKey:UserID"`
	Adventures []Adventure `json:"adventures,omitempty" gorm:"foreignKey:UserID"`
}

// Update existing models to include UserID foreign key
type Asset struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`

	// Cloudflare Images integration
	ImageID  string `json:"image_id"`  // Cloudflare image ID
	ImageURL string `json:"image_url"` // Main image URL (medium variant)

	// Image variants for different use cases
	ImageVariants ImageVariants `json:"image_variants" gorm:"embedded"`

	IsOfficial bool           `json:"is_official" gorm:"default:false"`
	Genres     pq.StringArray `json:"genres" gorm:"type:text[]"`
	UserID     *uint          `json:"user_id" gorm:"index"`
	CreatedAt  time.Time      `json:"created_at"`

	// Relationship
	User *User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type ImageVariants struct {
	Thumbnail string `json:"thumbnail"` // 200px variant
	Medium    string `json:"medium"`    // 800px variant
	Large     string `json:"large"`     // 1200px variant
	Original  string `json:"original"`  // Full size variant
}

func (a *Asset) GetImageURL(variant string) string {
	switch variant {
	case "thumbnail":
		return a.ImageVariants.Thumbnail
	case "medium":
		return a.ImageVariants.Medium
	case "large":
		return a.ImageVariants.Large
	case "original":
		return a.ImageVariants.Original
	default:
		// Default to medium for backwards compatibility
		return a.ImageURL
	}
}

type Adventure struct {
	ID             uint           `json:"id" gorm:"primaryKey"`
	Title          string         `json:"title"`
	Description    string         `json:"description"`
	BannerImageURL string         `json:"banner_image_url"`
	CardImageURL   string         `json:"card_image_url"`
	Genres         pq.StringArray `json:"genres" gorm:"type:text[]"`
	IsOfficial     bool           `json:"is_official" gorm:"default:false"`
	AgeRating      string         `json:"age_rating" gorm:"default:'For Everyone'"`
	UserID         *uint          `json:"user_id" gorm:"index"` // Foreign key to User (nullable for official adventures)
	CreatedAt      time.Time      `json:"created_at"`

	// Relationships
	User     *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Episodes []Episode `json:"episodes,omitempty" gorm:"foreignKey:AdventureID"`
	Assets   []Asset   `json:"assets,omitempty" gorm:"many2many:adventure_assets;"`
}

type TitlePage struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	AdventureID    uint      `json:"adventure_id"`
	Title          string    `json:"title"`
	Subtitle       string    `json:"subtitle"`
	BannerImageURL string    `json:"banner_image_url"`
	Introduction   string    `json:"introduction" gorm:"type:text"`
	Background     string    `json:"background" gorm:"type:text"`
	Prologue       string    `json:"prologue" gorm:"type:text"`
	CreatedAt      time.Time `json:"created_at"`
}

type Episode struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	AdventureID uint      `json:"adventure_id"`
	Order       int       `json:"order"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`

	// Relationships
	Adventure Adventure `json:"adventure" gorm:"foreignKey:AdventureID"`
	Scenes    []Scene   `json:"scenes,omitempty" gorm:"foreignKey:EpisodeID"`
}

type Scene struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	EpisodeID   uint      `json:"episode_id"`
	Order       int       `json:"order"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ImageURL    string    `json:"image_url"`
	Prose       string    `json:"prose" gorm:"type:text"`
	GMNotes     string    `json:"gm_notes" gorm:"type:text"`
	CreatedAt   time.Time `json:"created_at"`

	// Relationships
	Episode Episode `json:"episode" gorm:"foreignKey:EpisodeID"`
	Assets  []Asset `json:"assets,omitempty" gorm:"many2many:scene_assets;"`
}

type Credits struct {
	Designer string `json:"designer"`
	System   string `json:"system"`
	Version  string `json:"version"`
	Year     string `json:"year"`
}

type Epilogue struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	AdventureID   uint      `json:"adventure_id"`
	Content       string    `json:"content" gorm:"type:text"`
	DesignerNotes string    `json:"designer_notes" gorm:"type:text"`
	Credits       Credits   `json:"credits" gorm:"embedded;embeddedPrefix:credits_"`
	CreatedAt     time.Time `json:"created_at"`

	// Relationship
	Adventure     Adventure         `json:"adventure" gorm:"foreignKey:AdventureID"`
	Outcomes      []EpilogueOutcome `json:"outcomes,omitempty" gorm:"foreignKey:EpilogueID"`
	FollowUpHooks []FollowUpHook    `json:"follow_up_hooks,omitempty" gorm:"foreignKey:EpilogueID"`
}

type EpilogueOutcome struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	EpilogueID  uint   `json:"epilogue_id"`
	Title       string `json:"title"`
	Description string `json:"description" gorm:"type:text"`
	Details     string `json:"details" gorm:"type:text"`

	// Relationship
	Epilogue Epilogue `json:"epilogue" gorm:"foreignKey:EpilogueID"`
}

type FollowUpHook struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	EpilogueID  uint   `json:"epilogue_id"`
	Title       string `json:"title"`
	Description string `json:"description" gorm:"type:text"`

	// Relationship
	Epilogue Epilogue `json:"epilogue" gorm:"foreignKey:EpilogueID"`
}
