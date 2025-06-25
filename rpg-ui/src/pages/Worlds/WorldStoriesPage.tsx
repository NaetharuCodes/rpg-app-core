import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";

import { StoryCard } from "@/components/StoryCard/StoryCard";
import type { Story } from "@/services/api";

export function WorldStoriesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Mock data for now
  const worldTitle = "The Dustlands";
  const loreOverview =
    "The mythology and folklore of the Dustlands is rich with tales of ancient spirits, lost civilizations, and the eternal struggle between order and chaos...";

  // Add this after the loreOverview
  const mockStories: Story[] = [
    {
      id: 1,
      world_id: 1,
      title: "The Last Caravan",
      category: "Survival",
      excerpt:
        "When the water runs out, desperation drives people to make impossible choices...",
      word_count: 1260,
      cover_image_url: "mockurl",
      created_at: "today",
      chapters: [],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
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
                <h1 className="text-3xl font-bold">{worldTitle} - Stories</h1>
                <p className="text-muted-foreground mt-1">Stories</p>
              </div>
            </div>

            {isAuthenticated && (
              <Button variant="secondary" leftIcon={Edit}>
                Edit Story
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <Section spacing="md">
        <h2 className="text-2xl font-semibold mb-4">Cultural Overview</h2>
        <div className="prose max-w-none text-muted-foreground">
          <p>{loreOverview}</p>
        </div>
      </Section>

      {/* Lore Collection */}
      <Section background="muted" spacing="lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Myths & Legends</h2>
          {isAuthenticated && (
            <Button variant="primary" leftIcon={Plus} size="sm">
              Add Lore Entry
            </Button>
          )}
        </div>

        {/* Lore Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() =>
                navigate(`/worlds/${story.world_id}/stories/${story.id}/readcinematic, Chiaroscuro, monochrome, 

toddler, young girl, flat chest, naked, mother, mother spreading girl's pussy, 

squatting on dildo, gold dildo, `)
              }
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
