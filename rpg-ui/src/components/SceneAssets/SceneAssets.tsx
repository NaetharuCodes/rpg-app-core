import { useState } from "react";
import { Package } from "lucide-react";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import {
  AssetViewerModal,
  type AssetViewerAsset,
} from "@/components/Modals/AssetViewerModal";

interface Asset {
  id: string;
  name: string;
  type: "character" | "creature" | "location" | "item";
  description: string;
  imageUrl: string;
  genres?: string[];
}

interface SceneAssetsProps {
  assets: Asset[];
  title?: string;
  description?: string;
  className?: string;
}

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

// Asset type ordering for grouping
const assetTypeOrder: Asset["type"][] = [
  "location",
  "character",
  "creature",
  "item",
];

export function SceneAssets({
  assets,
  title = "Scene Assets",
  className = "",
}: SceneAssetsProps) {
  const [selectedAsset, setSelectedAsset] = useState<AssetViewerAsset | null>(
    null
  );
  const [showAssetViewer, setShowAssetViewer] = useState(false);

  // Group and sort assets by type
  const groupedAssets = assetTypeOrder.reduce((acc, type) => {
    const assetsOfType = assets.filter((asset) => asset.type === type);
    return [...acc, ...assetsOfType];
  }, [] as Asset[]);

  const handleAssetClick = (asset: Asset) => {
    // Convert to AssetViewerAsset format
    const viewerAsset: AssetViewerAsset = {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      description: asset.description,
      imageUrl: asset.imageUrl,
      genres: asset.genres,
    };
    setSelectedAsset(viewerAsset);
    setShowAssetViewer(true);
  };

  if (groupedAssets.length === 0) {
    return (
      <Card variant="elevated" className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assets in this scene</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="elevated" className={className}>
        <CardHeader>
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <Badge variant="outline" size="sm">
              {groupedAssets.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groupedAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleAssetClick(asset)}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent/5 hover:border-accent/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={asset.imageUrl}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {asset.name}
                    </h4>
                    <Badge variant={assetTypeColors[asset.type]} size="sm">
                      {asset.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {asset.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Viewer Modal */}
      <AssetViewerModal
        isOpen={showAssetViewer}
        onClose={() => setShowAssetViewer(false)}
        asset={selectedAsset}
      />
    </>
  );
}
