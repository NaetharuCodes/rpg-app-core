import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";

interface LoreEntry {
  id: number;
  title: string;
  category: string;
  preview: string;
  imageUrl?: string | null;
  fullContent?: string; // Full story content
}

interface LoreDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lore: LoreEntry | null;
}

const categoryColors = {
  "Creation Myth": "fantasy",
  "Folk Tale": "mystery",
  Legend: "scifi",
  "Cultural Belief": "historical",
} as const;

export function LoreDetailModal({
  isOpen,
  onClose,
  lore,
}: LoreDetailModalProps) {
  const [fullLore, setFullLore] = useState<LoreEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading full content when modal opens
  useEffect(() => {
    if (isOpen && lore) {
      // TODO: Replace with actual API call
      setFullLore({
        ...lore,
        fullContent: `This is the full content for "${lore.title}". Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
      });
    }
  }, [isOpen, lore]);

  if (!isOpen) return null;

  const categoryColor = lore
    ? categoryColors[lore.category as keyof typeof categoryColors] ||
      "secondary"
    : "secondary";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{lore?.title}</h2>
            {lore && (
              <Badge variant={categoryColor} size="sm">
                {lore.category}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading story...</div>
            </div>
          ) : (
            <div className="p-6">
              {/* Image */}
              {fullLore?.imageUrl && (
                <div className="mb-6">
                  <img
                    src={fullLore.imageUrl}
                    alt={fullLore.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none">
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {fullLore?.fullContent}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
