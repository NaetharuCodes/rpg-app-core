import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { assetService, type Asset } from "@/services/api";

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

export function AssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAsset(parseInt(id));
    }
  }, [id]);

  const loadAsset = async (assetId: number) => {
    try {
      setLoading(true);
      const data = await assetService.getById(assetId);
      setAsset(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load asset");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading asset...</div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Asset Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The asset you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/assets")}>Back to Assets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              leftIcon={ArrowLeft}
              onClick={() => navigate("/assets")}
            >
              Back to Assets
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={assetTypeColors[asset.type]} size="lg">
              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
            </Badge>
            {asset.is_official && (
              <Badge variant="mystery" size="sm">
                Official
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mt-2">{asset.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Image */}
            <Card variant="elevated">
              <CardContent className="p-0">
                <div className="aspect-[4/5] bg-muted overflow-hidden rounded-lg">
                  <img
                    src={asset.image_url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Description</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {asset.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Asset Details */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Asset Details</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Type</div>
                  <Badge variant={assetTypeColors[asset.type]}>
                    {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                  </Badge>
                </div>

                {asset.genres && asset.genres.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Genres</div>
                    <div className="flex flex-wrap gap-1">
                      {asset.genres.map((genre) => (
                        <Badge key={genre} variant="outline" size="sm">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created {new Date(asset.created_at).toLocaleDateString()}
                </div>

                {asset.user && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Created by {asset.user.name}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card variant="ghost" className="border border-border">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Usage Tips</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {asset.type === "character" && (
                    <p>
                      This character can be used as an NPC, ally, or antagonist
                      in your adventures.
                    </p>
                  )}
                  {asset.type === "creature" && (
                    <p>
                      This creature can serve as an encounter, companion, or
                      environmental element.
                    </p>
                  )}
                  {asset.type === "location" && (
                    <p>
                      This location can be used as a setting for scenes,
                      encounters, or story events.
                    </p>
                  )}
                  {asset.type === "item" && (
                    <p>
                      This item can be given as treasure, used as a plot device,
                      or part of your world's lore.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
