"use client";

/**
 * Sign Up page for OwnSpace.
 *
 * "use client" is required because we use:
 *  - useState for form state management
 *  - Event handlers (form submit, file change)
 *  - Better Auth's signUp from the client library
 *
 * Flow:
 *  1. User fills out the form (name, email, password, optional image).
 *  2. If an image was selected, it is uploaded to Cloudinary via our
 *     secure server-side route at /api/upload/image.
 *  3. The user is registered via Better Auth's signUp.email().
 *  4. On success, the user is redirected to the home page.
 *
 * Better Auth handles:
 *  - Password hashing (bcrypt)
 *  - Session cookie creation
 *  - Storing the user in the `user` table via Prisma
 */

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";

// ── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  image?: string;
  general?: string;
}

// ── Validation ─────────────────────────────────────────────────────────────
function validateForm(data: FormData, imageFile: File | null): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Full name is required.";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (imageFile) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(imageFile.type)) {
      errors.image = "Please upload a JPEG, PNG, WebP, or GIF image.";
    } else if (imageFile.size > 5 * 1024 * 1024) {
      errors.image = "Image must be smaller than 5 MB.";
    }
  }

  return errors;
}

// ── Google icon ────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ── Field change handler ─────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear per-field error on edit
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ── Image selection ──────────────────────────────────────────────────
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    // Validate immediately for instant feedback
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload a JPEG, PNG, WebP, or GIF image.",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image must be smaller than 5 MB.",
      }));
      return;
    }

    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: undefined }));

    // Create a local preview URL
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  // ── Upload image to Cloudinary via our API ───────────────────────────
  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error ?? "Image upload failed.");
    }
    return data.url as string;
  };

  // ── Form submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateForm(form, imageFile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Step 1: Upload image (if selected)
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Step 2: Register with Better Auth
      // signUp.email() sends a POST to /api/auth/sign-up/email
      // Better Auth hashes the password and creates the user + session.
      const result = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        // Pass image URL as an additional field
        // Better Auth will store it in the `user.image` column
        image: imageUrl,
      });

      if (result.error) {
        // Better Auth returns structured errors
        const message = result.error.message ?? "Registration failed.";
        if (
          message.toLowerCase().includes("email") &&
          message.toLowerCase().includes("exist")
        ) {
          setErrors({ email: "An account with this email already exists." });
        } else {
          setErrors({ general: message });
        }
        return;
      }

      // Step 3: Redirect on success
      setSuccessMessage("Account created! Redirecting…");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign up error:", err);
      setErrors({
        general: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Google sign-in ───────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Better Auth handles the OAuth redirect automatically.
      // After Google auth, the user is redirected back to callbackURL.
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setErrors({ general: "Google sign-in failed. Please try again." });
      setIsGoogleLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="auth-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div
        className="glass-card animate-in"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "2.5rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.875rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: "0 0 0.5rem",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem", margin: 0 }}>
            Join OwnSpace and own your daily routine.
          </p>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="alert-success" style={{ marginBottom: "1.25rem", textAlign: "center" }}>
            ✓ {successMessage}
          </div>
        )}

        {/* General error */}
        {errors.general && (
          <div className="alert-error" style={{ marginBottom: "1.25rem" }} role="alert">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Profile picture */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div
              className={`avatar-upload-area ${imagePreview ? "has-image" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload profile picture"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "var(--color-text-light)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p style={{ fontSize: "0.75rem", marginTop: "0.375rem" }}>Add photo</p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-brand-500)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.375rem",
                  transition: "background 0.15s",
                }}
              >
                {imagePreview ? "Change photo" : "Upload photo"}
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-error)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.375rem",
                    transition: "background 0.15s",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", margin: 0 }}>
              Optional · JPEG, PNG, WebP or GIF · Max 5 MB
            </p>
            {errors.image && <p className="field-error">{errors.image}</p>}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            aria-hidden="true"
            style={{ display: "none" }}
          />

          {/* Full Name */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="signup-name" className="input-label">
              Full Name <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? "error" : ""}`}
              disabled={isSubmitting}
              aria-describedby={errors.name ? "signup-name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p id="signup-name-error" className="field-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="signup-email" className="input-label">
              Email <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? "error" : ""}`}
              disabled={isSubmitting}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="signup-email-error" className="field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="signup-password" className="input-label">
              Password <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                className={`input-field ${errors.password ? "error" : ""}`}
                disabled={isSubmitting}
                style={{ paddingRight: "3rem" }}
                aria-describedby={errors.password ? "signup-password-error" : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-light)",
                  padding: "0.25rem",
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p id="signup-password-error" className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="signup-confirm" className="input-label">
              Confirm Password <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="signup-confirm"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`input-field ${errors.confirmPassword ? "error" : ""}`}
                disabled={isSubmitting}
                style={{ paddingRight: "3rem" }}
                aria-describedby={errors.confirmPassword ? "signup-confirm-error" : undefined}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-light)",
                  padding: "0.25rem",
                }}
              >
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="signup-confirm-error" className="field-error" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="signup-submit"
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider" style={{ margin: "1.5rem 0" }}>or</div>

        {/* Google sign-in */}
        <button
          id="signup-google"
          type="button"
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
        >
          {isGoogleLoading ? (
            <>
              <span className="spinner" style={{ borderTopColor: "var(--color-brand-500)", borderColor: "var(--color-border)" }} />
              Redirecting to Google…
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        {/* Sign-in link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/sign-in"
            style={{
              color: "var(--color-brand-500)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
