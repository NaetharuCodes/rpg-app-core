import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/Badge/Badge";

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  era: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

export function Timeline({ events, onEventClick }: TimelineProps) {
  // Sort events chronologically
  const sortedEvents = [...events].sort(
    (a, b) => parseInt(a.startDate) - parseInt(b.startDate)
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

      {/* Events */}
      <div className="space-y-8">
        {sortedEvents.map((event) => (
          <div key={event.id} className="relative flex items-start">
            {/* Timeline dot/icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full border-4 border-background flex items-center justify-center relative z-10">
              {event.endDate ? (
                <Calendar className="h-3 w-3 text-accent-foreground" />
              ) : (
                <Clock className="h-3 w-3 text-accent-foreground" />
              )}
            </div>

            {/* Event content */}
            <div className="ml-6 flex-1">
              <div
                className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onEventClick?.(event)}
              >
                {/* Event header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <Badge variant="outline" size="sm">
                    {event.era}
                  </Badge>
                </div>

                {/* Date range */}
                <div className="text-sm text-muted-foreground mb-2">
                  {event.endDate
                    ? `${event.startDate} - ${event.endDate}`
                    : event.startDate}
                </div>

                {/* Description */}
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
