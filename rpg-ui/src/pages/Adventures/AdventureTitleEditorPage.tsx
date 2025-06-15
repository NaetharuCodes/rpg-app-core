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
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

// Mock Link component for artifact demo
const Link = ({ to, className, children, ...props }: any) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

// Mock asset data
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
  {
    id: "ancient-sword",
    name: "Ancient Runeblade",
    type: "item",
    description: "A mystical weapon of great power",
    imageUrl: "https://via.placeholder.com/300x400/D97706/FFFFFF?text=Sword",
  },
];

// Mock library images
const mockLibraryImages = [
  {
    id: "banner1",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop",
    name: "Epic Battle",
  },
  {
    id: "banner2",
    url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=400&fit=crop",
    name: "Dark Castle",
  },
  {
    id: "banner3",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop",
    name: "Mystical Forest",
  },
  {
    id: "banner4",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop",
    name: "Mountain Path",
  },
];

interface TitleData {
  title: string;
  subtitle: string;
  bannerImage: string | null;
  introduction: string;
  background: string;
  prologue: string;
  relatedAssets: string[]; // Asset IDs
}

const defaultTitleData: TitleData = {
  title: "",
  subtitle: "A Simple D6 RPG Adventure for 3-5 Players",
  bannerImage: null,
  introduction: "",
  background: "",
  prologue: "",
  relatedAssets: [],
};

// Mock existing data
const mockExistingTitleData: TitleData = {
  title: "Fortress on the Edge of Doom",
  subtitle: "A Simple D6 RPG Adventure for 3-5 Players",
  bannerImage:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop",
  introduction:
    "Fortress on the Edge of Doom is an epic high fantasy adventure that focuses on heroism in the face of impossible odds, magical catastrophe, and the desperate defense of reality itself. The Simple D6 system provides quick resolution for action sequences when needed, but the heart of this adventure lies in dramatic storytelling, tactical cooperation, and the mounting tension of a final stand against cosmic horror.",
  background:
    "The Kingdom of Aldenwrath has been locked in a generations-long war against the Dark Lord Malthraxus and his armies of corrupted creatures. For three years, the final campaign has raged across the Thorndale Valley, with King Aldric's forces slowly pushing back the darkness.\n\nWhat neither side anticipated was the Dark Lord's final, desperate gambit. Faced with inevitable defeat, Malthraxus has turned to forbidden void magic - sorcery that tears at the very fabric of reality itself.",
  prologue:
    "The camera sweeps across a vast battlefield stretching between two mountain ranges. Banners of silver and gold clash against crimson and black as thousands of warriors fight in the valley below.\n\nAtop a rocky outcrop, the ancient fortress of Valenhall stands sentinel, its weathered gray stones bearing witness to the final battle between Light and Dark.",
  relatedAssets: [
    "sir-marcus-brightblade",
    "captain-roderick",
    "void-general",
    "fortress-valenhall",
  ],
};

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

interface AdventureTitleEditorProps {
  adventureId?: string;
  onSave?: (titleData: TitleData) => void;
  onBack?: () => void;
}

