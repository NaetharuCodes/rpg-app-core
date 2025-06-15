import React from "react";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { Clock, Map, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Adventure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isOfficial: boolean;
  genres: string[];
  estimatedTime: string;
  sceneCount: number;
  ageRating: "For Everyone" | "Teen" | "Adult";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

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

const difficultyColors = {
  Beginner: "green",
  Intermediate: "yellow",
  Advanced: "destructive",
} as const;

const genreColors = {
  fantasy: "fantasy",
  horror: "horror",
  scifi: "scifi",
  mystery: "mystery",
  historical: "historical",
  modern: "modern",
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
        <img
          src={adventure.imageUrl}
          alt={adventure.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Age Rating Badge - positioned over image */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={ageRatingColors[adventure.ageRating]}
            size="sm"
            className="font-semibold"
          >
            {adventure.ageRating}
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

        {/* Adventure Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{adventure.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            <span>{adventure.sceneCount} scenes</span>
          </div>
        </div>

        {/* Genres and Difficulty */}
        <div className="flex flex-wrap gap-2 mb-4">
          {adventure.genres.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant={
                genreColors[genre as keyof typeof genreColors] || "outline"
              }
              size="sm"
            >
              {genre}
            </Badge>
          ))}
          {adventure.genres.length > 2 && (
            <Badge variant="outline" size="sm">
              +{adventure.genres.length - 2}
            </Badge>
          )}
          {adventure.difficulty && (
            <Badge variant={difficultyColors[adventure.difficulty]} size="sm">
              {adventure.difficulty}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </div>
  );
}
