"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, CheckCircle2, LayoutDashboard, Target } from "lucide-react";

const principles = [
    { icon: LayoutDashboard, title: "Your own space", text: "Organize your workspace around your personal tasks and goals." },
    { icon: CheckCircle2, title: "Track your progress", text: "Mark tasks complete and keep track of what you have accomplished." },
    { icon: CalendarDays, title: "Plan by date", text: "Connect your tasks with dates to make daily planning easier." },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#090d18] dark:text-white">
            <section className="relative px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
                <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/15 blur-[100px]" />
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative mx-auto max-w-4xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                        <Target size={14} /> About OwnSpace
                    </span>
                    <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-6xl">
                        Make room for what <span className="text-indigo-500">matters.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                        OwnSpace is a personal productivity workspace built to help you organize daily tasks, plan your time, and build more consistent routines.
                    </p>
                    <Link href="/#features" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
                        Explore features <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </section>

            <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
                <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="grid gap-5 md:grid-cols-3">
                    {principles.map(({ icon: Icon, title, text }, index) => (
                        <motion.article key={title} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.025] sm:p-7">
                            <span className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-300"><Icon size={22} /></span>
                            <p className="mt-5 text-xs font-semibold tracking-widest text-slate-400">0{index + 1}</p>
                            <h2 className="mt-2 text-xl font-semibold">{title}</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{text}</p>
                        </motion.article>
                    ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-white p-7 dark:border-indigo-400/15 dark:from-indigo-500/[0.09] dark:to-white/[0.02] sm:p-10">
                    <h2 className="text-2xl font-bold sm:text-3xl">Built around your day</h2>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-600 dark:text-slate-400">
                        Everyone has different responsibilities and routines. OwnSpace brings task management, priorities, completion tracking, and date-based planning into one place, with separate user and administrator experiences.
                    </p>
                    <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
                        Questions about OwnSpace? <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </section>
        </main>
    );
}
