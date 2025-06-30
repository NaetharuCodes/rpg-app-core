import React, { useState } from "react";
import styles from "./Kanban.module.css";

interface Task {
  id: number;
  name: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  created_at: string;
  updated_at: string;
}

interface KanbanTaskCardProps {
  task: Task;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

export function KanbanTaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
}: KanbanTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id.toString());
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    onUpdateTask(task.id, {
      name: editName,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(task.name);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.cyberpunkCreateForm}>
        <div style={{ marginBottom: "1rem" }}>
          <label className={styles.cyberpunkLabel}>Task Name</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className={styles.cyberpunkInput}
            placeholder="Enter task name"
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label className={styles.cyberpunkLabel}>Description</label>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className={styles.cyberpunkInput}
            rows={3}
            placeholder="Enter description"
          />
        </div>
        <div className={styles.formActions}>
          <button onClick={handleSave} className={styles.taskCardBtn}>
            Save
          </button>
          <button
            onClick={handleCancel}
            className={`${styles.taskCardBtn} ${styles.delete}`}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.cyberpunkTaskCard} ${isDragging ? styles.dragging : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h5 className={styles.taskCardTitle}>{task.name}</h5>
      {task.description && (
        <p className={styles.taskCardDescription}>{task.description}</p>
      )}

      <div className={styles.taskCardFooter}>
        <span className={styles.taskCardDate}>
          {new Date(task.created_at).toLocaleDateString()}
        </span>
        <div className={styles.taskCardActions}>
          <button
            onClick={() => setIsEditing(true)}
            className={styles.taskCardBtn}
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className={`${styles.taskCardBtn} ${styles.delete}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
