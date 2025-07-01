import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/Button/Button";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { Badge } from "@/components/Badge/Badge";

interface NPC {
  id: number;
  name: string;
  age: number;
  gender: string;
  profession: string;
  social_class: string;
  personality: string;
  location?: {
    name: string;
  };
  memberships?: {
    organization: {
      name: string;
    };
    rank: {
      title: string;
    };
  }[];
}

export function WorldNPCsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerationModal, setShowGenerationModal] = useState(false);

  useEffect(() => {
    const fetchNPCs = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:8080/worlds/${id}/npcs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setNpcs(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch NPCs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNPCs();
  }, [id]);

  const handleGenerateNPCs = async (config: any) => {
    if (!id) return;

    try {
      const response = await fetch(
        `http://localhost:8080/worlds/${id}/generate-npcs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(config),
        }
      );

      if (response.ok) {
        window.location.reload(); // Simple refresh
      }
    } catch (error) {
      console.error("Failed to generate NPCs:", error);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading NPCs...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/worlds/${id}`)}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  👥 NPCs ({npcs.length})
                </h1>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setShowGenerationModal(true)}
            >
              ⚡ Generate NPCs
            </Button>
          </div>
        </div>
      </div>

      {/* NPC List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {npcs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No NPCs Yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate some NPCs to get started!
              </p>
              <Button
                variant="primary"
                onClick={() => setShowGenerationModal(true)}
              >
                ⚡ Generate NPCs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {npcs.map((npc) => (
              <Card key={npc.id}>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold">{npc.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {npc.age} year old {npc.gender} {npc.profession}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge>{npc.social_class.replace("_", " ")}</Badge>

                  {npc.location && (
                    <p className="text-sm">📍 {npc.location.name}</p>
                  )}

                  <p className="text-sm">
                    <strong>Personality:</strong> {npc.personality}
                  </p>

                  {npc.memberships && npc.memberships.length > 0 && (
                    <div className="text-sm">
                      <strong>Organizations:</strong>
                      {npc.memberships.map((membership, i) => (
                        <div key={i} className="ml-2">
                          • {membership.organization.name} (
                          {membership.rank.title})
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Simple Generation Modal */}
      {showGenerationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <h2 className="text-xl font-bold">Generate NPCs</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={() =>
                    handleGenerateNPCs({
                      population_size: 30,
                      organization_count: 3,
                      family_density: 0.4,
                      seed: Date.now(),
                    })
                  }
                  className="w-full"
                >
                  Generate 30 NPCs (Default)
                </Button>

                <Button
                  onClick={() =>
                    handleGenerateNPCs({
                      population_size: 10,
                      organization_count: 2,
                      family_density: 0.3,
                      seed: Date.now(),
                    })
                  }
                  className="w-full"
                >
                  Generate 10 NPCs (Small)
                </Button>

                <Button
                  onClick={() => setShowGenerationModal(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
