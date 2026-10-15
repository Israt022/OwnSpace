/**
 * Better Auth server-side configuration.
 *
 * This file runs only on the server (Next.js Route Handlers, Server Actions).
 * Never import this file in client components ("use client").
 *
 * The Prisma adapter connects Better Auth to your PostgreSQL database.
 * Better Auth will automatically manage the `user`, `session`, `account`,
 * and `verification` tables defined in prisma/schema.prisma.
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../server/src/generated/prisma/client";

// ── Prisma client setup ──────────────────────────────────────────────────────
// We use the pg driver adapter (same pattern as your Express server/config/db.ts)
// so that Better Auth uses the same Supabase PostgreSQL connection.
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error(
        "DATABASE_URL environment variable is not set. " +
        "Add it to your .env file before starting the server."
    );
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Better Auth configuration ────────────────────────────────────────────────
export const auth = betterAuth({
    // Connect Better Auth to your PostgreSQL database via Prisma
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    // Allow the auth cookies/sessions to work on your domain
    // BETTER_AUTH_URL must be set to your app's base URL (e.g. http://localhost:3000)
    baseURL: process.env.BETTER_AUTH_URL,

    // Secret used to sign sessions and tokens — must be long and random.
    // Generate with: openssl rand -base64 32
    secret: process.env.BETTER_AUTH_SECRET,

    // ── Email + Password authentication ─────────────────────────────────────
    emailAndPassword: {
        enabled: true,
        // Minimum password length for security
        minPasswordLength: 8,
    },

    // ── Social (OAuth) providers ──────────────────────────────────────────────
    socialProviders: {
        // Google sign-in — credentials come from Google Cloud Console.
        // Leave this block as-is; add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
        // to your .env when you have them. Better Auth will only activate Google
        // if both values are present.
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    // ── User object ───────────────────────────────────────────────────────────
    // Tell Better Auth about extra fields on the `user` table.
    // These fields must also exist in your Prisma schema.
    user: {
        additionalFields: {
            // Optional profile picture URL stored after Cloudinary upload
            image: {
                type: "string",
                required: false,
                defaultValue: null,
                input: true, // allow clients to set this field during sign-up
            },
            // User role for future admin features
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
                input: false, // clients cannot override role — server-side only
            },
        },
    },
});

// Export the auth type so TypeScript can infer session shapes in other files
export type Auth = typeof auth;