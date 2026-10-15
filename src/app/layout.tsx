import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | OwnSpace",
    default: "OwnSpace — Own Your Day",
  },
  description:
    "OwnSpace is your personal daily task and routine tracking app. " +
    "Build habits, stay consistent, and take ownership of your time.",
  keywords: ["productivity", "habits", "tasks", "routine", "daily planner"],
};

/**
 * Root Layout — wraps every page in the app.
 *
 * The Navbar is a Client Component, so it is rendered on every page.
 * Next.js will handle the server/client boundary automatically:
 * - layout.tsx itself is a Server Component (no "use client" directive)
 * - Navbar is a Client Component ("use client" inside Navbar.tsx)
 * This is the recommended pattern in Next.js App Router.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Navbar is sticky — it stays at the top as users scroll */}
        <Navbar />

        {/* Main content — grows to fill remaining viewport height */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
