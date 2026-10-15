"use client";

/**
 * Sign In page for OwnSpace.
 *
 * Uses Better Auth's client-side signIn helpers.
 * No manual session or cookie logic — Better Auth handles all of that.
 */

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

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

// ── Validation ─────────────────────────────────────────────────────────────
interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // signIn.email() sends credentials to Better Auth's /api/auth/sign-in/email
      // Better Auth verifies the password hash and creates a session cookie.
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/", // where to redirect after login
      });

      if (result.error) {
        const msg = result.error.message ?? "Sign in failed.";

        // Map common Better Auth error messages to friendly UI messages
        if (
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("credentials") ||
          msg.toLowerCase().includes("password") ||
          msg.toLowerCase().includes("not found")
        ) {
          setErrors({ general: "Incorrect email or password. Please try again." });
        } else {
          setErrors({ general: msg });
        }
        return;
      }

      // On success Better Auth sets the session cookie and redirects
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign in error:", err);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setErrors({ general: "Google sign-in failed. Please try again." });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div
      className="auth-bg"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem 1rem" }}
    >
      <div
        className="glass-card animate-in"
        style={{ width: "100%", maxWidth: "440px", padding: "2.5rem" }}
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
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
          <h1
            style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 0.5rem" }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem", margin: 0 }}>
            Sign in to your OwnSpace account.
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="alert-error" style={{ marginBottom: "1.25rem" }} role="alert">
            {errors.general}
          </div>
        )}

        {/* Google sign-in (above fold — primary social action) */}
        <button
          id="signin-google"
          type="button"
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
          style={{ marginBottom: "1.5rem" }}
        >
          {isGoogleLoading ? (
            <>
              <span
                className="spinner"
                style={{
                  borderTopColor: "var(--color-brand-500)",
                  borderColor: "var(--color-border)",
                }}
              />
              Redirecting to Google…
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        <div className="divider" style={{ marginBottom: "1.5rem" }}>
          or sign in with email
        </div>

        {/* Email / Password form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="signin-email" className="input-label">
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              className={`input-field ${errors.email ? "error" : ""}`}
              disabled={isSubmitting}
              aria-describedby={errors.email ? "signin-email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="signin-email-error" className="field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.375rem",
              }}
            >
              <label htmlFor="signin-password" className="input-label" style={{ margin: 0 }}>
                Password
              </label>
              {/* Placeholder for future "Forgot password" page */}
              <span
                style={{ fontSize: "0.8125rem", color: "var(--color-brand-500)", cursor: "default" }}
                title="Forgot password — coming soon"
              >
                Forgot password?
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`input-field ${errors.password ? "error" : ""}`}
                disabled={isSubmitting}
                style={{ paddingRight: "3rem" }}
                aria-describedby={errors.password ? "signin-password-error" : undefined}
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
              <p id="signin-password-error" className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "1.5rem" }} />

          <button
            id="signin-submit"
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign-up link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            style={{
              color: "var(--color-brand-500)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
