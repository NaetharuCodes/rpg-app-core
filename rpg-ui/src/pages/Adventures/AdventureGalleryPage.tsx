import React, { useState } from "react";
import { Plus, Search, Filter, Edit, Play } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { AdventureCard } from "@/components/AdventureCard/AdventureCard";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type ViewMode = "rpg-core" | "my-adventures";
type AgeRating = "For Everyone" | "Teen" | "Adult";

interface Adventure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isOfficial: boolean;
  genres: string[];
  estimatedTime: string;
  sceneCount: number;
  ageRating: AgeRating;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

// Mock data - in real app this would come from your API
const mockAdventures: Adventure[] = [
  // Official RPG Core Adventures
  {
    id: "fortress-on-edge-of-doom",
    title: "Fortress on the Edge of Doom",
    description:
      "An epic high fantasy adventure that focuses on heroism in the face of impossible odds, magical catastrophe, and the desperate defense of reality itself.",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop",
    isOfficial: true,
    genres: ["fantasy", "horror"],
    estimatedTime: "3-4 hours",
    sceneCount: 12,
    ageRating: "Teen",
    difficulty: "Intermediate",
  },
  {
    id: "mystery-of-willowbrook",
    title: "The Mystery of Willowbrook",
    description:
      "A charming small-town mystery perfect for introducing young players to RPGs. Solve the case of the missing festival decorations!",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
    isOfficial: true,
    genres: ["mystery", "modern"],
    estimatedTime: "2-3 hours",
    sceneCount: 8,
    ageRating: "For Everyone",
    difficulty: "Beginner",
  },
  {
    id: "shadows-over-salem",
    title: "Shadows Over Salem",
    description:
      "A dark horror adventure set in colonial America. Uncover the truth behind the witch trials, but beware what lurks in the shadows.",
    imageUrl:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&h=500&fit=crop",
    isOfficial: true,
    genres: ["horror", "historical"],
    estimatedTime: "4-5 hours",
    sceneCount: 15,
    ageRating: "Adult",
    difficulty: "Advanced",
  },
  {
    id: "cyberpunk-heist",
    title: "The Data Heist",
    description:
      "Break into the most secure corporate server in Neo-Tokyo. A high-tech thriller with moral choices and explosive action.",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=500&fit=crop",
    isOfficial: true,
    genres: ["scifi", "modern"],
    estimatedTime: "3-4 hours",
    sceneCount: 10,
    ageRating: "Teen",
    difficulty: "Intermediate",
  },
  {
    id: "pirates-treasure",
    title: "The Pirate's Lost Treasure",
    description:
      "Ahoy mateys! A swashbuckling adventure on the high seas. Perfect for families and new players who want excitement without complexity.",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
    isOfficial: true,
    genres: ["historical", "fantasy"],
    estimatedTime: "2-3 hours",
    sceneCount: 9,
    ageRating: "For Everyone",
    difficulty: "Beginner",
  },
  // User's Custom Adventures (only visible when logged in)
  {
    id: "user-custom-1",
    title: "My Homebrew Campaign",
    description: "A custom adventure I created for my weekly group.",
    imageUrl:
      "https://images.unsplash.com/photo-1551775538-ca3ec7f49a60?w=800&h=500&fit=crop",
    isOfficial: false,
    genres: ["fantasy"],
    estimatedTime: "4-6 hours",
    sceneCount: 18,
    ageRating: "Teen",
    difficulty: "Advanced",
  },
  {
    id: "user-custom-2",
    title: "Space Station Alpha",
    description: "A sci-fi adventure set on a mysterious space station.",
    imageUrl:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=500&fit=crop",
    isOfficial: false,
    genres: ["scifi"],
    estimatedTime: "3-4 hours",
    sceneCount: 11,
    ageRating: "Teen",
    difficulty: "Intermediate",
  },
];

