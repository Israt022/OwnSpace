"use client";

import { useState, useEffect, FormEvent } from "react";
import { X } from "lucide-react";
import { TaskResponse, TaskPriority, CreateTaskInput } from "@server/types";

interface TaskFormDialogProps {
  isOpen: boolean;
  initialTask?: TaskResponse | null;
  defaultDate?: string;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}

const CATEGORIES = ["Work", "Personal", "Study", "Health", "Fitness", "General"];

export default function TaskFormDialog({
  isOpen,
  initialTask,
  defaultDate,
  onClose,
  onSubmit,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [category, setCategory] = useState("Work");
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dueTime, setDueTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setPriority(initialTask.priority);
      setCategory(initialTask.category);
      setDueDate(
        initialTask.dueDate
          ? new Date(initialTask.dueDate).toISOString().split("T")[0]
          : ""
      );
      setDueTime(initialTask.dueTime || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setCategory("Work");
      setDueDate(defaultDate || new Date().toISOString().split("T")[0]);
      setDueTime("");
    }
  }, [initialTask, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        dueTime: dueTime || null,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            {initialTask ? "Edit Task" : "Create New Task"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="input-label" htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g., Prepare quarterly presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label className="input-label" htmlFor="task-notes">Notes & Sub-tasks</label>
            <textarea
              id="task-notes"
              placeholder="Add key milestones or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={2}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1rem" }}>
            <div>
              <label className="input-label" htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="input-field"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="input-label" htmlFor="task-cat">Category</label>
              <select
                id="task-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1.5rem" }}>
            <div>
              <label className="input-label" htmlFor="task-due-date">Due Date</label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="task-due-time">Target Time</label>
              <input
                id="task-due-time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={onClose} className="hero-btn-secondary" style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="hero-btn-primary" style={{ padding: "0.55rem 1.35rem", fontSize: "0.875rem" }}>
              {loading ? "Saving…" : initialTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
