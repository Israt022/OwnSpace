"use client";

import { useState, useEffect } from "react";
import { Sparkles, Edit2, CheckCircle2, Circle, StickyNote, Sun, Moon, Flame } from "lucide-react";
import { SessionUser } from "@/lib/session";

interface MySpaceWidgetsProps {
  user: SessionUser;
}

const DEFAULT_HABITS = [
  { id: "1", title: "Morning meditation & intention setting", completed: false },
  { id: "2", title: "90-minute deep focus block", completed: true },
  { id: "3", title: "2L hydration & physical movement", completed: false },
  { id: "4", title: "Evening review & plan next day", completed: false },
];

export default function MySpaceWidgets({ user }: MySpaceWidgetsProps) {
  const [focusGoal, setFocusGoal] = useState("Ship high-impact features & maintain consistent daily streak");
  const [editingFocus, setEditingFocus] = useState(false);
  const [notes, setNotes] = useState("");
  const [habits, setHabits] = useState(DEFAULT_HABITS);

  // Load scratchpad from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("ownspace_scratchpad");
    if (savedNotes) setNotes(savedNotes);

    const savedFocus = localStorage.getItem("ownspace_focus");
    if (savedFocus) setFocusGoal(savedFocus);
  }, []);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    localStorage.setItem("ownspace_scratchpad", val);
  };

  const handleSaveFocus = () => {
    setEditingFocus(false);
    localStorage.setItem("ownspace_focus", focusGoal);
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
      {/* Daily Focus & Vision Widget */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={18} style={{ color: "var(--color-brand-500)" }} />
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
              Today&apos;s Core Focus
            </h3>
          </div>
          <button
            onClick={() => (editingFocus ? handleSaveFocus() : setEditingFocus(true))}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-500)", fontSize: "0.8125rem", fontWeight: 600 }}
          >
            {editingFocus ? "Done" : "Edit"}
          </button>
        </div>

        {editingFocus ? (
          <div>
            <textarea
              value={focusGoal}
              onChange={(e) => setFocusGoal(e.target.value)}
              className="input-field"
              rows={3}
              autoFocus
            />
          </div>
        ) : (
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              background: "var(--muted)",
              border: "1px solid var(--border)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--foreground)",
              lineHeight: 1.5,
            }}
          >
            &ldquo;{focusGoal}&rdquo;
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>
          <Flame size={15} style={{ color: "#f59e0b" }} />
          <span>Keep this front of mind throughout all your tasks today.</span>
        </div>
      </div>

      {/* Daily Routine / Habits Checklist */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Sun size={18} style={{ color: "#f59e0b" }} />
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            Daily Routine Tracker
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.875rem",
                borderRadius: "0.5rem",
                background: habit.completed ? "rgba(34, 197, 94, 0.1)" : "var(--muted)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                textAlign: "left",
                color: "var(--foreground)",
                transition: "all 0.15s ease",
              }}
            >
              {habit.completed ? (
                <CheckCircle2 size={16} style={{ color: "#22c55e", flexShrink: 0 }} />
              ) : (
                <Circle size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
              )}
              <span style={{ fontSize: "0.875rem", textDecoration: habit.completed ? "line-through" : "none", color: habit.completed ? "var(--muted-foreground)" : "var(--foreground)" }}>
                {habit.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Scratchpad / Notes */}
      <div className="glass-card" style={{ gridColumn: "1 / -1", padding: "1.75rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <StickyNote size={18} style={{ color: "var(--color-brand-500)" }} />
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            Personal Scratchpad & Ideas
          </h3>
        </div>
        <p style={{ margin: "0 0 1rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          A quick distraction-free space to dump links, fleeting thoughts, or meeting takeaways. Auto-saves locally.
        </p>

        <textarea
          placeholder="Jot down notes, brainstorm ideas, paste temporary snippets..."
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          className="input-field"
          rows={5}
          style={{ width: "100%", resize: "vertical" }}
        />
      </div>
    </div>
  );
}
