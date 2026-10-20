
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import PublicPageIntro from "@/components/public/PublicPageIntro";
import Reveal from "@/components/public/Reveal";

const questions = [
    { q: "What is OwnSpace?", a: "OwnSpace is a productivity workspace for organizing personal tasks, setting priorities, planning by date, and tracking completed work." },
    { q: "Can I customize my workspace?", a: "OwnSpace is designed around a personal workspace where you can organize your tasks and goals to suit your routine." },
    { q: "Can I track completed tasks?", a: "Yes. Mark a task as completed to distinguish finished work from tasks that still need attention." },
    { q: "Can I organize tasks by date?", a: "Tasks can include due dates, helping you plan and review your work around your schedule." },
    { q: "What is the admin area for?", a: "The admin area provides authorized administrators with tools to manage users and review platform activity." },
    { q: "Do I need an account?", a: "You need an account to use personalized dashboard features. You can start from the sign-in or account creation page." },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <main className="min-h-screen bg-slate-50 px-5 py-20 text-slate-900 dark:bg-[#090d18] dark:text-white sm:px-10 sm:py-28">
            <div className="mx-auto max-w-6xl">
                <PublicPageIntro
                    eyebrow="Questions & answers"
                    title="A little clarity goes"
                    accent="a long way."
                    description="Quick answers about organizing tasks, managing your workspace, and using OwnSpace."
                />

                <section className="mt-16 grid gap-10 border-t border-slate-200 pt-8 dark:border-white/10 md:grid-cols-[0.65fr_1.35fr] md:gap-20 md:pt-12">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Need to know</p>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">Select a question to read its answer.</p>
                    </Reveal>

                    <div>
                        {questions.map((item, index) => {
                            const isOpen = openIndex === index;
                            const answerId = `faq-answer-${index}`;

                            return (
                                <Reveal key={item.q} delay={index * 0.035}>
                                    <div className="border-b border-slate-200 dark:border-white/10">
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={answerId}
                                            onClick={() => setOpenIndex(isOpen ? null : index)}
                                            className="flex w-full items-center justify-between gap-5 py-6 text-left"
                                        >
                                            <span className={`text-base font-medium transition-colors ${isOpen ? "text-indigo-600 dark:text-indigo-400" : ""}`}>{item.q}</span>
                                            <ChevronDown size={19} className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : ""}`} />
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    id={answerId}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
