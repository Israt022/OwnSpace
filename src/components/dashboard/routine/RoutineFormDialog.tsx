"use client";

import { useState, FormEvent } from "react";
import { X, AlertCircle } from "lucide-react";
import { RoutineResponse, DayOfWeek, CreateRoutineInput } from "@server/types";
import RoutineFormInputs from "./RoutineFormInputs";

interface RoutineFormDialogProps {
  isOpen: boolean;
  initialRoutine?: RoutineResponse | null;
  defaultDay?: DayOfWeek;
  onClose: () => void;
  onSubmit: (input: CreateRoutineInput) => Promise<void>;
}

function RoutineFormInner({
  initialRoutine,
  defaultDay,
  onClose,
  onSubmit,
}: Omit<RoutineFormDialogProps, "isOpen">) {
  const [title, setTitle] = useState(() => initialRoutine?.title ?? "");
  const [description, setDescription] = useState(() => initialRoutine?.description ?? "");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(() => initialRoutine?.dayOfWeek ?? defaultDay ?? "MONDAY");
  const [startTime, setStartTime] = useState(() => initialRoutine?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(() => initialRoutine?.endTime ?? "10:00");
  const [category, setCategory] = useState(() => initialRoutine?.category ?? "Study");
  const [reminder, setReminder] = useState(() => initialRoutine?.reminder ?? false);
  const [allowOverlap, setAllowOverlap] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please enter a routine title.");
      return;
    }
    if (endTime <= startTime) {
      setErrorMessage("End time must be later than start time.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        dayOfWeek,
        startTime,
        endTime,
        category,
        reminder,
        allowOverlap,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save routine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
          {initialRoutine ? "Edit Routine" : "Add New Routine"}
        </h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
          <X size={18} />
        </button>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "var(--color-error)",
            fontSize: "0.8125rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <RoutineFormInputs
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          dayOfWeek={dayOfWeek}
          setDayOfWeek={setDayOfWeek}
          category={category}
          setCategory={setCategory}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              style={{ accentColor: "var(--color-brand-500)" }}
            />
            <span style={{ color: "var(--foreground)" }}>Enable reminder indicator</span>
          </label>

          {errorMessage?.includes("conflicts") && (
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", cursor: "pointer", color: "var(--color-brand-500)" }}>
              <input
                type="checkbox"
                checked={allowOverlap}
                onChange={(e) => setAllowOverlap(e.target.checked)}
                style={{ accentColor: "var(--color-brand-500)" }}
              />
              <span>Allow time overlap anyway</span>
            </label>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button type="button" onClick={onClose} className="hero-btn-secondary" style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem" }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="hero-btn-primary" style={{ padding: "0.55rem 1.35rem", fontSize: "0.875rem" }}>
            {loading ? "Saving…" : initialRoutine ? "Update Routine" : "Add Routine"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RoutineFormDialog(props: RoutineFormDialogProps) {
  if (!props.isOpen) return null;

  const key = props.initialRoutine ? props.initialRoutine.id : (props.defaultDay || "new");

  return (
    <div className="modal-overlay" onClick={props.onClose}>
      <RoutineFormInner key={key} {...props} />
    </div>
  );
}