function AssetPickerModal({
  isOpen,
  onClose,
  selectedAssets,
  onToggleAsset,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: string[];
  onToggleAsset: (assetId: string) => void;
}) {
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
            <h2 className="text-xl font-semibold">Select Related Assets</h2>
            <p className="text-muted-foreground">
              Choose assets that appear in your adventure
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
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadPreview(result);
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
            <h2 className="text-xl font-semibold">Choose Banner Image</h2>
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
                  className="group relative aspect-[3/1] bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
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
                <strong>Recommended:</strong> 1200x400px (3:1 ratio)
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

export function AdventureTitleEditor({
  adventureId,
  onSave,
  onBack,
}: AdventureTitleEditorProps) {
  const [titleData, setTitleData] = useState<TitleData>(() =>
    adventureId ? mockExistingTitleData : defaultTitleData
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const handleBackToOverview = () => {
    navigate(`/adventures/${id}/edit`);
  };

  const handleSave = () => {
    if (!titleData.title.trim()) {
      alert("Please enter an adventure title");
      return;
    }
    onSave?.(titleData);
    alert("Title page saved!");
  };

  const handleToggleAsset = (assetId: string) => {
    setTitleData((prev) => ({
      ...prev,
      relatedAssets: prev.relatedAssets.includes(assetId)
        ? prev.relatedAssets.filter((id) => id !== assetId)
        : [...prev.relatedAssets, assetId],
    }));
  };

  const selectedAssets = mockAllAssets.filter((asset) =>
    titleData.relatedAssets.includes(asset.id)
  );

  if (previewMode) {
    // Preview Mode - Shows how the title page will look to players
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
                  <h1 className="text-xl font-semibold">Title Page Preview</h1>
                  <p className="text-sm text-muted-foreground">
                    How players will see your adventure
                  </p>
                </div>
              </div>
              <Button variant="primary" leftIcon={Save} onClick={handleSave}>
                Save Title Page
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div>
          {/* Banner Image and Title */}
          <div className="relative">
            <div
              className="h-80 bg-cover bg-center bg-muted"
              style={{
                backgroundImage: titleData.bannerImage
                  ? `url(${titleData.bannerImage})`
                  : undefined,
              }}
            >
              {titleData.bannerImage && (
                <div className="absolute inset-0 bg-black/40" />
              )}
              <div className="absolute inset-0 flex items-end">
                <div className="max-w-6xl mx-auto px-6 pb-8 w-full">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {titleData.title || "Untitled Adventure"}
                  </h1>
                  <p className="text-xl text-white/90">{titleData.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {titleData.introduction && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">
                      Adventure Overview
                    </h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {titleData.introduction
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </section>
                )}

                {titleData.background && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Background</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {titleData.background
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </section>
                )}

                {titleData.prologue && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Opening Scene</h2>
                    <Card
                      variant="feature"
                      className="bg-accent/5 border border-accent/20"
                    >
                      <CardContent className="p-6">
                        <div className="prose max-w-none text-muted-foreground italic">
                          {titleData.prologue
                            .split("\n")
                            .map((paragraph, index) => (
                              <p key={index} className="mb-4">
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {selectedAssets.length > 0 && (
                  <Card variant="elevated">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Key Assets</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedAssets.map((asset) => (
                          <div
                            key={asset.id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {asset.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {asset.description}
                              </div>
                            </div>
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
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
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
              <Button
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={handleBackToOverview}
              >
                Back to Overview
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Title Page</h1>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Modify your adventure introduction"
                    : "Create your adventure introduction"}
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
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Adventure Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={titleData.title}
                      onChange={(e) =>
                        setTitleData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 text-lg border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter adventure title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={titleData.subtitle}
                      onChange={(e) =>
                        setTitleData((prev) => ({
                          ...prev,
                          subtitle: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="A Simple D6 RPG Adventure for 3-5 Players"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Banner Image
                    </label>
                    {titleData.bannerImage ? (
                      <div className="space-y-3">
                        <div className="aspect-[3/1] bg-muted rounded-lg overflow-hidden">
                          <img
                            src={titleData.bannerImage}
                            alt="Banner"
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
                              setTitleData((prev) => ({
                                ...prev,
                                bannerImage: null,
                              }))
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
                        Choose Banner Image
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Adventure Content</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Introduction
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Adventure overview that explains the premise and gameplay
                      focus
                    </p>
                    <textarea
                      value={titleData.introduction}
                      onChange={(e) =>
                        setTitleData((prev) => ({
                          ...prev,
                          introduction: e.target.value,
                        }))
                      }
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Describe what makes this adventure unique and engaging..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Background
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Setting context and world information that sets up the
                      adventure
                    </p>
                    <textarea
                      value={titleData.background}
                      onChange={(e) =>
                        setTitleData((prev) => ({
                          ...prev,
                          background: e.target.value,
                        }))
                      }
                      rows={8}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Provide the historical context, current situation, and key events leading to this adventure..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Opening Scene / Prologue
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Dramatic opening description to set the mood and draw
                      players in
                    </p>
                    <textarea
                      value={titleData.prologue}
                      onChange={(e) =>
                        setTitleData((prev) => ({
                          ...prev,
                          prologue: e.target.value,
                        }))
                      }
                      rows={8}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                      placeholder="Write an evocative opening scene that immediately engages the players..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Assets */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Related Assets</h2>
                    <p className="text-sm text-muted-foreground">
                      Key characters, creatures, locations, and items
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
                <h3 className="text-lg font-semibold">Title Page Preview</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mini Banner Preview */}
                  {titleData.bannerImage ? (
                    <div className="aspect-[3/1] bg-muted rounded-lg overflow-hidden">
                      <img
                        src={titleData.bannerImage}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/1] bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-lg">
                      {titleData.title || "Untitled Adventure"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {titleData.subtitle}
                    </p>
                  </div>

                  {titleData.introduction && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">Introduction</h5>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {titleData.introduction}
                      </p>
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
                    <strong className="text-foreground">Introduction:</strong>{" "}
                    Focus on what makes your adventure unique and engaging for
                    players.
                  </div>
                  <div>
                    <strong className="text-foreground">Background:</strong>{" "}
                    Provide enough context to understand the situation without
                    overwhelming detail.
                  </div>
                  <div>
                    <strong className="text-foreground">Prologue:</strong> Paint
                    a vivid scene that immediately draws players into your
                    world.
                  </div>
                  <div>
                    <strong className="text-foreground">Assets:</strong> Include
                    the most important characters, locations, and items that
                    players will encounter.
                  </div>
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
          setTitleData((prev) => ({ ...prev, bannerImage: imageUrl }))
        }
      />

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        selectedAssets={titleData.relatedAssets}
        onToggleAsset={handleToggleAsset}
      />
    </div>
  );
}
