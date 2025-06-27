import { Button } from "@/components/Button/Button";
import { WorldCard } from "@/components/WorldCard/WorldCard";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { worldService, type World } from "@/services/api";
import { Edit, Filter, Play, Plus, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type ViewMode = "rpg-core" | "my-worlds";
type AgeRating = "For Everyone" | "Teen" | "Adult";

export function WorldsGalleryPage() {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>("rpg-core");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgeRating, setFilterAgeRating] = useState<AgeRating | "all">(
    "all"
  );
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        setIsLoading(true);
        const data = await worldService.getAll();
        setWorlds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load worlds");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorlds();
  }, []);

  const handleViewWorld = (world: World) => {
    navigate(`/worlds/${world.id}`);
  };

  const handleEditWorld = (world: World) => {
    navigate(`/worlds/${world.id}/edit`);
  };

  const handleDeleteWorld = async (world: World) => {
    if (!confirm(`Are you sure you want to delete "${world.title}"?`)) return;

    try {
      await worldService.delete(world.id);
      setWorlds((prev) => prev.filter((w) => w.id !== world.id));
    } catch (error) {
      console.error("Failed to delete world:", error);
      alert("Failed to delete world. Please try again.");
    }
  };

  const filteredWorlds = worlds.filter((adventure) => {
    const matchesViewMode =
      viewMode === "rpg-core" ? adventure.is_official : !adventure.is_official;
    const matchesSearch =
      adventure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adventure.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAgeRating =
      filterAgeRating === "all" || adventure.age_rating === filterAgeRating;

    return matchesViewMode && matchesSearch && matchesAgeRating;
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
              <h1 className="text-3xl font-bold">Worlds</h1>
              <p className="text-muted-foreground mt-1">
                {viewMode === "rpg-core"
                  ? "Discover ready-to-run adventures for your table"
                  : "Manage your custom adventures and campaigns"}
              </p>
            </div>

            {/* Create World Button - only show in My Worlds view */}
            {viewMode === "my-worlds" && isAuthenticated && (
              <Link to="/worlds/create">
                <Button variant="primary" leftIcon={Plus}>
                  Create World
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
                RPG Core Worlds
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setViewMode("my-worlds")}
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-colors",
                    viewMode === "my-worlds"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  My Worlds
                </button>
              )}
            </div>

            {!isAuthenticated && (
              <div className="text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to create and manage your own worlds
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
              placeholder="Search worlds..."
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
          {filteredWorlds.length}{" "}
          {filteredWorlds.length === 1 ? "adventure" : "adventures"} found
        </div>
      </div>

      {/* Worlds Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredWorlds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm || filterAgeRating !== "all" ? (
                <div>
                  <p className="text-lg mb-2">No worlds found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : viewMode === "my-worlds" ? (
                <div>
                  <p className="text-lg mb-4">
                    You haven't created any worlds yet
                  </p>
                  <Link to="/adventures/create">
                    <Button variant="primary" leftIcon={Plus}>
                      Create Your First World
                    </Button>
                  </Link>
                </div>
              ) : (
                <p>No official worlds available</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorlds.map((world) => (
              <WorldCard key={world.id} world={world}>
                {viewMode === "rpg-core" ? (
                  // Official adventures - just play
                  <Button
                    variant="primary"
                    leftIcon={Play}
                    onClick={() => handleViewWorld(world)}
                    className="flex-1"
                  >
                    View World
                  </Button>
                ) : (
                  // Custom adventures - play and edit
                  <>
                    <Button
                      variant="primary"
                      leftIcon={Play}
                      onClick={() => handleViewWorld(world)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      leftIcon={Edit}
                      onClick={() => handleEditWorld(world)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      leftIcon={Trash}
                      onClick={() => handleDeleteWorld(world)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </WorldCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
