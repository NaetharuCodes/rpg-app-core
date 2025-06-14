import React from "react";
import {
  ChevronLeft,
  ArrowRight,
  BookOpen,
  Trophy,
  Users,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";

// Mock epilogue data based on your PDF
const mockEpilogueData = {
  id: "epilogue",
  adventureId: "fortress-on-edge-of-doom",
  title: "Epilogue",
  content:
    "The aftermath of the Fortress on the Edge of Doom depends greatly on the choices made during the final confrontation and the specific outcome of the heroes' actions. The kingdom's fate now rests on the foundation built by their courage, sacrifice, and determination in the face of cosmic horror.",
  outcomes: [
    {
      title: "Complete Victory",
      description:
        "If the characters managed to destroy or redeem the void general while escaping through the portal:",
      details:
        "The void crack in the sky above the Thorndale Valley slowly begins to close over the following weeks. Without the void general's intelligence to coordinate them, the corrupted creatures become disorganized and eventually fade back into nothingness. The kingdom mourns its lost army but celebrates the heroes who prevented total catastrophe.\n\nThe Fortress of Valenhall becomes a shrine to the fallen, its ruins maintained as a memorial to those who held the line against cosmic horror. The kingdom's mages study the site extensively, learning new protective magics that will guard against similar threats in the future.",
    },
    {
      title: "Strategic Withdrawal",
      description:
        "If the characters escaped while the void general remained active:",
      details:
        "The void corruption continues to spread from the Thorndale Valley, though slowly and without the organized direction that would make it immediately catastrophic. The kingdom enters a state of siege warfare, establishing defensive lines and evacuation protocols for outlying regions.\n\nThe heroes become instrumental in training new defenders and developing tactics for fighting void-touched creatures. Their firsthand experience with the cosmic horror makes them invaluable advisors to the kingdom's military leadership. A new war begins - one that will test the realm's resilience for generations to come.",
    },
    {
      title: "Pyrrhic Victory",
      description: "If the characters succeeded but at great personal cost:",
      details:
        "The void threat is contained, but the price paid weighs heavily on all involved. Heroes who made the ultimate sacrifice are remembered as legends, their names spoken with reverence throughout the kingdom. Those who survived carry the burden of memory and the responsibility of ensuring such horrors never again threaten the realm.\n\nThe experience fundamentally changes the survivors, marking them as individuals who have looked into the abyss and lived to tell the tale. They become sought-after advisors, teachers, and guardians against threats that conventional forces cannot comprehend.",
    },
  ],
  designerNotes: {
    title: "Designer's Notes",
    content:
      "Fortress on the Edge of Doom was designed to showcase the Simple D6 system's ability to handle epic, high-stakes fantasy while maintaining focus on character development and heroic storytelling. The adventure emphasizes cooperation under pressure, tactical decision-making, and the theme that true victory sometimes requires sacrifice.\n\nThe escalating structure - from hopeful victory to cosmic horror to desperate last stand - was crafted to create maximum dramatic tension while giving players multiple opportunities to shine as heroes. Each character's unique abilities become crucial at different points, ensuring everyone has moments to feel essential to the group's survival.",
  },
  followUpHooks: [
    {
      title: "The Void's Legacy",
      description:
        "Investigate other locations where void magic might have taken hold",
    },
    {
      title: "Rebuilding the Kingdom",
      description:
        "Help establish new defenses and train the next generation of heroes",
    },
    {
      title: "The Missing Survivors",
      description:
        "Search for other fortress garrisons that might have survived the catastrophe",
    },
    {
      title: "Ancient Protections",
      description:
        "Seek out other sites with protective wards similar to Valenhall",
    },
  ],
  credits: {
    designer: "Your RPG Design Team",
    system: "Simple D6 RPG System",
    version: "1.0",
    year: "2025",
  },
};

// Mock navigation context
const mockNavigation = {
  currentScene: 13, // After all scenes
  totalScenes: 12,
  isEpilogue: true,
};

interface Outcome {
  title: string;
  description: string;
  details: string;
}

interface FollowUpHook {
  title: string;
  description: string;
}

interface EpilogueData {
  id: string;
  adventureId: string;
  title: string;
  content: string;
  outcomes: Outcome[];
  designerNotes: {
    title: string;
    content: string;
  };
  followUpHooks: FollowUpHook[];
  credits: {
    designer: string;
    system: string;
    version: string;
    year: string;
  };
}

interface AdventureEpiloguePageProps {
  epilogueData?: EpilogueData;
  navigation?: typeof mockNavigation;
  onPrevScene?: () => void;
  onBackToTitle?: () => void;
  onRestartAdventure?: () => void;
}

export function AdventureEpiloguePage({
  epilogueData = mockEpilogueData,
  navigation = mockNavigation,
  onPrevScene,
  onBackToTitle,
  onRestartAdventure,
}: AdventureEpiloguePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="fantasy" icon={Trophy}>
                  Adventure Complete
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{epilogueData.title}</h1>
              <p className="text-muted-foreground mt-1">
                The conclusion of your epic adventure
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBackToTitle}>
                Adventure Overview
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={ChevronLeft}
                onClick={onPrevScene}
              >
                Previous Scene
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <Card
              variant="feature"
              className="bg-accent/5 border border-accent/20"
            >
              <CardContent className="p-6">
                <div className="prose max-w-none text-muted-foreground">
                  {epilogueData.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Possible Outcomes */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Possible Outcomes</h2>
              <div className="space-y-6">
                {epilogueData.outcomes.map((outcome, index) => (
                  <Card key={index} variant="elevated">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-foreground">
                        {outcome.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {outcome.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none text-muted-foreground">
                        {outcome.details
                          .split("\n")
                          .map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-4">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Designer's Notes */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                {epilogueData.designerNotes.title}
              </h2>
              <Card variant="ghost" className="border border-border">
                <CardContent className="p-6">
                  <div className="prose max-w-none text-muted-foreground">
                    {epilogueData.designerNotes.content
                      .split("\n")
                      .map((paragraph, index) => (
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
            {/* Adventure Actions */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">What's Next?</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    leftIcon={RotateCcw}
                    onClick={onRestartAdventure}
                    className="w-full"
                  >
                    Run Again
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={BookOpen}
                    onClick={onBackToTitle}
                    className="w-full"
                  >
                    Adventure Overview
                  </Button>
                  <Button variant="ghost" leftIcon={Users} className="w-full">
                    Share with Players
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Adventure Hooks */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Continue the Story</h3>
                <p className="text-sm text-muted-foreground">
                  Potential follow-up adventures
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {epilogueData.followUpHooks.map((hook, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{hook.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {hook.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={ArrowRight}
                    className="w-full"
                  >
                    Browse More Adventures
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credits */}
            <Card variant="ghost" className="border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold">Credits</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Designer:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.designer}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">System:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.system}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Version:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.version}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Year:</span>
                    <span className="text-muted-foreground ml-2">
                      {epilogueData.credits.year}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adventure Stats */}
            <Card variant="ghost" className="border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold">Adventure Statistics</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {navigation.totalScenes}
                    </div>
                    <div className="text-xs text-muted-foreground">Scenes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-xs text-muted-foreground">
                      Episodes
                    </div>
                  </div>
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
            <div className="text-sm text-muted-foreground">
              Adventure completed successfully
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                leftIcon={ChevronLeft}
                onClick={onPrevScene}
              >
                Previous Scene
              </Button>
              <Button
                variant="primary"
                leftIcon={BookOpen}
                onClick={onBackToTitle}
              >
                Back to Overview
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Thank you for playing!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
