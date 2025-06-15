import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Users,
  Dice6,
  Package,
  X,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { DiceRoller } from "@/components/DiceRoller/DiceRoller";

// Mock scene data with scene-specific assets
const mockSceneData = {
  id: "scene-1-1",
  adventureId: "fortress-on-edge-of-doom",
  episodeId: "episode-1",
  title: "The Battle Observed",
  image:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop",
  prose:
    "From the ancient stones of Valenhall's battlements, the final battle spreads before you like a living tapestry of heroism and horror. Three years of war have led to this moment - King Aldric's forces, their silver banners gleaming in the afternoon sun, pressing forward in disciplined formations across the Thorndale Valley. The enemy's crimson standards fall back in retreat, their lines breaking under the sustained assault of the kingdom's finest warriors.\n\nCaptain Roderick stands beside you at the battlements, his weathered face showing the first signs of hope you've seen in months. \"Look there,\" he points toward the valley floor, where the king's golden standard advances steadily. \"Malthraxus is finally beaten. Three years of hell, but we've broken them at last.\"\n\nThe sounds of battle drift up from below - the clash of steel, the war cries of charging cavalry, the thunderous impact of magical artillery. But something feels wrong. The enemy retreat is too organized, too purposeful. They're not fleeing in panic - they're converging.",
  sceneAssets: [
    "captain-roderick",
    "fortress-valenhall",
    "king-aldric",
    "thorndale-valley",
  ],
  gmNotes: [
    {
      type: "paragraph",
      content:
        "Setting the Victory: Emphasize that this should be a moment of triumph. The characters have witnessed three years of brutal warfare, and victory seems finally at hand. Make them feel the relief and hope of the defenders before pulling it away:",
    },
    {
      type: "list",
      title: "Victory Indicators:",
      items: [
        "The enemy forces are in clear retreat across multiple fronts",
        "King Aldric himself leads the final charge, his presence inspiring the troops",
        "The fortress defenders are celebrating, some already talking about going home",
        "Messages arrive reporting successful advances on all fronts",
      ],
    },
    {
      type: "paragraph",
      content:
        "Character Interactions: Use this peaceful moment for characters to discuss their role in the war and what victory means to them, plans for after the war ends, observations about the tactical situation below, and relationships with NPCs like Captain Roderick and the fortress staff.",
    },
    {
      type: "list",
      title: "Simple D6 Checks:",
      items: [
        "Notice (Easy): The enemy retreat seems unusually organized",
        "Military Tactics (Moderate): The converging retreat pattern is strategically purposeful",
        "Magic Theory (Hard): The strange shimmer in the air around the obsidian tower",
        "Intuition (Very Easy): Something feels terribly wrong despite the apparent victory",
      ],
    },
    {
      type: "callout",
      title: "The Convergence",
      content:
        "As the scene progresses, make it clear that something ominous is happening. The obsidian tower that sprouted from the battlefield's heart pulses with dark energy, its surface crawling with runes that hurt to look at directly. The retreating enemy forces aren't fleeing - they're forming a vast circle around the tower, their movements precise and ritualistic.",
    },
  ],
};

// Mock asset data
const mockAssets = {
  sceneAssets: [
    {
      id: "captain-roderick",
      name: "Captain Roderick",
      type: "character",
      description:
        "Weathered fortress commander with decades of military experience",
      imageUrl:
        "https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Captain",
    },
    {
      id: "fortress-valenhall",
      name: "Fortress Valenhall",
      type: "location",
      description: "Ancient stronghold with protective magical wards",
      imageUrl:
        "https://via.placeholder.com/300x400/059669/FFFFFF?text=Fortress",
    },
    {
      id: "king-aldric",
      name: "King Aldric",
      type: "character",
      description: "Noble ruler leading the final charge against darkness",
      imageUrl: "https://via.placeholder.com/300x400/DC2626/FFFFFF?text=King",
    },
    {
      id: "thorndale-valley",
      name: "Thorndale Valley",
      type: "location",
      description: "The battlefield where the final confrontation takes place",
      imageUrl: "https://via.placeholder.com/300x400/D97706/FFFFFF?text=Valley",
    },
  ],
  allAdventureAssets: [
    // Scene assets plus additional ones
    {
      id: "sir-marcus-brightblade",
      name: "Sir Marcus Brightblade",
      type: "character",
      description: "Young knight seeking to prove his honor",
      imageUrl: "https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Knight",
    },
    {
      id: "void-general",
      name: "The Void General",
      type: "creature",
      description: "What King Aldric becomes when corrupted",
      imageUrl: "https://via.placeholder.com/300x400/991B1B/FFFFFF?text=Void",
    },
    {
      id: "ancient-wards",
      name: "Ancient Protective Wards",
      type: "item",
      description: "Magical defenses built into Valenhall's foundations",
      imageUrl: "https://via.placeholder.com/300x400/0369A1/FFFFFF?text=Wards",
    },
  ],
};

// Mock navigation context
const mockNavigation = {
  currentScene: 1,
  totalScenes: 12,
  episode: {
    id: "episode-1",
    title: "The Final Battle",
    sceneNumber: 1,
    totalInEpisode: 4,
  },
  hasNext: true,
  hasPrev: false,
};

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

interface GMNote {
  type: "paragraph" | "list" | "callout";
  title?: string;
  content?: string;
  items?: string[];
}

interface Asset {
  id: string;
  name: string;
  type: "character" | "creature" | "location" | "item";
  description: string;
  imageUrl: string;
}

