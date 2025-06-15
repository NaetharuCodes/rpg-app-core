import { X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";

export interface AssetViewerAsset {
  id: string;
  name: string;
  type: "character" | "creature" | "location" | "item";
  description: string;
  imageUrl: string;
  genres?: string[];
}

interface AssetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetViewerAsset | null;
}

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

export function AssetViewerModal({
  isOpen,
  onClose,
  asset,
}: AssetViewerModalProps) {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-end p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Asset Card */}
        <Card variant="ghost" padding="none">
          {/* Asset Image */}
          <div className="aspect-[3/4] bg-muted overflow-hidden">
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Asset Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={assetTypeColors[asset.type]} size="sm">
                {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
              </Badge>
            </div>

            <CardHeader className="p-0 mb-4">
              <h2 className="text-xl font-semibold">{asset.name}</h2>
            </CardHeader>

            <CardContent className="p-0">
              <p className="text-muted-foreground leading-relaxed">
                {asset.description}
              </p>

              {asset.genres && asset.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {asset.genres.map((genre) => (
                    <Badge key={genre} variant="outline" size="sm">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
