import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";
import { LoreCard } from "@/components/LoreCard/LoreCard";
import { useState } from "react";
import { LoreDetailModal } from "@/components/Modals/LoreDetailModal";

export function WorldLorePage() {
  const [selectedLore, setSelectedLore] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Mock data for now
  const worldTitle = "The Dustlands";
  const loreOverview =
    "The mythology and folklore of the Dustlands is rich with tales of ancient spirits, lost civilizations, and the eternal struggle between order and chaos...";

  // Add this after the loreOverview
  const mockLoreEntries = [
    {
      id: 1,
      title: "The First Awakening",
      category: "Creation Myth",
      preview:
        "Long before the great cities rose from the sand, the desert spirits stirred for the first time...",
      imageUrl: null,
    },
    {
      id: 2,
      title: "The Whispering Dunes",
      category: "Folk Tale",
      preview:
        "Travelers speak of voices that call from the deepest parts of the desert, leading the lost to safety or doom...",
      imageUrl: null,
    },
    {
      id: 3,
      title: "The Last Dragon King",
      category: "Legend",
      preview:
        "The final ruler of the old kingdom, said to have commanded both fire and sand until his mysterious disappearance...",
      imageUrl: null,
    },
    {
      id: 4,
      title: "Rituals of the Sand Walkers",
      category: "Cultural Belief",
      preview:
        "The nomadic tribes follow ancient ceremonies to appease the desert spirits and ensure safe passage...",
      imageUrl: null,
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
                <h1 className="text-3xl font-bold">
                  {worldTitle} - Lore & Myths
                </h1>
                <p className="text-muted-foreground mt-1">
                  Stories, legends, and cultural beliefs
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <Button variant="secondary" leftIcon={Edit}>
                Edit Lore
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
          {mockLoreEntries.map((lore) => (
            <LoreCard
              key={lore.id}
              lore={lore}
              onClick={(lore) => setSelectedLore(lore)}
            />
          ))}
        </div>
      </Section>
      <LoreDetailModal
        isOpen={!!selectedLore}
        onClose={() => setSelectedLore(null)}
        lore={selectedLore}
      />
    </div>
  );
}
