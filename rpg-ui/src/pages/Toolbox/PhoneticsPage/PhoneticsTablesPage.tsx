import { useState, useEffect } from "react";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";
import { phoneticService, type PhoneticTable } from "@/services/api";

interface NameGeneratorProps {
  table: PhoneticTable;
  onBack: () => void;
}

function NameGenerator({ table, onBack }: NameGeneratorProps) {
  const [syllables, setSyllables] = useState<PhoneticSyllable[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"manual" | "random">("random");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  // Manual mode state
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedMiddles, setSelectedMiddles] = useState<string[]>([]);
  const [selectedEnd, setSelectedEnd] = useState("");

  useEffect(() => {
    fetchTableDetails();
  }, [table.id]);

  const fetchTableDetails = async () => {
    try {
      const fullTable = await phoneticService.getById(table.id);
      setSyllables(fullTable.syllables || []);
    } catch (error) {
      console.error("Failed to fetch table details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSyllablesByPosition = (position: number) => {
    return syllables.filter((s) => s.position === position);
  };

  const generateRandomName = async () => {
    try {
      const result = await phoneticService.generateName(table.id);
      setGeneratedNames((prev) => [result.name, ...prev.slice(0, 9)]); // Keep last 10
    } catch (error) {
      console.error("Failed to generate name:", error);
    }
  };

  const generateManualName = () => {
    if (!selectedStart || !selectedEnd) return;

    const name = selectedStart + selectedMiddles.join("") + selectedEnd;
    setGeneratedNames((prev) => [name, ...prev.slice(0, 9)]);
  };

  const addMiddleSyllable = (syllable: string) => {
    setSelectedMiddles((prev) => [...prev, syllable]);
  };

  const removeMiddleSyllable = (index: number) => {
    setSelectedMiddles((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="text-center">Loading generator...</div>;
  }

  const starts = getSyllablesByPosition(0);
  const middles = getSyllablesByPosition(1);
  const ends = getSyllablesByPosition(2);

  const canGenerate = starts.length > 0 && ends.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          ← Back to Tables
        </button>
        <div>
          <h1 className="text-3xl font-bold">Name Generator</h1>
          <p className="text-muted-foreground">Using: {table.name}</p>
        </div>
      </div>

      {!canGenerate ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Table Not Ready
          </h3>
          <p className="text-yellow-700">
            This table needs at least one word start and one word ending
            syllable to generate names.
          </p>
        </div>
      ) : (
        <>
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("random")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "random"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Random Generator
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "manual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Manual Builder
            </button>
          </div>

          {/* Generator Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Generator */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                {mode === "random" ? "Random Generator" : "Manual Builder"}
              </h2>

              {mode === "random" ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Generate random names using all syllables from this table
                  </p>
                  <button
                    onClick={generateRandomName}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
                  >
                    Generate Random Name
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Start Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Word Start *
                    </label>
                    <select
                      value={selectedStart}
                      onChange={(e) => setSelectedStart(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Choose a start...</option>
                      {starts.map((s) => (
                        <option key={s.id} value={s.syllable}>
                          {s.syllable}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Middle Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Word Middles (optional)
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addMiddleSyllable(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="w-full border rounded-lg px-3 py-2 mb-2"
                    >
                      <option value="">Add a middle syllable...</option>
                      {middles.map((s) => (
                        <option key={s.id} value={s.syllable}>
                          {s.syllable}
                        </option>
                      ))}
                    </select>
                    {selectedMiddles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedMiddles.map((syllable, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                          >
                            {syllable}
                            <button
                              onClick={() => removeMiddleSyllable(index)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* End Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Word End *
                    </label>
                    <select
                      value={selectedEnd}
                      onChange={(e) => setSelectedEnd(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Choose an ending...</option>
                      {ends.map((s) => (
                        <option key={s.id} value={s.syllable}>
                          {s.syllable}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preview */}
                  {selectedStart && selectedEnd && (
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">
                        Preview:
                      </div>
                      <div className="font-mono text-lg">
                        {selectedStart}
                        {selectedMiddles.join("")}
                        {selectedEnd}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={generateManualName}
                    disabled={!selectedStart || !selectedEnd}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Name
                  </button>
                </div>
              )}
            </div>

            {/* Right: Generated Names */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Generated Names</h2>

              {generatedNames.length === 0 ? (
                <p className="text-muted-foreground italic">
                  No names generated yet. Use the generator to create some!
                </p>
              ) : (
                <div className="space-y-2">
                  {generatedNames.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-secondary rounded px-3 py-2"
                    >
                      <span className="font-mono text-lg">{name}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(name)}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface TableEditorProps {
  table: PhoneticTable;
  onBack: () => void;
  onUpdate: () => void;
}

function TableEditor({ table, onBack, onUpdate }: TableEditorProps) {
  const [syllables, setSyllables] = useState<PhoneticSyllable[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSyllable, setNewSyllable] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(0);

  useEffect(() => {
    fetchTableDetails();
  }, [table.id]);

  const fetchTableDetails = async () => {
    try {
      const fullTable = await phoneticService.getById(table.id);
      setSyllables(fullTable.syllables || []);
    } catch (error) {
      console.error("Failed to fetch table details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSyllable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSyllable.trim()) return;

    try {
      const syllable = await phoneticService.addSyllable(table.id, {
        syllable: newSyllable.trim(),
        position: selectedPosition,
      });
      setSyllables((prev) => [...prev, syllable]);
      setNewSyllable("");
      onUpdate();
    } catch (error) {
      console.error("Failed to add syllable:", error);
    }
  };

  const handleDeleteSyllable = async (syllableId: number) => {
    try {
      await phoneticService.deleteSyllable(table.id, syllableId);
      setSyllables((prev) => prev.filter((s) => s.id !== syllableId));
      onUpdate();
    } catch (error) {
      console.error("Failed to delete syllable:", error);
    }
  };

  const getSyllablesByPosition = (position: number) => {
    return syllables.filter((s) => s.position === position);
  };

  const getPositionName = (position: number) => {
    switch (position) {
      case 0:
        return "Word Starts";
      case 1:
        return "Word Middles";
      case 2:
        return "Word Endings";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return <div className="text-center">Loading table details...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          ← Back to Tables
        </button>
        <div>
          <h1 className="text-3xl font-bold">{table.name}</h1>
          {table.description && (
            <p className="text-muted-foreground">{table.description}</p>
          )}
        </div>
      </div>

      {/* Add Syllable Form */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Syllable</h2>
        <form onSubmit={handleAddSyllable} className="flex gap-4">
          <input
            type="text"
            value={newSyllable}
            onChange={(e) => setNewSyllable(e.target.value)}
            placeholder="Enter syllable (e.g., 'th', 'ar', 'ing')"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(parseInt(e.target.value))}
            className="border rounded-lg px-3 py-2 min-w-32"
          >
            <option value={0}>Word Start</option>
            <option value={1}>Word Middle</option>
            <option value={2}>Word End</option>
          </select>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      {/* Syllables by Position */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((position) => (
          <div key={position} className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">
              {getPositionName(position)}
            </h3>

            <div className="space-y-2">
              {getSyllablesByPosition(position).length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No syllables yet. Add some above!
                </p>
              ) : (
                getSyllablesByPosition(position).map((syllable) => (
                  <div
                    key={syllable.id}
                    className="flex items-center justify-between bg-secondary rounded px-3 py-2"
                  >
                    <span className="font-mono">{syllable.syllable}</span>
                    <button
                      onClick={() => handleDeleteSyllable(syllable.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              {getSyllablesByPosition(position).length} syllables
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CreateTableModalProps {
  onSubmit: (name: string, description: string) => void;
  onCancel: () => void;
}

function CreateTableModal({ onSubmit, onCancel }: CreateTableModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Phonetic Table</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Table Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., Elvish Names, Draconic Terms"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 h-20 resize-none"
              placeholder="Optional description of what this table is used for..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TablesListProps {
  tables: PhoneticTable[];
  onEdit: (table: PhoneticTable) => void;
  onGenerate: (table: PhoneticTable) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  canEdit: (table: PhoneticTable) => boolean;
}

function TablesList({
  tables,
  onEdit,
  onGenerate,
  onDelete,
  onCreate,
  canEdit,
}: TablesListProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Phonetic Tables</h1>
          <p className="text-muted-foreground mt-1">
            Create consistent names and words for your RPG worlds
          </p>
        </div>
        <button
          onClick={onCreate}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create New Table
        </button>
      </div>

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No phonetic tables yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first table to start generating consistent names
          </p>
          <button
            onClick={onCreate}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Your First Table
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div key={table.id} className="border rounded-lg p-6 bg-card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{table.name}</h3>
                {table.is_official && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Official
                  </span>
                )}
              </div>

              {table.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {table.description}
                </p>
              )}

              <div className="text-xs text-muted-foreground mb-4">
                {table.syllables ? (
                  <span>
                    {table.syllables.filter((s) => s.position === 0).length}{" "}
                    starts,{" "}
                    {table.syllables.filter((s) => s.position === 1).length}{" "}
                    middles,{" "}
                    {table.syllables.filter((s) => s.position === 2).length}{" "}
                    ends
                  </span>
                ) : (
                  <span>No syllables yet</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onGenerate(table)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Generate
                </button>

                {canEdit(table) && (
                  <>
                    <button
                      onClick={() => onEdit(table)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(table.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PhoneticTablesPage() {
  const [tables, setTables] = useState<PhoneticTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<PhoneticTable | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "editor" | "generator">("list");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await phoneticService.getAll();
      setTables(data);
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (name: string, description: string) => {
    try {
      const newTable = await phoneticService.create({ name, description });
      setTables((prev) => [newTable, ...prev]);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create table:", error);
    }
  };

  const handleDeleteTable = async (id: number) => {
    try {
      await phoneticService.delete(id);
      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete table:", error);
    }
  };

  if (loading) {
    return (
      <Section>
        <div className="text-center">Loading phonetic tables...</div>
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Section>
        {view === "list" && (
          <TablesList
            tables={tables}
            onEdit={(table) => {
              setSelectedTable(table);
              setView("editor");
            }}
            onGenerate={(table) => {
              setSelectedTable(table);
              setView("generator");
            }}
            onDelete={handleDeleteTable}
            onCreate={() => setShowCreateForm(true)}
            canEdit={(table) => user && table.user_id === user.id}
          />
        )}

        {view === "editor" && selectedTable && (
          <TableEditor
            table={selectedTable}
            onBack={() => setView("list")}
            onUpdate={fetchTables}
          />
        )}

        {view === "generator" && selectedTable && (
          <NameGenerator table={selectedTable} onBack={() => setView("list")} />
        )}

        {showCreateForm && (
          <CreateTableModal
            onSubmit={handleCreateTable}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </Section>
    </div>
  );
}
