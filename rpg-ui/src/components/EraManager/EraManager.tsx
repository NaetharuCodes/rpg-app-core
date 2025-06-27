import { useState } from "react";
import { Plus, GripVertical, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { worldEraService, type WorldEra } from "@/services/api";

interface EraManagerProps {
  worldId: number;
  eras: WorldEra[];
  onErasChange: (eras: WorldEra[]) => void;
}

export function EraManager({ worldId, eras, onErasChange }: EraManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newEraName, setNewEraName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddEra = async () => {
    if (!newEraName.trim()) return;

    try {
      const newEra = await worldEraService.create(worldId, {
        name: newEraName.trim(),
        sort_order: eras.length,
      });
      onErasChange([...eras, newEra]);
      setNewEraName("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to create era:", error);
      alert("Failed to create era. Please try again.");
    }
  };

  const handleEditEra = async (era: WorldEra) => {
    if (!editingName.trim()) return;

    try {
      const updated = await worldEraService.update(worldId, era.id, {
        name: editingName.trim(),
      });
      onErasChange(eras.map((e) => (e.id === era.id ? updated : e)));
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Failed to update era:", error);
      alert("Failed to update era. Please try again.");
    }
  };

  const handleDeleteEra = async (era: WorldEra) => {
    if (
      !confirm(
        `Are you sure you want to delete "${era.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await worldEraService.delete(worldId, era.id);
      onErasChange(eras.filter((e) => e.id !== era.id));
    } catch (error) {
      console.error("Failed to delete era:", error);
      alert("Failed to delete era. Please try again.");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newEras = [...eras];
    const draggedEra = newEras[draggedIndex];
    newEras.splice(draggedIndex, 1);
    newEras.splice(dropIndex, 0, draggedEra);

    // Update sort orders
    const updatedEras = newEras.map((era, index) => ({
      ...era,
      sort_order: index,
    }));

    try {
      const reorderedEras = await worldEraService.reorder(
        worldId,
        updatedEras.map((era) => era.id)
      );
      onErasChange(reorderedEras);
    } catch (error) {
      console.error("Failed to reorder eras:", error);
      alert("Failed to reorder eras. Please try again.");
    }

    setDraggedIndex(null);
  };

  const startEdit = (era: WorldEra) => {
    setEditingId(era.id);
    setEditingName(era.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="space-y-4">
      {/* Era List */}
      <div className="space-y-2">
        {eras.map((era, index) => (
          <div
            key={era.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors group cursor-move"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />

            <div className="flex-1">
              {editingId === era.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditEra(era);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditEra(era)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <span className="font-medium">{era.name}</span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEdit(era)}
                disabled={editingId !== null}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteEra(era)}
                disabled={editingId !== null}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Era */}
      {isAdding ? (
        <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg">
          <input
            type="text"
            value={newEraName}
            onChange={(e) => setNewEraName(e.target.value)}
            placeholder="Enter era name..."
            className="flex-1 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddEra();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewEraName("");
              }
            }}
            autoFocus
          />
          <Button variant="primary" size="sm" onClick={handleAddEra}>
            <Check className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(false);
              setNewEraName("");
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={Plus}
          onClick={() => setIsAdding(true)}
          disabled={editingId !== null}
        >
          Add Era
        </Button>
      )}

      {eras.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-2">No eras defined yet</p>
          <p className="text-sm">
            Add your first historical era to get started
          </p>
        </div>
      )}
    </div>
  );
}
