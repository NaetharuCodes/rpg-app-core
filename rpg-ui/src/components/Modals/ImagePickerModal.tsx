import { useState } from "react";
import { X, Upload, ImageIcon, Dice6 } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { imageService } from "@/services/api";

export interface LibraryImage {
  id: string;
  url: string;
  name: string;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageData: { url: string; id: string }) => void;
  aspectRatio?: "banner" | "square" | "landscape" | "portrait";
  title?: string;
  description?: string;
}

const aspectRatioConfig = {
  banner: {
    aspectClass: "aspect-[3/1]",
    dimensions: "1200x400px (3:1 ratio)",
    gridCols: "grid-cols-1 md:grid-cols-2",
  },
  square: {
    aspectClass: "aspect-square",
    dimensions: "800x800px (1:1 ratio)",
    gridCols: "grid-cols-2 md:grid-cols-3",
  },
  landscape: {
    aspectClass: "aspect-[16/9]",
    dimensions: "800x500px (16:9 ratio)",
    gridCols: "grid-cols-1 md:grid-cols-2",
  },
  portrait: {
    aspectClass: "aspect-[3/4]",
    dimensions: "600x800px (3:4 ratio)",
    gridCols: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  },
};

export function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  aspectRatio = "landscape",
  title = "Choose Image",
  description = "Select from library or upload your own",
}: ImagePickerModalProps) {
  const [imageSource, setImageSource] = useState<"library" | "upload">(
    "library"
  );

  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const config = aspectRatioConfig[aspectRatio];

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true); // Start loading
        const response = await imageService.uploadImage(file);
        onSelectImage({
          url: response.urls.medium,
          id: response.image_id,
        });
        onClose();
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false); // Stop loading
      }
    }
  };

  return isUploading ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Dice6 className="h-10 w-10 text-accent animate-spin animate-pulse mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Uploading image...</p>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          <div className="flex gap-3 mb-6">
            <Button
              variant={imageSource === "library" ? "primary" : "secondary"}
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
          {imageSource === "library" ? (
            <div
              className={`grid ${config.gridCols} gap-4 overflow-y-auto max-h-[50vh]`}
            >
              {/* Library content commented out */}
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="w-full px-4 py-4 border border-border rounded-lg bg-card file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
              />
              <div className="text-sm text-muted-foreground mt-3 p-4 bg-muted/20 rounded-lg">
                <strong>Recommended:</strong> {config.dimensions}
                <br />
                <strong>Max size:</strong> 5MB | <strong>Formats:</strong> JPG,
                PNG, WebP
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
