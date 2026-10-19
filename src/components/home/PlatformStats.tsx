"use client";

import { useEffect, useState } from "react";
import { Users, ListTodo, CheckCircle2, TrendingUp } from "lucide-react";

type Stats = {
    totalUsers: number;
    totalTasks: number;
    completedTasks: number;
};

const items = [
    { key: "totalUsers", label: "Registered users", icon: Users },
    { key: "totalTasks", label: "Tasks created", icon: ListTodo },
    { key: "completedTasks", label: "Tasks completed", icon: CheckCircle2 },
] as const;

function CountUp({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let frame = 0;
        let start: number | undefined;
        const duration = 1000;

        const animate = (time: number) => {
            if (start === undefined) start = time;
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            setCount(Math.round(value * eased));

            if (progress < 1) frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [value]);

    return <>{count.toLocaleString()}</>;
}

export default function PlatformStats() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;

        fetch("/api/public/stats")
            .then(async (res) => {
                if (!res.ok) throw new Error("Stats unavailable");
                return res.json();
            })
            .then((result) => {
                if (active && result.success) setStats(result.data);
                else if (active) setError(true);
            })
            .catch(() => {
                if (active) setError(true);
            });

        return () => {
            active = false;
        };
    }, []);

    if (error) {
        return (
            <section className="os-platform-stats">
                <div className="os-stats-heading">
                    <span className="os-stats-eyebrow">
                        <span className="os-stats-dot" />
                        THE OWNSPACE COMMUNITY
                    </span>

                    <h2>
                        Small steps.
                        <br />
                        <span>Real progress.</span>
                    </h2>

                    <p>
                        Every great routine starts with one small step.
                        Create your space, organize your day, and make
                        progress at your own pace.
                    </p>

                    <a href="/sign-up" className="os-stats-cta">
                        Start your journey <span>↗</span>
                    </a>
                </div>

                <div className="os-stats-unavailable">
                    <div className="os-stats-decoration">
                        <span>01</span>
                        <div className="os-stats-line" />
                        <span>03</span>
                    </div>

                    <div className="os-stats-message">
                        <span className="os-stats-message-icon">✳</span>
                        <div>
                            <strong>Your progress starts here</strong>
                            <p>Build habits. Track tasks. Own your day.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="os-platform-stats" aria-label="OwnSpace platform statistics">
            <div className="os-stats-heading">
                <span>OWNSPACE IN NUMBERS</span>
                <h2>Small steps. Real progress.</h2>
                <p>A look at the activity happening across OwnSpace.</p>
            </div>

            <div className="os-stats-grid">
                {items.map(({ key, label, icon: Icon }) => (
                    <div className="os-stat-item" key={key}>
                        <Icon size={21} aria-hidden="true" />
                        <div className="os-stat-number">
                            {stats ? <CountUp value={stats[key]} /> : "—"}
                        </div>
                        <p>{label}</p>
                    </div>
                ))}
            </div>

            {stats && (
                <p className="os-stats-note">
                    {stats.totalTasks > 0
                        ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% of all recorded tasks completed`
                        : "Your first task is the start of something great."}
                </p>
            )}
        </section>
    );
}