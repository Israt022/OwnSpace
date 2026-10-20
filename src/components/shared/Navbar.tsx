
"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  CheckSquare,
  LogOut,
  LoaderCircle,
} from "lucide-react";
import OwnSpaceLogo from "@/components/shared/OwnSpaceLogo";

const emptySubscribe = () => () => { };

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Loading theme"
        className="h-10 w-10 rounded-xl border border-[var(--color-border)] opacity-50"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all duration-200 hover:border-indigo-400/50 hover:text-indigo-400"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function UserAvatar({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  if (image) {
    return (
      <Image
        src={image}
        alt={name || "User avatar"}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full border border-[var(--color-border)] object-cover"
      />
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-xs font-bold text-indigo-400">
      {initials}
    </span>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const { user } = session ?? {};

  const userRole =
    (user as (typeof user & { role?: string }) | undefined)?.role ?? "USER";
  const isAdmin = userRole === "ADMIN";

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await signOut();
      closeMenus();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Unable to sign out:", error);
    } finally {
      setSigningOut(false);
    }
  };

  const dashboardHref = isAdmin ? "/dashboard?view=user" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <OwnSpaceLogo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          >
            About
          </Link>

          {!isPending && user && (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-indigo-400"
                >
                  Admin Console
                </Link>
              )}

              <Link
                href={dashboardHref}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-indigo-400"
              >
                {isAdmin ? "My Tasks" : "Dashboard"}
              </Link>
            </>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-[var(--color-surface-2)]" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-1.5 pr-3 transition hover:border-indigo-400/50"
              >
                <UserAvatar name={user.name} image={user.image} />
                <span className="max-w-24 truncate text-sm font-medium text-[var(--color-text)]">
                  {user.name?.split(" ")[0] ?? "Account"}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-[var(--color-text-muted)] transition-transform ${dropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {dropdownOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close user menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setDropdownOpen(false)}
                  />

                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-2xl"
                  >
                    <div className="border-b border-[var(--color-border)] px-3 py-3">
                      <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
                        {user.email}
                      </p>
                      <span className="mt-2 inline-flex rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-indigo-400">
                        {userRole}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
                      >
                        <ShieldCheck size={17} className="text-indigo-400" />
                        Admin Console
                      </Link>
                    )}

                    <Link
                      href={dashboardHref}
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
                    >
                      <CheckSquare size={17} className="text-indigo-400" />
                      {isAdmin ? "My Daily Tasks" : "Daily Tasks"}
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {signingOut ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <LogOut size={17} />
                      )}
                      {signingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
              >
                Get started
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text)] transition hover:border-indigo-400/50 hover:text-indigo-400"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-5 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              href="/"
              onClick={closeMenus}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenus}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
            >
              About
            </Link>

            {!isPending && user && (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenus}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
                  >
                    Admin Console
                  </Link>
                )}
                <Link
                  href={dashboardHref}
                  onClick={closeMenus}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
                >
                  {isAdmin ? "My Daily Tasks" : "Dashboard"}
                </Link>
              </>
            )}

            {!isPending && !user && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={closeMenus}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-center text-sm font-medium text-[var(--color-text)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            )}

            {!isPending && user && (
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar name={user.name} image={user.image} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[var(--color-text-muted)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-red-400/20 px-3 py-2 text-sm font-medium text-red-400 disabled:opacity-50"
                >
                  {signingOut ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <LogOut size={15} />
                  )}
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
