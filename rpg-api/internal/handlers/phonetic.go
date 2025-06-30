package handlers

import (
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/middleware"
	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type PhoneticHandler struct {
	DB *gorm.DB
}

func NewPhoneticHandler(db *gorm.DB) *PhoneticHandler {
	return &PhoneticHandler{DB: db}
}

// GET /phonetics
func (h *PhoneticHandler) GetTables(c *gin.Context) {
	var tables []models.PhoneticTable
	query := h.DB.Preload("User").Preload("Syllables")

	user, isAuthenticated := middleware.GetCurrentUser(c)
	if isAuthenticated {
		query = query.Where("user_id = ? OR is_official = ?", user.ID, true)
	} else {
		query = query.Where("is_official = ?", true)
	}

	if err := query.Find(&tables).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tables"})
		return
	}

	c.JSON(http.StatusOK, tables)
}

// GET /phonetics/:id
func (h *PhoneticHandler) GetTable(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var table models.PhoneticTable
	query := h.DB.Preload("User").Preload("Syllables")

	user, isAuthenticated := middleware.GetCurrentUser(c)
	if isAuthenticated {
		query = query.Where("(user_id = ? OR is_official = ?) AND id = ?", user.ID, true, id)
	} else {
		query = query.Where("is_official = ? AND id = ?", true, id)
	}

	if err := query.First(&table).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	c.JSON(http.StatusOK, table)
}

// POST /phonetics
func (h *PhoneticHandler) CreateTable(c *gin.Context) {
	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var table models.PhoneticTable
	if err := c.ShouldBindJSON(&table); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	table.UserID = &user.ID
	table.IsOfficial = false

	if err := h.DB.Create(&table).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create table"})
		return
	}

	c.JSON(http.StatusCreated, table)
}

// PATCH /phonetics/:id
func (h *PhoneticHandler) UpdateTable(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var table models.PhoneticTable
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, id).First(&table).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	if err := c.ShouldBindJSON(&table); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	table.UserID = &user.ID
	table.IsOfficial = false

	if err := h.DB.Save(&table).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update table"})
		return
	}

	c.JSON(http.StatusOK, table)
}

// DELETE /phonetics/:id
func (h *PhoneticHandler) DeleteTable(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var table models.PhoneticTable
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, id).First(&table).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	if err := h.DB.Delete(&table).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete table"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Table deleted successfully"})
}

// POST /phonetics/:id/syllables
func (h *PhoneticHandler) AddSyllable(c *gin.Context) {
	tableID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid table ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Check table ownership
	var table models.PhoneticTable
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, tableID).First(&table).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	var syllable models.PhoneticSyllable
	if err := c.ShouldBindJSON(&syllable); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	syllable.TableID = uint(tableID)

	if err := h.DB.Create(&syllable).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add syllable"})
		return
	}

	c.JSON(http.StatusCreated, syllable)
}

// DELETE /phonetics/:id/syllables/:syllableId
func (h *PhoneticHandler) DeleteSyllable(c *gin.Context) {
	tableID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid table ID"})
		return
	}

	syllableID, err := strconv.Atoi(c.Param("syllableId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid syllable ID"})
		return
	}

	user, exists := middleware.GetCurrentUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Check table ownership
	var table models.PhoneticTable
	if err := h.DB.Where("user_id = ? AND id = ?", user.ID, tableID).First(&table).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	if err := h.DB.Where("table_id = ? AND id = ?", tableID, syllableID).Delete(&models.PhoneticSyllable{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete syllable"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Syllable deleted successfully"})
}

// POST /phonetics/:id/generate
func (h *PhoneticHandler) GenerateName(c *gin.Context) {
	tableID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid table ID"})
		return
	}

	// Get table with access check
	var table models.PhoneticTable
	query := h.DB.Preload("Syllables")

	user, isAuthenticated := middleware.GetCurrentUser(c)
	if isAuthenticated {
		query = query.Where("(user_id = ? OR is_official = ?) AND id = ?", user.ID, true, tableID)
	} else {
		query = query.Where("is_official = ? AND id = ?", true, tableID)
	}

	if err := query.First(&table).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	// Group syllables by position
	var starts, middles, ends []string
	for _, syllable := range table.Syllables {
		switch syllable.Position {
		case models.PositionStart:
			starts = append(starts, syllable.Syllable)
		case models.PositionMiddle:
			middles = append(middles, syllable.Syllable)
		case models.PositionEnd:
			ends = append(ends, syllable.Syllable)
		}
	}

	if len(starts) == 0 || len(ends) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Table needs at least one start and one end syllable"})
		return
	}

	// Generate name using the new random approach
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	name := starts[rng.Intn(len(starts))]

	// Randomly add middle syllable
	if len(middles) > 0 && rng.Float32() < 0.5 {
		name += middles[rng.Intn(len(middles))]
	}

	name += ends[rng.Intn(len(ends))]

	c.JSON(http.StatusOK, gin.H{"name": name})
}
