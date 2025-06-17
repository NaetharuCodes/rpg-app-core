import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ArrowRight,
  BookOpen,
  Trophy,
  Users,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import {
  adventureService,
  type Adventure,
  type Epilogue,
} from "@/services/api";

interface Outcome {
  title: string;
  description: string;
  details: string;
}

interface FollowUpHook {
  title: string;
  description: string;
}

interface EpilogueData {
  id: number;
  adventure_id: number;
  title: string;
  content: string;
  outcomes: Outcome[];
  designer_notes: string;
  follow_up_hooks: FollowUpHook[];
  credits: {
    designer: string;
    system: string;
    version: string;
    year: string;
  };
  created_at: string;
}

interface NavigationContext {
  totalScenes: number;
  totalEpisodes: number;
  isEpilogue: boolean;
}

interface AdventureEpiloguePageProps {
  onPrevScene?: () => void;
  onBackToTitle?: () => void;
  onRestartAdventure?: () => void;
}

export function AdventureEpiloguePage({
  onPrevScene,
  onBackToTitle,
  onRestartAdventure,
}: AdventureEpiloguePageProps) {
  const { adventureId } = useParams();
  const navigate = useNavigate();

  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [epilogueData, setEpilogueData] = useState<Epilogue | null>(null);
  const [navigation, setNavigation] = useState<NavigationContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEpilogueData = async () => {
      if (!adventureId) return;

      try {
        setIsLoading(true);

        // Fetch adventure data
        const adventureData = await adventureService.getById(
          parseInt(adventureId)
        );
        setAdventure(adventureData);

        // Try to fetch epilogue data
        let epilogue = null;
        try {
          epilogue = await adventureService.epilogue.get(parseInt(adventureId));
          setEpilogueData(epilogue);
        } catch (err) {
          // No epilogue exists - create fallback
          setEpilogueData({
            id: 0,
            adventure_id: parseInt(adventureId),
            title: "Adventure Complete",
            content: `You have completed "${adventureData.title}".`,
            outcomes: [],
            designer_notes: "",
            follow_up_hooks: [],
            credits: {
              designer: "",
              system: "",
              version: "",
              year: "",
            },
            created_at: new Date().toISOString(),
          });
        }

        // Calculate navigation stats
        const totalScenes =
          adventureData.episodes?.reduce(
            (total, ep) => total + (ep.scenes?.length || 0),
            0
          ) || 0;

        setNavigation({
          totalScenes,
          totalEpisodes: adventureData.episodes?.length || 0,
          isEpilogue: true,
        });
      } catch (err) {
        console.error("Error loading epilogue:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load epilogue"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEpilogueData();
  }, [adventureId]);

  const handleBackToTitle = () => {
    if (onBackToTitle) {
      onBackToTitle();
    } else {
      navigate(`/adventures/${adventureId}`);
    }
  };

  const handleRestartAdventure = () => {
    if (onRestartAdventure) {
      onRestartAdventure();
    } else {
      navigate(`/adventures/${adventureId}`);
    }
  };

  const handlePrevScene = () => {
    if (onPrevScene) {
      onPrevScene();
    } else {
      // Navigate to the last scene of the last episode
      if (adventure && adventure.episodes && adventure.episodes.length > 0) {
        const lastEpisode = adventure.episodes[adventure.episodes.length - 1];
        const lastSceneNumber = lastEpisode.scenes?.length || 1;
        navigate(
          `/adventures/${adventureId}/episodes/${lastEpisode.id}/scenes/${lastSceneNumber}`
        );
      }
    }
  };

  const handleBrowseAdventures = () => {
    navigate("/adventures");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading epilogue...</p>
        </div>
      </div>
    );
  }

  if (error || !epilogueData || !navigation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "Epilogue not found"}
          </p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="fantasy" icon={Trophy}>
                  Adventure Complete
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{epilogueData.title}</h1>
              <p className="text-muted-foreground mt-1">
                The conclusion of your epic adventure
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleBackToTitle}>
                Adventure Overview
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={ChevronLeft}
                onClick={handlePrevScene}
              >
                Previous Scene
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <Card
              variant="feature"
              className="bg-accent/5 border border-accent/20"
            >
              <CardContent className="p-6">
                <div className="prose max-w-none text-muted-foreground">
                  {epilogueData.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Possible Outcomes */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Possible Outcomes</h2>
              <div className="space-y-6">
                {epilogueData.outcomes.map((outcome, index) => (
                  <Card key={index} variant="elevated">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-foreground">
                        {outcome.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {outcome.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none text-muted-foreground">
                        {outcome.details
                          .split("\n")
                          .map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-4">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Designer's Notes */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Designer's Notes</h2>
              <Card variant="ghost" className="border border-border">
                <CardContent className="p-6">
                  <div className="prose max-w-none text-muted-foreground">
                    {epilogueData.designer_notes
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Adventure Actions */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">What's Next?</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    leftIcon={RotateCcw}
                    onClick={handleRestartAdventure}
                    className="w-full"
                  >
                    Run Again
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={BookOpen}
                    onClick={handleBackToTitle}
                    className="w-full"
                  >
                    Adventure Overview
                  </Button>
                  <Button variant="ghost" leftIcon={Users} className="w-full">
                    Share with Players
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Adventure Hooks */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Continue the Story</h3>
                <p className="text-sm text-muted-foreground">
                  Potential follow-up adventures
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {epilogueData.follow_up_hooks &&
                    epilogueData.follow_up_hooks.length > 0 && (
                      <Card variant="elevated">
                        <CardHeader>
                          <h3 className="text-lg font-semibold">
                            Continue the Story
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Potential follow-up adventures
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {epilogueData.follow_up_hooks.map((hook, index) => (
                              <div
                                key={index}
                                className="p-3 bg-muted/30 rounded-lg"
                              >
                                <h4 className="font-medium text-sm mb-1">
                                  {hook.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {hook.description}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-border mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              rightIcon={ArrowRight}
                              className="w-full"
                              onClick={handleBrowseAdventures}
                            >
                              Browse More Adventures
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </div>
                <div className="pt-4 border-t border-border mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={ArrowRight}
                    className="w-full"
                    onClick={handleBrowseAdventures}
                  >
                    Browse More Adventures
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credits */}
            <Card variant="ghost" className="border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold">Credits</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Designer:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.designer}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">System:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.system}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Version:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.version}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Year:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.year}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adventure Stats */}
            <Card variant="ghost" className="border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold">Adventure Statistics</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {navigation.totalScenes}
                    </div>
                    <div className="text-xs text-muted-foreground">Scenes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {navigation.totalEpisodes}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Episodes
                    </div>
                  </div>
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
            <div className="text-sm text-muted-foreground">
              Adventure completed successfully
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                leftIcon={ChevronLeft}
                onClick={handlePrevScene}
              >
                Previous Scene
              </Button>
              <Button
                variant="primary"
                leftIcon={BookOpen}
                onClick={handleBackToTitle}
              >
                Back to Overview
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Thank you for playing!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
