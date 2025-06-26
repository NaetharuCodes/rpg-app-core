import { Search, Filter, ZoomIn, ZoomOut, Calendar } from "lucide-react";
import { Button } from "@/components/Button/Button";

interface TimelineControlsProps {
  onZoomChange: (level: ZoomLevel) => void;
  onImportanceFilter: (importance: ImportanceFilter) => void;
  onEraFilter: (era: string | null) => void;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (start: number | null, end: number | null) => void;

  currentZoom: ZoomLevel;
  currentImportanceFilter: ImportanceFilter;
  currentEraFilter: string | null;
  currentSearch: string;
  currentDateRange: { start: number | null; end: number | null };

  availableEras: string[];
  totalEvents: number;
  filteredEvents: number;
}

type ZoomLevel = "all" | "century" | "decade" | "year";
type ImportanceFilter = "all" | "critical" | "major" | "minor";

export function TimelineControls({
  onZoomChange,
  onImportanceFilter,
  onEraFilter,
  onSearchChange,
  onDateRangeChange,
  currentZoom,
  currentImportanceFilter,
  currentEraFilter,
  currentSearch,
  currentDateRange,
  availableEras,
  totalEvents,
  filteredEvents,
}: TimelineControlsProps) {
  const zoomLevels: { value: ZoomLevel; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "century", label: "Century" },
    { value: "decade", label: "Decade" },
    { value: "year", label: "Year" },
  ];

  const importanceLevels: {
    value: ImportanceFilter;
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "All Events", color: "default" },
    { value: "critical", label: "Critical", color: "destructive" },
    { value: "major", label: "Major", color: "default" },
    { value: "minor", label: "Minor", color: "secondary" },
  ];

  const hasActiveFilters =
    currentImportanceFilter !== "all" ||
    currentEraFilter !== null ||
    currentSearch.length > 0;

  const clearAllFilters = () => {
    onImportanceFilter("all");
    onEraFilter(null);
    onSearchChange("");
    onDateRangeChange(null, null);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between h-[64px]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Timeline Controls
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing {filteredEvents} of {totalEvents} events
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
            <label className="text-sm font-medium">Zoom Level</label>
            <div className="flex flex-wrap gap-1">
              {zoomLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={
                    currentZoom === level.value ? "primary" : "secondary"
                  }
                  size="sm"
                  onClick={() => onZoomChange(level.value)}
                  leftIcon={level.value === "all" ? ZoomOut : ZoomIn}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Importance</label>
            <div className="flex flex-wrap gap-1">
              {importanceLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={
                    currentImportanceFilter === level.value
                      ? "primary"
                      : "secondary"
                  }
                  size="sm"
                  onClick={() => onImportanceFilter(level.value)}
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
                variant={currentEraFilter === null ? "primary" : "secondary"}
                size="sm"
                onClick={() => onEraFilter(null)}
              >
                All Eras
              </Button>
              {availableEras.map((era) => (
                <Button
                  key={era}
                  variant={currentEraFilter === era ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => onEraFilter(era)}
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
                value={currentSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Start year"
              value={currentDateRange.start || ""}
              onChange={(e) =>
                onDateRangeChange(
                  e.target.value ? parseInt(e.target.value) : null,
                  currentDateRange.end
                )
              }
              className="w-32 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="number"
              placeholder="End year"
              value={currentDateRange.end || ""}
              onChange={(e) =>
                onDateRangeChange(
                  currentDateRange.start,
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-32 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {(currentDateRange.start || currentDateRange.end) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateRangeChange(null, null)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
