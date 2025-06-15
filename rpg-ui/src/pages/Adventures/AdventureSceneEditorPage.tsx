import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  Save,
  Eye,
  Edit,
  X,
  Package,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { cn } from "@/lib/utils";

// Mock Link component for artifact demo
const Link = ({ to, className, children, ...props }: any) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

// Mock asset data (same as title editor)
const mockAllAssets = [
  {
    id: "sir-marcus-brightblade",
    name: "Sir Marcus Brightblade",
    type: "character",
    description: "A young knight seeking to prove his honor",
    imageUrl: "https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Knight",
  },
  {
    id: "captain-roderick",
    name: "Captain Roderick",
    type: "character",
    description: "Weathered fortress commander",
    imageUrl: "https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Captain",
  },
  {
    id: "void-general",
    name: "The Void General",
    type: "creature",
    description: "What King Aldric becomes when corrupted",
    imageUrl: "https://via.placeholder.com/300x400/DC2626/FFFFFF?text=Void",
  },
  {
    id: "fortress-valenhall",
    name: "Fortress Valenhall",
    type: "location",
    description: "Ancient stronghold with protective wards",
    imageUrl: "https://via.placeholder.com/300x400/059669/FFFFFF?text=Fortress",
  },
];

// Mock library images
const mockLibraryImages = [
  {
    id: "scene1",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop",
    name: "Epic Battle",
  },
  {
    id: "scene2",
    url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop",
    name: "Dark Castle",
  },
  {
    id: "scene3",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=500&fit=crop",
    name: "Mystical Forest",
  },
];

interface SceneData {
  title: string;
  description: string;
  image: string | null;
  prose: string;
  gmNotes: string; // Markdown format
  sceneAssets: string[]; // Asset IDs
}

const defaultSceneData: SceneData = {
  title: "",
  description: "",
  image: null,
  prose: "",
  gmNotes: "",
  sceneAssets: [],
};

// Mock existing scene data
const mockExistingSceneData: SceneData = {
  title: "The Battle Observed",
  description: "Heroes witness the final battle from the fortress battlements",
  image:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop",
  prose:
    "From the ancient stones of Valenhall's battlements, the final battle spreads before you like a living tapestry of heroism and horror. Three years of war have led to this moment - King Aldric's forces, their silver banners gleaming in the afternoon sun, pressing forward in disciplined formations across the Thorndale Valley.\n\nCaptain Roderick stands beside you at the battlements, his weathered face showing the first signs of hope you've seen in months. \"Look there,\" he points toward the valley floor, where the king's golden standard advances steadily. \"Malthraxus is finally beaten. Three years of hell, but we've broken them at last.\"",
  gmNotes:
    "## Setting the Victory\nEmphasize that this should be a moment of triumph. The characters have witnessed three years of brutal warfare, and victory seems finally at hand.\n\n### Victory Indicators:\n- The enemy forces are in clear retreat across multiple fronts\n- King Aldric himself leads the final charge\n- The fortress defenders are celebrating\n\n### Simple D6 Checks:\n- **Notice (Easy)**: The enemy retreat seems unusually organized\n- **Military Tactics (Moderate)**: The converging retreat pattern is strategically purposeful\n- **Magic Theory (Hard)**: The strange shimmer in the air around the obsidian tower\n\n> **The Convergence**: As the scene progresses, make it clear that something ominous is happening.",
  sceneAssets: ["captain-roderick", "fortress-valenhall"],
};

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: string[];
  onToggleAsset: (assetId: string) => void;
}

