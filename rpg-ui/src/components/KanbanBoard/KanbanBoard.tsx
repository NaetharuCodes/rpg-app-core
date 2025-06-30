import { KanbanColumn } from "./KanbanColumn";
import { Button } from "@/components/Button/Button";
import styles from "./Kanban.module.css";

interface Task {
  id: number;
  name: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  created_at: string;
  updated_at: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onCreateTask: () => void; // Just opens modal
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

const columns = [
  { id: "todo", title: "INCOMING", status: "todo" as const, color: "#00fff9" },
  {
    id: "in-progress",
    title: "PROCESSING",
    status: "in-progress" as const,
    color: "#ff00c1",
  },
  { id: "done", title: "COMPLETE", status: "done" as const, color: "#00ff00" },
];

export function KanbanBoard({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const getTasksForColumn = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleMoveTask = (taskId: number, newStatus: Task["status"]) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  return (
    <div className={styles.cyberpunkKanban}>
      <div className={styles.kanbanHeader}>
        <h3 className={styles.kanbanTitle}>Task Board</h3>
        <Button onClick={onCreateTask} theme="cyberpunk" variant="primary">
          + New Task
        </Button>
      </div>

      <div className={styles.kanbanGrid}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.status}
            color={column.color}
            tasks={getTasksForColumn(column.status)}
            onMoveTask={handleMoveTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}
