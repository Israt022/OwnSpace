"use client";

import { useState, FormEvent } from "react";
import { X, AlertCircle } from "lucide-react";
import { RoutineResponse, CreateRoutineInput } from "@server/types";

interface RoutineManageDialogProps {
  isOpen: boolean;
  initialRoutine?: RoutineResponse | null;
  onClose: () => void;
  onSubmit: (input: CreateRoutineInput) => Promise<void>;
}

function RoutineManageFormInner({
  initialRoutine,
  onClose,
  onSubmit,
}: Omit<RoutineManageDialogProps, "isOpen">) {
  const [name, setName] = useState(() => initialRoutine?.name ?? "");
  const [description, setDescription] = useState(() => initialRoutine?.description ?? "");
  const [isDefault, setIsDefault] = useState(() => initialRoutine?.isDefault ?? false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter a routine name.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        isDefault,
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
          {initialRoutine ? "Edit Routine" : "Create New Routine"}
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
        <div style={{ marginBottom: "1rem" }}>
          <label className="input-label" htmlFor="routine-name">Routine Name *</label>
          <input
            id="routine-name"
            type="text"
            placeholder="e.g. University Class Routine, Study Schedule, Workout Plan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
            autoFocus
          />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label className="input-label" htmlFor="routine-desc">Description (Optional)</label>
          <textarea
            id="routine-desc"
            placeholder="e.g. Fall Semester weekly classes and lab timings"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            rows={2}
          />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              style={{ accentColor: "var(--color-brand-500)" }}
            />
            <span style={{ color: "var(--foreground)" }}>Set as my default active routine</span>
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button type="button" onClick={onClose} className="hero-btn-secondary" style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem" }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="hero-btn-primary" style={{ padding: "0.55rem 1.35rem", fontSize: "0.875rem" }}>
            {loading ? "Saving…" : initialRoutine ? "Save Changes" : "Create Routine"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RoutineManageDialog(props: RoutineManageDialogProps) {
  if (!props.isOpen) return null;
  const key = props.initialRoutine ? props.initialRoutine.id : "new";

  return (
    <div className="modal-overlay" onClick={props.onClose}>
      <RoutineManageFormInner key={key} {...props} />
    </div>
  );
}

