import React, { useState } from "react";
import { ArrowLeft, Upload, ImageIcon, Save, X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";
import { assetService, imageService, type Asset } from "@/services/api";
import { GenreInput } from "@/components/GenreInput/GenreInput";
import { MarkdownViewer } from "@/components/MarkdownViewer/MarkdownViewer";
import { useAuth } from "@/contexts/AuthContext";
import { AssetCreationSuccessModal } from "@/components/Modals/CreateAssetSuccessModal";

const Link = ({ to, className, children, ...props }: any) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

type AssetType = "character" | "creature" | "location" | "item";

interface AssetFormData {
  type: AssetType;
  name: string;
  description: string;
  image: File | string | null;
  genres: string[];
}

// // Mock images for demonstration - in real app these would come from your asset library
const mockLibraryImages = {
  character: [
    {
      id: "char1",
      url: "https://via.placeholder.com/768x1024/4F46E5/FFFFFF?text=Character+1",
      name: "Knight",
    },
    {
      id: "char2",
      url: "https://via.placeholder.com/768x1024/7C3AED/FFFFFF?text=Character+2",
      name: "Wizard",
    },
    {
      id: "char3",
      url: "https://via.placeholder.com/768x1024/059669/FFFFFF?text=Character+3",
      name: "Rogue",
    },
    {
      id: "char4",
      url: "https://via.placeholder.com/768x1024/DC2626/FFFFFF?text=Character+4",
      name: "Warrior",
    },
  ],
  creature: [
    {
      id: "crea1",
      url: "https://via.placeholder.com/768x1024/B91C1C/FFFFFF?text=Creature+1",
      name: "Dragon",
    },
    {
      id: "crea2",
      url: "https://via.placeholder.com/768x1024/7F1D1D/FFFFFF?text=Creature+2",
      name: "Goblin",
    },
    {
      id: "crea3",
      url: "https://via.placeholder.com/768x1024/991B1B/FFFFFF?text=Creature+3",
      name: "Wolf",
    },
  ],
  location: [
    {
      id: "loc1",
      url: "https://via.placeholder.com/768x1024/0369A1/FFFFFF?text=Location+1",
      name: "Castle",
    },
    {
      id: "loc2",
      url: "https://via.placeholder.com/768x1024/0284C7/FFFFFF?text=Location+2",
      name: "Forest",
    },
    {
      id: "loc3",
      url: "https://via.placeholder.com/768x1024/0EA5E9/FFFFFF?text=Location+3",
      name: "Tavern",
    },
  ],
  item: [
    {
      id: "item1",
      url: "https://via.placeholder.com/768x1024/D97706/FFFFFF?text=Item+1",
      name: "Sword",
    },
    {
      id: "item2",
      url: "https://via.placeholder.com/768x1024/EA580C/FFFFFF?text=Item+2",
      name: "Potion",
    },
    {
      id: "item3",
      url: "https://via.placeholder.com/768x1024/F59E0B/FFFFFF?text=Item+3",
      name: "Shield",
    },
  ],
};

export function AssetCreatorPage() {
  const { isAuthenticated } = useAuth();

  const [createdAsset, setCreatedAsset] = useState<Asset | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(true);

  const [formData, setFormData] = useState<AssetFormData>({
    type: "character",
    name: "",
    description: "",
    image: null,
    genres: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [imageSource, setImageSource] = useState<"library" | "upload">(
    "library"
  );
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const assetTypes = [
    { key: "character" as const, label: "Character", icon: "👤" },
    { key: "creature" as const, label: "Creature", icon: "🐉" },
    { key: "location" as const, label: "Location", icon: "🏰" },
    { key: "item" as const, label: "Item", icon: "⚔️" },
  ];

  const handleTypeChange = (type: AssetType) => {
    setFormData({ ...formData, type, image: null });
    setUploadPreview(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Please upload a JPG, PNG, or WebP image");
        return;
      }

      setFormData({ ...formData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to create assets");
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter a name for your asset");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";

      // Handle image upload if user uploaded a file
      if (formData.image instanceof File) {
        console.log("Uploading image...");
        const uploadResult = await imageService.uploadImage(formData.image);
        imageUrl = uploadResult.urls.medium; // Use medium variant for the asset
      } else if (typeof formData.image === "string") {
        // User selected from library
        imageUrl = formData.image;
      } else {
        // No image selected - use placeholder
        const getPlaceholderImageUrl = (type: AssetType): string => {
          const colors = {
            character: "4F46E5",
            creature: "B91C1C",
            location: "0369A1",
            item: "D97706",
          };
          return `https://via.placeholder.com/768x1024/${colors[type]}/FFFFFF?text=${encodeURIComponent(formData.name)}`;
        };
        imageUrl = getPlaceholderImageUrl(formData.type);
      }

      // Create the asset with the uploaded image URL
      const assetData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        image_url: imageUrl,
        is_official: false,
        genres: formData.genres,
      };

      console.log("Creating asset with data:", assetData);
      const apiResponse = await assetService.create(assetData);

      console.log("Asset created successfully:", apiResponse);
      setCreatedAsset(apiResponse);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        type: "character",
        name: "",
        description: "",
        image: null,
        genres: [],
      });
      setUploadPreview(null);
      setUploadPreview(null);
    } catch (error) {
      console.error("Error creating asset:", error);
      alert("Failed to create asset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLibraryImageSelect = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl });
    setShowImageLibrary(false);
    setUploadPreview(null);
  };

  const handleGenresChange = (newGenres: string[]) => {
    setFormData((prev) => ({
      ...prev,
      genres: newGenres,
    }));
  };

  const currentLibraryImages = mockLibraryImages[formData.type];
  const hasSelectedImage = formData.image !== null;
  const imagePreviewUrl =
    uploadPreview ||
    (typeof formData.image === "string" ? formData.image : null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/assets"
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Create New Asset</h1>
                <p className="text-muted-foreground">
                  Add a new asset to your library
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={Save}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Save Asset"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-200px)]">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Asset Type Selection */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Asset Type
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose what type of asset you're creating
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assetTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => handleTypeChange(type.key)}
                    className={cn(
                      "p-6 rounded-lg border-2 transition-all text-center hover:bg-accent/50",
                      formData.type === type.key
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="text-3xl mb-3">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 text-lg border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder={`Enter ${formData.type} name...`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={12}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical font-mono text-sm"
                    placeholder={`Describe this ${formData.type}...

You can use Markdown formatting:

**Bold text**
*Italic text*
- Bullet points
1. Numbered lists

## Headers
---

> Quotes

\`Code\` or code blocks`}
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    Supports Markdown formatting for rich text styling
                  </div>
                </div>
              </div>
            </div>

            {/* Image Selection */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Image
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose an image from the library or upload your own
              </p>

              <div className="space-y-4">
                {/* Image Source Toggle */}
                <div className="flex gap-3">
                  <Button
                    variant={
                      imageSource === "library" ? "primary" : "secondary"
                    }
                    leftIcon={ImageIcon}
                    onClick={() => setImageSource("library")}
                  >
                    From Library
                  </Button>
                  <Button
                    variant={imageSource === "upload" ? "primary" : "secondary"}
                    leftIcon={Upload}
                    onClick={() => setImageSource("upload")}
                  >
                    Upload New
                  </Button>
                </div>

                {/* Library Selection */}
                {imageSource === "library" && (
                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => setShowImageLibrary(true)}
                      className="w-full py-4"
                    >
                      Choose from {formData.type} images (
                      {currentLibraryImages.length} available)
                    </Button>
                  </div>
                )}

                {/* Upload Section */}
                {imageSource === "upload" && (
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-4 border border-border rounded-lg bg-card file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
                    />
                    <div className="text-sm text-muted-foreground mt-3 p-4 bg-muted/20 rounded-lg">
                      <strong>Recommended:</strong> 768x1024px (3:4 ratio)
                      <br />
                      <strong>Max size:</strong> 5MB | <strong>Formats:</strong>{" "}
                      JPG, PNG, WebP
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Preview
              </h2>

              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                {/* Image Preview */}
                {hasSelectedImage && imagePreviewUrl ? (
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                    <img
                      src={imagePreviewUrl}
                      alt="Asset preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p>No image selected</p>
                    </div>
                  </div>
                )}

                {/* Asset Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {formData.type.charAt(0).toUpperCase() +
                        formData.type.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl">
                      {formData.name || `Untitled ${formData.type}`}
                    </h3>
                  </div>

                  {formData.description && (
                    <div className="border-t border-border pt-4">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {/* Simple markdown-like rendering for preview */}

                        <MarkdownViewer
                          content={formData.description}
                          className="text-sm text-muted-foreground max-h-48 overflow-y-auto"
                        />
                      </div>
                    </div>
                  )}
                  <GenreInput
                    genres={formData.genres}
                    onGenresChange={handleGenresChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Image Library Modal */}
      {showImageLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold">
                  Choose{" "}
                  {formData.type.charAt(0).toUpperCase() +
                    formData.type.slice(1)}{" "}
                  Image
                </h2>
                <p className="text-muted-foreground">
                  Select an image from the library
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageLibrary(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentLibraryImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleLibraryImageSelect(image.url)}
                    className="group relative aspect-[3/4] bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium bg-black/50 rounded px-2 py-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <AssetCreationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setCreatedAsset(null);
        }}
        asset={createdAsset}
      />
    </div>
  );
}
