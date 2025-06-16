import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/Button/Button";

interface Episode {
  id: string;
  title: string;
  description: string;
}

interface EpisodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null;
  onSave: (episode: Episode) => void;
  isCreating?: boolean; // true when creating new episode, false when editing
}

export function EpisodeEditModal({
  isOpen,
  onClose,
  episode,
  onSave,
  isCreating = false,
}: EpisodeEditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Reset form when episode changes or modal opens/closes
  useEffect(() => {
    if (isOpen && episode) {
      setTitle(episode.title);
      setDescription(episode.description);
    } else if (!isOpen) {
      setTitle("");
      setDescription("");
    }
  }, [isOpen, episode]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter an episode title");
      return;
    }

    if (!episode) return;

    const updatedEpisode: Episode = {
      ...episode,
      title: title.trim(),
      description: description.trim(),
    };

    onSave(updatedEpisode);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isOpen || !episode) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">
              {isCreating ? "Create Episode" : "Edit Episode"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isCreating
                ? "Add a new episode to your adventure"
                : "Update episode details"}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Episode Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter episode title..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Brief description of what happens in this episode..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              This helps you and your players understand the episode's focus and
              pacing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" leftIcon={Save} onClick={handleSave}>
            {isCreating ? "Create Episode" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
