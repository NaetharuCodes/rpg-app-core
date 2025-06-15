import React from "react";
import { ArrowRight, Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { SceneAssets } from "@/components/SceneAssets/SceneAssets";
import { mockAssets } from "@/components/mocks/assetMocks";

// Mock data based on your PDF adventure
const mockTitleData = {
  id: "title-page",
  adventureId: "fortress-on-edge-of-doom",
  title: "Fortress on the Edge of Doom",
  subtitle: "A Simple D6 RPG Adventure for 3-5 Players",
  bannerImage:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop",
  introduction:
    "Fortress on the Edge of Doom is an epic high fantasy adventure that focuses on heroism in the face of impossible odds, magical catastrophe, and the desperate defense of reality itself. The Simple D6 system provides quick resolution for action sequences when needed, but the heart of this adventure lies in dramatic storytelling, tactical cooperation, and the mounting tension of a final stand against cosmic horror.",
  background:
    "The Kingdom of Aldenwrath has been locked in a generations-long war against the Dark Lord Malthraxus and his armies of corrupted creatures. For three years, the final campaign has raged across the Thorndale Valley, with King Aldric's forces slowly pushing back the darkness. The ancient fortress of Valenhall, perched on a strategic outcrop overlooking the battlefield, has served as a crucial stronghold and observation post.\n\nWhat neither side anticipated was the Dark Lord's final, desperate gambit. Faced with inevitable defeat, Malthraxus has turned to forbidden void magic - sorcery that tears at the very fabric of reality itself. His plan is catastrophically simple: if he cannot rule the world, he will unmake it entirely, opening a rift to the hungry void that lies between dimensions.",
  prologue:
    "The camera sweeps across a vast battlefield stretching between two mountain ranges. Banners of silver and gold clash against crimson and black as thousands of warriors fight in the valley below. The sun hangs low on the horizon, casting long shadows across a landscape scarred by three years of magical warfare.\n\nAtop a rocky outcrop, the ancient fortress of Valenhall stands sentinel, its weathered gray stones bearing witness to the final battle between Light and Dark. From its battlements, you can see the tide of war clearly - King Aldric's forces, their armor gleaming in the dying light, pressing forward against the Dark Lord's army of twisted creatures and corrupted men.\n\nThunder rolls across the sky, but there are no clouds. The very air crackles with magical energy as powerful sorcerers on both sides weave spells that shake the earth itself. Victory seems at hand for the forces of Light - the Dark Lord's army is in retreat, his banners falling one by one.\n\nBut something is wrong. The retreating enemy forces are converging on a single point in the valley, where a massive obsidian tower has risen from the earth. Dark lightning plays around its peak, and the very air seems to bend and twist around it. The tower pulses with malevolent energy, and with each pulse, the sky grows a little darker...",
  relatedAssets: [
    {
      id: "sir-marcus-brightblade",
      type: "character",
      name: "Sir Marcus Brightblade",
      description: "A young knight seeking to prove his honor",
    },
    {
      id: "captain-roderick",
      type: "character",
      name: "Captain Roderick",
      description: "Weathered fortress commander",
    },
    {
      id: "void-general",
      type: "creature",
      name: "The Void General",
      description: "What King Aldric became",
    },
    {
      id: "fortress-valenhall",
      type: "location",
      name: "Fortress Valenhall",
      description: "Ancient stronghold with protective wards",
    },
  ],
};

const mockStructure = {
  totalScenes: 12,
  episodes: [
    { id: "episode-1", title: "The Final Battle", sceneCount: 4 },
    { id: "episode-2", title: "Holding the Line", sceneCount: 5 },
    { id: "episode-3", title: "Race Against Darkness", sceneCount: 4 },
  ],
};

const assetTypeColors = {
  character: "fantasy",
  creature: "horror",
  location: "scifi",
  item: "mystery",
} as const;

interface AdventureTitlePageProps {
  titleData?: typeof mockTitleData;
  structure?: typeof mockStructure;
  onStartAdventure?: () => void;
}

export function AdventureTitlePage({
  titleData = mockTitleData,
  structure = mockStructure,
  onStartAdventure,
}: AdventureTitlePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner Image and Title */}
      <div className="relative">
        <div
          className="h-80 bg-cover bg-center bg-muted"
          style={{ backgroundImage: `url(${titleData.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-6xl mx-auto px-6 pb-8 w-full">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                {titleData.title}
              </h1>
              <p className="text-xl text-white/90">{titleData.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Adventure Info */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="fantasy" icon={Users}>
                3-5 Players
              </Badge>
              <Badge variant="scifi" icon={Clock}>
                {structure.totalScenes} Scenes
              </Badge>
              <Badge variant="mystery" icon={BookOpen}>
                {structure.episodes.length} Episodes
              </Badge>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Adventure Overview</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {titleData.introduction.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Background */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Background</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {titleData.background.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Prologue */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Opening Scene</h2>
              <Card
                variant="feature"
                className="bg-accent/5 border border-accent/20"
              >
                <CardContent className="p-6">
                  <div className="prose max-w-none text-muted-foreground italic">
                    {titleData.prologue.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Adventure */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-xl font-semibold">Ready to Begin?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start the adventure and navigate through each scene as your
                  story unfolds.
                </p>
                <Button
                  variant="primary"
                  rightIcon={ArrowRight}
                  onClick={onStartAdventure}
                  className="w-full"
                >
                  Start Adventure
                </Button>
              </CardContent>
            </Card>

            {/* Episode Structure */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-xl font-semibold">Episodes</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {structure.episodes.map((episode, index) => (
                    <div
                      key={episode.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">Episode {index + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          {episode.title}
                        </div>
                      </div>
                      <Badge variant="outline" size="sm">
                        {episode.sceneCount} scenes
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <SceneAssets assets={mockAssets} />
          </div>
        </div>
      </div>
    </div>
  );
}
