import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  BookOpen,
  ChevronRight,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { EpisodeEditModal } from "@/components/Modals/EditEpisodeModal";
import { ImagePickerModal } from "@/components/Modals/ImagePickerModal";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import {
  adventureService,
  type Adventure,
  type Episode,
  type Scene,
} from "@/services/api";
import CreateHeader from "@/components/CreateHeader/CreateHeader";
import SavingModal from "@/components/Modals/SavingModal";

type SceneStatus = "empty" | "draft" | "complete";

const getSceneStatus = (scene: Scene): SceneStatus => {
  if (scene.prose && scene.prose.trim()) return "complete";
  if (scene.title && scene.title.trim()) return "draft";
  return "empty";
};

const genreOptions = [
  "fantasy",
  "scifi",
  "horror",
  "mystery",
  "historical",
  "modern",
];

const ageRatingColors = {
  "For Everyone": "green",
  Teen: "yellow",
  Adult: "destructive",
} as const;

// Empty adventure for new creation
const createEmptyAdventure = (): Adventure => ({
  id: 0,
  title: "",
  description: "",
  banner_image_url: "",
  card_image_url: "",
  genres: [],
  is_official: false,
  age_rating: "For Everyone",
  episodes: [],
  created_at: "",
});

export function AdventureBuilderOverviewPage() {
  const [adventure, setAdventure] = useState<Adventure>(() =>
    createEmptyAdventure()
  );

  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(
    new Set(["1"]) // First episode expanded by default
  );

  // Episode modal state
  const [episodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isCreatingEpisode, setIsCreatingEpisode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showCardImagePicker, setShowCardImagePicker] = useState(false);

  const loadAdventure = async (adventureId: number) => {
    try {
      setIsLoading(true);
      const data = await adventureService.getById(adventureId);

      console.log("DATA: ====> ", data);

      const sortedData = {
        ...data,
        episodes:
          data.episodes
            ?.map((episode) => ({
              ...episode,
              scenes: episode.scenes?.sort((a, b) => a.order - b.order) || [],
            }))
            .sort((a, b) => a.order - b.order) || [],
      };

      setAdventure(sortedData);

      // Set first episode as expanded
      if (data.episodes && data.episodes.length > 0) {
        setExpandedEpisodes(new Set([data.episodes[0].id.toString()]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load adventure");
    } finally {
      setIsLoading(false);
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadAdventure(parseInt(id));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleNavigateToTitle = () => {
    navigate(`/adventures/${id}/edit/title`);
  };

  const handleNavigateToScene = (sceneID: string, episodeID: string) => {
    console.log("Navigation called with:", {
      sceneID,
      episodeID,
      adventureId: id,
    });
    navigate(`/adventures/${id}/edit/episodes/${episodeID}/scenes/${sceneID}`);
  };

  const handleNavigateToEpilogue = () => {
    navigate(`/adventures/${id}/edit/epilogue`);
  };

  const handleGenreToggle = (genre: string) => {
    setAdventure((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleCardImageSelect = (imageData: { url: string; id: string }) => {
    setAdventure((prev) => ({
      ...prev,
      card_image_url: imageData.url,
      card_image_id: imageData.id,
    }));
  };

  const toggleEpisode = (episodeId: string) => {
    setExpandedEpisodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  const handleAddEpisode = () => {
    const newEpisode: Episode = {
      id: 0, // Will be set by API
      adventure_id: adventure.id,
      order: (adventure.episodes?.length || 0) + 1,
      title: `Episode ${(adventure.episodes?.length || 0) + 1}`,
      description: "",
      created_at: "",
      scenes: [],
    };

    setEditingEpisode(newEpisode);
    setIsCreatingEpisode(true);
    setEpisodeModalOpen(true);
  };

  const handleEditEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setIsCreatingEpisode(false);
    setEpisodeModalOpen(true);
  };

  const handleSaveEpisode = async (updatedEpisode: Episode) => {
    const saveStartTime = Date.now();
    setShowSavingModal(true);
    setIsSaving(true);

    if (!adventure) {
      console.log("No apiAdventure found");
      return;
    }

    try {
      if (isCreatingEpisode) {
        const newEpisode = await adventureService.episodes.create(
          adventure.id,
          {
            title: updatedEpisode.title,
            description: updatedEpisode.description,
          }
        );
        setAdventure((prev) => ({
          ...prev,
          episodes: [...(prev.episodes || []), newEpisode],
        }));

        // Save Modal Timer
        const elapsed = Date.now() - saveStartTime;
        const minDelay = 800;

        if (elapsed < minDelay) {
          setTimeout(() => setIsSaving(false), minDelay - elapsed);
        } else {
          setIsSaving(false);
        }
      } else {
        const result = await adventureService.episodes.update(
          adventure.id,
          updatedEpisode.id,
          {
            title: updatedEpisode.title,
            description: updatedEpisode.description,
          }
        );
        setAdventure((prev) => ({
          ...prev,
          episodes: (prev.episodes || []).map((ep) =>
            ep.id === updatedEpisode.id ? result : ep
          ),
        }));

        // Save Modal Timer
        const elapsed = Date.now() - saveStartTime;
        const minDelay = 800;

        if (elapsed < minDelay) {
          setTimeout(() => setIsSaving(false), minDelay - elapsed);
        } else {
          setIsSaving(false);
        }
      }
    } catch (err) {
      console.error("Error in handleSaveEpisode:", err);
    }
  };

  const handleCloseEpisodeModal = () => {
    setEpisodeModalOpen(false);
    setEditingEpisode(null);
    setIsCreatingEpisode(false);
  };

  const handleDeleteEpisode = async (episodeId: number) => {
    if (!adventure || (adventure.episodes?.length || 0) <= 1) {
      alert("An adventure must have at least one episode");
      return;
    }

    if (
      confirm(
        "Are you sure you want to delete this episode and all its scenes?"
      )
    ) {
      try {
        await adventureService.episodes.delete(adventure.id, episodeId);
        setAdventure((prev) => ({
          ...prev,
          episodes: (prev.episodes || []).filter(
            (episode) => episode.id !== episodeId
          ),
        }));
        setExpandedEpisodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(episodeId.toString());
          return newSet;
        });
      } catch (err) {
        alert(
          `Failed to delete episode: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    }
  };

  const handleAddScene = async (episodeId: number) => {
    console.log("adding a scene");

    if (!adventure) return;

    console.log("adding a scene and working");
    try {
      const newScene = await adventureService.scenes.create(
        adventure.id,
        episodeId,
        {
          title: "",
          description: "",
        }
      );

      setAdventure((prev) => ({
        ...prev,
        episodes: (prev.episodes || []).map((ep) =>
          ep.id === episodeId
            ? {
                ...ep,
                scenes: [...(ep.scenes || []), newScene],
              }
            : ep
        ),
      }));
    } catch (err) {
      alert(
        `Failed to add scene: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const handleDeleteScene = async (episodeId: number, sceneId: number) => {
    if (!adventure) return;

    const episode = adventure.episodes?.find((e) => e.id === episodeId);
    if (!episode || (episode.scenes?.length || 0) <= 1) {
      alert("An episode must have at least one scene");
      return;
    }

    if (confirm("Are you sure you want to delete this scene?")) {
      try {
        await adventureService.scenes.delete(adventure.id, episodeId, sceneId);

        setAdventure((prev) => ({
          ...prev,
          episodes: (prev.episodes || []).map((ep) =>
            ep.id === episodeId
              ? {
                  ...ep,
                  scenes: (ep.scenes || []).filter(
                    (scene) => scene.id !== sceneId
                  ),
                }
              : ep
          ),
        }));
      } catch (err) {
        alert(
          `Failed to delete scene: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    }
  };

  const handleSave = async () => {
    const saveStartTime = Date.now();
    setIsSaving(true);
    setShowSavingModal(true);
    if (!adventure.title.trim()) {
      alert("Please enter an adventure title");
      return;
    }
    try {
      if (isEditing && adventure) {
        await adventureService.update(adventure.id, {
          title: adventure.title,
          description: adventure.description,
          card_image_url: adventure.card_image_url,
          card_image_id: adventure.card_image_id, // ADD THIS LINE
          genres: adventure.genres,
          age_rating: adventure.age_rating,
        });
        await loadAdventure(adventure.id);
        const elapsed = Date.now() - saveStartTime;
        const minDelay = 800; // 800ms minimum
        if (elapsed < minDelay) {
          setTimeout(() => setIsSaving(false), minDelay - elapsed);
        } else {
          setIsSaving(false);
        }
      } else {
        const created = await adventureService.create({
          title: adventure.title,
          description: adventure.description,
          card_image_url: adventure.card_image_url || "",
          card_image_id: adventure.card_image_id || "", // ADD THIS LINE
          banner_image_url: "",
          genres: adventure.genres || [],
          is_official: false,
          age_rating: adventure.age_rating,
        });
        setAdventure(created);
        navigate(`/adventures/${created.id}/edit`);
        setIsSaving(false);
      }
    } catch (err) {
      setShowSavingModal(false);
      alert(
        `Failed to save adventure: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const getStatusBadge = (scene: Scene) => {
    const status = getSceneStatus(scene);
    switch (status) {
      case "complete":
        return (
          <Badge variant="green" size="sm">
            Complete
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="yellow" size="sm">
            Draft
          </Badge>
        );
      case "empty":
        return (
          <Badge variant="outline" size="sm">
            Empty
          </Badge>
        );
    }
  };

  const getTotalScenes = () => {
    return (adventure.episodes || []).reduce(
      (total, episode) => total + (episode.scenes?.length || 0),
      0
    );
  };

  const handleBackToOverview = () => {
    navigate(`/adventures/`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <CreateHeader
        isEditing={isEditing}
        handleSave={handleSave}
        navigateBack={handleBackToOverview}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Adventure Metadata */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Adventure Details</h2>
                <p className="text-muted-foreground">
                  Basic information about your adventure
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Adventure Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={adventure.title}
                      onChange={(e) =>
                        setAdventure((prev) => ({
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
                      Description
                    </label>
                    <textarea
                      value={adventure.description}
                      onChange={(e) =>
                        setAdventure((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Brief description of your adventure..."
                    />
                  </div>

                  {/* Card Image Section */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Card Image
                    </label>
                    <p className="text-sm text-muted-foreground mb-3">
                      This image will appear on adventure cards in the gallery
                    </p>
                    {adventure.card_image_url ? (
                      <div className="space-y-3">
                        <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden max-w-md">
                          <img
                            src={adventure.card_image_url}
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
                              setAdventure((prev) => ({
                                ...prev,
                                card_image_url: "",
                                card_image_id: "",
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
                        onClick={() => setShowCardImagePicker(true)}
                        className="w-full py-8 border-dashed"
                      >
                        Choose Card Image
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Age Rating
                      </label>
                      <select
                        value={adventure.age_rating}
                        onChange={(e) =>
                          setAdventure((prev) => ({
                            ...prev,
                            age_rating: e.target
                              .value as Adventure["age_rating"],
                          }))
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="For Everyone">For Everyone</option>
                        <option value="Teen">Teen</option>
                        <option value="Adult">Adult</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Genres
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {genreOptions.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => handleGenreToggle(genre)}
                          className={cn(
                            "px-3 py-2 rounded-md text-sm font-medium transition-colors border",
                            adventure.genres.includes(genre)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adventure Structure - Episodes */}
            {!isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  Save your adventure details above to start adding episodes and
                  scenes.
                </p>
              </div>
            )}
            <Card
              variant="elevated"
              className={cn(!isEditing && "opacity-50 pointer-events-none")}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 sm:pb-2">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Adventure Structure
                    </h2>
                    <p className="text-muted-foreground">
                      Organize your adventure into episodes and scenes
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    leftIcon={Plus}
                    onClick={handleAddEpisode}
                  >
                    Add Episode
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Title Page */}
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <div className="hidden sm:flex min-w-8 min-h-8 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-medium">
                        T
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">
                          {adventure.title_page?.title || "Title Page"}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
                          {adventure.title_page?.subtitle ||
                            "Adventure introduction and setup"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      {adventure.title_page ? (
                        <Badge variant="green" size="sm">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          Empty
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Edit}
                        onClick={handleNavigateToTitle}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Episodes */}
                  {(adventure.episodes || []).map((episode, episodeIndex) => (
                    <Card
                      key={episode.id}
                      variant="ghost"
                      className="border border-border"
                    >
                      {/* Episode Header */}
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                            <button
                              onClick={() =>
                                toggleEpisode(episode.id.toString())
                              }
                              className="flex items-center gap-2 hover:bg-accent rounded-md p-1 -m-1 transition-colors min-w-0 flex-1"
                            >
                              <div className="hidden sm:flex min-w-8 min-h-8 rounded-full bg-accent text-accent-foreground items-center justify-center text-sm font-medium">
                                {episodeIndex + 1}
                              </div>
                              <div className="text-left min-w-0 flex-1">
                                <h3 className="font-medium truncate">
                                  {episode.title ||
                                    `Episode ${episodeIndex + 1}`}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
                                  {episode.description || "No description yet"}{" "}
                                  • {episode.scenes?.length || 0} scenes
                                </p>
                              </div>
                              {expandedEpisodes.has(episode.id.toString()) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={Edit}
                              onClick={() => handleEditEpisode(episode)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={Trash2}
                              onClick={() => handleDeleteEpisode(episode.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              disabled={(adventure.episodes?.length || 0) <= 1}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        {/* Episode Content - Scenes */}
                        {expandedEpisodes.has(episode.id.toString()) && (
                          <div className="mt-6 space-y-3">
                            {(episode.scenes || []).map((scene, sceneIndex) => (
                              <div
                                key={scene.id}
                                className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition gap-2"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                  <div className="hidden sm:flex w-6 h-6 min-w-6 min-h-6 rounded bg-background text-foreground items-center justify-center text-xs font-medium">
                                    {sceneIndex + 1}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-sm truncate">
                                      {scene.title || `Scene ${sceneIndex + 1}`}
                                    </h4>
                                    <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">
                                      {scene.description ||
                                        "No description yet"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                  {getStatusBadge(scene)}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={Edit}
                                    onClick={() =>
                                      handleNavigateToScene(
                                        scene.id.toString(),
                                        episode.id.toString()
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={Trash2}
                                    onClick={() =>
                                      handleDeleteScene(episode.id, scene.id)
                                    }
                                    className="text-red-600 hover:text-red-700"
                                    disabled={
                                      (episode.scenes?.length || 0) <= 1
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {/* Add Scene Button */}
                            <div className="ml-0 sm:ml-12">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={Plus}
                                onClick={() => handleAddScene(episode.id)}
                                className="w-full border-dashed"
                              >
                                Add Scene to This Episode
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {/* Epilogue */}
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <div className="hidden sm:flex w-8 h-8 rounded-full bg-muted text-muted-foreground items-center justify-center text-sm font-medium">
                        E
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">Epilogue</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
                          Adventure conclusion and outcomes
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                      {adventure.epilogue ? (
                        <Badge variant="green" size="sm">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          Empty
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Edit}
                        onClick={handleNavigateToEpilogue}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Preview */}
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Adventure Preview</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-lg">
                      {adventure.title || "Untitled Adventure"}
                    </h4>
                    {adventure.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {adventure.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={ageRatingColors[adventure.age_rating]}
                      size="sm"
                    >
                      {adventure.age_rating}
                    </Badge>
                  </div>

                  {adventure.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {adventure.genres.map((genre) => (
                        <Badge key={genre} variant="outline" size="sm">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Structure</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Title Page: {adventure.title_page ? "✓" : "○"}</div>
                      <div>
                        {adventure.episodes?.length || 0} Episode
                        {(adventure.episodes?.length || 0) !== 1 ? "s" : ""}
                      </div>
                      <div>
                        {getTotalScenes()} Total Scene
                        {getTotalScenes() !== 1 ? "s" : ""}
                      </div>
                      <div>Epilogue: {adventure.epilogue ? "✓" : "○"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Episode Edit Modal */}
      <EpisodeEditModal
        isOpen={episodeModalOpen}
        onClose={handleCloseEpisodeModal}
        episode={editingEpisode}
        onSave={handleSaveEpisode}
        isCreating={isCreatingEpisode}
      />

      {/* Card Image Picker Modal */}
      <ImagePickerModal
        isOpen={showCardImagePicker}
        onClose={() => setShowCardImagePicker(false)}
        onSelectImage={handleCardImageSelect}
        aspectRatio="landscape"
        title="Choose Card Image"
        description="Select an image for your adventure card in the gallery"
      />

      {/* Saving modal */}
      <SavingModal
        isOpen={showSavingModal}
        isLoading={isSaving}
        message={isEditing ? "Saving adventure..." : "Creating adventure..."}
        onClose={() => setShowSavingModal(false)}
      />
    </div>
  );
}
