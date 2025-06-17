import { useEffect, useState } from "react";
import { ArrowLeft, ImageIcon, Save, Eye, Edit } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePickerModal } from "@/components/Modals/ImagePickerModal";
import { AssetPickerModal } from "@/components/Modals/AssetPickerModal";
import { mockLibraryImages } from "@/components/mocks/imageMocks";
import { mockAssets } from "@/components/mocks/assetMocks";
import { AssetSelector } from "@/components/AssetPicker/AssetPicker";
import { adventureService, assetService, type Asset } from "@/services/api";

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

export function AdventureTitleEditor({
  adventureId,
}: AdventureTitleEditorProps) {
  const [titleData, setTitleData] = useState<TitleData>({
    title: "",
    subtitle: "",
    bannerImage: null,
    introduction: "",
    background: "",
    prologue: "",
    relatedAssets: [],
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (adventureId || id) {
      loadTitlePage();
    } else {
      setIsLoading(false);
    }
  }, [adventureId, id]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const assets = await assetService.getAll();
        setAllAssets(assets);
      } catch (err) {
        console.error("Failed to load assets:", err);
      }
    };
    loadAssets();
  }, []);

  const loadTitlePage = async () => {
    try {
      setIsLoading(true);
      const titlePage = await adventureService.titlePage.get(parseInt(id!));

      // Convert API data to component format
      setTitleData({
        title: titlePage.title,
        subtitle: titlePage.subtitle,
        bannerImage: titlePage.banner_image_url || null,
        introduction: titlePage.introduction,
        background: titlePage.background,
        prologue: titlePage.prologue,
        relatedAssets: [], // TODO: Handle assets when implemented
      });
    } catch (err) {
      // If title page doesn't exist, that's fine - show empty form
      if (err instanceof Error && err.message.includes("not found")) {
        // Keep default empty titleData
        console.log("No title page found, showing empty form");
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to load title page"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToOverview = () => {
    navigate(`/adventures/${id}/edit`);
  };

  const handleSave = async () => {
    if (!titleData.title.trim()) {
      alert("Please enter an adventure title");
      return;
    }

    try {
      const titlePageData = {
        title: titleData.title,
        subtitle: titleData.subtitle,
        banner_image_url: titleData.bannerImage || "",
        introduction: titleData.introduction,
        background: titleData.background,
        prologue: titleData.prologue,
      };

      // Try to update first, if it fails (404), then create
      try {
        await adventureService.titlePage.update(parseInt(id!), titlePageData);
      } catch (updateErr) {
        if (
          updateErr instanceof Error &&
          updateErr.message.includes("not found")
        ) {
          // Title page doesn't exist, create it
          await adventureService.titlePage.create(parseInt(id!), titlePageData);
        } else {
          throw updateErr;
        }
      }

      alert("Title page saved!");
      navigate(`/adventures/${id}/edit`);
    } catch (err) {
      alert(
        `Failed to save title page: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const handleToggleAsset = (assetId: string) => {
    setTitleData((prev) => ({
      ...prev,
      relatedAssets: prev.relatedAssets.includes(assetId)
        ? prev.relatedAssets.filter((id) => id !== assetId)
        : [...prev.relatedAssets, assetId],
    }));
  };

  const selectedAssets = allAssets.filter((asset) =>
    titleData.relatedAssets.includes(asset.id.toString())
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
            <AssetSelector
              title="Related Assets"
              description="Key characters, creatures, locations, and items"
              selectedAssetIds={titleData.relatedAssets}
              availableAssets={mockAssets}
              onToggleAsset={handleToggleAsset}
              emptyStateMessage="No assets selected yet"
              emptyStateButtonText="Add Your First Asset"
            />
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
        images={mockLibraryImages.banner}
      />

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        selectedAssets={titleData.relatedAssets}
        onToggleAsset={handleToggleAsset}
        assets={mockAssets}
      />
    </div>
  );
}
