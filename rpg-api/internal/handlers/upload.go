// rpg-api/internal/handlers/upload.go
package handlers

import (
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/naetharu/rpg-api/internal/services"
)

type UploadHandler struct {
	CloudflareService *services.CloudflareImagesService
}

type ImageUploadResponse struct {
	ImageID  string `json:"image_id"`
	Filename string `json:"filename"`
	URLs     struct {
		Thumbnail string `json:"thumbnail"`
		Medium    string `json:"medium"`
		Large     string `json:"large"`
		Original  string `json:"original"`
	} `json:"urls"`
}

func NewUploadHandler() *UploadHandler {
	return &UploadHandler{
		CloudflareService: services.NewCloudflareImagesService(),
	}
}

// POST /api/upload/image
func (h *UploadHandler) UploadImage(c *gin.Context) {
	// Get file from form
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}
	defer file.Close()

	// Validate file type
	if !isValidImageType(header.Filename) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only JPEG, PNG, and WebP are allowed"})
		return
	}

	// Get optional metadata
	metadata := make(map[string]string)
	if alt := c.PostForm("alt"); alt != "" {
		metadata["alt"] = alt
	}
	if caption := c.PostForm("caption"); caption != "" {
		metadata["caption"] = caption
	}

	// Upload to Cloudflare
	cfResp, err := h.CloudflareService.UploadImage(file, header.Filename, metadata)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image: " + err.Error()})
		return
	}

	// Build response with different variant URLs
	response := ImageUploadResponse{
		ImageID:  cfResp.Result.ID,
		Filename: cfResp.Result.Filename,
	}

	// Generate URLs for different variants
	response.URLs.Thumbnail = h.CloudflareService.GetImageURL(cfResp.Result.ID, "thumbnail")
	response.URLs.Medium = h.CloudflareService.GetImageURL(cfResp.Result.ID, "medium")
	response.URLs.Large = h.CloudflareService.GetImageURL(cfResp.Result.ID, "large")
	response.URLs.Original = h.CloudflareService.GetImageURL(cfResp.Result.ID, "public")

	c.JSON(http.StatusOK, response)
}

func isValidImageType(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	validExts := []string{".jpg", ".jpeg", ".png", ".webp"}

	for _, validExt := range validExts {
		if ext == validExt {
			return true
		}
	}
	return false
}
