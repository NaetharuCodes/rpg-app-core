import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";
import type { Asset } from "@/services/api";

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  selectedAssets: string[];
  onAcceptSelection: (assetIds: number[]) => void;
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
  onAcceptSelection,
  title = "Select Assets",
  description = "Choose assets for your content",
  availableTypes = ["character", "creature", "location", "item"],
}: AssetPickerModalProps) {
  const [filter, setFilter] = useState<
    "all" | "character" | "creature" | "location" | "item"
  >("all");

  // Internal pending selection state
  const [pendingSelection, setPendingSelection] = useState<string[]>([]);

  // Initialize pending selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setPendingSelection([...selectedAssets]);
    }
  }, [isOpen, selectedAssets]);

  if (!isOpen) return null;

  const filteredAssets =
    filter === "all"
      ? assets.filter((asset) => availableTypes.includes(asset.type))
      : assets.filter(
          (asset) =>
            asset.type === filter && availableTypes.includes(asset.type)
        );

  const handleAssetClick = (assetId: number) => {
    const assetIdStr = assetId.toString();
    setPendingSelection((prev) =>
      prev.includes(assetIdStr)
        ? prev.filter((id) => id !== assetIdStr)
        : [...prev, assetIdStr]
    );
  };

  const handleAccept = () => {
    onAcceptSelection(pendingSelection.map((id) => parseInt(id)));
    onClose();
  };

  const handleCancel = () => {
    // Reset pending selection and close
    setPendingSelection([...selectedAssets]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl h-[80vh] md:h-[80vh] h-[90vh] flex flex-col mx-4 md:mx-0">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col p-3 md:p-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
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
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleAssetClick(asset.id)}
                  className={cn(
                    "bg-card border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md group relative",
                    pendingSelection.includes(asset.id.toString())
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {/* Asset Image */}
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={asset.image_url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Selection Indicator */}
                  <div className="absolute top-2 right-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        pendingSelection.includes(asset.id.toString())
                          ? "border-primary bg-primary"
                          : "border-white bg-white/80"
                      )}
                    >
                      {pendingSelection.includes(asset.id.toString()) && (
                        <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={assetTypeColors[asset.type]} size="sm">
                        {asset.type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-2 line-clamp-1">
                      {asset.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {asset.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Footer with Accept/Cancel buttons */}
        <div className="border-t border-border p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <span className="text-sm text-muted-foreground order-2 sm:order-1">
              {pendingSelection.length} asset
              {pendingSelection.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-3 order-1 sm:order-2">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAccept}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
