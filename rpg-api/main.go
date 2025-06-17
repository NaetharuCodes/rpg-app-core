package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/naetharu/rpg-api/internal/handlers"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Connect to database
	db := connectDB()

	// Auto-migrate tables (including the updated Asset model)
	db.AutoMigrate(
		&models.User{},
		&models.Asset{},
		&models.Adventure{},
		&models.Episode{},
		&models.Scene{},
		&models.TitlePage{},
		&models.Epilogue{},
		&models.EpilogueOutcome{},
		&models.FollowUpHook{},
		&models.EmailVerificationToken{},
		&models.PasswordResetToken{},
	)

	// Setup middleware
	authMiddleware := middleware.NewAuthMiddleware(db)

	// Setup handlers
	assetHandler := handlers.NewAssetHandler(db)
	adventureHandler := handlers.NewAdventureHandler(db)
	authHandler := handlers.NewAuthHandler(db)
	uploadHandler := handlers.NewUploadHandler()

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

	// Auth routes (no auth required)
	r.GET("/auth/google", authHandler.GoogleLogin)
	r.GET("/auth/google/callback", authHandler.GoogleCallback)
	r.POST("/auth/verify", authHandler.VerifyToken)
	r.POST("/auth/login", authHandler.EmailLogin)

	// Upload routes (require auth)
	api := r.Group("/api")
	api.Use(authMiddleware.RequireAuth())
	{
		api.POST("/upload/image", uploadHandler.UploadImage)
	}

	// Asset routes
	// GET endpoints use optional auth (show different content based on auth status)
	r.GET("/assets", authMiddleware.OptionalAuth(), assetHandler.GetAssets)
	r.GET("/assets/:id", authMiddleware.OptionalAuth(), assetHandler.GetAsset)

	// POST/PATCH/DELETE endpoints require auth
	r.POST("/assets", authMiddleware.RequireAuth(), assetHandler.CreateAsset)
	r.PATCH("/assets/:id", authMiddleware.RequireAuth(), assetHandler.UpdateAsset)
	r.DELETE("/assets/:id", authMiddleware.RequireAuth(), assetHandler.DeleteAsset)

	// Adventure routes (similar pattern)
	r.GET("/adventures", authMiddleware.OptionalAuth(), adventureHandler.GetAdventures)
	r.GET("/adventures/:id", authMiddleware.OptionalAuth(), adventureHandler.GetAdventure)
	r.POST("/adventures", authMiddleware.RequireAuth(), adventureHandler.CreateAdventure)
	r.PATCH("/adventures/:id", authMiddleware.RequireAuth(), adventureHandler.UpdateAdventure)
	r.DELETE("/adventures/:id", authMiddleware.RequireAuth(), adventureHandler.DeleteAdventure)

	// Title Page routes
	r.GET("/adventures/:id/title-page", authMiddleware.OptionalAuth(), adventureHandler.GetTitlePage)
	r.POST("/adventures/:id/title-page", authMiddleware.RequireAuth(), adventureHandler.CreateTitlePage)
	r.PATCH("/adventures/:id/title-page", authMiddleware.RequireAuth(), adventureHandler.UpdateTitlePage)
	r.DELETE("/adventures/:id/title-page", authMiddleware.RequireAuth(), adventureHandler.DeleteTitlePage)

	// Episode routes - ADD authMiddleware.RequireAuth() to POST/PATCH/DELETE
	r.GET("/adventures/:id/episodes", authMiddleware.RequireAuth(), adventureHandler.GetEpisodes)
	r.POST("/adventures/:id/episodes", authMiddleware.RequireAuth(), adventureHandler.CreateEpisode)
	r.PATCH("/adventures/:id/episodes/:episodeId", authMiddleware.RequireAuth(), adventureHandler.UpdateEpisode)
	r.DELETE("/adventures/:id/episodes/:episodeId", authMiddleware.RequireAuth(), adventureHandler.DeleteEpisode)

	// Scene routes - ADD authMiddleware.RequireAuth() to POST/PATCH/DELETE
	r.GET("/adventures/:id/episodes/:episodeId/scenes", authMiddleware.RequireAuth(), adventureHandler.GetScenes)
	r.POST("/adventures/:id/episodes/:episodeId/scenes", authMiddleware.RequireAuth(), adventureHandler.CreateScene)
	r.PATCH("/adventures/:id/episodes/:episodeId/scenes/:sceneId", authMiddleware.RequireAuth(), adventureHandler.UpdateScene)
	r.DELETE("/adventures/:id/episodes/:episodeId/scenes/:sceneId", authMiddleware.RequireAuth(), adventureHandler.DeleteScene)

	// Epilogue routes
	r.GET("/adventures/:id/epilogue", authMiddleware.OptionalAuth(), adventureHandler.GetEpilogue)
	r.POST("/adventures/:id/epilogue", authMiddleware.RequireAuth(), adventureHandler.CreateEpilogue)
	r.PATCH("/adventures/:id/epilogue", authMiddleware.RequireAuth(), adventureHandler.UpdateEpilogue)
	r.DELETE("/adventures/:id/epilogue", authMiddleware.RequireAuth(), adventureHandler.DeleteEpilogue)

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
