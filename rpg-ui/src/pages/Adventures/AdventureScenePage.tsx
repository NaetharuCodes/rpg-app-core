import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Users,
  Dice6,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { DiceRoller } from "@/components/DiceRoller/DiceRoller";
import { SceneAssets } from "@/components/SceneAssets/SceneAssets";
import {
  adventureService,
  assetService,
  type Scene,
  type Episode,
  type Adventure,
  type Asset,
} from "@/services/api";
import { MarkdownViewer } from "@/components/MarkdownViewer/MarkdownViewer";

interface NavigationContext {
  currentSceneIndex: number;
  totalScenes: number;
  episode: {
    id: number;
    title: string;
    order: number;
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

export function AdventureScenePage({
  onNextScene,
  onPrevScene,
}: AdventureScenePageProps) {
  const { adventureId, episodeId, sceneNumber } = useParams();
  const navigate = useNavigate();

  // State for scenes and navigation
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [navigation, setNavigation] = useState<NavigationContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sceneAssets, setSceneAssets] = useState<Asset[]>([]);
  const [showDiceRoller, setShowDiceRoller] = useState(false);

  // Update URL without navigation
  const updateUrl = (newSceneIndex: number) => {
    const newSceneNumber = newSceneIndex + 1;
    const newUrl = `/adventures/${adventureId}/episodes/${episodeId}/scenes/${newSceneNumber}`;
    window.history.replaceState(null, "", newUrl);
  };

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

        // Fetch all episodes for navigation context
        const episodesData = await adventureService.episodes.getAll(
          parseInt(adventureId)
        );
        const sortedEpisodes = episodesData.sort((a, b) => a.order - b.order);
        setAllEpisodes(sortedEpisodes);

        // Find current episode
        const currentEpisode = sortedEpisodes.find(
          (ep) => ep.id === parseInt(episodeId)
        );
        if (!currentEpisode) {
          throw new Error("Episode not found");
        }
        setEpisode(currentEpisode);

        // Fetch all scenes for this episode
        const scenesData = await adventureService.scenes.getAll(
          parseInt(adventureId),
          parseInt(episodeId)
        );
        const sortedScenes = scenesData.sort((a, b) => a.order - b.order);
        setScenes(sortedScenes);

        // Determine current scene index from URL scene number
        const urlSceneNumber = parseInt(sceneNumber);
        const sceneIndex = urlSceneNumber - 1; // Convert 1-based to 0-based

        // Validate scene index
        if (sceneIndex < 0 || sceneIndex >= sortedScenes.length) {
          throw new Error("Scene not found");
        }

        setCurrentSceneIndex(sceneIndex);

        // Load only the assets for this scene
        const currentScene = sortedScenes[sceneIndex];
        if (currentScene?.asset_ids && currentScene.asset_ids.length > 0) {
          const sceneAssetPromises = currentScene.asset_ids.map((id) =>
            assetService.getById(id)
          );

          const sceneAssetData = await Promise.all(sceneAssetPromises);

          // Sort by type
          const sortedAssets = sceneAssetData.sort((a, b) => {
            const assetTypeOrder = [
              "location",
              "character",
              "creature",
              "item",
            ];
            return (
              assetTypeOrder.indexOf(a.type) - assetTypeOrder.indexOf(b.type)
            );
          });

          setSceneAssets(sortedAssets);
        } else {
          setSceneAssets([]); // Clear assets if scene has none
        }

        // Build navigation context
        const currentEpisodeIndex = sortedEpisodes.findIndex(
          (ep) => ep.id === parseInt(episodeId)
        );

        let nextAction: "scene" | "episode" | "epilogue" = "scene";
        let hasNext = true;

        if (sceneIndex === sortedScenes.length - 1) {
          // Last scene in episode
          if (currentEpisodeIndex === sortedEpisodes.length - 1) {
            // Last episode - go to epilogue (always available)
            nextAction = "epilogue";
            hasNext = true;
          } else {
            // Go to next episode
            nextAction = "episode";
            hasNext = true;
          }
        } else {
          // Not last scene, so next scene is available
          hasNext = true;
        }

        const hasPrev = sceneIndex > 0 || currentEpisodeIndex > 0;

        setNavigation({
          currentSceneIndex: sceneIndex,
          totalScenes: sortedScenes.length,
          episode: {
            id: currentEpisode.id,
            title: currentEpisode.title,
            order: currentEpisode.order,
          },
          hasNext,
          hasPrev,
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

  useEffect(() => {
    const loadCurrentSceneAssets = async () => {
      if (scenes.length === 0 || currentSceneIndex >= scenes.length) return;

      const currentScene = scenes[currentSceneIndex];
      if (currentScene?.asset_ids && currentScene.asset_ids.length > 0) {
        const sceneAssetPromises = currentScene.asset_ids.map((id) =>
          assetService.getById(id)
        );
        const sceneAssetData = await Promise.all(sceneAssetPromises);

        // Sort by type
        const sortedAssets = sceneAssetData.sort((a, b) => {
          const assetTypeOrder = ["location", "character", "creature", "item"];
          return (
            assetTypeOrder.indexOf(a.type) - assetTypeOrder.indexOf(b.type)
          );
        });

        setSceneAssets(sortedAssets);
      } else {
        setSceneAssets([]);
      }
    };

    loadCurrentSceneAssets();
  }, [scenes, currentSceneIndex]);

  const handleNextScene = () => {
    if (onNextScene) {
      onNextScene();
      return;
    }

    if (!navigation || !adventureId || !episodeId) return;

    if (navigation.nextAction === "scene") {
      // Go to next scene in same episode
      const nextIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIndex);
      updateUrl(nextIndex);

      // Update navigation context
      setNavigation((prev) =>
        prev
          ? {
              ...prev,
              currentSceneIndex: nextIndex,
              hasNext: true,
              hasPrev: true,
              nextAction:
                nextIndex === scenes.length - 1
                  ? allEpisodes.findIndex(
                      (ep) => ep.id === parseInt(episodeId)
                    ) ===
                    allEpisodes.length - 1
                    ? "epilogue"
                    : "episode"
                  : "scene",
            }
          : null
      );
    } else if (navigation.nextAction === "episode") {
      // Go to next episode title page
      const currentEpisodeIndex = allEpisodes.findIndex(
        (ep) => ep.id === parseInt(episodeId)
      );
      const nextEpisode = allEpisodes[currentEpisodeIndex + 1];
      if (nextEpisode) {
        navigate(`/adventures/${adventureId}/episodes/${nextEpisode.id}`);
      }
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

    if (currentSceneIndex > 0) {
      // Go to previous scene in same episode
      const prevIndex = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIndex);
      updateUrl(prevIndex);

      // Update navigation context
      setNavigation((prev) =>
        prev
          ? {
              ...prev,
              currentSceneIndex: prevIndex,
              hasNext: true,
              hasPrev: prevIndex > 0,
              nextAction: "scene",
            }
          : null
      );
    } else {
      // Go back to episode title page
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

  if (
    error ||
    !scenes.length ||
    !episode ||
    !navigation ||
    currentSceneIndex >= scenes.length
  ) {
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

  const currentScene = scenes[currentSceneIndex];

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
            <h1 className="text-2xl font-bold">{currentScene.title}</h1>
            <p className="text-sm text-muted-foreground">
              Scene {currentSceneIndex + 1} of {navigation.totalScenes}
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
        {currentScene.image_url && (
          <div className="h-32 sm:h-[400px] rounded-lg overflow-hidden bg-muted">
            <img
              src={currentScene.image_url}
              alt={currentScene.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Read-Aloud Prose */}
        <Card variant="feature" className="bg-accent/5 border border-accent/20">
          <CardHeader>
            This is here{" "}
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
              {(currentScene.prose || "No scene description available.")
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
                <MarkdownViewer content={currentScene.gm_notes || ""} />
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

      {/* Dice Roller Modal */}
      <DiceRoller
        isOpen={showDiceRoller}
        onClose={() => setShowDiceRoller(false)}
      />
    </div>
  );
}