function AssetPickerModal({
  isOpen,
  onClose,
  selectedAssets,
  onToggleAsset,
}: AssetPickerModalProps) {
  const [filter, setFilter] = useState<
    "all" | "character" | "creature" | "location" | "item"
  >("all");

  if (!isOpen) return null;

  const filteredAssets =
    filter === "all"
      ? mockAllAssets
      : mockAllAssets.filter((asset) => asset.type === filter);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">Select Scene Assets</h2>
            <p className="text-muted-foreground">
              Choose assets that appear in this scene
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(
              ["all", "character", "creature", "location", "item"] as const
            ).map((tab) => (
              <Button
                key={tab}
                variant={filter === tab ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(tab)}
              >
                {tab === "all"
                  ? "All"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
                s
              </Button>
            ))}
          </div>

          {/* Assets Grid */}
          <div className="overflow-y-auto max-h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onToggleAsset(asset.id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all hover:bg-accent/5",
                    selectedAssets.includes(asset.id)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={asset.imageUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {asset.name}
                        </h4>
                        <Badge
                          variant={
                            assetTypeColors[
                              asset.type as keyof typeof assetTypeColors
                            ]
                          }
                          size="sm"
                        >
                          {asset.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {asset.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center",
                          selectedAssets.includes(asset.id)
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {selectedAssets.includes(asset.id) && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {selectedAssets.length} asset
              {selectedAssets.length !== 1 ? "s" : ""} selected
            </span>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}) {
  const [imageSource, setImageSource] = useState<"library" | "upload">(
    "library"
  );

  if (!isOpen) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelectImage(result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">Choose Scene Image</h2>
            <p className="text-muted-foreground">
              Select from library or upload your own
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Source Toggle */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[50vh]">
              {mockLibraryImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => {
                    onSelectImage(image.url);
                    onClose();
                  }}
                  className="group relative aspect-[16/9] bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
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
          ) : (
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="w-full px-4 py-4 border border-border rounded-lg bg-card file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
              />
              <div className="text-sm text-muted-foreground mt-3 p-4 bg-muted/20 rounded-lg">
                <strong>Recommended:</strong> 800x500px (16:9 ratio)
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

// Simple markdown renderer for preview
function MarkdownPreview({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={index} className="font-semibold text-foreground mt-4 mb-2">
            {line.slice(4)}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3
            key={index}
            className="font-semibold text-lg text-foreground mt-4 mb-2"
          >
            {line.slice(3)}
          </h3>
        );
      }
      // Lists
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.slice(2)}
          </li>
        );
      }
      // Blockquotes
      if (line.startsWith("> ")) {
        return (
          <div
            key={index}
            className="border-l-4 border-accent pl-4 my-2 italic bg-accent/5 py-2"
          >
            {line.slice(2)}
          </div>
        );
      }
      // Bold text
      const boldText = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      if (line.trim() === "") {
        return <br key={index} />;
      }

      return (
        <p
          key={index}
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: boldText }}
        />
      );
    });
  };

  return (
    <div className="prose max-w-none text-muted-foreground">
      {renderMarkdown(content)}
    </div>
  );
}

interface AdventureSceneEditorProps {
  adventureId?: string;
  sceneId?: string;
  sceneNumber?: number;
  totalScenes?: number;
  onSave?: (sceneData: SceneData) => void;
  onBack?: () => void;
  onNextScene?: () => void;
  onPrevScene?: () => void;
}

