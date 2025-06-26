import { Clock, Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/Badge/Badge";

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  era: string;
  importance: "minor" | "major" | "critical";
  imageUrl?: string;
  details?: string;
  sortOrder: number;
}

interface TimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
  onAddEvent?: (date: string) => void;
}

interface GroupedEvent {
  date: string;
  sortOrder: number;
  events: TimelineEvent[];
}

const importanceColors = {
  minor: "border-l-green-500",
  major: "border-l-yellow-500",
  critical: "border-l-red-500",
};

const importanceBgColors = {
  minor: "bg-green-50 dark:bg-green-950/20",
  major: "bg-yellow-50 dark:bg-yellow-950/20",
  critical: "bg-red-50 dark:bg-red-950/20",
};

export function Timeline({ events, onEventClick, onAddEvent }: TimelineProps) {
  const groupedEvents: GroupedEvent[] = Object.values(
    events.reduce(
      (acc, event) => {
        const key = event.startDate;
        if (!acc[key]) {
          acc[key] = {
            date: event.startDate,
            sortOrder: event.sortOrder,
            events: [],
          };
        }
        acc[key].events.push(event);
        return acc;
      },
      {} as Record<string, GroupedEvent>
    )
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  const importanceOrder = { critical: 0, major: 1, minor: 2 };
  groupedEvents.forEach((group) => {
    group.events.sort(
      (a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]
    );
  });

  const getTimelineIcon = (events: TimelineEvent[]) => {
    const mostImportant = events[0];
    return mostImportant.endDate ? (
      <Calendar className="h-3 w-3 text-accent-foreground" />
    ) : (
      <Clock className="h-3 w-3 text-accent-foreground" />
    );
  };

  const getTimelineDotColor = (events: TimelineEvent[]) => {
    const mostImportant = events[0];
    switch (mostImportant.importance) {
      case "critical":
        return "bg-red-500";
      case "major":
        return "bg-yellow-500";
      case "minor":
        return "bg-green-500";
      default:
        return "bg-accent";
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

      <div className="space-y-8">
        {groupedEvents.map((group) => (
          <div key={group.date} className="relative flex items-start">
            <div
              className={`flex-shrink-0 w-8 h-8 ${getTimelineDotColor(group.events)} rounded-full border-4 border-background flex items-center justify-center relative z-10`}
            >
              {getTimelineIcon(group.events)}
            </div>

            <div className="ml-6 flex-1">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-muted/30 px-4 py-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{group.date}</span>
                    {onAddEvent && (
                      <button
                        onClick={() => onAddEvent(group.date)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Add event at this date"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {group.events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 cursor-pointer hover:bg-muted/30 transition-colors border-l-4 ${importanceColors[event.importance]} ${importanceBgColors[event.importance]}`}
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-base">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              event.importance === "critical"
                                ? "destructive"
                                : event.importance === "major"
                                  ? "default"
                                  : "secondary"
                            }
                            size="sm"
                          >
                            {event.importance}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {event.era}
                          </Badge>
                        </div>
                      </div>

                      {event.endDate && (
                        <div className="text-xs text-muted-foreground mb-2">
                          Ends: {event.endDate}
                        </div>
                      )}

                      <p className="text-muted-foreground text-sm">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
