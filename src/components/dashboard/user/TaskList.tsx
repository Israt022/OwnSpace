"use client";

import { CheckCircle2, Plus } from "lucide-react";
import TaskItem from "./TaskItem";
import { TaskResponse } from "@server/types";

interface TaskListProps {
  tasks: TaskResponse[];
  loading: boolean;
  onToggle: (task: TaskResponse) => void;
  onEdit: (task: TaskResponse) => void;
  onDelete: (taskId: string) => void;
  onOpenCreate: () => void;
  hasFilters: boolean;
}

export default function TaskList({
  tasks,
  loading,
  onToggle,
  onEdit,
  onDelete,
  onOpenCreate,
  hasFilters,
}: TaskListProps) {
  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
        <div className="spinner" style={{ margin: "0 auto 1rem" }} />
        Loading your tasks…
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card" style={{ padding: "3.5rem 2rem", textAlign: "center", borderRadius: "1rem" }}>
        <div
          style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "50%",
            background: "var(--muted)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-brand-500)",
            marginBottom: "1rem",
          }}
        >
          <CheckCircle2 size={28} />
        </div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--foreground)" }}>
          {hasFilters ? "No matching tasks found" : "No tasks yet!"}
        </h3>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
          {hasFilters
            ? "Try clearing or adjusting your search keywords and filters."
            : "Get started by adding your first daily goal or task."}
        </p>
        <button
          onClick={onOpenCreate}
          className="hero-btn-primary"
          style={{ padding: "0.6rem 1.35rem", fontSize: "0.875rem" }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
