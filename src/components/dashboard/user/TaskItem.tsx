"use client";

import { Check, Clock, Edit3, Trash2 } from "lucide-react";
import { TaskResponse } from "@server/types";

interface TaskItemProps {
  task: TaskResponse;
  onToggle: (task: TaskResponse) => void;
  onEdit: (task: TaskResponse) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.875rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", flex: 1, minWidth: 0 }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
            className="custom-checkbox"
            style={{ marginTop: "0.2rem" }}
            aria-label={`Mark task ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--foreground)",
                textDecoration: task.completed ? "line-through" : "none",
                marginBottom: "0.25rem",
                wordBreak: "break-word",
              }}
            >
              {task.title}
            </div>

            {task.description && (
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted-foreground)",
                  margin: "0 0 0.4rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {task.description}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>

              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "0.375rem",
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {task.category}
              </span>

              {task.dueTime && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.2rem",
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <Clock size={12} />
                  {task.dueTime}
                </span>
              )}

              {task.completed && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#22c55e",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <Check size={12} /> Done
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: "0.375rem",
              color: "var(--muted-foreground)",
            }}
            aria-label="Edit task"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: "0.375rem",
              color: "var(--muted-foreground)",
            }}
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
