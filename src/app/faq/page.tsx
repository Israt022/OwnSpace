
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, CircleHelp } from "lucide-react";

const questions = [
    { q: "What is OwnSpace?", a: "OwnSpace is a productivity workspace for organizing daily tasks, managing priorities, planning by date, and tracking completed work." },
    { q: "Can I manage my own tasks?", a: "Yes. The user dashboard is designed for managing your personal tasks and tracking their completion." },
    { q: "Can I set task priorities?", a: "OwnSpace supports task priority levels so you can organize work according to its importance." },
    { q: "Can tasks have dates?", a: "Tasks can have due dates, helping you organize and review work according to your schedule." },
    { q: "What does the administrator do?", a: "The administrator area provides role-specific access for managing users and reviewing platform activity." },
    { q: "Do I need an account?", a: "An account is needed to access personalized dashboard features. Use the Sign in or Create account options to continue." },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-900 dark:bg-[#090d18] dark:text-white sm:px-8 sm:py-24">
            <div className="mx-auto max-w-3xl">
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
                    <span className="mx-auto inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-300"><CircleHelp size={25} /></span>
                    <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Frequently asked questions</h1>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
                        Learn how OwnSpace helps you organize tasks, plan your day, and manage your workspace.
                    </p>
                </motion.div>

                <div className="space-y-3">
                    {questions.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.section key={item.q} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? "border-indigo-300 bg-white dark:border-indigo-400/30 dark:bg-white/[0.04]" : "border-slate-200 bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.02]"}`}>
                                <button type="button" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6">
                                    <span className="text-sm font-semibold sm:text-base">{item.q}</span>
                                    <ChevronDown size={18} className={`shrink-0 text-indigo-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                                            <p className="px-5 pb-5 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:px-6">{item.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