interface SceneData {
  id: string;
  adventureId: string;
  episodeId: string;
  title: string;
  image?: string;
  prose: string;
  sceneAssets: string[];
  gmNotes: GMNote[];
}

interface AdventureScenePageProps {
  sceneData?: SceneData;
  navigation?: typeof mockNavigation;
  onNextScene?: () => void;
  onPrevScene?: () => void;
  onBackToTitle?: () => void;
}

function GMNoteItem({ note }: { note: GMNote }) {
  switch (note.type) {
    case "paragraph":
      return (
        <div className="prose max-w-none">
          <p className="text-muted-foreground">{note.content}</p>
        </div>
      );

    case "list":
      return (
        <div>
          {note.title && (
            <h4 className="font-semibold text-foreground mb-2">{note.title}</h4>
          )}
          <ul className="space-y-1 text-muted-foreground">
            {note.items?.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "callout":
      return (
        <Card variant="feature" className="bg-accent/5 border border-accent/20">
          <CardContent className="p-4">
            {note.title && (
              <h4 className="font-semibold text-foreground mb-2">
                {note.title}
              </h4>
            )}
            <p className="text-muted-foreground italic">{note.content}</p>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}

function AssetCard({
  asset,
  size = "normal",
}: {
  asset: Asset;
  size?: "normal" | "small";
}) {
  if (size === "small") {
    return (
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{asset.name}</h4>
            <Badge variant={assetTypeColors[asset.type]} size="sm">
              {asset.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {asset.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="aspect-[3/4] bg-muted">
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={assetTypeColors[asset.type]} size="sm">
            {asset.type}
          </Badge>
        </div>
        <h4 className="font-medium mb-2">{asset.name}</h4>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {asset.description}
        </p>
      </div>
    </div>
  );
}

function AllAssetsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "all" | "character" | "creature" | "location" | "item"
  >("all");

  if (!isOpen) return null;

  const filteredAssets =
    activeTab === "all"
      ? mockAssets.allAdventureAssets
      : mockAssets.allAdventureAssets.filter(
          (asset) => asset.type === activeTab
        );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">Adventure Assets</h2>
            <p className="text-muted-foreground">
              All assets available in this adventure
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(
              ["all", "character", "creature", "location", "item"] as const
            ).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all"
                  ? "All"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
                s
              </Button>
            ))}
          </div>

          {/* Assets Grid */}
          <div className="overflow-y-auto max-h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} size="small" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdventureScenePage({
  sceneData = mockSceneData,
  navigation = mockNavigation,
  onNextScene,
  onPrevScene,
  onBackToTitle,
}: AdventureScenePageProps) {
  const [showAllAssets, setShowAllAssets] = useState(false);

  const sceneAssets = mockAssets.sceneAssets.filter((asset) =>
    sceneData.sceneAssets.includes(asset.id)
  );

  const [showDiceRoller, setShowDiceRoller] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Scene Info - Always at top */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="fantasy" size="sm">
                Episode {navigation.episode.sceneNumber}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {navigation.episode.title}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{sceneData.title}</h1>
            <p className="text-sm text-muted-foreground">
              Scene {navigation.currentScene} of {navigation.totalScenes}
            </p>
          </div>

          {/* Navigation Controls - Below on separate row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={ChevronLeft}
                onClick={onPrevScene}
                disabled={!navigation.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={ChevronRight}
                onClick={onNextScene}
                disabled={!navigation.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Scene Image */}
        {sceneData.image && (
          <div className="h-32 rounded-lg overflow-hidden bg-muted">
            <img
              src={sceneData.image}
              alt={sceneData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Read-Aloud Prose */}
        <Card variant="feature" className="bg-accent/5 border border-accent/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold">Scene Description</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Read aloud to your players
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {sceneData.prose.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout for GM Notes and Assets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GM Notes - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">GM Notes</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Running this scene
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sceneData.gmNotes.map((note, index) => (
                    <GMNoteItem key={index} note={note} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Assets and Actions */}
          <div className="space-y-6">
            {/* Scene Assets */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-semibold">Scene Assets</h3>
                  </div>
                  <Badge variant="outline" size="sm">
                    {sceneAssets.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Key assets for this scene
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sceneAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} size="small" />
                  ))}
                </div>
                <div className="pt-4 border-t border-border mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowAllAssets(true)}
                  >
                    View All Adventure Assets
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="ghost" className="border border-border">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Dice6 className="h-4 w-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Dice6}
                    className="w-full justify-start"
                    onClick={() => setShowDiceRoller(true)}
                  >
                    Roll Dice
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Users}
                    className="w-full justify-start"
                  >
                    Manage Players
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              leftIcon={ChevronLeft}
              onClick={onPrevScene}
              disabled={!navigation.hasPrev}
            >
              Previous Scene
            </Button>
            <Button
              variant="primary"
              rightIcon={ChevronRight}
              onClick={onNextScene}
              disabled={!navigation.hasNext}
            >
              {navigation.hasNext ? "Next Scene" : "Epilogue"}
            </Button>
          </div>
        </div>
      </div>

      {/* All Assets Modal */}
      <AllAssetsModal
        isOpen={showAllAssets}
        onClose={() => setShowAllAssets(false)}
      />
      {/* Dice Roller Modal */}
      <DiceRoller
        isOpen={showDiceRoller}
        onClose={() => setShowDiceRoller(false)}
      />
    </div>
  );
}
