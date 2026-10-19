"use client";

import { useEffect, useState } from "react";

type Task = { title: string; priority: "urgent" | "high" | "medium" | "low"; tag: string };

const TASKS: Task[] = [
  { title: "Send project update", priority: "urgent", tag: "Work" },
  { title: "Review pull requests", priority: "high", tag: "Work" },
  { title: "30 minute walk", priority: "medium", tag: "Health" },
  { title: "Read 20 pages", priority: "low", tag: "Personal" },
];

const STEP_MS = 1500;
const RESET_MS = 2600;

/** Self-playing mock of the dashboard: tasks get checked off one by one. */
export default function LiveTaskDemo() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(2);
      return;
    }
    const t = setTimeout(
      () => setDone((d) => (d >= TASKS.length ? 0 : d + 1)),
      done >= TASKS.length ? RESET_MS : STEP_MS
    );
    return () => clearTimeout(t);
  }, [done]);

  const pct = Math.round((done / TASKS.length) * 100);

  return (
    <div className="demo-card" role="img" aria-label="Animated preview of the OwnSpace task dashboard">
      <div className="demo-head">
        <div>
          <p className="demo-title">Today</p>
          <p className="demo-sub">{done} of {TASKS.length} done</p>
        </div>
        <span className="demo-live"><i /> Live preview</span>
      </div>

      <div className="demo-bar"><div className="demo-bar-fill" style={{ width: `${pct}%` }} /></div>

      <ul className="demo-list">
        {TASKS.map((task, i) => {
          const isDone = i < done;
          return (
            <li key={task.title} className={`task-item demo-row${isDone ? " completed" : ""}`}>
              <input type="checkbox" className="custom-checkbox" checked={isDone} readOnly tabIndex={-1} aria-hidden="true" />
              <div className="demo-row-main">
                <span className={`demo-row-title${isDone ? " is-done" : ""}`}>{task.title}</span>
                <span className="category-pill">{task.tag}</span>
              </div>
              <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
            </li>
          );
        })}
      </ul>

      <p className="demo-foot">{pct === 100 ? "All clear for today ✓" : `${pct}% complete`}</p>
    </div>
  );
}