import React from "react";
import { KanbanTaskCard } from "./KanbanTaskCard";
import styles from "./Kanban.module.css";

interface Task {
  id: number;
  name: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  created_at: string;
  updated_at: string;
}

interface KanbanColumnProps {
  title: string;
  status: Task["status"];
  color: string;
  tasks: Task[];
  onMoveTask: (taskId: number, newStatus: Task["status"]) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

export function KanbanColumn({
  title,
  status,
  color,
  tasks,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const [dragOver, setDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    onMoveTask(taskId, status);
  };

  return (
    <div
      className={styles.kanbanColumn}
      style={{ "--column-color": color } as React.CSSProperties}
    >
      <div className={styles.kanbanColumnHeader}>
        <h4 className={styles.kanbanColumnTitle}>{title}</h4>
        <span className={styles.kanbanColumnCount}>{tasks.length}</span>
      </div>

      <div
        className={`${styles.kanbanDropZone} ${dragOver ? styles.dragOver : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div className={styles.kanbanDropZoneEmpty}>Drop tasks here</div>
        ) : (
          tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
