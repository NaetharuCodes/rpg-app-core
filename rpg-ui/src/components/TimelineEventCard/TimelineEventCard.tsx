import { X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import type { TimelineEvent } from "@/services/api";

interface TimelineEventCardProps {
  isOpen: boolean;
  onClose: () => void;
  event: TimelineEvent | null;
}

export function TimelineEventCard({
  isOpen,
  onClose,
  event,
}: TimelineEventCardProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <Badge variant="outline" size="sm">
              {event.era}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date */}
          <div className="text-sm text-muted-foreground mb-4">
            {event.end_date
              ? `${event.start_date} - ${event.end_date}`
              : event.start_date}
          </div>

          {/* Image */}
          {event.image_url && (
            <div className="mb-6">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {event.details || event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
