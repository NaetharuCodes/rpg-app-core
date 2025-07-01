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
	Reviewed   bool           `json:"reviewed" gorm:"default:false"`
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
	BannerImageID  string         `json:"banner_image_id"`
	CardImageURL   string         `json:"card_image_url"`
	CardImageID    string         `json:"card_image_id"`
	Genres         pq.StringArray `json:"genres" gorm:"type:text[]"`
	IsOfficial     bool           `json:"is_official" gorm:"default:false"`
	Reviewed       bool           `json:"reviewed" gorm:"default:false"`
	AgeRating      string         `json:"age_rating" gorm:"default:'For Everyone'"`
	UserID         *uint          `json:"user_id" gorm:"index"`
	CreatedAt      time.Time      `json:"created_at"`

	// Relationships
	User      *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Episodes  []Episode  `json:"episodes,omitempty" gorm:"foreignKey:AdventureID"`
	Assets    []Asset    `json:"assets,omitempty" gorm:"many2many:adventure_assets;"`
	TitlePage *TitlePage `json:"title_page,omitempty" gorm:"foreignKey:AdventureID"`
	Epilogue  *Epilogue  `json:"epilogue,omitempty" gorm:"foreignKey:AdventureID"`
}

type TitlePage struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	AdventureID    uint      `json:"adventure_id"`
	Title          string    `json:"title"`
	Subtitle       string    `json:"subtitle"`
	BannerImageURL string    `json:"banner_image_url"`
	BannerImageID  string    `json:"banner_image_id"`
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
	ImageID     string    `json:"image_id"`
	Prose       string    `json:"prose" gorm:"type:text"`
	GMNotes     string    `json:"gm_notes" gorm:"type:text"`
	CreatedAt   time.Time `json:"created_at"`

	// For frontend communication
	AssetIDs []uint `json:"asset_ids" gorm:"-"` // Don't persist, just for JSON to save me having to send whole assets up from the creator pages

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
	Outcomes      []EpilogueOutcome `json:"outcomes" gorm:"foreignKey:EpilogueID"`
	FollowUpHooks []FollowUpHook    `json:"follow_up_hooks" gorm:"foreignKey:EpilogueID"`
}

// Worlds

type World struct {
	ID             uint           `json:"id" gorm:"primaryKey"`
	Title          string         `json:"title" gorm:"not null"`
	Description    string         `json:"description"`
	BannerImageURL string         `json:"banner_image_url"`
	BannerImageID  string         `json:"banner_image_id"`
	CardImageURL   string         `json:"card_image_url"`
	CardImageID    string         `json:"card_image_id"`
	Genres         pq.StringArray `json:"genres" gorm:"type:text[]"`
	IsOfficial     bool           `json:"is_official" gorm:"default:false"`
	Reviewed       bool           `json:"reviewed" gorm:"default:false"`
	AgeRating      string         `json:"age_rating" gorm:"default:'For Everyone'"`
	UserID         *uint          `json:"user_id" gorm:"index"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`

	// Relationships
	User           *User           `json:"user,omitempty" gorm:"foreignKey:UserID"`
	TimelineEvents []TimelineEvent `json:"timeline_events,omitempty" gorm:"foreignKey:WorldID"`
}

type TimelineEvent struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	WorldID     uint      `json:"world_id"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	StartDate   string    `json:"start_date" gorm:"not null"`
	EndDate     *string   `json:"end_date"`
	Era         string    `json:"era" gorm:"not null"`
	Importance  string    `json:"importance" gorm:"not null;default:'minor'"`
	SortOrder   int       `json:"sort_order" gorm:"not null"`
	ImageURL    string    `json:"image_url"`
	ImageID     string    `json:"image_id"`
	Details     string    `json:"details" gorm:"type:text"`
	UserID      *uint     `json:"user_id" gorm:"index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relationships
	World World `json:"world,omitempty" gorm:"foreignKey:WorldID"`
	User  *User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type WorldEra struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	WorldID   uint      `json:"world_id" gorm:"not null;index"`
	Name      string    `json:"name" gorm:"not null"`
	SortOrder int       `json:"sort_order" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`

	// Relationships
	World World `json:"world,omitempty" gorm:"foreignKey:WorldID"`
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

// Kanban Tool

type Task struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text"`
	Status      string    `json:"status" gorm:"not null;default:'todo'"` // todo, in-progress, done
	UserID      uint      `json:"user_id" gorm:"not null;index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relationships
	User *User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// Phonetic Tables

type PhoneticTable struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	IsOfficial  bool      `json:"is_official" gorm:"default:false"`
	UserID      *uint     `json:"user_id" gorm:"index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relationships
	User      *User              `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Syllables []PhoneticSyllable `json:"syllables,omitempty" gorm:"foreignKey:TableID"`
}

type PhoneticSyllable struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	TableID  uint   `json:"table_id" gorm:"not null;index"`
	Syllable string `json:"syllable" gorm:"not null"`
	Position int    `json:"position" gorm:"not null"` // 0=start, 1=middle, 2=end

	// Relationship
	Table *PhoneticTable `json:"table,omitempty" gorm:"foreignKey:TableID"`
}

// Constants for position values
const (
	PositionStart  = 0
	PositionMiddle = 1
	PositionEnd    = 2
)

// NPC Generation Models

type NPCLocation struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	WorldID      uint      `json:"world_id"`
	Name         string    `json:"name" gorm:"not null"`
	Description  string    `json:"description"`
	LocationType string    `json:"location_type"` // "district", "village", "quarter", etc.
	Population   int       `json:"population"`
	WealthLevel  string    `json:"wealth_level"` // "poor", "middle", "wealthy", "noble"
	CreatedAt    time.Time `json:"created_at"`

	// Relationships
	World World `json:"world" gorm:"foreignKey:WorldID"`
	NPCs  []NPC `json:"npcs,omitempty" gorm:"foreignKey:LocationID"`
}

type Organization struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	WorldID     uint      `json:"world_id"`
	Name        string    `json:"name" gorm:"not null"`
	OrgType     string    `json:"org_type"` // "government", "guild", "criminal", "religious", etc.
	Description string    `json:"description"`
	PowerLevel  int       `json:"power_level"` // 1-10 scale
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`

	// Relationships
	World   World                    `json:"world" gorm:"foreignKey:WorldID"`
	Ranks   []OrganizationRank       `json:"ranks,omitempty" gorm:"foreignKey:OrganizationID"`
	Members []OrganizationMembership `json:"members,omitempty" gorm:"foreignKey:OrganizationID"`
}

