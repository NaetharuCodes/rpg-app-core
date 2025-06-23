import { Badge } from "@/components/Badge/Badge";
import { cn } from "@/lib/utils";
import type { Story } from "@/services/api";

interface StoryCardProps {
  story: Story;
  onClick: (story: Story) => void;
  className?: string;
}

const categoryColors = {
  Survival: "fantasy",
  "Daily Life": "mystery",
  Conflict: "destructive",
  Atmosphere: "scifi",
  Mystery: "historical",
} as const;

export function StoryCard({ story, onClick, className }: StoryCardProps) {
  const categoryColor =
    categoryColors[story.category as keyof typeof categoryColors] ||
    "secondary";

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group",
        className
      )}
      onClick={() => onClick(story)}
    >
      {/* Image placeholder */}
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        {story.imageUrl ? (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-sm text-muted-foreground font-medium">
                {story.category}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{story.title}</h3>
          <Badge variant={categoryColor} size="sm">
            {story.category}
          </Badge>
        </div>
        {story.word_count && (
          <div className="text-xs text-muted-foreground mt-2">
            {story.word_count} words
          </div>
        )}
        <p className="text-muted-foreground text-sm line-clamp-3">
          {story.excerpt}
        </p>
      </div>
    </div>
  );
}
