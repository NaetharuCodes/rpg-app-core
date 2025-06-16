import React from "react";
import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";
import type { Asset } from "@/services/api";

interface AssetCardProps {
  asset: Asset;
  children?: React.ReactNode; // For action buttons
  className?: string;
}

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

const assetTypeIcons = {
  character: "👤",
  creature: "🐉",
  location: "🏰",
  item: "⚔️",
};

export function AssetCard({ asset, children, className }: AssetCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group relative",
        className
      )}
      style={{ contain: "layout style" }}
    >
      {/* Image */}
      <div className="aspect-[3/4] bg-muted overflow-hidden">
        <img
          src={asset.image_url}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{assetTypeIcons[asset.type]}</span>
            <Badge variant={assetTypeColors[asset.type]} size="sm">
              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
            </Badge>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {asset.name}
        </h3>

        <p
          className="text-muted-foreground text-sm mb-4 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {asset.description}
        </p>

        {asset.is_official && asset.genres && (
          <div className="flex flex-wrap gap-1 mb-3">
            {asset.genres.map((genre) => (
              <Badge key={genre} variant="outline" size="sm">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </div>
  );
}
