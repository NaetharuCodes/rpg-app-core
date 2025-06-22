import type { World } from "@/services/api";
import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";
import { ageRatingColors } from "@/lib/constants";
import { Earth } from "lucide-react";

interface WorldCardProps {
  world: World;
  children: React.ReactNode; // For the action buttons
  className?: string;
}

export function WorldCard({ world, children, className }: WorldCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group flex flex-col space-between",
        className
      )}
    >
      {/* Image */}
      <div className="aspect-[16/9] bg-muted overflow-hidden relative">
        {world.card_image_url ? (
          <img
            src={world.card_image_url}
            alt={world.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2 flex justify-center">
                <Earth />
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                World
              </div>
            </div>
          </div>
        )}

        {/* Age Rating Badge - positioned over image */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={ageRatingColors[world.age_rating]}
            size="sm"
            className="font-semibold"
          >
            {world.age_rating}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-hidden flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {world.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {world.description}
        </p>

        <div className="flex-1"></div>

        {/* Action Buttons */}
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </div>
  );
}
