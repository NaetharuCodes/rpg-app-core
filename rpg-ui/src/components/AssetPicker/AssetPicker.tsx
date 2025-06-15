import { useState } from "react";
import { X, Package, Plus } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import {
  AssetPickerModal,
  type AssetPickerAsset,
} from "@/components/Modals/AssetPickerModal";

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

interface AssetSelectorProps {
  title?: string;
  description?: string;
  selectedAssetIds: string[];
  availableAssets: AssetPickerAsset[];
  onToggleAsset: (assetId: string) => void;
  className?: string;
  gridCols?: "1" | "2" | "3";
  emptyStateMessage?: string;
  emptyStateButtonText?: string;
  availableTypes?: ("character" | "creature" | "location" | "item")[];
  multiSelect?: boolean;
}

export function AssetSelector({
  title = "Assets",
  description = "Select assets for this content",
  selectedAssetIds,
  availableAssets,
  onToggleAsset,
  className = "",
  gridCols = "2",
  emptyStateMessage = "No assets selected yet",
  emptyStateButtonText = "Add Your First Asset",
  availableTypes = ["character", "creature", "location", "item"],
  multiSelect = true,
}: AssetSelectorProps) {
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  const selectedAssets = availableAssets.filter((asset) =>
    selectedAssetIds.includes(asset.id)
  );

  const gridColsMap = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <>
      <Card variant="elevated" className={className}>
        <CardHeader>
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
              variant="secondary"
              leftIcon={Plus}
              onClick={() => setShowAssetPicker(true)}
            >
              Add Assets
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedAssets.length > 0 ? (
            <div className={`grid ${gridColsMap[gridCols]} gap-4`}>
              {selectedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg"
                >
                  <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {asset.name}
                      </h4>
                      <Badge
                        variant={
                          assetTypeColors[
                            asset.type as keyof typeof assetTypeColors
                          ]
                        }
                        size="sm"
                      >
                        {asset.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {asset.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleAsset(asset.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{emptyStateMessage}</p>
              <Button
                variant="secondary"
                leftIcon={Plus}
                onClick={() => setShowAssetPicker(true)}
              >
                {emptyStateButtonText}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        selectedAssets={selectedAssetIds}
        onToggleAsset={onToggleAsset}
        assets={availableAssets}
        availableTypes={availableTypes}
        multiSelect={multiSelect}
      />
    </>
  );
}
