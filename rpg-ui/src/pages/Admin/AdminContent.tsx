import { useEffect, useState } from "react";
import { Package, Map, Check, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import type { Asset, Adventure } from "@/services/api";

interface UnreviewedContent {
  assets: Asset[];
  adventures: Adventure[];
}

export function AdminContent() {
  const [content, setContent] = useState<UnreviewedContent>({
    assets: [],
    adventures: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnreviewedContent();
  }, []);

  const fetchUnreviewedContent = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/admin/content/unreviewed",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error("Failed to fetch unreviewed content:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAssetReviewed = async (assetId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/content/assets/${assetId}/review`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchUnreviewedContent(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to mark asset as reviewed:", error);
    }
  };

  const markAdventureReviewed = async (adventureId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/content/adventures/${adventureId}/review`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchUnreviewedContent(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to mark adventure as reviewed:", error);
    }
  };

  const deleteAsset = async (assetId: number) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/assets/${assetId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          fetchUnreviewedContent(); // Refresh the list
        }
      } catch (error) {
        console.error("Failed to delete asset:", error);
      }
    }
  };

  const deleteAdventure = async (adventureId: number) => {
    if (confirm("Are you sure you want to delete this adventure?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/adventures/${adventureId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          fetchUnreviewedContent(); // Refresh the list
        }
      } catch (error) {
        console.error("Failed to delete adventure:", error);
      }
    }
  };

  if (loading) return <div className="p-6">Loading content...</div>;

  const totalUnreviewed = content.assets.length + content.adventures.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Content Review</h1>
        <Badge
          variant={totalUnreviewed > 0 ? "destructive" : "green"}
          size="lg"
        >
          {totalUnreviewed} items to review
        </Badge>
      </div>

      {totalUnreviewed === 0 ? (
        <Card variant="elevated" className="text-center py-12">
          <CardContent>
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
            <p className="text-muted-foreground">No content pending review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Unreviewed Assets */}
          {content.assets.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Unreviewed Assets ({content.assets.length})
              </h2>
              <Card variant="elevated">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Asset</th>
                          <th className="text-left p-4 font-medium">Creator</th>
                          <th className="text-left p-4 font-medium">Type</th>
                          <th className="text-left p-4 font-medium">Created</th>
                          <th className="text-right p-4 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.assets.map((asset) => (
                          <tr key={asset.id} className="border-t border-border">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={asset.image_url}
                                    alt={asset.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {asset.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {asset.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                {asset.user?.name || "Unknown"}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="secondary" size="sm">
                                {asset.type}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(asset.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={Eye}
                                  onClick={() =>
                                    window.open(`/assets/${asset.id}`, "_blank")
                                  }
                                >
                                  View
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={Check}
                                  onClick={() => markAssetReviewed(asset.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={Trash2}
                                  onClick={() => deleteAsset(asset.id)}
                                  className="text-red-600"
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Unreviewed Adventures */}
          {content.adventures.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Map className="h-6 w-6" />
                Unreviewed Adventures ({content.adventures.length})
              </h2>
              <Card variant="elevated">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">
                            Adventure
                          </th>
                          <th className="text-left p-4 font-medium">Creator</th>
                          <th className="text-left p-4 font-medium">Created</th>
                          <th className="text-right p-4 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.adventures.map((adventure) => (
                          <tr
                            key={adventure.id}
                            className="border-t border-border"
                          >
                            <td className="p-4">
                              <div>
                                <div className="font-medium">
                                  {adventure.title}
                                </div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {adventure.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                {adventure.user?.name || "Unknown"}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(
                                adventure.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={Eye}
                                  onClick={() =>
                                    window.open(
                                      `/adventures/${adventure.id}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  View
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={Check}
                                  onClick={() =>
                                    markAdventureReviewed(adventure.id)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={Trash2}
                                  onClick={() => deleteAdventure(adventure.id)}
                                  className="text-red-600"
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
