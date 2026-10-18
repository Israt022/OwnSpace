import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: "USER" | "ADMIN" | string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Server-side helper to get the currently authenticated user and session.
 * Safe to call in Server Components, Route Handlers, and Server Actions.
 */
export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      session: session.session,
      user: {
        ...session.user,
        role: (session.user as unknown as { role?: string }).role ?? "USER",
      } as SessionUser,
    };
  } catch (error) {
    if ((error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Error retrieving server session:", error);
    return null;
  }
}

/**
 * Fast helper to get just the user or null.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const data = await getServerSession();
  return data?.user ?? null;
}
