import React from "react";
import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";

interface LoreEntry {
  id: number;
  title: string;
  category: string;
  preview: string;
  imageUrl?: string | null;
}

interface LoreCardProps {
  lore: LoreEntry;
  onClick: (lore: LoreEntry) => void;
  className?: string;
}

const categoryColors = {
  "Creation Myth": "fantasy",
  "Folk Tale": "mystery",
  Legend: "scifi",
  "Cultural Belief": "historical",
} as const;

export function LoreCard({ lore, onClick, className }: LoreCardProps) {
  const categoryColor =
    categoryColors[lore.category as keyof typeof categoryColors] || "secondary";

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group",
        className
      )}
      onClick={() => onClick(lore)}
    >
      {/* Image placeholder */}
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        {lore.imageUrl ? (
          <img
            src={lore.imageUrl}
            alt={lore.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📜</div>
              <div className="text-sm text-muted-foreground font-medium">
                {lore.category}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{lore.title}</h3>
          <Badge variant={categoryColor} size="sm">
            {lore.category}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-3">
          {lore.preview}
        </p>
      </div>
    </div>
  );
}
