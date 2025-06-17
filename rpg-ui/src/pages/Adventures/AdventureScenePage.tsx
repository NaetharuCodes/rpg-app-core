import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Users,
  Dice6,
  X,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { DiceRoller } from "@/components/DiceRoller/DiceRoller";
import { SceneAssets } from "@/components/SceneAssets/SceneAssets";
import { mockAssets } from "@/components/mocks/assetMocks";
import {
  adventureService,
  type Scene,
  type Episode,
  type Adventure,
} from "@/services/api";

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

interface GMNote {
  type: "paragraph" | "list" | "callout";
  title?: string;
  content?: string;
  items?: string[];
}

interface Asset {
  id: string;
  name: string;
  type: "character" | "creature" | "location" | "item";
  description: string;
  imageUrl: string;
}

interface NavigationContext {
  currentScene: number;
  totalScenes: number;
  episode: {
    id: number;
    title: string;
    sceneNumber: number;
    totalInEpisode: number;
  };
  hasNext: boolean;
  hasPrev: boolean;
  nextAction: "scene" | "episode" | "epilogue";
}

interface AdventureScenePageProps {
  onNextScene?: () => void;
  onPrevScene?: () => void;
  onBackToTitle?: () => void;
}

function GMNoteItem({ note }: { note: GMNote }) {
  switch (note.type) {
    case "paragraph":
      return (
        <div className="prose max-w-none">
          <p className="text-muted-foreground">{note.content}</p>
        </div>
      );

    case "list":
      return (
        <div>
          {note.title && (
            <h4 className="font-semibold text-foreground mb-2">{note.title}</h4>
          )}
          <ul className="space-y-1 text-muted-foreground">
            {note.items?.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "callout":
      return (
        <Card variant="feature" className="bg-accent/5 border border-accent/20">
          <CardContent className="p-4">
            {note.title && (
              <h4 className="font-semibold text-foreground mb-2">
                {note.title}
              </h4>
            )}
            <p className="text-muted-foreground italic">{note.content}</p>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}

function AssetCard({
  asset,
  size = "normal",
}: {
  asset: Asset;
  size?: "normal" | "small";
}) {
  if (size === "small") {
    return (
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{asset.name}</h4>
            <Badge variant={assetTypeColors[asset.type]} size="sm">
              {asset.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {asset.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="aspect-[3/4] bg-muted">
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={assetTypeColors[asset.type]} size="sm">
            {asset.type}
          </Badge>
        </div>
        <h4 className="font-medium mb-2">{asset.name}</h4>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {asset.description}
        </p>
      </div>
    </div>
  );
}

function AllAssetsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "all" | "character" | "creature" | "location" | "item"
  >("all");

  if (!isOpen) return null;

  const filteredAssets = mockAssets;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">Adventure Assets</h2>
            <p className="text-muted-foreground">
              All assets available in this adventure
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
                variant={activeTab === tab ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
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
                <AssetCard key={asset.id} asset={asset} size="small" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to parse GM notes from string
function parseGMNotes(gmNotesString: string): GMNote[] {
  if (!gmNotesString || gmNotesString.trim() === "") {
    return [
      {
        type: "paragraph",
        content: "No additional GM notes for this scene.",
      },
    ];
  }

  // For now, just return as a single paragraph
  // You can enhance this later to parse markdown or structured format
  return [
    {
      type: "paragraph",
      content: gmNotesString,
    },
  ];
}

export function AdventureScenePage({
  onNextScene,
  onPrevScene,
}: AdventureScenePageProps) {
  const { adventureId, episodeId, sceneNumber } = useParams();
  const navigate = useNavigate();

  const [scene, setScene] = useState<Scene | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [navigation, setNavigation] = useState<NavigationContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAllAssets, setShowAllAssets] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);

  useEffect(() => {
    const loadSceneData = async () => {
      if (!adventureId || !episodeId || !sceneNumber) return;

      try {
        setIsLoading(true);

        // Fetch adventure data
        const adventureData = await adventureService.getById(
          parseInt(adventureId)
        );
        setAdventure(adventureData);

        // Fetch episode data
        const episodes = await adventureService.episodes.getAll(
          parseInt(adventureId)
        );
        const currentEpisode = episodes.find(
          (ep) => ep.id === parseInt(episodeId)
        );
        if (!currentEpisode) {
          throw new Error("Episode not found");
        }
        setEpisode(currentEpisode);

        // Fetch scenes for this episode
        const scenes = await adventureService.scenes.getAll(
          parseInt(adventureId),
          parseInt(episodeId)
        );
        const sortedScenes = scenes.sort((a, b) => a.order - b.order);

        // Find current scene by scene number (1-indexed)
        const currentScene = sortedScenes[parseInt(sceneNumber) - 1];
        if (!currentScene) {
          throw new Error("Scene not found");
        }
        setScene(currentScene);

        // Calculate navigation context
        const currentSceneIndex = parseInt(sceneNumber) - 1;
        const totalScenesInEpisode = sortedScenes.length;

        // Calculate total scenes across all episodes
        const totalScenes =
          adventureData.episodes?.reduce(
            (total, ep) => total + (ep.scenes?.length || 0),
            0
          ) || 0;

        // Find current episode index
        const sortedEpisodes = episodes.sort((a, b) => a.order - b.order);
        const currentEpisodeIndex = sortedEpisodes.findIndex(
          (ep) => ep.id === parseInt(episodeId)
        );

        // Determine what happens on "next"
        let nextAction: "scene" | "episode" | "epilogue" = "scene";
        if (currentSceneIndex === totalScenesInEpisode - 1) {
          // Last scene in episode
          if (currentEpisodeIndex === sortedEpisodes.length - 1) {
            // Last episode - go to epilogue
            nextAction = "epilogue";
          } else {
            // Go to next episode
            nextAction = "episode";
          }
        }

        setNavigation({
          currentScene: parseInt(sceneNumber),
          totalScenes: totalScenesInEpisode,
          episode: {
            id: currentEpisode.id,
            title: currentEpisode.title,
            sceneNumber: parseInt(sceneNumber),
            totalInEpisode: totalScenesInEpisode,
          },
          hasNext:
            currentSceneIndex < totalScenesInEpisode - 1 ||
            currentEpisodeIndex < sortedEpisodes.length - 1 ||
            (currentSceneIndex === totalScenesInEpisode - 1 &&
              currentEpisodeIndex === sortedEpisodes.length - 1 &&
              nextAction === "epilogue"),
          hasPrev: currentSceneIndex > 0 || currentEpisodeIndex > 0,
          nextAction,
        });
      } catch (err) {
        console.error("Error loading scene:", err);
        setError(err instanceof Error ? err.message : "Failed to load scene");
      } finally {
        setIsLoading(false);
      }
    };

    loadSceneData();
  }, [adventureId, episodeId, sceneNumber]);

  const handleNextScene = () => {
    if (onNextScene) {
      onNextScene();
      return;
    }

    if (!navigation || !adventureId || !episodeId) return;

    if (navigation.nextAction === "scene") {
      // Go to next scene in same episode
      const nextSceneNumber = navigation.currentScene + 1;
      navigate(
        `/adventures/${adventureId}/episodes/${episodeId}/scenes/${nextSceneNumber}`
      );
    } else if (navigation.nextAction === "episode") {
      // Go to next episode title page
      const nextEpisodeId = parseInt(episodeId) + 1; // This is simplified - you might need to fetch episodes to get the actual next episode ID
      navigate(`/adventures/${adventureId}/episodes/${nextEpisodeId}`);
    } else if (navigation.nextAction === "epilogue") {
      // Go to epilogue
      navigate(`/adventures/${adventureId}/epilogue`);
    }
  };

  const handlePrevScene = () => {
    if (onPrevScene) {
      onPrevScene();
      return;
    }

    if (!navigation || !adventureId || !episodeId) return;

    if (navigation.currentScene > 1) {
      // Go to previous scene in same episode
      const prevSceneNumber = navigation.currentScene - 1;
      navigate(
        `/adventures/${adventureId}/episodes/${episodeId}/scenes/${prevSceneNumber}`
      );
    } else {
      // Go back to episode title or previous episode's last scene
      // For now, just go back to episode title
      navigate(`/adventures/${adventureId}/episodes/${episodeId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading scene...</p>
        </div>
      </div>
    );
  }

  if (error || !scene || !episode || !navigation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Scene not found"}</p>
          <Button
            onClick={() => navigate(`/adventures/${adventureId}`)}
            variant="secondary"
          >
            Back to Adventure
          </Button>
        </div>
      </div>
    );
  }

  const sceneAssets = mockAssets.filter(
    (asset) => scene.title.toLowerCase().includes(asset.name.toLowerCase()) // Simple matching for now
  );

  const gmNotes = parseGMNotes(scene.gm_notes || "");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Scene Info - Always at top */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="fantasy" size="sm">
                Episode {episode.order}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {episode.title}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{scene.title}</h1>
            <p className="text-sm text-muted-foreground">
              Scene {navigation.currentScene} of {navigation.totalScenes}
            </p>
          </div>

          {/* Navigation Controls - Below on separate row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={ChevronLeft}
                onClick={handlePrevScene}
                disabled={!navigation.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={ChevronRight}
                onClick={handleNextScene}
                disabled={!navigation.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Scene Image */}
        {scene.image_url && (
          <div className="h-32 rounded-lg overflow-hidden bg-muted">
            <img
              src={scene.image_url}
              alt={scene.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Read-Aloud Prose */}
        <Card variant="feature" className="bg-accent/5 border border-accent/20">
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
              {(scene.prose || "No scene description available.")
                .split("\n")
                .map((paragraph, index) => (
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

        {/* Two Column Layout for GM Notes and Assets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GM Notes - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">GM Notes</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Running this scene
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {gmNotes.map((note, index) => (
                    <GMNoteItem key={index} note={note} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Assets and Actions */}
          <div className="space-y-6">
            {/* Scene Assets */}
            <SceneAssets assets={sceneAssets} />

            {/* Quick Actions */}
            <Card variant="ghost" className="border border-border">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Dice6 className="h-4 w-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Dice6}
                    className="w-full justify-start"
                    onClick={() => setShowDiceRoller(true)}
                  >
                    Roll Dice
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Users}
                    className="w-full justify-start"
                  >
                    Manage Players
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              leftIcon={ChevronLeft}
              onClick={handlePrevScene}
              disabled={!navigation.hasPrev}
            >
              Previous Scene
            </Button>
            <Button
              variant="primary"
              rightIcon={ChevronRight}
              onClick={handleNextScene}
              disabled={!navigation.hasNext}
            >
              {navigation.nextAction === "scene" && "Next Scene"}
              {navigation.nextAction === "episode" && "Next Episode"}
              {navigation.nextAction === "epilogue" && "Epilogue"}
            </Button>
          </div>
        </div>
      </div>

      {/* All Assets Modal */}
      <AllAssetsModal
        isOpen={showAllAssets}
        onClose={() => setShowAllAssets(false)}
      />
      {/* Dice Roller Modal */}
      <DiceRoller
        isOpen={showDiceRoller}
        onClose={() => setShowDiceRoller(false)}
      />
    </div>
  );
}
