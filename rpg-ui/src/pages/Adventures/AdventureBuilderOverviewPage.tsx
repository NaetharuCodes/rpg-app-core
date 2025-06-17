import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Save,
  Play,
  Users,
  Clock,
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
  imageService,
  type Adventure,
  type Episode,
  type Scene,
} from "@/services/api";

// Mock Link component for artifact demo
const Link = ({ to, className, children, ...props }: any) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

interface LocalScene {
  id: string;
  title: string;
  description: string;
  status: "empty" | "draft" | "complete";
}

interface LocalEpisode {
  id: string;
  title: string;
  description: string;
  scenes: LocalScene[];
}

interface LocalAdventure extends Omit<Adventure, "episodes"> {
  playerCount: string;
  duration: string;
  suitability: "All" | "Teen" | "Adult";
  episodes: LocalEpisode[];
  hasTitle: boolean;
  hasEpilogue: boolean;
  titlePageData?: any;
}

const genreOptions = [
  "fantasy",
  "scifi",
  "horror",
  "mystery",
  "historical",
  "modern",
];

const suitabilityColours = {
  All: "green",
  Teen: "yellow",
  Adult: "destructive",
} as const;

// Empty adventure for new creation
const createEmptyAdventure = (): LocalAdventure => ({
  id: 0,
  title: "",
  description: "",
  card_image_url: "",
  banner_image_url: "",
  genres: [],
  is_official: false,
  age_rating: "For Everyone",
  created_at: "",
  playerCount: "3-5",
  duration: "2-4 hours",
  suitability: "All",
  hasTitle: false,
  hasEpilogue: false,
  episodes: [
    {
      id: "episode-1",
      title: "Episode 1",
      description: "",
      scenes: [
        { id: "scene-1-1", title: "", description: "", status: "empty" },
      ],
    },
  ],
});

// Mock library images - replace with your actual image library
const mockLibraryImages = [
  {
    id: "1",
    url: "https://picsum.photos/800/450?random=1",
    name: "Fantasy Landscape",
  },
  {
    id: "2",
    url: "https://picsum.photos/800/450?random=2",
    name: "Mysterious Castle",
  },
  {
    id: "3",
    url: "https://picsum.photos/800/450?random=3",
    name: "Dark Forest",
  },
];

interface AdventureBuilderOverviewProps {
  adventureId?: string;
  onSave?: (adventure: LocalAdventure) => void;
  onPreview?: () => void;
}

