
"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight, CalendarDays, CheckCircle2, LayoutDashboard } from "lucide-react";
import PublicPageIntro from "@/components/public/PublicPageIntro";
import Reveal from "@/components/public/Reveal";

const features = [
    { icon: LayoutDashboard, number: "01", title: "Make it your own", text: "Create a personal workspace around your tasks, goals, and routines." },
    { icon: CheckCircle2, number: "02", title: "Make progress visible", text: "Complete tasks and keep track of the work you have finished." },
    { icon: CalendarDays, number: "03", title: "Keep your days connected", text: "Use due dates to organize tasks around your schedule." },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#090d18] dark:text-white">
            <section className="relative px-5 pb-20 pt-24 sm:px-10 sm:pb-28 sm:pt-32">
                <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px]" />
                <div className="relative mx-auto max-w-6xl">
                    <PublicPageIntro
                        eyebrow="A little about us"
                        title="Your day. Your goals."
                        accent="Your space."
                        description="OwnSpace is a personal productivity workspace for organizing tasks, planning your time, and building routines that work for you."
                    />
                    <Link href="/#features" className="group mt-9 inline-flex items-center gap-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        Explore the features <ArrowDownRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                    </Link>
                </div>
            </section>

            <section className="border-y border-slate-200 dark:border-white/10">
                <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-20">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">The idea</p>
                        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Less scattered. More intentional.</h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="text-base leading-8 text-slate-600 dark:text-slate-400">
                            Everyone has different responsibilities. OwnSpace gives you a place to organize personal tasks, set priorities, mark completed work, and plan around dates without forcing everyone into the same routine.
                        </p>
                    </Reveal>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-28">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">What you can do</p>
                    <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">A workspace that follows your workflow.</h2>
                </Reveal>
                <div className="mt-12">
                    {features.map(({ icon: Icon, number, title, text }, index) => (
                        <Reveal key={number} delay={index * 0.08}>
                            <article className="group grid gap-4 border-t border-slate-200 py-7 transition-colors hover:border-indigo-400 dark:border-white/10 dark:hover:border-indigo-400 sm:grid-cols-[70px_1fr_1.2fr] sm:items-center sm:gap-8">
                                <span className="text-sm tabular-nums text-slate-400">{number}</span>
                                <div className="flex items-center gap-3">
                                    <Icon size={20} className="shrink-0 text-indigo-500 transition-transform group-hover:scale-110" />
                                    <h3 className="text-lg font-semibold">{title}</h3>
                                </div>
                                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{text}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>
                <Link href="/faq" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:gap-3 dark:text-indigo-400">
                    Explore common questions <ArrowRight size={16} />
                </Link>
            </section>
        </main>
    );
}
