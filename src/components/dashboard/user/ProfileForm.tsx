
"use client";

import {
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import {
  User,
  Check,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import { SessionUser } from "@/lib/session";

interface ProfileFormProps {
  user: SessionUser;
  onProfileUpdated?: (updated: SessionUser) => void;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProfileForm({
  user,
  onProfileUpdated,
}: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  const [name, setName] = useState(user.name);
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user.image || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please select a JPEG, PNG, WebP, or GIF image.",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({
        type: "error",
        text: "Image must be smaller than 5 MB.",
      });
      e.target.value = "";
      return;
    }

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewRef.current = objectUrl;

    setSelectedFile(file);
    setPreview(objectUrl);
    setMessage(null);
  };

  const handleRemoveImage = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }

    setSelectedFile(null);
    setPreview(null);
    setImageUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage(null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.url) {
      throw new Error(data.error || "Image upload failed.");
    }

    return data.url as string;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      setMessage({
        type: "error",
        text: "Full name must be at least 2 characters.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let finalImageUrl = imageUrl;

      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: finalImageUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setImageUrl(finalImageUrl);
      setSelectedFile(null);
      setPreview(finalImageUrl || null);

      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const updatedUser = {
        ...user,
        name: name.trim(),
        image: finalImageUrl || null,
      };

      onProfileUpdated?.(updatedUser);

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const initials =
    name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

  return (
    <div
      className="glass-card"
      style={{
        maxWidth: "600px",
        padding: "2rem",
        borderRadius: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 80,
            height: 80,
            flexShrink: 0,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid var(--border)",
            background: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {preview ? (
            <Image
              src={preview}
              alt={`${name || "User"} profile picture`}
              fill
              unoptimized={preview.startsWith("blob:")}
              sizes="80px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              {initials}
            </span>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            {name || user.name}
          </h2>

          <p
            style={{
              margin: "0.25rem 0",
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
              overflowWrap: "anywhere",
            }}
          >
            {user.email}
          </p>

          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            {user.role}
          </span>
        </div>
      </div>

      {message && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            background:
              message.type === "success"
                ? "var(--color-success-bg)"
                : "var(--color-error-bg)",
            color: message.type === "success" ? "#22c55e" : "#ef4444",
          }}
        >
          {message.type === "success" ? (
            <Check size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.25rem" }}>
          <label className="input-label" htmlFor="profile-name">
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            minLength={2}
            required
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label className="input-label" htmlFor="profile-email">
            Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            className="input-field"
            style={{ opacity: 0.7, cursor: "not-allowed" }}
          />
        </div>

        <div style={{ marginBottom: "1.75rem" }}>
          <span className="input-label">Profile Picture</span>

          <input
            ref={fileInputRef}
            id="profile-image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            disabled={loading}
            style={{ display: "none" }}
          />

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="button"
              className="hero-btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              style={{
                padding: "0.65rem 1rem",
                fontSize: "0.875rem",
              }}
            >
              <Upload size={16} />
              {selectedFile || imageUrl ? "Change Photo" : "Upload Photo"}
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.65rem 1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  background: "transparent",
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
                Remove
              </button>
            )}
          </div>

          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              marginTop: "0.5rem",
            }}
          >
            JPEG, PNG, WebP or GIF. Maximum size: 5 MB.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={loading}
            className="hero-btn-primary"
            style={{ padding: "0.65rem 1.5rem", fontSize: "0.875rem" }}
          >
            {loading ? "Uploading & Saving…" : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
