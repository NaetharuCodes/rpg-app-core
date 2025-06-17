import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { adventureService } from "@/services/api";

interface EpisodeData {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  order: number;
  adventure_id: number;
  scenes: Array<{
    id: number;
    title: string;
    order: number;
  }>;
}

interface EpisodeTitlePageProps {
  episodeData?: EpisodeData;
  onStartEpisode?: () => void;
  onBackToAdventure?: () => void;
}

export function EpisodeTitlePage({
  onStartEpisode,
  onBackToAdventure,
}: EpisodeTitlePageProps) {
  const { adventureId, episodeId } = useParams();
  const navigate = useNavigate();
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [adventureTitle, setAdventureTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEpisodeData = async () => {
      if (!adventureId || !episodeId) return;

      try {
        setIsLoading(true);

        // Fetch adventure data to get the title
        const adventure = await adventureService.getById(parseInt(adventureId));
        setAdventureTitle(adventure.title);

        // Fetch all episodes to find the specific one
        const episodes = await adventureService.episodes.getAll(
          parseInt(adventureId)
        );
        const episode = episodes.find((ep) => ep.id === parseInt(episodeId));

        if (!episode) {
          throw new Error("Episode not found");
        }

        // Fetch scenes for this episode
        const scenes = await adventureService.scenes.getAll(
          parseInt(adventureId),
          parseInt(episodeId)
        );

        setEpisodeData({
          ...episode,
          scenes: scenes.sort((a, b) => a.order - b.order),
        });
      } catch (err) {
        console.error("Error loading episode:", err);
        setError(err instanceof Error ? err.message : "Failed to load episode");
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisodeData();
  }, [adventureId, episodeId]);

  const handleStartEpisode = () => {
    if (onStartEpisode) {
      onStartEpisode();
    } else {
      // Navigate to first scene of this episode
      navigate(`/adventures/${adventureId}/episodes/${episodeId}/scenes/1`);
    }
  };

  const handleBackToAdventure = () => {
    if (onBackToAdventure) {
      onBackToAdventure();
    } else {
      navigate(`/adventures/${adventureId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading episode...</p>
        </div>
      </div>
    );
  }

  if (error || !episodeData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "Episode not found"}
          </p>
          <Button onClick={handleBackToAdventure} variant="secondary">
            Back to Adventure
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Episode Banner */}
      <div className="relative">
        <div
          className="h-64 bg-cover bg-center bg-muted"
          style={{
            backgroundImage: episodeData.image_url
              ? `url(${episodeData.image_url})`
              : undefined,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-6xl mx-auto px-6 pb-8 w-full">
              <div className="mb-2">
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/20"
                >
                  Episode {episodeData.order}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                {episodeData.title}
              </h1>
              <p className="text-lg text-white/90">{adventureTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Episode Info */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="fantasy" icon={BookOpen}>
                {episodeData.scenes.length} Scenes
              </Badge>
              <Badge variant="scifi" icon={Clock}>
                ~{Math.ceil(episodeData.scenes.length * 15)} minutes
              </Badge>
            </div>

            {/* Episode Description */}
            {episodeData.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Episode Overview</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {episodeData.description
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </section>
            )}

            {/* Scene Preview */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Scenes in This Episode
              </h2>
              <div className="space-y-3">
                {episodeData.scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {scene.title || `Scene ${index + 1}`}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Episode */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-xl font-semibold">Ready to Begin?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start this episode and experience the story as it unfolds
                  scene by scene.
                </p>
                <Button
                  variant="primary"
                  rightIcon={ArrowRight}
                  onClick={handleStartEpisode}
                  className="w-full mb-3"
                >
                  Start Episode
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={ArrowLeft}
                  onClick={handleBackToAdventure}
                  className="w-full"
                >
                  Back to Adventure
                </Button>
              </CardContent>
            </Card>

            {/* Episode Stats */}
            <Card variant="ghost" className="border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold">Episode Details</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scenes</span>
                    <span className="font-medium">
                      {episodeData.scenes.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Episode</span>
                    <span className="font-medium">{episodeData.order}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Time</span>
                    <span className="font-medium">
                      ~{Math.ceil(episodeData.scenes.length * 15)} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
