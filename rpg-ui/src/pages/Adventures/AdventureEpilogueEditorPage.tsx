import React, { useState } from "react";
import { ArrowLeft, Save, Eye, Edit, Plus, Trash2, Trophy } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { useNavigate, useParams } from "react-router-dom";

// Mock Link component for artifact demo
const Link = ({ to, className, children, ...props }: any) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

interface Outcome {
  id: string;
  title: string;
  description: string;
  details: string;
}

interface FollowUpHook {
  id: string;
  title: string;
  description: string;
}

interface EpilogueData {
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

const defaultEpilogueData: EpilogueData = {
  content: "",
  outcomes: [],
  designerNotes: {
    title: "Designer's Notes",
    content: "",
  },
  followUpHooks: [],
  credits: {
    designer: "",
    system: "Simple D6 RPG System",
    version: "1.0",
    year: new Date().getFullYear().toString(),
  },
};

// Mock existing data
const mockExistingEpilogueData: EpilogueData = {
  content:
    "The aftermath of the Fortress on the Edge of Doom depends greatly on the choices made during the final confrontation and the specific outcome of the heroes' actions. The kingdom's fate now rests on the foundation built by their courage, sacrifice, and determination in the face of cosmic horror.",
  outcomes: [
    {
      id: "outcome-1",
      title: "Complete Victory",
      description:
        "If the characters managed to destroy or redeem the void general while escaping through the portal:",
      details:
        "The void crack in the sky above the Thorndale Valley slowly begins to close over the following weeks. Without the void general's intelligence to coordinate them, the corrupted creatures become disorganized and eventually fade back into nothingness.",
    },
    {
      id: "outcome-2",
      title: "Strategic Withdrawal",
      description:
        "If the characters escaped while the void general remained active:",
      details:
        "The void corruption continues to spread from the Thorndale Valley, though slowly and without the organized direction that would make it immediately catastrophic.",
    },
  ],
  designerNotes: {
    title: "Designer's Notes",
    content:
      "Fortress on the Edge of Doom was designed to showcase the Simple D6 system's ability to handle epic, high-stakes fantasy while maintaining focus on character development and heroic storytelling.",
  },
  followUpHooks: [
    {
      id: "hook-1",
      title: "The Void's Legacy",
      description:
        "Investigate other locations where void magic might have taken hold",
    },
    {
      id: "hook-2",
      title: "Rebuilding the Kingdom",
      description:
        "Help establish new defenses and train the next generation of heroes",
    },
  ],
  credits: {
    designer: "Your RPG Design Team",
    system: "Simple D6 RPG System",
    version: "1.0",
    year: "2025",
  },
};

interface AdventureEpilogueEditorProps {
  adventureId?: string;
  onSave?: (epilogueData: EpilogueData) => void;
  onBack?: () => void;
}

export function AdventureEpilogueEditorPage({
  adventureId,
  onSave,
  onBack,
}: AdventureEpilogueEditorProps) {
  const [epilogueData, setEpilogueData] = useState<EpilogueData>(() =>
    adventureId ? mockExistingEpilogueData : defaultEpilogueData
  );

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [previewMode, setPreviewMode] = useState(false);

  const handleBackToOverview = () => {
    navigate(`/adventures/${id}/edit`);
  };

  const handleSave = () => {
    onSave?.(epilogueData);
    alert("Epilogue saved!");
  };

  const addOutcome = () => {
    const newOutcome: Outcome = {
      id: `outcome-${Date.now()}`,
      title: "",
      description: "",
      details: "",
    };
    setEpilogueData((prev) => ({
      ...prev,
      outcomes: [...prev.outcomes, newOutcome],
    }));
  };

  const updateOutcome = (id: string, field: keyof Outcome, value: string) => {
    setEpilogueData((prev) => ({
      ...prev,
      outcomes: prev.outcomes.map((outcome) =>
        outcome.id === id ? { ...outcome, [field]: value } : outcome
      ),
    }));
  };

  const deleteOutcome = (id: string) => {
    if (confirm("Are you sure you want to delete this outcome?")) {
      setEpilogueData((prev) => ({
        ...prev,
        outcomes: prev.outcomes.filter((outcome) => outcome.id !== id),
      }));
    }
  };

  const addFollowUpHook = () => {
    const newHook: FollowUpHook = {
      id: `hook-${Date.now()}`,
      title: "",
      description: "",
    };
    setEpilogueData((prev) => ({
      ...prev,
      followUpHooks: [...prev.followUpHooks, newHook],
    }));
  };

  const updateFollowUpHook = (
    id: string,
    field: keyof FollowUpHook,
    value: string
  ) => {
    setEpilogueData((prev) => ({
      ...prev,
      followUpHooks: prev.followUpHooks.map((hook) =>
        hook.id === id ? { ...hook, [field]: value } : hook
      ),
    }));
  };

  const deleteFollowUpHook = (id: string) => {
    if (confirm("Are you sure you want to delete this follow-up hook?")) {
      setEpilogueData((prev) => ({
        ...prev,
        followUpHooks: prev.followUpHooks.filter((hook) => hook.id !== id),
      }));
    }
  };

  if (previewMode) {
    // Preview Mode - Shows how the epilogue will look to players
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  leftIcon={Edit}
                  onClick={() => setPreviewMode(false)}
                >
                  Back to Editor
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Epilogue Preview</h1>
                  <p className="text-sm text-muted-foreground">
                    How players will see your epilogue
                  </p>
                </div>
              </div>
              <Button variant="primary" leftIcon={Save} onClick={handleSave}>
                Save Epilogue
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content - Similar to AdventureEpiloguePage */}
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b border-border bg-card">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="fantasy" icon={Trophy}>
                      Adventure Complete
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold">Epilogue</h1>
                  <p className="text-muted-foreground mt-1">
                    The conclusion of your epic adventure
                  </p>
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
                {epilogueData.content && (
                  <Card
                    variant="feature"
                    className="bg-accent/5 border border-accent/20"
                  >
                    <CardContent className="p-6">
                      <div className="prose max-w-none text-muted-foreground">
                        {epilogueData.content
                          .split("\n")
                          .map((paragraph, index) => (
                            <p key={index} className="mb-4">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Possible Outcomes */}
                {epilogueData.outcomes.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6">
                      Possible Outcomes
                    </h2>
                    <div className="space-y-6">
                      {epilogueData.outcomes.map((outcome) => (
                        <Card key={outcome.id} variant="elevated">
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
                )}

                {/* Designer's Notes */}
                {epilogueData.designerNotes.content && (
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
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Follow-up Adventure Hooks */}
                {epilogueData.followUpHooks.length > 0 && (
                  <Card variant="elevated">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Continue the Story
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Potential follow-up adventures
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {epilogueData.followUpHooks.map((hook) => (
                          <div
                            key={hook.id}
                            className="p-3 bg-muted/30 rounded-lg"
                          >
                            <h4 className="font-medium text-sm mb-1">
                              {hook.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {hook.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editor Mode
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={handleBackToOverview}
              >
                Back to Overview
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Epilogue</h1>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Modify your adventure conclusion"
                    : "Create your adventure conclusion"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                leftIcon={Eye}
                onClick={() => setPreviewMode(true)}
              >
                Preview
              </Button>
              <Button variant="primary" leftIcon={Save} onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Introduction</h2>
                <p className="text-sm text-muted-foreground">
                  Opening text that sets up the epilogue
                </p>
              </CardHeader>
              <CardContent>
                <textarea
                  value={epilogueData.content}
                  onChange={(e) =>
                    setEpilogueData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Describe how the adventure's conclusion depends on the heroes' choices and actions..."
                />
              </CardContent>
            </Card>

            {/* Possible Outcomes */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Possible Outcomes</h2>
                    <p className="text-sm text-muted-foreground">
                      Different endings based on player choices
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    leftIcon={Plus}
                    onClick={addOutcome}
                  >
                    Add Outcome
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {epilogueData.outcomes.length > 0 ? (
                  <div className="space-y-6">
                    {epilogueData.outcomes.map((outcome, index) => (
                      <div
                        key={outcome.id}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Outcome {index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={Trash2}
                            onClick={() => deleteOutcome(outcome.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={outcome.title}
                              onChange={(e) =>
                                updateOutcome(
                                  outcome.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="e.g., Complete Victory"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Condition
                            </label>
                            <input
                              type="text"
                              value={outcome.description}
                              onChange={(e) =>
                                updateOutcome(
                                  outcome.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="When this outcome occurs..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Details
                            </label>
                            <textarea
                              value={outcome.details}
                              onChange={(e) =>
                                updateOutcome(
                                  outcome.id,
                                  "details",
                                  e.target.value
                                )
                              }
                              rows={4}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Describe what happens in this outcome..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No outcomes added yet
                    </p>
                    <Button
                      variant="secondary"
                      leftIcon={Plus}
                      onClick={addOutcome}
                    >
                      Add Your First Outcome
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Designer's Notes */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Designer's Notes</h2>
                <p className="text-sm text-muted-foreground">
                  Insights about the adventure's design and themes
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={epilogueData.designerNotes.title}
                      onChange={(e) =>
                        setEpilogueData((prev) => ({
                          ...prev,
                          designerNotes: {
                            ...prev.designerNotes,
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Designer's Notes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content
                    </label>
                    <textarea
                      value={epilogueData.designerNotes.content}
                      onChange={(e) =>
                        setEpilogueData((prev) => ({
                          ...prev,
                          designerNotes: {
                            ...prev.designerNotes,
                            content: e.target.value,
                          },
                        }))
                      }
                      rows={6}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Share insights about your adventure's design, themes, and intended experience..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Hooks */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Follow-up Adventure Hooks
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Optional ideas for continuing the story
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    leftIcon={Plus}
                    onClick={addFollowUpHook}
                  >
                    Add Hook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {epilogueData.followUpHooks.length > 0 ? (
                  <div className="space-y-4">
                    {epilogueData.followUpHooks.map((hook, index) => (
                      <div
                        key={hook.id}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Hook {index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={Trash2}
                            onClick={() => deleteFollowUpHook(hook.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={hook.title}
                              onChange={(e) =>
                                updateFollowUpHook(
                                  hook.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="e.g., The Void's Legacy"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Description
                            </label>
                            <textarea
                              value={hook.description}
                              onChange={(e) =>
                                updateFollowUpHook(
                                  hook.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Brief description of the follow-up adventure idea..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No follow-up hooks added yet
                    </p>
                    <Button
                      variant="secondary"
                      leftIcon={Plus}
                      onClick={addFollowUpHook}
                    >
                      Add Your First Hook
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credits */}
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-semibold">Credits</h2>
                <p className="text-sm text-muted-foreground">
                  Adventure authorship information
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Designer
                    </label>
                    <input
                      type="text"
                      value={epilogueData.credits.designer}
                      onChange={(e) =>
                        setEpilogueData((prev) => ({
                          ...prev,
                          credits: {
                            ...prev.credits,
                            designer: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name or team"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      System
                    </label>
                    <input
                      type="text"
                      value={epilogueData.credits.system}
                      onChange={(e) =>
                        setEpilogueData((prev) => ({
                          ...prev,
                          credits: {
                            ...prev.credits,
                            system: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Simple D6 RPG System"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Version
                    </label>
                    <input
                      type="text"
                      value={epilogueData.credits.version}
                      onChange={(e) =>
                        setEpilogueData((prev) => ({
                          ...prev,
                          credits: {
                            ...prev.credits,
                            version: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="1.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      value={epilogueData.credits.year}
                      onChange={(e) =>
                        setEpilogueData((prev) => ({
                          ...prev,
                          credits: {
                            ...prev.credits,
                            year: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="2025"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold">Epilogue Preview</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">Epilogue</h4>
                    {epilogueData.content && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                        {epilogueData.content}
                      </p>
                    )}
                  </div>

                  {epilogueData.outcomes.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">
                        Outcomes ({epilogueData.outcomes.length})
                      </h5>
                      <div className="space-y-2">
                        {epilogueData.outcomes.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{epilogueData.outcomes.length - 3} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {epilogueData.followUpHooks.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">
                        Follow-up Hooks ({epilogueData.followUpHooks.length})
                      </h5>
                      <div className="space-y-1">
                        {epilogueData.followUpHooks.slice(0, 2).map((hook) => (
                          <div key={hook.id} className="text-xs">
                            <span className="font-medium">
                              {hook.title || "Untitled"}
                            </span>
                          </div>
                        ))}
                        {epilogueData.followUpHooks.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{epilogueData.followUpHooks.length - 2} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {epilogueData.credits.designer && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-sm mb-2">Credits</h5>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Designer: {epilogueData.credits.designer}</div>
                        <div>System: {epilogueData.credits.system}</div>
                        <div>
                          Version {epilogueData.credits.version} (
                          {epilogueData.credits.year})
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card variant="ghost" className="border border-border">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Writing Tips</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Introduction:</strong>{" "}
                    Set up how the ending depends on player choices and actions.
                  </div>
                  <div>
                    <strong className="text-foreground">Outcomes:</strong> Cover
                    major story branches based on key decisions and successes.
                  </div>
                  <div>
                    <strong className="text-foreground">Designer Notes:</strong>{" "}
                    Share your design philosophy and intended experience.
                  </div>
                  <div>
                    <strong className="text-foreground">
                      Follow-up Hooks:
                    </strong>{" "}
                    Plant seeds for future adventures in your world.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
