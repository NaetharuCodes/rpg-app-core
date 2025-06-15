import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";

export interface AssetPickerAsset {
  id: string;
  name: string;
  type: "character" | "creature" | "location" | "item";
  description: string;
  imageUrl: string;
}

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetPickerAsset[];
  selectedAssets: string[];
  onToggleAsset: (assetId: string) => void;
  title?: string;
  description?: string;
  availableTypes?: ("character" | "creature" | "location" | "item")[];
  multiSelect?: boolean;
}

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

export function AssetPickerModal({
  isOpen,
  onClose,
  assets,
  selectedAssets,
  onToggleAsset,
  title = "Select Assets",
  description = "Choose assets for your content",
  availableTypes = ["character", "creature", "location", "item"],
  multiSelect = true,
}: AssetPickerModalProps) {
  const [filter, setFilter] = useState<
    "all" | "character" | "creature" | "location" | "item"
  >("all");

  if (!isOpen) return null;

  const filteredAssets =
    filter === "all"
      ? assets.filter((asset) => availableTypes.includes(asset.type))
      : assets.filter(
          (asset) =>
            asset.type === filter && availableTypes.includes(asset.type)
        );

  const handleAssetClick = (assetId: string) => {
    if (
      !multiSelect &&
      selectedAssets.length > 0 &&
      !selectedAssets.includes(assetId)
    ) {
      // Single select mode: replace selection
      onToggleAsset(selectedAssets[0]); // Remove current selection
    }
    onToggleAsset(assetId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === "all" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            {availableTypes.map((type) => (
              <Button
                key={type}
                variant={filter === type ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </Button>
            ))}
          </div>

          {/* Assets Grid */}
          <div className="overflow-y-auto max-h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleAssetClick(asset.id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all hover:bg-accent/5",
                    selectedAssets.includes(asset.id)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
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
                        <Badge variant={assetTypeColors[asset.type]} size="sm">
                          {asset.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {asset.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center",
                          selectedAssets.includes(asset.id)
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {selectedAssets.includes(asset.id) && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {selectedAssets.length} asset
              {selectedAssets.length !== 1 ? "s" : ""} selected
            </span>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
