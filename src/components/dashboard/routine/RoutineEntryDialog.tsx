"use client";

import { useState, FormEvent } from "react";
import { X, AlertCircle } from "lucide-react";
import { RoutineEntryResponse, DayOfWeek, CreateRoutineEntryInput } from "@server/types";
import RoutineEntryInputs from "./RoutineEntryInputs";

interface RoutineEntryDialogProps {
  isOpen: boolean;
  initialEntry?: RoutineEntryResponse | null;
  defaultDay?: DayOfWeek;
  defaultStartTime?: string;
  onClose: () => void;
  onSubmit: (input: CreateRoutineEntryInput) => Promise<void>;
}

function RoutineEntryFormInner({
  initialEntry,
  defaultDay,
  defaultStartTime,
  onClose,
  onSubmit,
}: Omit<RoutineEntryDialogProps, "isOpen">) {
  const [title, setTitle] = useState(() => initialEntry?.title ?? "");
  const [description, setDescription] = useState(() => initialEntry?.description ?? "");
  const [category, setCategory] = useState(() => initialEntry?.category ?? "Lecture");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(() => initialEntry?.dayOfWeek ?? defaultDay ?? "MONDAY");
  const [startTime, setStartTime] = useState(() => initialEntry?.startTime ?? defaultStartTime ?? "09:00");
  const [endTime, setEndTime] = useState(() => {
    if (initialEntry?.endTime) return initialEntry.endTime;
    if (defaultStartTime) {
      const h = parseInt(defaultStartTime.split(":")[0], 10);
      return `${String(Math.min(23, h + 1)).padStart(2, "0")}:00`;
    }
    return "10:00";
  });
  const [location, setLocation] = useState(() => initialEntry?.location ?? "");
  const [allowOverlap, setAllowOverlap] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please enter an activity title or subject.");
      return;
    }
    if (endTime <= startTime) {
      setErrorMessage("End time must be strictly later than start time.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        category,
        dayOfWeek,
        startTime,
        endTime,
        location: location.trim() || null,
        allowOverlap,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
          {initialEntry ? "Edit Timetable Activity" : "Add Timetable Activity"}
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
        <RoutineEntryInputs
          title={title}
          setTitle={setTitle}
          dayOfWeek={dayOfWeek}
          setDayOfWeek={setDayOfWeek}
          category={category}
          setCategory={setCategory}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
        />

        {errorMessage?.includes("conflicts") && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", cursor: "pointer", color: "var(--color-brand-500)" }}>
              <input
                type="checkbox"
                checked={allowOverlap}
                onChange={(e) => setAllowOverlap(e.target.checked)}
                style={{ accentColor: "var(--color-brand-500)" }}
              />
              <span>Allow overlapping time slot</span>
            </label>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button type="button" onClick={onClose} className="hero-btn-secondary" style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem" }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="hero-btn-primary" style={{ padding: "0.55rem 1.35rem", fontSize: "0.875rem" }}>
            {loading ? "Saving…" : initialEntry ? "Update Activity" : "Add Activity"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RoutineEntryDialog(props: RoutineEntryDialogProps) {
  if (!props.isOpen) return null;
  const key = props.initialEntry ? props.initialEntry.id : `${props.defaultDay || "new"}-${props.defaultStartTime || "09:00"}`;

  return (
    <div className="modal-overlay" onClick={props.onClose}>
      <RoutineEntryFormInner key={key} {...props} />
    </div>
  );
}
