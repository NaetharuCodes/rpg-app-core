import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";
import { Timeline } from "@/components/TimeLine/TimeLine";
import { TimelineEventCard } from "@/components/TimelineEventCard/TimelineEventCard";

// Mock data for now
const worldTitle = "The Dustlands";
const historyOverview =
  "The history of the Dustlands spans thousands of years, from the ancient Age of Sand when the great cities first rose from the dunes, through the devastating Great War that buried much of civilization, to the current era where nomadic tribes struggle to survive in the harsh desert landscape.";

const mockTimelineEvents = [
  {
    id: 1,
    title: "The First Awakening",
    description:
      "The ancient spirits of the desert first stirred, bringing magic to the world.",
    startDate: "0",
    endDate: null, // Point event
    era: "Age of Sand",
  },
  {
    id: 2,
    title: "Rise of the Sand Cities",
    description:
      "The great cities of Qadesh and Tamrin were founded, marking the beginning of civilization.",
    startDate: "150",
    endDate: "300",
    era: "Age of Sand",
  },
  {
    id: 3,
    title: "The Great War",
    description:
      "A devastating conflict between the northern and southern kingdoms that lasted decades.",
    startDate: "200",
    endDate: "226",
    era: "Age of Sand",
  },
  {
    id: 4,
    title: "The Great Burial",
    description:
      "Massive sandstorms buried most of the great cities, ending the Age of Sand.",
    startDate: "485",
    endDate: null,
    era: "Age of Sand",
  },
  {
    id: 5,
    title: "The Wandering Begins",
    description:
      "Survivors form the first nomadic tribes, beginning the current era.",
    startDate: "500",
    endDate: null,
    era: "Age of Wanderers",
  },
  {
    id: 6,
    title: "The Great War",
    description:
      "A devastating conflict between the northern and southern kingdoms.",
    startDate: "200",
    endDate: "225",
    era: "Age of Sand",
    imageUrl: "https://example.com/war-image.jpg",
    details:
      "The Great War began when trade disputes between the northern city-states and the southern desert kingdoms escalated into open conflict. What started as border skirmishes soon engulfed the entire region in a devastating war that would reshape the political landscape forever.",
  },
  {
    id: 7,
    title: "Fall of the Dragon King",
    description:
      "The last Dragon King is slain in battle during the war's final year.",
    startDate: "224",
    endDate: null,
    era: "Age of Sand",
  },
  {
    id: 8,
    title: "The Black Plague",
    description: "A terrible disease spreads across the war-torn lands.",
    startDate: "222",
    endDate: "230",
    era: "Age of Sand",
  },
];

export function WorldHistoryPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
                <h1 className="text-3xl font-bold">{worldTitle} - History</h1>
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
          <p>{historyOverview}</p>
        </div>
      </Section>

      {/* Timeline Section */}
      <Section background="muted" spacing="lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Timeline</h2>
          {isAuthenticated && (
            <Button variant="primary" leftIcon={Plus} size="sm">
              Add Event
            </Button>
          )}
        </div>

        {/* Timeline component will go here */}
        <div className="text-center text-muted-foreground py-8">
          <Timeline
            onEventClick={setSelectedEvent}
            events={mockTimelineEvents}
          />
        </div>
      </Section>
      <TimelineEventCard
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
}
