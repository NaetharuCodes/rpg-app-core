package models

import (
	"time"

	"github.com/lib/pq"
)

type User struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Email      string    `json:"email" gorm:"uniqueIndex;not null"`
	Name       string    `json:"name" gorm:"not null"`
	Avatar     string    `json:"avatar"`
	Provider   string    `json:"provider" gorm:"not null"` // "google", "discord", "email"
	ProviderID string    `json:"provider_id" gorm:"index"` // OAuth provider user ID
	IsActive   bool      `json:"is_active" gorm:"default:true"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// Relationships - user can own assets and adventures
	Assets     []Asset     `json:"assets,omitempty" gorm:"foreignKey:UserID"`
	Adventures []Adventure `json:"adventures,omitempty" gorm:"foreignKey:UserID"`
}

// Update existing models to include UserID foreign key
type Asset struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Type        string         `json:"type"`
	ImageURL    string         `json:"image_url"`
	IsOfficial  bool           `json:"is_official" gorm:"default:false"`
	Genres      pq.StringArray `json:"genres" gorm:"type:text[]"` // PostgreSQL string array
	UserID      *uint          `json:"user_id" gorm:"index"`      // Foreign key to User (nullable for official assets)
	CreatedAt   time.Time      `json:"created_at"`

	// Relationship
	User *User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type Adventure struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	BannerImageURL string    `json:"banner_image_url"`
	UserID         *uint     `json:"user_id" gorm:"index"` // Foreign key to User (nullable for official adventures)
	CreatedAt      time.Time `json:"created_at"`

	// Relationships
	User   *User   `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Scenes []Scene `json:"scenes,omitempty" gorm:"foreignKey:AdventureID"`
	Assets []Asset `json:"assets,omitempty" gorm:"many2many:adventure_assets;"`
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

	// Relationships
	TitlePage *TitlePage `json:"title_page,omitempty" gorm:"foreignKey:AdventureID"`
	Scenes    []Scene    `json:"scenes,omitempty" gorm:"foreignKey:AdventureID"`
	Epilogue  *Epilogue  `json:"epilogue,omitempty" gorm:"foreignKey:AdventureID"`
	Assets    []Asset    `json:"assets,omitempty" gorm:"many2many:adventure_assets;"`
}

type Scene struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	AdventureID uint      `json:"adventure_id"`
	Order       int       `json:"order"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ImageURL    string    `json:"image_url"`
	Prose       string    `json:"prose" gorm:"type:text"`
	GMNotes     string    `json:"gm_notes" gorm:"type:text"`
	CreatedAt   time.Time `json:"created_at"`

	// Relationships
	Adventure Adventure `json:"adventure" gorm:"foreignKey:AdventureID"`
	Assets    []Asset   `json:"assets,omitempty" gorm:"many2many:scene_assets;"`
}

type Epilogue struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	AdventureID   uint      `json:"adventure_id"`
	Content       string    `json:"content" gorm:"type:text"`
	DesignerNotes string    `json:"designer_notes" gorm:"type:text"`
	Credits       string    `json:"credits" gorm:"type:text"` // JSON string for credits object
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
