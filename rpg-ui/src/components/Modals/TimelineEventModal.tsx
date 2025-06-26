import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { ImagePickerModal } from "@/components/Modals/ImagePickerModal";
import type { TimelineEvent } from "@/services/api";

interface TimelineEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    event: Omit<
      TimelineEvent,
      "id" | "world_id" | "created_at" | "updated_at" | "user_id" | "user"
    >
  ) => Promise<void>;
  event?: TimelineEvent | null;
  isCreating?: boolean;
}

const IMPORTANCE_LEVELS = [
  { value: "minor", label: "Minor", color: "text-green-600" },
  { value: "major", label: "Major", color: "text-yellow-600" },
  { value: "critical", label: "Critical", color: "text-red-600" },
] as const;

export function TimelineEventModal({
  isOpen,
  onClose,
  onSave,
  event,
  isCreating = false,
}: TimelineEventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    era: "",
    importance: "minor" as "minor" | "major" | "critical",
    sort_order: 0,
    image_url: "",
    image_id: "",
    details: "",
  });

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (event && !isCreating) {
        setFormData({
          title: event.title,
          description: event.description,
          start_date: event.start_date,
          end_date: event.end_date || "",
          era: event.era,
          importance: event.importance,
          sort_order: event.sort_order,
          image_url: event.image_url || "",
          image_id: event.image_id || "",
          details: event.details || "",
        });
      } else {
        // Reset for new event
        setFormData({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          era: "",
          importance: "minor",
          sort_order: 0,
          image_url: "",
          image_id: "",
          details: "",
        });
      }
    }
  }, [isOpen, event, isCreating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.start_date.trim() ||
      !formData.era.trim()
    ) {
      alert("Title, start date, and era are required");
      return;
    }

    try {
      setIsLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save timeline event:", error);
      alert("Failed to save timeline event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageData: { url: string; id: string }) => {
    setFormData({
      ...formData,
      image_url: imageData.url,
      image_id: imageData.id,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold">
                {isCreating ? "Create Timeline Event" : "Edit Timeline Event"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isCreating
                  ? "Add a new event to your world's timeline"
                  : "Update timeline event details"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col max-h-[calc(90vh-120px)]"
          >
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter event title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 1423 AC, Spring 2045..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Leave empty for single point in time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Era <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.era}
                    onChange={(e) =>
                      setFormData({ ...formData, era: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Ancient Era, Modern Times..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Importance
                  </label>
                  <select
                    value={formData.importance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        importance: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {IMPORTANCE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower numbers appear first in timeline
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brief Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Short summary of what happened..."
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Full details, background information, consequences..."
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Image (Optional)
                </label>
                {formData.image_url ? (
                  <div className="space-y-3">
                    <div className="aspect-[16/9] bg-muted overflow-hidden rounded-lg">
                      <img
                        src={formData.image_url}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowImagePicker(true)}
                      >
                        Change Image
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            image_url: "",
                            image_id: "",
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowImagePicker(true)}
                    className="w-full py-8 border-dashed"
                  >
                    Choose Event Image
                  </Button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={Save}
                loading={isLoading}
              >
                {isCreating ? "Create Event" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelectImage={handleImageSelect}
        aspectRatio="landscape"
        title="Choose Event Image"
        description="Select an image for this timeline event"
      />
    </>
  );
}
