import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Play, Eye } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { AssetCard } from "@/components/AssetCard/AssetCard";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { assetService, type Asset } from "@/services/api";
import {
  AssetViewerModal,
  type AssetViewerAsset,
} from "@/components/Modals/AssetViewerModal";
import { useAuth } from "@/contexts/AuthContext";

type AssetType = "character" | "creature" | "location" | "item";
type ViewMode = "rpg-core" | "my-assets";

export function AssetsGalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("rpg-core");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<AssetType | "all">("all");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetViewerAsset | null>(
    null
  );
  const [showAssetViewer, setShowAssetViewer] = useState(false);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await assetService.getAll();
        setAssets(data);
      } catch (err) {
        setError("Failed to load assets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    // Filter by view mode first
    const matchesViewMode =
      viewMode === "rpg-core"
        ? asset.is_official
        : !asset.is_official && asset.user_id === user?.id;

    // Then apply search and type filters
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || asset.type === filterType;

    return matchesViewMode && matchesSearch && matchesType;
  });

  if (loading) return <div className="p-6">Loading assets...</div>;
  if (error) return <div className="p-6">Error: {error}</div>;

  const handleUseAsset = (asset: Asset) => {
    // In real app, this would add to campaign or open in editor
    console.log("Using asset:", asset.name);
    alert(`Added "${asset.name}" to your campaign!`);
  };

  const handleEditAsset = (asset: Asset) => {
    // In real app, this would navigate to edit page
    console.log("Editing asset:", asset.name);
    alert(`Editing "${asset.name}"`);
  };

  const handleDeleteAsset = async (asset: Asset) => {
    if (confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      try {
        await assetService.delete(asset.id);
        // Refresh the assets list
        const updatedAssets = await assetService.getAll();
        setAssets(updatedAssets);
      } catch (error) {
        console.error("Error deleting asset:", error);
        alert("Failed to delete asset. Please try again.");
      }
    }
  };

  const handleDuplicateAsset = (asset: Asset) => {
    console.log("Duplicating asset:", asset.name);
    alert(`Created a copy of "${asset.name}"!`);
  };

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset({
      id: asset.id.toString(),
      name: asset.name,
      type: asset.type,
      description: asset.description,
      imageUrl: asset.image_url,
      genres: asset.genres,
    });
    setShowAssetViewer(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Assets Library</h1>
              <p className="text-muted-foreground mt-1">
                {viewMode === "rpg-core"
                  ? "Browse official characters, creatures, locations, and items"
                  : "Manage your personal collection of custom assets"}
              </p>
            </div>

            {/* Create Asset Button - only show in My Assets view */}
            {viewMode === "my-assets" && isAuthenticated && (
              <Link to="/assets/create">
                <Button variant="primary" leftIcon={Plus}>
                  Create Asset
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
                RPG Core Assets
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setViewMode("my-assets")}
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-colors",
                    viewMode === "my-assets"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  My Assets
                </button>
              )}
            </div>

            {!isAuthenticated && (
              <div className="text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to create and manage your own assets
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as AssetType | "all")
              }
              className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="character">Characters</option>
              <option value="creature">Creatures</option>
              <option value="location">Locations</option>
              <option value="item">Items</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-muted-foreground">
          {filteredAssets.length}{" "}
          {filteredAssets.length === 1 ? "asset" : "assets"} found
        </div>
      </div>

      {/* Assets Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm || filterType !== "all" ? (
                <div>
                  <p className="text-lg mb-2">No assets found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : viewMode === "my-assets" ? (
                <div>
                  <p className="text-lg mb-4">
                    You haven't created any assets yet
                  </p>
                  <Link to="/assets/create">
                    <Button variant="primary" leftIcon={Plus}>
                      Create Your First Asset
                    </Button>
                  </Link>
                </div>
              ) : (
                <p>No official assets available</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset}>
                {viewMode === "rpg-core" ? (
                  // Official assets - use in campaign
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={Play}
                    onClick={() => handleAssetClick(asset)}
                    className="flex-1"
                  >
                    View
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={Eye}
                      onClick={() => handleAssetClick(asset)}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={Edit}
                      onClick={() => handleEditAsset(asset)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={Trash2}
                      onClick={() => handleDeleteAsset(asset)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </AssetCard>
            ))}
          </div>
        )}
      </div>
      <AssetViewerModal
        isOpen={showAssetViewer}
        onClose={() => setShowAssetViewer(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
