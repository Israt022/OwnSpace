import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          {/* Navbar is sticky — it stays at the top as users scroll */}
          <Navbar />

          {/* Main content — grows to fill remaining viewport height */}
          <main style={{ flex: 1 }}>
            {children}
          </main>

          {/* Footer is also sticky — it stays at the bottom as users scroll */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
