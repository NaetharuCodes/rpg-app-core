import React, { useState } from "react";
import { Button } from "@/components/Button/Button";
import styles from "./Kanban.module.css";

interface KanbanTaskCreateFormProps {
  onSubmit: (name: string, description: string) => void;
  onCancel: () => void;
}

export function KanbanTaskCreateForm({
  onSubmit,
  onCancel,
}: KanbanTaskCreateFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
      setName("");
      setDescription("");
    }
  };

  return (
    <div className={styles.cyberpunkCreateForm}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h4 className={styles.createFormTitle}>Create New Task</h4>
          <button type="button" onClick={onCancel} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label className={styles.cyberpunkLabel}>Task Designation *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.cyberpunkInput}
            placeholder="Enter task designation"
            required
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label className={styles.cyberpunkLabel}>Task Parameters</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.cyberpunkInput}
            rows={4}
            placeholder="Enter task parameters (optional)"
          />
        </div>

        <div className={styles.formActions}>
          <Button type="submit" theme="cyberpunk" variant="primary">
            Initialize Task
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            theme="cyberpunk"
            variant="ghost"
          >
            Abort
          </Button>
        </div>
      </form>
    </div>
  );
}
