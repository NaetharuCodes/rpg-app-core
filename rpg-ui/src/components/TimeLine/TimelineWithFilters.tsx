import { useState, useMemo } from "react";
import { Clock, Calendar, Plus, Search, Filter } from "lucide-react";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import type { TimelineEvent } from "@/services/api";

interface TimelineWithFiltersProps {
  events: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
  onAddEvent: (date: string) => void;
  onEditEvent: (event: TimelineEvent) => void;
  onDeleteEvent: (eventId: number) => void;
  isEditing?: boolean;
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
  onEditEvent,
  onDeleteEvent,
  isEditing = false,
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
      <div className="bg-gradient-to-r from-card to-card/50 border border-border/50 rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Timeline Filters</h3>
              <p className="text-sm text-muted-foreground">
                Showing {filteredEvents.length} of {events.length} events
              </p>
            </div>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>

        {/* Filter Groups */}
        <div className="space-y-6">
          {/* Search Bar - Full Width */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events by title or description..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Filter Pills Row */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Importance Filters */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-fit">
                Importance:
              </span>
              <div className="flex items-center gap-2">
                {importanceLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setImportanceFilter(level.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                      importanceFilter === level.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {level.label}
                    {level.value !== "all" && (
                      <span
                        className={`inline-block w-2 h-2 rounded-full ml-2 ${
                          level.value === "critical"
                            ? "bg-red-500"
                            : level.value === "major"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Era Filters */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-fit">
                Era:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEraFilter(null)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    eraFilter === null
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  All Eras
                </button>
                {availableEras.map((era) => (
                  <button
                    key={era}
                    onClick={() => setEraFilter(era)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                      eraFilter === era
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {era}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-4 pt-2 border-t border-border/30">
            <span className="text-sm font-medium text-muted-foreground min-w-fit">
              Date Range:
            </span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Start year"
                value={dateRange.start || ""}
                onChange={(e) =>
                  setDateRange({
                    start: e.target.value ? parseInt(e.target.value) : null,
                    end: dateRange.end,
                  })
                }
                className="w-28 px-3 py-2 text-sm border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <input
                type="number"
                placeholder="End year"
                value={dateRange.end || ""}
                onChange={(e) =>
                  setDateRange({
                    start: dateRange.start,
                    end: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-28 px-3 py-2 text-sm border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {(dateRange.start || dateRange.end) && (
                <button
                  onClick={() => setDateRange({ start: null, end: null })}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
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
                              {isEditing && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditEvent(event);
                                    }}
                                    className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit event"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteEvent(event.id);
                                    }}
                                    className="text-xs px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                    title="Delete event"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                              <Badge>...</Badge>
                              <Badge>...</Badge>
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