export function AdventureGalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("rpg-core");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [filterAgeRating, setFilterAgeRating] = useState<AgeRating | "all">(
    "all"
  );

  // Mock auth state - will replace with real auth context later
  const isAuthenticated = true;

  const filteredAdventures = mockAdventures.filter((adventure) => {
    // Filter by official/custom based on view mode
    const matchesViewMode =
      viewMode === "rpg-core" ? adventure.isOfficial : !adventure.isOfficial;

    // Filter by search term
    const matchesSearch =
      adventure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adventure.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by genre
    const matchesGenre =
      filterGenre === "all" || adventure.genres.includes(filterGenre);

    // Filter by age rating
    const matchesAgeRating =
      filterAgeRating === "all" || adventure.ageRating === filterAgeRating;

    return matchesViewMode && matchesSearch && matchesGenre && matchesAgeRating;
  });

  const handlePlayAdventure = (adventure: Adventure) => {
    // Navigate to adventure title page
    window.location.href = `/adventures/${adventure.id}`;
  };

  const handleEditAdventure = (adventure: Adventure) => {
    // Navigate to adventure editor
    window.location.href = `/adventures/${adventure.id}/edit`;
  };

  // Get unique genres for filter dropdown
  const allGenres = Array.from(
    new Set(
      mockAdventures
        .filter((a) => (viewMode === "rpg-core" ? a.isOfficial : !a.isOfficial))
        .flatMap((a) => a.genres)
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Adventures</h1>
              <p className="text-muted-foreground mt-1">
                {viewMode === "rpg-core"
                  ? "Discover ready-to-run adventures for your table"
                  : "Manage your custom adventures and campaigns"}
              </p>
            </div>

            {/* Create Adventure Button - only show in My Adventures view */}
            {viewMode === "my-adventures" && isAuthenticated && (
              <Link to="/adventures/create">
                <Button variant="primary" leftIcon={Plus}>
                  Create Adventure
                </Button>
              </Link>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("rpg-core")}
                className={cn(
                  "px-4 py-2 rounded-md font-medium transition-colors",
                  viewMode === "rpg-core"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                RPG Core Adventures
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setViewMode("my-adventures")}
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-colors",
                    viewMode === "my-adventures"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  My Adventures
                </button>
              )}
            </div>

            {!isAuthenticated && (
              <div className="text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to create and manage your own adventures
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search adventures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>

            {/* Genre Filter */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              <option value="all">All Genres</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>

            {/* Age Rating Filter */}
            <select
              value={filterAgeRating}
              onChange={(e) =>
                setFilterAgeRating(e.target.value as AgeRating | "all")
              }
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              <option value="all">All Ages</option>
              <option value="For Everyone">For Everyone</option>
              <option value="Teen">Teen</option>
              <option value="Adult">Adult</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-muted-foreground">
          {filteredAdventures.length}{" "}
          {filteredAdventures.length === 1 ? "adventure" : "adventures"} found
        </div>
      </div>

      {/* Adventures Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredAdventures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm ||
              filterGenre !== "all" ||
              filterAgeRating !== "all" ? (
                <div>
                  <p className="text-lg mb-2">No adventures found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : viewMode === "my-adventures" ? (
                <div>
                  <p className="text-lg mb-4">
                    You haven't created any adventures yet
                  </p>
                  <Link to="/adventures/create">
                    <Button variant="primary" leftIcon={Plus}>
                      Create Your First Adventure
                    </Button>
                  </Link>
                </div>
              ) : (
                <p>No official adventures available</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdventures.map((adventure) => (
              <AdventureCard key={adventure.id} adventure={adventure}>
                {viewMode === "rpg-core" ? (
                  // Official adventures - just play
                  <Button
                    variant="primary"
                    leftIcon={Play}
                    onClick={() => handlePlayAdventure(adventure)}
                    className="flex-1"
                  >
                    Play Adventure
                  </Button>
                ) : (
                  // Custom adventures - play and edit
                  <>
                    <Button
                      variant="primary"
                      leftIcon={Play}
                      onClick={() => handlePlayAdventure(adventure)}
                      className="flex-1"
                    >
                      Play
                    </Button>
                    <Button
                      variant="secondary"
                      leftIcon={Edit}
                      onClick={() => handleEditAdventure(adventure)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </AdventureCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
