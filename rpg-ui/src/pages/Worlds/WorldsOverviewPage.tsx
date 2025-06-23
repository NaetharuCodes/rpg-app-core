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
import type { World } from "@/services/api";

// Mock world data for now
const mockWorld: World = {
  id: 1,
  title: "The Dustlands",
  description:
    "A harsh desert world where ancient magic meets the struggle for survival. Once-great cities now lie buried beneath endless dunes, while nomadic tribes navigate the treacherous landscape seeking water and shelter.",
  banner_image_url:
    "https://png.pngtree.com/background/20230401/original/pngtree-abstract-neon-lights-background-picture-image_2247943.jpg",
  card_image_url: "",
  genres: ["Fantasy", "Post-Apocalyptic", "Adventure"],
  is_official: false,
  reviewed: false,
  age_rating: "Teen",
  created_at: "2024-01-15T10:30:00Z",
};

interface WorldSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  countLabel: string;
  href: string;
  category: "content" | "assets";
}

export function WorldsOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [world, setWorld] = useState<World | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data loading
  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setWorld(mockWorld);
      setIsLoading(false);
    }, 500);
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

  const sections: WorldSection[] = [
    // Content Sections
    {
      id: "history",
      title: "History",
      description: "Timeline of key events that shaped this world",
      icon: Clock,
      count: 8,
      countLabel: "Historical Events",
      href: `/worlds/${id}/history`,
      category: "content",
    },
    {
      id: "lore",
      title: "Lore & Myths",
      description: "Mythology, beliefs, and cultural traditions",
      icon: BookOpen,
      count: 5,
      countLabel: "Myths & Legends",
      href: `/worlds/${id}/lore`,
      category: "content",
    },
    {
      id: "stories",
      title: "Stories",
      description: "Prose pieces that showcase the world's feel and themes",
      icon: FileText,
      count: 3,
      countLabel: "Stories",
      href: `/worlds/${id}/stories`,
      category: "content",
    },
    // Asset Sections
    {
      id: "characters",
      title: "Key Characters",
      description: "Important people who shape the world's destiny",
      icon: Users,
      count: 12,
      countLabel: "Key Characters",
      href: `/worlds/${id}/characters`,
      category: "assets",
    },
    {
      id: "locations",
      title: "Key Locations",
      description: "Significant places of power, beauty, or danger",
      icon: MapPin,
      count: 7,
      countLabel: "Key Locations",
      href: `/worlds/${id}/locations`,
      category: "assets",
    },
    {
      id: "creatures",
      title: "Key Creatures",
      description: "Notable beings that inhabit this world",
      icon: Zap,
      count: 9,
      countLabel: "Key Creatures",
      href: `/worlds/${id}/creatures`,
      category: "assets",
    },
    {
      id: "items",
      title: "Key Items",
      description: "Artifacts and objects of significance",
      icon: Package,
      count: 6,
      countLabel: "Key Items",
      href: `/worlds/${id}/items`,
      category: "assets",
    },
  ];

  const contentSections = sections.filter((s) => s.category === "content");
  const assetSections = sections.filter((s) => s.category === "assets");

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

            {isAuthenticated && !world.is_official && (
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
            ? `linear-gradient(rgba(1, 0, 0, .7), rgba(1, 0, 0, .9)), url(${world.banner_image_url})`
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
          {contentSections.map((section) => (
            <Link key={section.id} to={section.href}>
              <Card variant="elevated" hover="lift" className="h-full">
                <CardIcon icon={section.icon} variant="gradient" size="md" />
                <CardHeader>
                  <h3 className="text-xl font-semibold mb-2">
                    {section.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" size="sm">
                      {section.count} {section.countLabel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Asset Sections */}
      <Section background="muted" spacing="md">
        <h2 className="text-2xl font-semibold mb-6">Key Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assetSections.map((section) => (
            <Link key={section.id} to={section.href}>
              <Card variant="elevated" hover="lift" className="h-full">
                <CardIcon icon={section.icon} variant="gradient" size="md" />
                <CardHeader>
                  <h3 className="text-lg font-semibold mb-2">
                    {section.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" size="sm">
                      {section.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
