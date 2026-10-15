/**
 * Better Auth client-side configuration.
 *
 * Safe to import in Client Components ("use client") and browser code.
 * Do NOT import the server-side `auth` from src/lib/auth.ts here.
 *
 * `useSession()` is a React hook that returns the current session.
 * `signIn`, `signUp`, `signOut` are async functions that call the
 * Better Auth API routes at /api/auth/*.
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Tells the client where to find the auth API.
  // This defaults to window.location.origin in the browser,
  // which is correct for a Next.js app where auth runs on the same domain.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
});

// Re-export the individual helpers for convenience in components.
// Usage examples:
//   const { data: session } = useSession();
//   await signIn.email({ email, password });
//   await signUp.email({ email, password, name });
//   await signOut();
export const { signIn, signUp, signOut, useSession } = authClient;