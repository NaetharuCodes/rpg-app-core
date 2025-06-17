import { useEffect, useState } from "react";
import { Plus, Search, Filter, Edit, Play, Trash } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { AdventureCard } from "@/components/AdventureCard/AdventureCard";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { adventureService, type Adventure } from "@/services/api";

type ViewMode = "rpg-core" | "my-adventures";
type AgeRating = "For Everyone" | "Teen" | "Adult";

export function AdventureGalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("rpg-core");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [filterAgeRating, setFilterAgeRating] = useState<AgeRating | "all">(
    "all"
  );
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setIsLoading(true);
        const data = await adventureService.getAll();
        console.log("API Response:", data);
        // Transform API data to match your display format
        const transformedAdventures = data.map((adventure) => ({
          ...adventure,
          isOfficial: !adventure.user_id, // Official adventures have no user_id
          genres: adventure || [],
          // Add default values for display properties
          estimatedTime: "2-4 hours", // You can calculate this from scenes later
          sceneCount:
            adventure.episodes?.reduce(
              (total, ep) => total + (ep.scenes?.length || 0),
              0
            ) || 0,
          ageRating: "For Everyone" as AgeRating, // Default, you can enhance this later
        }));

        setAdventures(transformedAdventures);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load adventures"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdventures();
  }, []);

  // Mock auth state - will replace with real auth context later
  const isAuthenticated = true;

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setIsLoading(true);
        const data = await adventureService.getAll();

        // Transform API data to match your display format
        const transformedAdventures = data.map((adventure) => ({
          ...adventure,
          isOfficial: !adventure.user_id, // Official adventures have no user_id
          genres: adventure.genres || [],
          // Add default values for display properties
          estimatedTime: "2-4 hours", // You can calculate this from scenes later
          sceneCount:
            adventure.episodes?.reduce(
              (total, ep) => total + (ep.scenes?.length || 0),
              0
            ) || 0,
          ageRating: "For Everyone" as AgeRating, // Default, you can enhance this later
        }));

        setAdventures(transformedAdventures);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load adventures"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdventures();
  }, []);

  const handlePlayAdventure = (adventure: Adventure) => {
    // Navigate to adventure title page
    window.location.href = `/adventures/${adventure.id}`;
  };

  const handleEditAdventure = (adventure: Adventure) => {
    // Navigate to adventure editor
    window.location.href = `/adventures/${adventure.id}/edit`;
  };

  const handleDeleteAdventure = async (adventure: Adventure) => {
    if (
      confirm(
        `Are you sure you want to delete "${adventure.title}"? This will permanently delete the entire adventure including all episodes and scenes.`
      )
    ) {
      try {
        await adventureService.delete(adventure.id);

        // Refetch and transform data (same as your existing useEffect)
        const data = await adventureService.getAll();
        const transformedAdventures = data.map((adventure) => ({
          ...adventure,
          isOfficial: !adventure.user_id,
          genres: adventure.genres || [],
          estimatedTime: "2-4 hours",
          sceneCount:
            adventure.episodes?.reduce(
              (total, ep) => total + (ep.scenes?.length || 0),
              0
            ) || 0,
          ageRating: "For Everyone" as AgeRating,
        }));

        setAdventures(transformedAdventures);
      } catch (error) {
        alert("Failed to delete adventure. Please try again.");
      }
    }
  };

  const filteredAdventures = adventures.filter((adventure) => {
    // Filter by official/custom based on view mode
    const matchesViewMode =
      viewMode === "rpg-core" ? adventure.is_official : !adventure.is_official;

    // Rest of your existing filter logic stays the same...
    const matchesSearch =
      adventure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adventure.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      filterGenre === "all" || adventure.genres.includes(filterGenre);

    const matchesAgeRating =
      filterAgeRating === "all" || adventure.age_rating === filterAgeRating;

    return matchesViewMode && matchesSearch && matchesGenre && matchesAgeRating;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">Loading adventures...</div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

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
            {/* <select
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
            </select> */}

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
                    <Button
                      variant="destructive"
                      leftIcon={Trash}
                      onClick={() => handleDeleteAdventure(adventure)}
                    >
                      Delete
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
