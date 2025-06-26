import { useState, useMemo } from "react";
import { Clock, Calendar, Plus, Search, Filter } from "lucide-react";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import type { TimelineEvent } from "@/services/api";

interface TimelineWithFiltersProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
  onAddEvent?: (date: string) => void;
}

interface GroupedEvent {
  date: string;
  sortOrder: number;
  events: TimelineEvent[];
}

type ImportanceFilter = "all" | "critical" | "major" | "minor";

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

export function TimelineWithFilters({
  events,
  onEventClick,
  onAddEvent,
}: TimelineWithFiltersProps) {
  const [importanceFilter, setImportanceFilter] =
    useState<ImportanceFilter>("all");
  const [eraFilter, setEraFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    start: number | null;
    end: number | null;
  }>({
    start: null,
    end: null,
  });

  const availableEras = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.era))).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (importanceFilter !== "all" && event.importance !== importanceFilter) {
        return false;
      }

      if (eraFilter && event.era !== eraFilter) {
        return false;
      }

      if (searchFilter) {
        const searchLower = searchFilter.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(searchLower);
        const matchesDescription = event.description
          .toLowerCase()
          .includes(searchLower);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      if (dateRange.start !== null && event.sort_order < dateRange.start) {
        return false;
      }

      if (dateRange.end !== null && event.sort_order > dateRange.end) {
        return false;
      }

      return true;
    });
  }, [events, importanceFilter, eraFilter, searchFilter, dateRange]);

  const groupedEvents: GroupedEvent[] = useMemo(() => {
    const grouped = Object.values(
      filteredEvents.reduce(
        (acc, event) => {
          const key = event.start_date;
          if (!acc[key]) {
            acc[key] = {
              date: event.start_date,
              sortOrder: event.sort_order,
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
    grouped.forEach((group) => {
      group.events.sort(
        (a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]
      );
    });

    return grouped;
  }, [filteredEvents]);

  const importanceLevels: { value: ImportanceFilter; label: string }[] = [
    { value: "all", label: "All Events" },
    { value: "critical", label: "Critical" },
    { value: "major", label: "Major" },
    { value: "minor", label: "Minor" },
  ];

  const hasActiveFilters =
    importanceFilter !== "all" ||
    eraFilter !== null ||
    searchFilter.length > 0 ||
    dateRange.start !== null ||
    dateRange.end !== null;

  const clearAllFilters = () => {
    setImportanceFilter("all");
    setEraFilter(null);
    setSearchFilter("");
    setDateRange({ start: null, end: null });
  };

  const getTimelineIcon = (events: TimelineEvent[]) => {
    const mostImportant = events[0];
    return mostImportant.end_date ? (
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
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between h-[64px]">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Timeline Filters
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Showing {filteredEvents.length} of {events.length} events
              </span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Importance</label>
              <div className="flex flex-wrap gap-1">
                {importanceLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={
                      importanceFilter === level.value ? "primary" : "secondary"
                    }
                    size="sm"
                    onClick={() => setImportanceFilter(level.value)}
                  >
                    {level.label}
                    {level.value !== "all" && (
                      <div
                        className={`w-2 h-2 rounded-full ml-1 ${
                          level.value === "critical"
                            ? "bg-red-500"
                            : level.value === "major"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Era</label>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={eraFilter === null ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setEraFilter(null)}
                >
                  All Eras
                </Button>
                {availableEras.map((era) => (
                  <Button
                    key={era}
                    variant={eraFilter === era ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setEraFilter(era)}
                  >
                    {era}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Start"
                  value={dateRange.start || ""}
                  onChange={(e) =>
                    setDateRange({
                      start: e.target.value ? parseInt(e.target.value) : null,
                      end: dateRange.end,
                    })
                  }
                  className="w-20 px-2 py-1 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <input
                  type="number"
                  placeholder="End"
                  value={dateRange.end || ""}
                  onChange={(e) =>
                    setDateRange({
                      start: dateRange.start,
                      end: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-20 px-2 py-1 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {groupedEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
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
                        <span className="font-medium text-sm">
                          {group.date}
                        </span>
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

                          {event.end_date && (
                            <div className="text-xs text-muted-foreground mb-2">
                              Ends: {event.end_date}
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
      )}
    </div>
  );
}
