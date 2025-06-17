import React from "react";
import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";
import type { Adventure } from "@/services/api";

interface AdventureCardProps {
  adventure: Adventure;
  children: React.ReactNode; // For action buttons
  className?: string;
}

const ageRatingColors = {
  "For Everyone": "green",
  Teen: "yellow",
  Adult: "destructive",
} as const;

export function AdventureCard({
  adventure,
  children,
  className,
}: AdventureCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group",
        className
      )}
    >
      {/* Image */}
      <div className="aspect-[16/9] bg-muted overflow-hidden relative">
        {adventure.card_image_url ? (
          <img
            src={adventure.card_image_url}
            alt={adventure.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎲</div>
              <div className="text-sm text-muted-foreground font-medium">
                Adventure
              </div>
            </div>
          </div>
        )}

        {/* Age Rating Badge - positioned over image */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={ageRatingColors[adventure.age_rating]}
            size="sm"
            className="font-semibold"
          >
            {adventure.age_rating}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {adventure.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {adventure.description}
        </p>

        {/* Action Buttons */}
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </div>
  );
}