type OrganizationRank struct {
	ID             uint   `json:"id" gorm:"primaryKey"`
	OrganizationID uint   `json:"organization_id"`
	Title          string `json:"title" gorm:"not null"`
	AuthorityLevel int    `json:"authority_level"` // 1-10, higher = more authority
	Description    string `json:"description"`
	SortOrder      int    `json:"sort_order"`

	// Relationships
	Organization Organization             `json:"organization" gorm:"foreignKey:OrganizationID"`
	Members      []OrganizationMembership `json:"members,omitempty" gorm:"foreignKey:RankID"`
}

type NPC struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	WorldID     uint      `json:"world_id"`
	LocationID  *uint     `json:"location_id"` // Can be null if location-less
	Name        string    `json:"name" gorm:"not null"`
	Age         int       `json:"age"`
	Gender      string    `json:"gender"`
	Profession  string    `json:"profession"`
	SocialClass string    `json:"social_class"` // "peasant", "merchant", "noble", etc.
	Personality string    `json:"personality"`  // Brief personality traits
	IsAlive     bool      `json:"is_alive" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`

	// Relationships
	World       World                    `json:"world" gorm:"foreignKey:WorldID"`
	Location    *NPCLocation             `json:"location,omitempty" gorm:"foreignKey:LocationID"`
	Memberships []OrganizationMembership `json:"memberships,omitempty" gorm:"foreignKey:NPCID"`
	// Self-referencing for family/relationships - we'll handle this with a junction table
}

type OrganizationMembership struct {
	ID             uint       `json:"id" gorm:"primaryKey"`
	NPCID          uint       `json:"npc_id"`
	OrganizationID uint       `json:"organization_id"`
	RankID         uint       `json:"rank_id"`
	Status         string     `json:"status" gorm:"default:'active'"` // "active", "inactive", "expelled", "deceased"
	JoinedAt       time.Time  `json:"joined_at"`
	LeftAt         *time.Time `json:"left_at"`
	Notes          string     `json:"notes"` // Special circumstances, achievements, etc.
	CreatedAt      time.Time  `json:"created_at"`

	// Relationships
	NPC          NPC              `json:"npc" gorm:"foreignKey:NPCID"`
	Organization Organization     `json:"organization" gorm:"foreignKey:OrganizationID"`
	Rank         OrganizationRank `json:"rank" gorm:"foreignKey:RankID"`
}

type NPCRelationship struct {
	ID                  uint       `json:"id" gorm:"primaryKey"`
	WorldID             uint       `json:"world_id"`
	FromNPCID           uint       `json:"from_npc_id"`
	ToNPCID             uint       `json:"to_npc_id"`
	RelationshipType    string     `json:"relationship_type"`             // "family", "friend", "rival", "romantic", "professional"
	RelationshipSubtype string     `json:"relationship_subtype"`          // "parent", "sibling", "mentor", "enemy", etc.
	Strength            int        `json:"strength"`                      // 1-10, how strong the relationship is
	IsPublic            bool       `json:"is_public" gorm:"default:true"` // False for secret relationships
	StartedAt           *time.Time `json:"started_at"`                    // When relationship began
	EndedAt             *time.Time `json:"ended_at"`                      // Null if ongoing
	Notes               string     `json:"notes"`
	CreatedAt           time.Time  `json:"created_at"`

	// Relationships
	World   World `json:"world" gorm:"foreignKey:WorldID"`
	FromNPC NPC   `json:"from_npc" gorm:"foreignKey:FromNPCID"`
	ToNPC   NPC   `json:"to_npc" gorm:"foreignKey:ToNPCID"`
}

// For storing generation parameters and allowing regeneration
type NPCGenerationConfig struct {
	ID                uint      `json:"id" gorm:"primaryKey"`
	WorldID           uint      `json:"world_id"`
	Seed              int64     `json:"seed"` // For reproducible generation
	PopulationSize    int       `json:"population_size"`
	FamilyDensity     float64   `json:"family_density"` // 0.0-1.0
	OrganizationCount int       `json:"organization_count"`
	SocialClassDist   string    `json:"social_class_distribution"` // JSON storing class percentages
	GeneratedAt       time.Time `json:"generated_at"`

	// Relationships
	World World `json:"world" gorm:"foreignKey:WorldID"`
}
