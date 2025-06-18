import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImageIcon,
  Save,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Package,
  X,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";

import {
  adventureService,
  assetService,
  type Scene,
  type Asset,
} from "@/services/api";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePickerModal } from "@/components/Modals/ImagePickerModal";
import { AssetPickerModal } from "@/components/Modals/AssetPickerModal";

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

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
  onSave?: (sceneData: Scene) => void;
  onBack?: () => void;
  onNextScene?: () => void;
  onPrevScene?: () => void;
}

export function AdventureSceneEditorPage({
  onBack,
  onNextScene,
  onPrevScene,
}: AdventureSceneEditorProps) {
  const { id: adventureId, episodeId, sceneId } = useParams();
  const navigate = useNavigate();

  const [sceneData, setSceneData] = useState<Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [sceneNumber, setSceneNumber] = useState(1);
  const [totalScenes, setTotalScenes] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([]);

  const isEditing = Boolean(sceneId);
  const hasNext = sceneNumber < totalScenes;
  const hasPrev = sceneNumber > 1;

  useEffect(() => {
    if (adventureId && episodeId && sceneId && assets.length > 0) {
      loadScene();
    } else if (!adventureId || !episodeId || !sceneId) {
      setIsLoading(false);
    }
  }, [adventureId, episodeId, sceneId, assets]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await assetService.getAll();
        setAssets(data);
        console.log("Assets loaded:", data.length);
        console.log("Fetching assets...");
      } catch (err) {
        setError("Failed to load assets");
        console.error(err);
      }
    };
    fetchAssets();
  }, []);

  const loadScene = async () => {
    try {
      setIsLoading(true);
      console.log("Loading scene with params:", {
        adventureId,
        episodeId,
        sceneId,
      });

      const scenes = await adventureService.scenes.getAll(
        parseInt(adventureId!),
        parseInt(episodeId!)
      );

      console.log("All scenes from API:", scenes);

      const scene = scenes.find((s) => s.id === parseInt(sceneId!));
      if (!scene) {
        throw new Error("Scene not found");
      }

      const currentSceneIndex = scenes.findIndex(
        (s) => s.id === parseInt(sceneId!)
      );
      setSceneNumber(currentSceneIndex + 1);
      setTotalScenes(scenes.length);

      setSceneData(scene);
      console.log(
        "Scene loaded with asset_ids:",
        scene.asset_ids,
        "Available assets:",
        assets.length
      );
    } catch (err) {
      console.error("Error in loadScene:", err);
      setError(err instanceof Error ? err.message : "Failed to load scene");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!sceneData) return;

    if (!sceneData.title?.trim()) {
      alert("Please enter a scene title");
      return;
    }

    try {
      if (sceneData.id) {
        // Updating existing scene
        const updated = await adventureService.scenes.update(
          parseInt(adventureId!),
          parseInt(episodeId!),
          sceneData.id,
          {
            title: sceneData.title,
            description: sceneData.description,
            image_url: sceneData.image_url,
            prose: sceneData.prose,
            gm_notes: sceneData.gm_notes,
            asset_ids: sceneData.asset_ids,
          }
        );
        setSceneData(updated);
        alert("Scene saved!");
      } else {
        // Creating new scene
        const created = await adventureService.scenes.create(
          parseInt(adventureId!),
          parseInt(episodeId!),
          {
            title: sceneData.title,
            description: sceneData.description,
            image_url: sceneData.image_url,
            prose: sceneData.prose,
            gm_notes: sceneData.gm_notes,
            asset_ids: sceneData.asset_ids,
          }
        );
        setSceneData(created);
        alert("Scene created!");
      }
    } catch (err) {
      alert(
        `Failed to save scene: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const handleToggleAsset = (assetId: number) => {
    if (!sceneData) return;

    const currentAssetIds = sceneData.asset_ids || [];
    const isSelected = currentAssetIds.includes(assetId);

    const updatedAssetIds = isSelected
      ? currentAssetIds.filter((id) => id !== assetId)
      : [...currentAssetIds, assetId];

    setSceneData((prev) =>
      prev
        ? {
            ...prev,
            asset_ids: updatedAssetIds,
          }
        : prev
    );
  };

  const handleBackToOverview = () => {
    navigate(`/adventures/${adventureId}/edit`);
  };

  // Calculate selected assets based on asset_ids
  const selectedAssets = assets.filter(
    (asset) => sceneData?.asset_ids?.includes(asset.id) || false
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading scene...</p>
        </div>
      </div>
    );
  }

  if (!sceneData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No scene data available</p>
        </div>
      </div>
    );
  }

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
          {sceneData.image_url && (
            <div className="h-32 rounded-lg overflow-hidden bg-muted">
              <img
                src={sceneData.image_url}
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
            {sceneData.gm_notes && (
              <div className="lg:col-span-2">
                <Card variant="elevated">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">GM Notes</h2>
                    <p className="text-sm text-muted-foreground">
                      Running this scene
                    </p>
                  </CardHeader>
                  <CardContent>
                    <MarkdownPreview content={sceneData.gm_notes} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Scene Assets */}
            {selectedAssets.length > 0 && (
              <div className={sceneData.gm_notes ? "" : "lg:col-span-3"}>
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
                              src={asset.image_url}
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
                      value={sceneData.title || ""}
                      onChange={(e) =>
                        setSceneData((prev) =>
                          prev
                            ? {
                                ...prev,
                                title: e.target.value,
                              }
                            : prev
                        )
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
                      value={sceneData.description || ""}
                      onChange={(e) =>
                        setSceneData((prev) =>
                          prev
                            ? {
                                ...prev,
                                description: e.target.value,
                              }
                            : prev
                        )
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Brief description for the scene list..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Scene Image
                    </label>
                    {sceneData.image_url ? (
                      <div className="space-y-3">
                        <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
                          <img
                            src={sceneData.image_url}
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
                              setSceneData((prev) =>
                                prev ? { ...prev, image_url: undefined } : prev
                              )
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
                      value={sceneData.prose || ""}
                      onChange={(e) =>
                        setSceneData((prev) =>
                          prev
                            ? {
                                ...prev,
                                prose: e.target.value,
                              }
                            : prev
                        )
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
                      value={sceneData.gm_notes || ""}
                      onChange={(e) =>
                        setSceneData((prev) =>
                          prev
                            ? {
                                ...prev,
                                gm_notes: e.target.value,
                              }
                            : prev
                        )
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
                <div className="flex items-center justify-between pb-4">
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
                  <div className="space-y-3">
                    {selectedAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg"
                      >
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={asset.image_url}
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
                  {sceneData.image_url ? (
                    <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
                      <img
                        src={sceneData.image_url}
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

                  {sceneData.gm_notes && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">GM Notes</h5>
                      <div className="text-xs text-muted-foreground line-clamp-4">
                        <MarkdownPreview
                          content={sceneData.gm_notes.slice(0, 200) + "..."}
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

            {/* Writing Tips Card */}
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
          setSceneData((prev) =>
            prev ? { ...prev, image_url: imageUrl } : prev
          )
        }
      />

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        selectedAssets={sceneData.asset_ids?.map((id) => id.toString()) || []}
        onAcceptSelection={(assetIds) =>
          setSceneData((prev) =>
            prev ? { ...prev, asset_ids: assetIds } : prev
          )
        }
        assets={assets}
        title="Select Scene Assets"
        description="Choose assets that appear in this scene"
      />
    </div>
  );
}
