"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Plus, ArrowRight, CheckCircle2 } from "lucide-react";
import TaskItem from "./TaskItem";
import { TaskResponse, CreateTaskInput } from "@server/types";

interface TodayTasksProps {
  tasks: TaskResponse[];
  onToggle: (task: TaskResponse) => void;
  onEdit: (task: TaskResponse) => void;
  onDelete: (taskId: string) => void;
  onQuickAdd: (title: string) => Promise<void>;
}

export default function TodayTasks({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onQuickAdd,
}: TodayTasksProps) {
  const [quickTitle, setQuickTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    setAdding(true);
    try {
      await onQuickAdd(quickTitle.trim());
      setQuickTitle("");
    } finally {
      setAdding(false);
    }
  };

  const todayTasks = tasks.slice(0, 6);

  return (
    <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
            Today&apos;s Focus & Tasks
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", margin: "0.15rem 0 0" }}>
            Prioritize your daily execution
          </p>
        </div>

        <Link
          href="/dashboard/tasks"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-brand-500)",
            textDecoration: "none",
          }}
        >
          View all tasks <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick Add Input Bar */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <input
          type="text"
          placeholder="Quick add a task for today... (Press Enter)"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          className="input-field"
          style={{ height: "2.5rem", fontSize: "0.875rem" }}
        />
        <button
          type="submit"
          disabled={adding || !quickTitle.trim()}
          className="hero-btn-primary"
          style={{ padding: "0 1rem", height: "2.5rem", fontSize: "0.875rem" }}
          aria-label="Add task"
        >
          <Plus size={16} />
        </button>
      </form>

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {todayTasks.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
            <CheckCircle2 size={32} style={{ color: "#22c55e", margin: "0 auto 0.5rem" }} />
            <p style={{ margin: 0, fontWeight: 600, color: "var(--foreground)" }}>No active tasks today</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem" }}>Add a task above or take a well-deserved break!</p>
          </div>
        ) : (
          todayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