export function AdventureBuilderOverviewPage({
  onPreview,
}: AdventureBuilderOverviewProps) {
  const [adventure, setAdventure] = useState<LocalAdventure>(() =>
    createEmptyAdventure()
  );

  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(
    new Set(["episode-1"]) // First episode expanded by default
  );

  // Episode modal state
  const [episodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<LocalEpisode | null>(
    null
  );
  const [isCreatingEpisode, setIsCreatingEpisode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiAdventure, setApiAdventure] = useState<Adventure | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Image picker state
  const [showCardImagePicker, setShowCardImagePicker] = useState(false);

  const loadAdventure = async (adventureId: number) => {
    try {
      setIsLoading(true);
      const data = await adventureService.getById(adventureId);
      setApiAdventure(data);
      await convertApiDataToComponent(data);
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

  const convertApiDataToComponent = async (apiData: Adventure) => {
    console.log("All episodes from API:", apiData.episodes);

    const sortedEpisodes = (apiData.episodes || []).sort(
      (a, b) => a.order - b.order
    );

    const episodes: LocalEpisode[] = sortedEpisodes.map((ep) => ({
      id: ep.id.toString(),
      title: ep.title,
      description: ep.description,
      scenes: (ep.scenes || [])
        .sort((a, b) => a.order - b.order)
        .map((scene) => ({
          id: scene.id.toString(),
          title: scene.title,
          description: scene.description,
          status: scene.prose ? "complete" : scene.title ? "draft" : "empty",
        })),
    }));

    let hasTitle = false;
    let titlePageData = null;
    try {
      titlePageData = await adventureService.titlePage.get(apiData.id);
      hasTitle = true;
    } catch (err) {
      hasTitle = false;
    }

    setAdventure((prev) => ({
      ...prev,
      id: apiData.id,
      title: apiData.title,
      description: apiData.description,
      card_image_url: apiData.card_image_url,
      banner_image_url: apiData.banner_image_url,
      genres: apiData.genres,
      is_official: apiData.is_official,
      age_rating: apiData.age_rating,
      created_at: apiData.created_at,
      episodes,
      hasTitle,
      titlePageData,
    }));
  };

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

  const handleCardImageSelect = (imageUrl: string) => {
    setAdventure((prev) => ({
      ...prev,
      card_image_url: imageUrl,
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
    const newEpisode: LocalEpisode = {
      id: `episode-${adventure.episodes.length + 1}`,
      title: `Episode ${adventure.episodes.length + 1}`,
      description: "",
      scenes: [
        {
          id: `scene-${adventure.episodes.length + 1}-1`,
          title: "",
          description: "",
          status: "empty",
        },
      ],
    };

    setEditingEpisode(newEpisode);
    setIsCreatingEpisode(true);
    setEpisodeModalOpen(true);
  };

  const handleEditEpisode = (episode: LocalEpisode) => {
    setEditingEpisode(episode);
    setIsCreatingEpisode(false);
    setEpisodeModalOpen(true);
  };

  const handleSaveEpisode = async (updatedEpisode: LocalEpisode) => {
    console.log("handleSaveEpisode called with:", updatedEpisode);

    if (!apiAdventure) {
      console.log("No apiAdventure found");
      return;
    }

    try {
      if (isCreatingEpisode) {
        console.log("Creating new episode...");
        const newEpisode = await adventureService.episodes.create(
          apiAdventure.id,
          {
            title: updatedEpisode.title,
            description: updatedEpisode.description,
          }
        );
        console.log("New episode created:", newEpisode);
        setAdventure((prev) => ({
          ...prev,
          episodes: [
            ...prev.episodes,
            {
              id: newEpisode.id.toString(),
              title: newEpisode.title,
              description: newEpisode.description,
              scenes: [],
            },
          ],
        }));
      } else {
        console.log(
          "Updating existing episode...",
          apiAdventure.id,
          updatedEpisode.id
        );
        const result = await adventureService.episodes.update(
          apiAdventure.id,
          parseInt(updatedEpisode.id),
          {
            title: updatedEpisode.title,
            description: updatedEpisode.description,
          }
        );
        console.log("Update result:", result);
        setAdventure((prev) => ({
          ...prev,
          episodes: prev.episodes.map((ep) =>
            ep.id === updatedEpisode.id
              ? {
                  ...ep,
                  title: updatedEpisode.title,
                  description: updatedEpisode.description,
                }
              : ep
          ),
        }));
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

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!apiAdventure || adventure.episodes.length <= 1) {
      alert("An adventure must have at least one episode");
      return;
    }

    if (
      confirm(
        "Are you sure you want to delete this episode and all its scenes?"
      )
    ) {
      try {
        await adventureService.episodes.delete(
          apiAdventure.id,
          parseInt(episodeId)
        );
        setAdventure((prev) => ({
          ...prev,
          episodes: prev.episodes.filter((episode) => episode.id !== episodeId),
        }));
        setExpandedEpisodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(episodeId);
          return newSet;
        });
      } catch (err) {
        alert(
          `Failed to delete episode: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    }
  };

  const handleAddScene = async (episodeId: string) => {
    console.log("adding a scene");

    if (!apiAdventure) return;

    console.log("adding a scene and working");
    try {
      const newScene = await adventureService.scenes.create(
        apiAdventure.id,
        parseInt(episodeId),
        {
          title: "",
          description: "",
        }
      );

      setAdventure((prev) => ({
        ...prev,
        episodes: prev.episodes.map((ep) =>
          ep.id === episodeId
            ? {
                ...ep,
                scenes: [
                  ...ep.scenes,
                  {
                    id: newScene.id.toString(),
                    title: newScene.title,
                    description: newScene.description,
                    status: "empty",
                  },
                ],
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

  const handleDeleteScene = async (episodeId: string, sceneId: string) => {
    if (!apiAdventure) return;

    const episode = adventure.episodes.find((e) => e.id === episodeId);
    if (!episode || episode.scenes.length <= 1) {
      alert("An episode must have at least one scene");
      return;
    }

    if (confirm("Are you sure you want to delete this scene?")) {
      try {
        await adventureService.scenes.delete(
          apiAdventure.id,
          parseInt(episodeId),
          parseInt(sceneId)
        );

        setAdventure((prev) => ({
          ...prev,
          episodes: prev.episodes.map((ep) =>
            ep.id === episodeId
              ? {
                  ...ep,
                  scenes: ep.scenes.filter((scene) => scene.id !== sceneId),
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
    if (!adventure.title.trim()) {
      alert("Please enter an adventure title");
      return;
    }

    try {
      if (isEditing && apiAdventure) {
        await adventureService.update(apiAdventure.id, {
          title: adventure.title,
          description: adventure.description,
          card_image_url: adventure.card_image_url,
          genres: adventure.genres,
          age_rating:
            adventure.suitability === "All"
              ? "For Everyone"
              : adventure.suitability,
        });
        await loadAdventure(apiAdventure.id);
        alert("Adventure updated!");
      } else {
        const created = await adventureService.create({
          title: adventure.title,
          description: adventure.description,
          card_image_url: adventure.card_image_url || "",
          banner_image_url: "",
          genres: adventure.genres || [],
          is_official: false,
          age_rating:
            adventure.suitability === "All"
              ? "For Everyone"
              : adventure.suitability,
        });

        // Auto-create title page
        await adventureService.titlePage.create(created.id, {
          title: adventure.title,
          subtitle: "",
          banner_image_url: "",
          introduction: "",
          background: "",
          prologue: "",
        });

        // Auto-create first episode
        const firstEpisode = await adventureService.episodes.create(
          created.id,
          {
            title: "Episode 1",
            description: "",
          }
        );

        // Auto-create first scene in the episode
        await adventureService.scenes.create(created.id, firstEpisode.id, {
          title: "Scene 1",
          description: "",
          prose: "",
          gm_notes: "",
        });

        setApiAdventure(created);
        navigate(`/adventures/${created.id}/edit`);
        alert("Adventure created with basic structure!");
      }
    } catch (err) {
      alert(
        `Failed to save adventure: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const getStatusBadge = (status: LocalScene["status"]) => {
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
    return adventure.episodes.reduce(
      (total, episode) => total + episode.scenes.length,
      0
    );
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
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/adventures"
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditing ? "Edit Adventure" : "Create New Adventure"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isEditing
                    ? "Modify your adventure structure and content"
                    : "Build your custom RPG adventure step by step"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} leftIcon={Save}>
                {isEditing ? "Save Changes" : "Create Adventure"}
              </Button>
            </div>
          </div>
        </div>
      </div>

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
                        Player Count
                      </label>
                      <select
                        value={adventure.playerCount}
                        onChange={(e) =>
                          setAdventure((prev) => ({
                            ...prev,
                            playerCount: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="2-3">2-3 Players</option>
                        <option value="3-5">3-5 Players</option>
                        <option value="4-6">4-6 Players</option>
                        <option value="5-8">5-8 Players</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Duration
                      </label>
                      <select
                        value={adventure.duration}
                        onChange={(e) =>
                          setAdventure((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="1-2 hours">1-2 hours</option>
                        <option value="2-4 hours">2-4 hours</option>
                        <option value="4-6 hours">4-6 hours</option>
                        <option value="6+ hours">6+ hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Suitability
                      </label>
                      <select
                        value={adventure.suitability}
                        onChange={(e) =>
                          setAdventure((prev) => ({
                            ...prev,
                            suitability: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="All">All</option>
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
            {!apiAdventure && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  Save your adventure details above to start adding episodes and
                  scenes.
                </p>
              </div>
            )}
            <Card
              variant="elevated"
              className={cn(!apiAdventure && "opacity-50 pointer-events-none")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
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
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        T
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {adventure.titlePageData?.title || "Title Page"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {adventure.titlePageData?.subtitle ||
                            "Adventure introduction and setup"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {adventure.hasTitle ? (
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
                  {adventure.episodes.map((episode, episodeIndex) => (
                    <Card
                      key={episode.id}
                      variant="ghost"
                      className="border border-border"
                    >
                      {/* Episode Header */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleEpisode(episode.id)}
                              className="flex items-center gap-2 hover:bg-accent rounded-md p-1 -m-1 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                                {episodeIndex + 1}
                              </div>
                              <div className="text-left">
                                <h3 className="font-medium">
                                  {episode.title ||
                                    `Episode ${episodeIndex + 1}`}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {episode.description || "No description yet"}{" "}
                                  • {episode.scenes.length} scenes
                                </p>
                              </div>
                              {expandedEpisodes.has(episode.id) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
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
                              disabled={adventure.episodes.length <= 1}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Episode Content - Scenes */}
                        {expandedEpisodes.has(episode.id) && (
                          <div className="mt-6 space-y-3">
                            {episode.scenes.map((scene, sceneIndex) => (
                              <div
                                key={scene.id}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors ml-12"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded bg-background text-foreground flex items-center justify-center text-xs font-medium">
                                    {sceneIndex + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm">
                                      {scene.title || `Scene ${sceneIndex + 1}`}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                      {scene.description ||
                                        "No description yet"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(scene.status)}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={Edit}
                                    onClick={() =>
                                      handleNavigateToScene(
                                        scene.id,
                                        episode.id
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
                                    disabled={episode.scenes.length <= 1}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}

                            {/* Add Scene Button */}
                            <div className="ml-12">
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
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                        E
                      </div>
                      <div>
                        <h3 className="font-medium">Epilogue</h3>
                        <p className="text-sm text-muted-foreground">
                          Adventure conclusion and outcomes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {adventure.hasEpilogue ? (
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
                    <Badge variant="fantasy" icon={Users} size="sm">
                      {adventure.playerCount}
                    </Badge>
                    <Badge variant="scifi" icon={Clock} size="sm">
                      {adventure.duration}
                    </Badge>
                    <Badge
                      variant={suitabilityColours[adventure.suitability]}
                      size="sm"
                    >
                      {adventure.suitability}
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
                      <div>Title Page: {adventure.hasTitle ? "✓" : "○"}</div>
                      <div>
                        {adventure.episodes.length} Episode
                        {adventure.episodes.length !== 1 ? "s" : ""}
                      </div>
                      <div>
                        {getTotalScenes()} Total Scene
                        {getTotalScenes() !== 1 ? "s" : ""}
                      </div>
                      <div>Epilogue: {adventure.hasEpilogue ? "✓" : "○"}</div>
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
    </div>
  );
}