export function AdventureSceneEditorPage({
  adventureId,
  sceneId,
  sceneNumber = 1,
  totalScenes = 12,
  onSave,
  onBack,
  onNextScene,
  onPrevScene,
}: AdventureSceneEditorProps) {
  const [sceneData, setSceneData] = useState<SceneData>(() =>
    sceneId ? mockExistingSceneData : defaultSceneData
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  const isEditing = Boolean(sceneId);
  const hasNext = sceneNumber < totalScenes;
  const hasPrev = sceneNumber > 1;

  const handleSave = () => {
    if (!sceneData.title.trim()) {
      alert("Please enter a scene title");
      return;
    }
    onSave?.(sceneData);
    alert("Scene saved!");
  };

  const handleToggleAsset = (assetId: string) => {
    setSceneData((prev) => ({
      ...prev,
      sceneAssets: prev.sceneAssets.includes(assetId)
        ? prev.sceneAssets.filter((id) => id !== assetId)
        : [...prev.sceneAssets, assetId],
    }));
  };

  const selectedAssets = mockAllAssets.filter((asset) =>
    sceneData.sceneAssets.includes(asset.id)
  );

  if (previewMode) {
    // Preview Mode - Shows how the scene will look to GMs
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  leftIcon={Edit}
                  onClick={() => setPreviewMode(false)}
                >
                  Back to Editor
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Scene Preview</h1>
                  <p className="text-sm text-muted-foreground">
                    Scene {sceneNumber} of {totalScenes}
                  </p>
                </div>
              </div>
              <Button variant="primary" leftIcon={Save} onClick={handleSave}>
                Save Scene
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Scene Image */}
          {sceneData.image && (
            <div className="h-32 rounded-lg overflow-hidden bg-muted">
              <img
                src={sceneData.image}
                alt={sceneData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Read-Aloud Prose */}
          {sceneData.prose && (
            <Card
              variant="feature"
              className="bg-accent/5 border border-accent/20"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">Scene Description</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Read aloud to your players
                </p>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {sceneData.prose.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* GM Notes */}
            {sceneData.gmNotes && (
              <div className="lg:col-span-2">
                <Card variant="elevated">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">GM Notes</h2>
                    <p className="text-sm text-muted-foreground">
                      Running this scene
                    </p>
                  </CardHeader>
                  <CardContent>
                    <MarkdownPreview content={sceneData.gmNotes} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Scene Assets */}
            {selectedAssets.length > 0 && (
              <div className={sceneData.gmNotes ? "" : "lg:col-span-3"}>
                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Scene Assets</h3>
                    <p className="text-sm text-muted-foreground">
                      Key assets for this scene
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={asset.imageUrl}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {asset.name}
                              </h4>
                              <Badge
                                variant={
                                  assetTypeColors[
                                    asset.type as keyof typeof assetTypeColors
                                  ]
                                }
                                size="sm"
                              >
                                {asset.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {asset.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Editor Mode
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" leftIcon={ArrowLeft} onClick={onBack}>
                Back to Overview
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? "Edit Scene" : "Create Scene"}
                </h1>
                <p className="text-muted-foreground">
                  Scene {sceneNumber} of {totalScenes}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                leftIcon={Eye}
                onClick={() => setPreviewMode(true)}
              >
                Preview
              </Button>
              <Button variant="primary" leftIcon={Save} onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>

          {/* Scene Navigation */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={ChevronLeft}
              onClick={onPrevScene}
              disabled={!hasPrev}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={ChevronRight}
              onClick={onNextScene}
              disabled={!hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Scene Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Scene Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sceneData.title}
                      onChange={(e) =>
                        setSceneData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 text-lg border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter scene title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Scene Description
                    </label>
                    <input
                      type="text"
                      value={sceneData.description}
                      onChange={(e) =>
                        setSceneData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Brief description for the scene list..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Scene Image
                    </label>
                    {sceneData.image ? (
                      <div className="space-y-3">
                        <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
                          <img
                            src={sceneData.image}
                            alt="Scene"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => setShowImagePicker(true)}
                          >
                            Change Image
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              setSceneData((prev) => ({ ...prev, image: null }))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        leftIcon={ImageIcon}
                        onClick={() => setShowImagePicker(true)}
                        className="w-full py-8 border-dashed"
                      >
                        Choose Scene Image
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scene Content */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Scene Content</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Read-Aloud Text
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Descriptive text that you'll read to players to set the
                      scene
                    </p>
                    <textarea
                      value={sceneData.prose}
                      onChange={(e) =>
                        setSceneData((prev) => ({
                          ...prev,
                          prose: e.target.value,
                        }))
                      }
                      rows={10}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Paint a vivid picture of what the players see, hear, and experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GM Notes
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Use markdown formatting for organization.
                    </p>
                    <textarea
                      value={sceneData.gmNotes}
                      onChange={(e) =>
                        setSceneData((prev) => ({
                          ...prev,
                          gmNotes: e.target.value,
                        }))
                      }
                      rows={15}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                      placeholder="## Scene Overview...Write your GM notes here..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scene Assets */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Scene Assets</h2>
                    <p className="text-sm text-muted-foreground">
                      Characters, creatures, locations, and items in this scene
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    leftIcon={Plus}
                    onClick={() => setShowAssetPicker(true)}
                  >
                    Add Assets
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedAssets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg"
                      >
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={asset.imageUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {asset.name}
                            </h4>
                            <Badge
                              variant={
                                assetTypeColors[
                                  asset.type as keyof typeof assetTypeColors
                                ]
                              }
                              size="sm"
                            >
                              {asset.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {asset.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAsset(asset.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No assets selected yet
                    </p>
                    <Button
                      variant="secondary"
                      leftIcon={Plus}
                      onClick={() => setShowAssetPicker(true)}
                    >
                      Add Your First Asset
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Scene Preview</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mini Image Preview */}
                  {sceneData.image ? (
                    <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
                      <img
                        src={sceneData.image}
                        alt="Scene preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-lg">
                      {sceneData.title || `Scene ${sceneNumber}`}
                    </h4>
                    {sceneData.description && (
                      <p className="text-sm text-muted-foreground">
                        {sceneData.description}
                      </p>
                    )}
                  </div>

                  {sceneData.prose && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">
                        Read-Aloud Text
                      </h5>
                      <p className="text-xs text-muted-foreground line-clamp-4">
                        {sceneData.prose}
                      </p>
                    </div>
                  )}

                  {sceneData.gmNotes && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">GM Notes</h5>
                      <div className="text-xs text-muted-foreground line-clamp-4">
                        <MarkdownPreview
                          content={sceneData.gmNotes.slice(0, 200) + "..."}
                        />
                      </div>
                    </div>
                  )}

                  {selectedAssets.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">
                        Assets ({selectedAssets.length})
                      </h5>
                      <div className="space-y-1">
                        {selectedAssets.slice(0, 3).map((asset) => (
                          <div
                            key={asset.id}
                            className="flex items-center gap-2"
                          >
                            <Badge
                              variant={
                                assetTypeColors[
                                  asset.type as keyof typeof assetTypeColors
                                ]
                              }
                              size="sm"
                            >
                              {asset.type}
                            </Badge>
                            <span className="text-xs truncate">
                              {asset.name}
                            </span>
                          </div>
                        ))}
                        {selectedAssets.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{selectedAssets.length - 3} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card variant="ghost" className="border border-border">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Writing Tips</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Read-Aloud:</strong> Use
                    vivid, sensory language. Write like you're painting a
                    picture.
                  </div>
                  <div>
                    <strong className="text-foreground">GM Notes:</strong>{" "}
                    Include potential actions, difficulty ratings, and key
                    information.
                  </div>
                  <div>
                    <strong className="text-foreground">Markdown:</strong> Use
                    ## for headers, **bold** for emphasis, - for lists.
                  </div>
                  <div>
                    <strong className="text-foreground">Assets:</strong> Include
                    NPCs, locations, and items players will interact with.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scene Navigation Helper */}
            <Card variant="ghost" className="border border-border">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Scene Navigation</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={ChevronLeft}
                    onClick={onPrevScene}
                    disabled={!hasPrev}
                    className="w-full justify-start"
                  >
                    Previous Scene
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={ChevronRight}
                    onClick={onNextScene}
                    disabled={!hasNext}
                    className="w-full justify-start"
                  >
                    Next Scene
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-3 text-center">
                  Scene {sceneNumber} of {totalScenes}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelectImage={(imageUrl) =>
          setSceneData((prev) => ({ ...prev, image: imageUrl }))
        }
      />

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        selectedAssets={sceneData.sceneAssets}
        onToggleAsset={handleToggleAsset}
      />
    </div>
  );
}
