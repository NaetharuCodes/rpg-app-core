import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Play,
  Users,
  Clock,
  BookOpen,
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

interface Scene {
  id: string;
  title: string;
  description: string;
  status: "empty" | "draft" | "complete";
}

interface AdventureData {
  id?: string;
  title: string;
  description: string;
  playerCount: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  genres: string[];
  scenes: Scene[];
  hasTitle: boolean;
  hasEpilogue: boolean;
}

const genreOptions = [
  "fantasy",
  "scifi",
  "horror",
  "mystery",
  "historical",
  "modern",
];

const difficultyColors = {
  beginner: "green",
  intermediate: "yellow",
  advanced: "destructive",
} as const;

// Mock data for editing existing adventure
const mockExistingAdventure: AdventureData = {
  id: "existing-adventure-1",
  title: "The Dragon's Lair",
  description: "A classic dungeon crawl adventure for brave heroes",
  playerCount: "3-5",
  duration: "4-6 hours",
  difficulty: "intermediate",
  genres: ["fantasy"],
  hasTitle: true,
  hasEpilogue: true,
  scenes: [
    {
      id: "scene-1",
      title: "The Village Tavern",
      description: "Heroes meet and receive the quest",
      status: "complete",
    },
    {
      id: "scene-2",
      title: "Journey to the Lair",
      description: "Travel through dangerous territory",
      status: "complete",
    },
    {
      id: "scene-3",
      title: "The Dragon's Chamber",
      description: "Final confrontation",
      status: "draft",
    },
  ],
};

// Empty adventure for new creation
const createEmptyAdventure = (): AdventureData => ({
  title: "",
  description: "",
  playerCount: "3-5",
  duration: "2-4 hours",
  difficulty: "beginner",
  genres: [],
  hasTitle: false,
  hasEpilogue: false,
  scenes: [{ id: "scene-1", title: "", description: "", status: "empty" }],
});

interface AdventureBuilderOverviewProps {
  adventureId?: string; // If provided, we're editing existing
  onNavigateToTitle?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  onNavigateToEpilogue?: () => void;
  onSave?: (adventure: AdventureData) => void;
  onPreview?: () => void;
}

export function AdventureBuilderOverviewPage({
  adventureId,
  onNavigateToTitle,
  onNavigateToScene,
  onNavigateToEpilogue,
  onSave,
  onPreview,
}: AdventureBuilderOverviewProps) {
  const [adventure, setAdventure] = useState<AdventureData>(() =>
    adventureId ? mockExistingAdventure : createEmptyAdventure()
  );

  const isEditing = Boolean(adventureId);

  const handleGenreToggle = (genre: string) => {
    setAdventure((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `scene-${adventure.scenes.length + 1}`,
      title: "",
      description: "",
      status: "empty",
    };
    setAdventure((prev) => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
  };

  const handleDeleteScene = (sceneId: string) => {
    if (adventure.scenes.length <= 1) {
      alert("An adventure must have at least one scene");
      return;
    }

    if (confirm("Are you sure you want to delete this scene?")) {
      setAdventure((prev) => ({
        ...prev,
        scenes: prev.scenes.filter((scene) => scene.id !== sceneId),
      }));
    }
  };

  const handleMoveScene = (sceneId: string, direction: "up" | "down") => {
    const currentIndex = adventure.scenes.findIndex((s) => s.id === sceneId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= adventure.scenes.length) return;

    const newScenes = [...adventure.scenes];
    [newScenes[currentIndex], newScenes[newIndex]] = [
      newScenes[newIndex],
      newScenes[currentIndex],
    ];

    setAdventure((prev) => ({
      ...prev,
      scenes: newScenes,
    }));
  };

  const handleSave = () => {
    if (!adventure.title.trim()) {
      alert("Please enter an adventure title");
      return;
    }
    onSave?.(adventure);
    alert(isEditing ? "Adventure updated!" : "Adventure created!");
  };

  const getStatusBadge = (status: Scene["status"]) => {
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
              {isEditing && (
                <Button variant="secondary" leftIcon={Play} onClick={onPreview}>
                  Preview
                </Button>
              )}
              <Button variant="primary" leftIcon={Save} onClick={handleSave}>
                {isEditing ? "Save Changes" : "Save Adventure"}
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
                        Difficulty
                      </label>
                      <select
                        value={adventure.difficulty}
                        onChange={(e) =>
                          setAdventure((prev) => ({
                            ...prev,
                            difficulty: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
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

            {/* Adventure Structure */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Adventure Structure
                    </h2>
                    <p className="text-muted-foreground">
                      Organize your adventure's content
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    leftIcon={Plus}
                    onClick={handleAddScene}
                  >
                    Add Scene
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
                        <h3 className="font-medium">Title Page</h3>
                        <p className="text-sm text-muted-foreground">
                          Adventure introduction and setup
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
                        onClick={onNavigateToTitle}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Scenes */}
                  {adventure.scenes.map((scene, index) => (
                    <div
                      key={scene.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {scene.title || `Scene ${index + 1}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {scene.description || "No description yet"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(scene.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveScene(scene.id, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveScene(scene.id, "down")}
                          disabled={index === adventure.scenes.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Edit}
                          onClick={() => onNavigateToScene?.(scene.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={Trash2}
                          onClick={() => handleDeleteScene(scene.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          disabled={adventure.scenes.length <= 1}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
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
                        onClick={onNavigateToEpilogue}
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
                    <Badge variant="fantasy" leftIcon={Users} size="sm">
                      {adventure.playerCount}
                    </Badge>
                    <Badge variant="scifi" leftIcon={Clock} size="sm">
                      {adventure.duration}
                    </Badge>
                    <Badge
                      variant={difficultyColors[adventure.difficulty]}
                      size="sm"
                    >
                      {adventure.difficulty}
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
                        {adventure.scenes.length} Scene
                        {adventure.scenes.length !== 1 ? "s" : ""}
                      </div>
                      <div>Epilogue: {adventure.hasEpilogue ? "✓" : "○"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="ghost" className="border border-border">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Import from Template
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Duplicate Adventure
                  </Button>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600"
                    >
                      Delete Adventure
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
