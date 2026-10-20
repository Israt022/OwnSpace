
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import OwnSpaceLogo from "@/components/shared/OwnSpaceLogo";
import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { siGithub } from "simple-icons";

type NavLink = {
    label: string;
    href: string;
};

const PRODUCT_LINKS: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Members & Admins", href: "/#roles" },
];

const GUEST_LINKS: NavLink[] = [
    { label: "Sign in", href: "/sign-in" },
    { label: "Create account", href: "/sign-up" },
];

function FooterColumn({
    title,
    links,
}: {
    title: string;
    links: NavLink[];
}) {
    return (
        <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                {title}
            </h3>

            <ul className="mt-5 space-y-3.5">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                        >
                            {link.label}
                            <ArrowUpRight
                                size={13}
                                className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    const pathname = usePathname();
    const { data: session, isPending } = useSession();

    const user = session?.user;

    const isAdmin =
        (user as (typeof user & { role?: string }) | undefined)?.role ===
        "ADMIN";

    if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/admin")
    ) {
        return null;
    }

    const accountLinks: NavLink[] = user
        ? [
            ...(isAdmin
                ? [{ label: "Admin Console", href: "/admin" }]
                : []),
            {
                label: isAdmin ? "My Daily Tasks" : "Dashboard",
                href: isAdmin ? "/dashboard?view=user" : "/dashboard",
            },
        ]
        : GUEST_LINKS;

    return (
        <footer className="relative mt-auto w-full overflow-hidden border-t border-indigo-200/70 bg-slate-50 text-slate-700 transition-colors duration-300 dark:border-indigo-400/[0.12] dark:bg-[#090d18] dark:text-slate-300">
            {/* Animated background decoration */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {/* Soft ambient glow */}
                <div className="footer-glow absolute -top-36 left-[18%] h-72 w-72 rounded-full bg-violet-400/15 blur-[100px] dark:bg-indigo-500/[0.12]" />
                <div className="footer-glow footer-glow-delay absolute -top-28 right-[8%] h-64 w-64 rounded-full bg-sky-400/15 blur-[100px] dark:bg-violet-500/[0.09]" />

                {/* Subtle dotted grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#64748b_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-[0.10] dark:opacity-[0.12]" />

                {/* Oversized animated typography */}
                <div className="footer-marquee absolute left-0 top-5 flex w-max select-none whitespace-nowrap">
                    {[0, 1, 2, 3].map((item) => (
                        <span
                            key={item}
                            className="px-5 text-[clamp(5rem,12vw,10rem)] font-black leading-none tracking-[-0.09em] text-indigo-500/[0.045] dark:text-indigo-200/[0.045]"
                        >
                            OWN YOUR DAY<span className="text-violet-500/50">.</span>
                        </span>
                    ))}
                </div>

                {/* Animated accent line */}
                <div className="footer-light absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                {/* Main content */}
                <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_0.8fr] lg:gap-16 lg:py-16">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <OwnSpaceLogo />

                        <p className="mt-5 max-w-xs text-sm leading-7 text-slate-600 dark:text-slate-400">
                            Your space to plan, focus, and grow. Organize your daily
                            tasks, track your progress, and build better habits one
                            day at a time.
                        </p>

                        {/* Motto */}
                        <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-200/80 bg-white/70 px-3.5 py-2 shadow-sm shadow-indigo-950/[0.03] dark:border-white/[0.08] dark:bg-white/[0.025] dark:shadow-none">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>

                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Make every day count
                            </span>
                        </div>

                        {/* GitHub */}
                        <a
                            href="https://github.com/Israt022"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit GitHub profile"
                            className="group mt-6 inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
                        >
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                className="h-[17px] w-[17px] transition-transform duration-200 group-hover:scale-110"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d={siGithub.path} />
                            </svg>

                            <span>Find me on GitHub</span>
                            <MoveUpRight
                                size={14}
                                className="text-slate-400 transition-colors group-hover:text-indigo-500"
                            />
                        </a>
                    </div>

                    {/* Explore */}
                    <FooterColumn
                        title="Explore"
                        links={PRODUCT_LINKS}
                    />

                    {/* Account */}
                    {isPending ? (
                        <div className="space-y-5">
                            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-white/[0.06]"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <FooterColumn
                            title="Your Space"
                            links={accountLinks}
                        />
                    )}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col gap-4 border-t border-slate-200/80 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.07]">
                    <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">
                        © {new Date().getFullYear()} OwnSpace. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                            Built for better days.
                        </span>

                        <Link
                            href="/"
                            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                        >
                            Back to home
                            <ArrowUpRight
                                size={13}
                                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Animation styles */}
            <style jsx>{`
        .footer-marquee {
          animation: footer-marquee 42s linear infinite;
        }

        .footer-glow {
          animation: footer-float 12s ease-in-out infinite alternate;
        }

        .footer-glow-delay {
          animation-delay: -6s;
        }

        .footer-light {
          animation: footer-light 8s ease-in-out infinite alternate;
        }

        @keyframes footer-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes footer-float {
          from {
            transform: translate3d(-12px, 0, 0);
          }
          to {
            transform: translate3d(18px, 20px, 0);
          }
        }

        @keyframes footer-light {
          from {
            transform: translateX(-30%);
            opacity: 0.35;
          }
          to {
            transform: translateX(230%);
            opacity: 0.9;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-marquee,
          .footer-glow,
          .footer-light {
            animation: none;
          }
        }
      `}</style>
        </footer>
    );
}
