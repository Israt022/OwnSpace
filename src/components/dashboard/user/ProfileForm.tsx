"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { User, Mail, Shield, Check, AlertCircle } from "lucide-react";
import { SessionUser } from "@/lib/session";

interface ProfileFormProps {
  user: SessionUser;
  onProfileUpdated?: (updated: SessionUser) => void;
}

export default function ProfileForm({ user, onProfileUpdated }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setMessage({ type: "error", text: "Full name must be at least 2 characters." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        if (onProfileUpdated) {
          onProfileUpdated({ ...user, name: name.trim(), image: imageUrl.trim() || null });
        }
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile." });
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const initials = user.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="glass-card" style={{ maxWidth: "600px", padding: "2rem", borderRadius: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={72}
            height={72}
            style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
          />
        ) : (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
        )}

        <div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>
            {user.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.15rem 0.6rem",
                borderRadius: "1rem",
                background: user.role === "ADMIN" ? "rgba(99, 102, 241, 0.15)" : "var(--muted)",
                color: user.role === "ADMIN" ? "var(--color-brand-500)" : "var(--muted-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              {user.role}
            </span>
            <span style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
              {user.email}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            background: message.type === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
            color: message.type === "success" ? "#22c55e" : "#ef4444",
            border: `1px solid ${message.type === "success" ? "#22c55e" : "#ef4444"}`,
          }}
        >
          {message.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.25rem" }}>
          <label className="input-label" htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label className="input-label" htmlFor="profile-email">Email Address</label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            className="input-field"
            style={{ opacity: 0.7, cursor: "not-allowed" }}
          />
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.25rem", display: "block" }}>
            Account email is verified with your authentication provider.
          </span>
        </div>

        <div style={{ marginBottom: "1.75rem" }}>
          <label className="input-label" htmlFor="profile-image">Profile Avatar URL</label>
          <input
            id="profile-image"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={imageUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
            className="input-field"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={loading}
            className="hero-btn-primary"
            style={{ padding: "0.65rem 1.5rem", fontSize: "0.875rem" }}
          >
            {loading ? "Saving Changes…" : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
