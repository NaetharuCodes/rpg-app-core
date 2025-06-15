package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/naetharu/rpg-api/internal/handlers"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Connect to database
	db := connectDB()

	// Auto-migrate tables (including the new User model)
	db.AutoMigrate(
		&models.User{},
		&models.Asset{},
		&models.Adventure{},
		&models.Scene{},
		&models.TitlePage{},
		&models.Epilogue{},
		&models.EpilogueOutcome{},
		&models.FollowUpHook{},
	)

	// Setup handlers
	assetHandler := handlers.NewAssetHandler(db)
	adventureHandler := handlers.NewAdventureHandler(db)
	authHandler := handlers.NewAuthHandler(db)

	// Setup routes
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Vite dev server
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Auth routes
	r.GET("/auth/google", authHandler.GoogleLogin)
	r.GET("/auth/google/callback", authHandler.GoogleCallback)
	r.POST("/auth/verify", authHandler.VerifyToken)

	// Asset routes
	r.POST("/assets", assetHandler.CreateAsset)
	r.GET("/assets", assetHandler.GetAssets)
	r.GET("/assets/:id", assetHandler.GetAsset)
	r.PATCH("/assets/:id", assetHandler.UpdateAsset)

	// Adventure routes
	r.POST("/adventures", adventureHandler.CreateAdventure)
	r.GET("/adventures", adventureHandler.GetAdventures)
	r.GET("/adventures/:id", adventureHandler.GetAdventure)
	r.PATCH("/adventures/:id", adventureHandler.UpdateAdventure)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

func connectDB() *gorm.DB {
	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" port=" + os.Getenv("DB_PORT") +
		" sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	return db
}
