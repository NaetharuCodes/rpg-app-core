import { ArrowRight, Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { SceneAssets } from "@/components/SceneAssets/SceneAssets";
import { mockAssets } from "@/components/mocks/assetMocks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adventureService,
  type Adventure,
  type TitlePage,
} from "@/services/api";

interface AdventureStructure {
  totalScenes: number;
  episodes: Array<{
    id: number;
    title: string;
    sceneCount: number;
  }>;
}

interface AdventureTitlePageProps {
  onStartAdventure?: () => void;
}

export function AdventureTitlePage({
  onStartAdventure,
}: AdventureTitlePageProps) {
  const { adventureId } = useParams();
  const navigate = useNavigate();

  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [titleData, setTitleData] = useState<TitlePage | null>(null);
  const [structure, setStructure] = useState<AdventureStructure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!adventureId) return;

      try {
        setIsLoading(true);

        // Fetch adventure
        const adventureData = await adventureService.getById(
          parseInt(adventureId)
        );
        setAdventure(adventureData);

        // Try to fetch title page data (optional)
        try {
          const titlePageData = await adventureService.titlePage.get(
            parseInt(adventureId)
          );
          setTitleData(titlePageData);
        } catch {
          // Use adventure data as fallback
          setTitleData({
            id: 0,
            adventure_id: parseInt(adventureId),
            title: adventureData.title,
            subtitle:
              adventureData.description || "An exciting adventure awaits",
            banner_image_url: adventureData.banner_image_url || "",
            introduction:
              adventureData.description ||
              "Embark on an epic adventure filled with danger, mystery, and heroic deeds.",
            background:
              "Prepare yourself for an unforgettable journey that will test your courage and wit.",
            prologue:
              "Your adventure begins here. The path ahead is uncertain, but glory awaits those brave enough to take the first step.",
            created_at: new Date().toISOString(),
          });
        }

        // Build structure from episodes
        setStructure({
          totalScenes:
            adventureData.episodes?.reduce(
              (total, ep) => total + (ep.scenes?.length || 0),
              0
            ) || 0,
          episodes:
            adventureData.episodes?.map((ep) => ({
              id: ep.id,
              title: ep.title,
              sceneCount: ep.scenes?.length || 0,
            })) || [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load adventure"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [adventureId]);

  const handleStartAdventure = () => {
    if (onStartAdventure) {
      onStartAdventure();
    } else {
      // Navigate to first episode
      if (structure && structure.episodes.length > 0) {
        navigate(
          `/adventures/${adventureId}/episodes/${structure.episodes[0].id}`
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading adventure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={() => navigate("/adventures")} variant="secondary">
            Back to Adventures
          </Button>
        </div>
      </div>
    );
  }

  if (!titleData || !structure) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No adventure data found</p>
          <Button onClick={() => navigate("/adventures")} variant="secondary">
            Back to Adventures
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Image and Title */}
      <div className="relative">
        <div
          className="h-80 bg-cover bg-center bg-muted"
          style={{
            backgroundImage: titleData.banner_image_url
              ? `url(${titleData.banner_image_url})`
              : undefined,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-6xl mx-auto px-6 pb-8 w-full">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                {titleData.title}
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
            {/* Adventure Info */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="fantasy" icon={Users}>
                3-5 Players
              </Badge>
              <Badge variant="scifi" icon={Clock}>
                {structure.totalScenes} Scenes
              </Badge>
              <Badge variant="mystery" icon={BookOpen}>
                {structure.episodes.length} Episodes
              </Badge>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Adventure Overview</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {titleData.introduction.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Background */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Background</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {titleData.background.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Prologue */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Opening Scene</h2>
              <Card
                variant="feature"
                className="bg-accent/5 border border-accent/20"
              >
                <CardContent className="p-6">
                  <div className="prose max-w-none text-muted-foreground italic">
                    {titleData.prologue.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Adventure */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-xl font-semibold">Ready to Begin?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start the adventure and navigate through each scene as your
                  story unfolds.
                </p>
                <Button
                  variant="primary"
                  rightIcon={ArrowRight}
                  onClick={handleStartAdventure}
                  className="w-full"
                  disabled={!structure.episodes.length}
                >
                  Start Adventure
                </Button>
              </CardContent>
            </Card>

            {/* Episode Structure */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-xl font-semibold">Episodes</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {structure.episodes.map((episode, index) => (
                    <div
                      key={episode.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">Episode {index + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          {episode.title}
                        </div>
                      </div>
                      <Badge variant="outline" size="sm">
                        {episode.sceneCount} scenes
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <SceneAssets assets={mockAssets} />
          </div>
        </div>
      </div>
    </div>
  );
}
