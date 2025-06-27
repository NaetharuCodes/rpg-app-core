import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock,
  BookOpen,
  FileText,
  Users,
  MapPin,
  Zap,
  Package,
  Edit,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardIcon,
} from "@/components/Card/Card";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";
import { ageRatingColors } from "@/lib/constants";
import { worldService, type World } from "@/services/api";

export function WorldsOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [world, setWorld] = useState<World | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorld = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const worldData = await worldService.get(parseInt(id));
        setWorld(worldData);
      } catch (error) {
        console.error("Failed to fetch world:", error);
        setWorld(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorld();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading world...</div>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>World not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={() => navigate("/worlds")}
              >
                Back to Worlds
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{world.title}</h1>
                <p className="opacity-90 mt-1">World Overview & Management</p>
              </div>
            </div>

            {isAuthenticated && world.user_id && user?.id === world.user_id && (
              <Link to={`/worlds/${id}/edit`}>
                <Button variant="primary" leftIcon={Edit}>
                  Edit World
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* World Info Section */}
      <Section
        background="muted"
        spacing="md"
        style={{
          backgroundImage: world.banner_image_url
            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${world.banner_image_url})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={world.banner_image_url ? "text-white" : ""}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              About This World
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-white">
              {world.description}
            </p>
          </div>

          {/* World Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Age Rating:</span>
                  <Badge variant={ageRatingColors[world.age_rating]} size="sm">
                    {world.age_rating}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-sm">
                    {new Date(world.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {world.genres && world.genres.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-1">
                  {world.genres.map((genre) => (
                    <Badge key={genre} variant="outline" size="sm">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Content Sections */}
      <Section spacing="md">
        <h2 className="text-2xl font-semibold mb-6">World Building</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to={`/worlds/${id}/history`}>
            <Card variant="elevated" hover="lift" className="h-full">
              <CardIcon icon={Clock} variant="gradient" size="md" />
              <CardHeader>
                <h3 className="text-xl font-semibold mb-2">History</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    Timeline
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Timeline of key events that shaped this world
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`/worlds/${id}/lore`}>
            <Card variant="elevated" hover="lift" className="h-full">
              <CardIcon icon={BookOpen} variant="gradient" size="md" />
              <CardHeader>
                <h3 className="text-xl font-semibold mb-2">Lore & Myths</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    Cultural
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mythology, beliefs, and cultural traditions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`/worlds/${id}/stories`}>
            <Card variant="elevated" hover="lift" className="h-full">
              <CardIcon icon={FileText} variant="gradient" size="md" />
              <CardHeader>
                <h3 className="text-xl font-semibold mb-2">Stories</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    Narrative
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prose pieces that showcase the world's feel and themes
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </Section>

      {/* Asset Sections */}
      <Section background="muted" spacing="md">
        <h2 className="text-2xl font-semibold mb-6">Key Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to={`/worlds/${id}/characters`}>
            <Card variant="elevated" hover="lift" className="h-full">
              <CardIcon icon={Users} variant="gradient" size="md" />
              <CardHeader>
                <h3 className="text-lg font-semibold mb-2">Key Characters</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    NPCs
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Important people who shape the world's destiny
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`/worlds/${id}/locations`}>
            <Card variant="elevated" hover="lift" className="h-full">
              <CardIcon icon={MapPin} variant="gradient" size="md" />
              <CardHeader>
                <h3 className="text-lg font-semibold mb-2">Key Locations</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    Places
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Significant places of power, beauty, or danger
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`/worlds/${id}/creatures`}>
            <Card variant="elevated" hover="lift" className="h-full">
              <CardIcon icon={Zap} variant="gradient" size="md" />
              <CardHeader>
                <h3 className="text-lg font-semibold mb-2">Key Creatures</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    Beings
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Notable beings that inhabit this world
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`/worlds/${id}/items`}>
            <Card variant="elevated" hover="lift" className="h-full">
              <CardIcon icon={Package} variant="gradient" size="md" />
              <CardHeader>
                <h3 className="text-lg font-semibold mb-2">Key Items</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" size="sm">
                    Artifacts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Artifacts and objects of significance
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </Section>
    </div>
  );
}
