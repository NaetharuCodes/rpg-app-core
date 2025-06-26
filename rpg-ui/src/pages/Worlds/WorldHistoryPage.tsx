import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";
import { TimelineWithFilters } from "@/components/TimeLine/TimelineWithFilters"; // Update to new component
import { TimelineEventCard } from "@/components/TimelineEventCard/TimelineEventCard";
import {
  worldService,
  timelineEventService,
  type World,
  type TimelineEvent,
} from "@/services/api";
import { TimelineEventModal } from "@/components/Modals/TimelineEventModal";

export function WorldHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [world, setWorld] = useState<World | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load world and timeline events
        const [worldData, eventsData] = await Promise.all([
          worldService.get(parseInt(id)),
          timelineEventService.getAll(parseInt(id)),
        ]);

        setWorld(worldData);
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to load world data:", err);
        setError("Failed to load world data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAddEvent = async (date: string) => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (eventData) => {
    if (!id) return;

    try {
      if (editingEvent) {
        // Update existing event
        const updated = await timelineEventService.update(
          parseInt(id),
          editingEvent.id,
          eventData
        );
        setEvents((prev) =>
          prev.map((e) => (e.id === editingEvent.id ? updated : e))
        );
      } else {
        // Create new event
        const newEvent = await timelineEventService.create(
          parseInt(id),
          eventData
        );
        setEvents((prev) => [...prev, newEvent]);
      }
    } catch (error) {
      console.error("Failed to save event:", error);
      throw error;
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await timelineEventService.delete(parseInt(id), eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleUpdateEvent = async (eventData) => {
    if (!editingEvent || !id) return;

    try {
      const updated = await timelineEventService.update(
        parseInt(id),
        editingEvent.id,
        eventData
      );
      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? updated : e))
      );
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div>Loading world history...</div>
        </div>
      </div>
    );
  }

  if (error || !world) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">World Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || "The requested world could not be found."}
            </p>
            <Button onClick={() => navigate("/worlds")}>Back to Worlds</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={() => navigate(`/worlds/${id}`)}
              >
                Back to World
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{world.title} - History</h1>
                <p className="text-muted-foreground mt-1">
                  Timeline and historical overview
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <Button variant="secondary" leftIcon={Edit}>
                Edit History
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <Section spacing="md">
        <h2 className="text-2xl font-semibold mb-4">Historical Overview</h2>
        <div className="prose max-w-none text-muted-foreground">
          <p>{world.description}</p>
        </div>
      </Section>

      {/* Timeline Section */}
      <Section background="muted" spacing="lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Timeline</h2>
          {isAuthenticated && (
            <Button
              variant="primary"
              leftIcon={Plus}
              size="sm"
              onClick={() => handleAddEvent("")}
            >
              Add Event
            </Button>
          )}
        </div>
        <TimelineWithFilters
          events={events}
          onEventClick={setSelectedEvent}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          isEditing={true}
        />
      </Section>

      <TimelineEventCard
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
      <TimelineEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
        isCreating={!editingEvent}
      />
    </div>
  );
}
