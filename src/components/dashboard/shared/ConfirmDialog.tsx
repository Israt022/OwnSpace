"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ maxWidth: "440px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {isDestructive && (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertTriangle size={18} />
              </div>
            )}
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="hero-btn-secondary"
            style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: "0.55rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "0.75rem",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              color: "#ffffff",
              background: isDestructive ? "#ef4444" : "var(--color-brand-500)",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
