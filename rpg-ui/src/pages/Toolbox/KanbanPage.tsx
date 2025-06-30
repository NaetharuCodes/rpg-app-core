import { useState, useEffect } from "react";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";
import { KanbanBoard } from "@/components/KanbanBoard/KanbanBoard";

import styles from "@/components/KanbanBoard/Kanban.module.css";
import { KanbanTaskCreateForm } from "@/components/KanbanBoard/KanbanTaskCreateForm";

interface Task {
  id: number;
  name: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  created_at: string;
  updated_at: string;
}

export function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("auth_token"); // Changed to auth_token
      const response = await fetch("http://localhost:8080/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const createTask = async (name: string, description: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          status: "todo",
        }),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [newTask, ...prev]);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  if (loading) {
    return (
      <Section>
        <div className="text-center">Loading...</div>
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Section>
        <KanbanBoard
          tasks={tasks}
          onCreateTask={() => setShowCreateForm(true)}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />

        {/* Modal */}
        {showCreateForm && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowCreateForm(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <KanbanTaskCreateForm
                onSubmit={createTask}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
