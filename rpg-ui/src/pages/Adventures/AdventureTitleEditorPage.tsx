import { useEffect, useState } from "react";
import { ArrowLeft, ImageIcon, Save, Eye, Edit } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePickerModal } from "@/components/Modals/ImagePickerModal";
import {
  adventureService,
  assetService,
  type Asset,
  type TitlePage,
} from "@/services/api";
import CreateHeader from "@/components/CreateHeader/CreateHeader";
import SavingModal from "@/components/Modals/SavingModal";

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

interface AdventureTitleEditorProps {
  adventureId?: string;
  onSave?: (titlePage: TitlePage) => void;
  onBack?: () => void;
}

export function AdventureTitleEditor({
  adventureId,
}: AdventureTitleEditorProps) {
  const [titlePage, setTitlePage] = useState<Partial<TitlePage>>({
    title: "",
    subtitle: "",
    banner_image_url: "",
    banner_image_id: "",
    introduction: "",
    background: "",
    prologue: "",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      setTitlePage({
        title: titlePage.title,
        subtitle: titlePage.subtitle,
        banner_image_url: titlePage.banner_image_url || "",
        banner_image_id: titlePage.banner_image_id || "",
        introduction: titlePage.introduction,
        background: titlePage.background,
        prologue: titlePage.prologue,
      });
    } catch (err) {
      // If title page doesn't exist, that's fine - show empty form
      if (err instanceof Error && err.message.includes("not found")) {
        // Keep default empty titlePage
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
    const saveStartTime = Date.now();
    setShowSavingModal(true);
    setIsSaving(true);

    if (!titlePage?.title?.trim()) {
      alert("Please enter an adventure title");
      return;
    }

    try {
      // Creating this so I can make sure all the fields have some value to satisfy the API
      const titlePageData = {
        title: titlePage.title || "",
        subtitle: titlePage.subtitle || "",
        banner_image_url: titlePage.banner_image_url || "",
        banner_image_id: titlePage.banner_image_id || "",
        introduction: titlePage.introduction || "",
        background: titlePage.background || "",
        prologue: titlePage.prologue || "",
      };
      try {
        await adventureService.titlePage.update(parseInt(id!), titlePage);
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

      const elapsed = Date.now() - saveStartTime;
      const minDelay = 800;

      if (elapsed < minDelay) {
        setTimeout(() => setIsSaving(false), minDelay - elapsed);
      } else {
        setIsSaving(false);
      }
    } catch (err) {
      setShowSavingModal(false);
      alert(
        `Failed to save title page: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

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
                backgroundImage: titlePage.banner_image_url
                  ? `url(${titlePage.banner_image_url})`
                  : undefined,
              }}
            >
              {titlePage.banner_image_url && (
                <div className="absolute inset-0 bg-black/40" />
              )}
              <div className="absolute inset-0 flex items-end">
                <div className="max-w-6xl mx-auto px-6 pb-8 w-full">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {titlePage.title || "Untitled Adventure"}
                  </h1>
                  <p className="text-xl text-white/90">{titlePage.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {titlePage.introduction && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">
                      Adventure Overview
                    </h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {titlePage.introduction
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </section>
                )}

                {titlePage.background && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Background</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {titlePage.background
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </section>
                )}

                {titlePage.prologue && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Opening Scene</h2>
                    <Card
                      variant="feature"
                      className="bg-accent/5 border border-accent/20"
                    >
                      <CardContent className="p-6">
                        <div className="prose max-w-none text-muted-foreground italic">
                          {titlePage.prologue
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editor Mode
  return (
    <div className="min-h-screen bg-background">
      <CreateHeader
        isEditing={isEditing}
        handleSave={handleSave}
        togglePreview={() => setPreviewMode(true)}
        navigateBack={handleBackToOverview}
      />

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
                      value={titlePage.title}
                      onChange={(e) =>
                        setTitlePage((prev) => ({
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
                      value={titlePage.subtitle}
                      onChange={(e) =>
                        setTitlePage((prev) => ({
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
                    {titlePage.banner_image_url ? (
                      <div className="space-y-3">
                        <div className="aspect-[3/1] bg-muted rounded-lg overflow-hidden">
                          <img
                            src={titlePage.banner_image_url}
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
                              setTitlePage((prev) => ({
                                ...prev,
                                banner_image_url: "",
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
                      value={titlePage.introduction}
                      onChange={(e) =>
                        setTitlePage((prev) => ({
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
                      value={titlePage.background}
                      onChange={(e) =>
                        setTitlePage((prev) => ({
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
                      value={titlePage.prologue}
                      onChange={(e) =>
                        setTitlePage((prev) => ({
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
                  {titlePage.banner_image_url ? (
                    <div className="aspect-[3/1] bg-muted rounded-lg overflow-hidden">
                      <img
                        src={titlePage.banner_image_url}
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
                      {titlePage.title || "Untitled Adventure"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {titlePage.subtitle}
                    </p>
                  </div>

                  {titlePage.introduction && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">Introduction</h5>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {titlePage.introduction}
                      </p>
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
        onSelectImage={(imageData) =>
          setTitlePage((prev) => ({
            ...prev,
            banner_image_url: imageData.url,
            banner_image_id: imageData.id,
          }))
        }
        aspectRatio="banner"
        title="Choose Banner Image"
        description="Select or upload a banner image for your adventure"
      />
      <SavingModal
        isOpen={showSavingModal}
        isLoading={isSaving}
        message={isEditing ? "Saving adventure..." : "Creating adventure..."}
        onClose={() => setShowSavingModal(false)}
      />
    </div>
  );
}
