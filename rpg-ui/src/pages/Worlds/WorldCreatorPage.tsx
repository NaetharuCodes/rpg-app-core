import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Section } from "@/components/Section/Section";
import { GenreInput } from "@/components/GenreInput/GenreInput";
import { worldService, type World } from "@/services/api";
import { AGE_RATINGS, type AgeRating } from "@/lib/constants";
import { ImagePickerModal } from "@/components/Modals/ImagePickerModal";

export function WorldCreatorPage() {
  const [showBannerImagePicker, setShowBannerImagePicker] = useState(false);
  const [showCardImagePicker, setShowCardImagePicker] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<World, "id" | "created_at" | "user_id" | "user">
  >({
    title: "",
    description: "",
    banner_image_url: "",
    banner_image_id: "",
    card_image_url: "",
    card_image_id: "",
    genres: [],
    age_rating: "For Everyone",
    is_official: false,
    reviewed: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setIsLoading(true);
      const newWorld = await worldService.create(formData);
      navigate(`/worlds/${newWorld.id}`);
    } catch (error) {
      console.error("Failed to create world:", error);
      alert("Failed to create world. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerImageSelect = (imageData: { url: string; id: string }) => {
    setFormData({
      ...formData,
      banner_image_url: imageData.url,
      banner_image_id: imageData.id,
    });
  };

  const handleCardImageSelect = (imageData: { url: string; id: string }) => {
    setFormData({
      ...formData,
      card_image_url: imageData.url,
      card_image_id: imageData.id,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              leftIcon={ArrowLeft}
              onClick={() => navigate("/worlds")}
            >
              Back to Worlds
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New World</h1>
              <p className="opacity-90 mt-1">
                Build a new setting for your adventures
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Section spacing="md" size="lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                World Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter world name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Describe your world's setting, themes, and atmosphere..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Age Rating
              </label>
              <select
                value={formData.age_rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    age_rating: e.target.value as AgeRating,
                  })
                }
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {AGE_RATINGS.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Categorization</h2>
            <GenreInput
              genres={formData.genres}
              onGenresChange={(genres) => setFormData({ ...formData, genres })}
            />
          </div>

          {/* Images (Optional) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Images (Optional)</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Banner Image
              </label>
              {formData.banner_image_url ? (
                <div className="space-y-3">
                  <div className="aspect-[3/1] bg-muted overflow-hidden rounded-lg">
                    <img
                      src={formData.banner_image_url}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowBannerImagePicker(true)}
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          banner_image_url: "",
                          banner_image_id: "",
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setShowBannerImagePicker(true)}
                  className="w-full py-8 border-dashed"
                >
                  Choose Banner Image
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Large banner image for the world overview page
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Card Image
              </label>
              {formData.card_image_url ? (
                <div className="space-y-3">
                  <div className="aspect-[2/3] bg-muted overflow-hidden rounded-lg">
                    <img
                      src={formData.card_image_url}
                      alt="Card preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowCardImagePicker(true)}
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          card_image_url: "",
                          card_image_id: "",
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setShowCardImagePicker(true)}
                  className="w-full py-8 border-dashed"
                >
                  Choose Card Image
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Thumbnail image for world cards in galleries
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => navigate("/worlds")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={Save}
              loading={isLoading}
            >
              Create World
            </Button>
          </div>
        </form>
      </Section>
      <ImagePickerModal
        isOpen={showBannerImagePicker}
        onClose={() => setShowBannerImagePicker(false)}
        onSelectImage={handleBannerImageSelect}
        aspectRatio="banner"
        title="Choose Banner Image"
        description="Select a banner image for your world overview page"
      />

      <ImagePickerModal
        isOpen={showCardImagePicker}
        onClose={() => setShowCardImagePicker(false)}
        onSelectImage={handleCardImageSelect}
        aspectRatio="landscape"
        title="Choose Card Image"
        description="Select a thumbnail image for world cards in galleries"
      />
    </div>
  );
}
