"use client";

import { DayOfWeek } from "@server/types";
import { DAYS_OF_WEEK, ROUTINE_CATEGORIES } from "@/lib/constants/routine";

interface RoutineFormInputsProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  dayOfWeek: DayOfWeek;
  setDayOfWeek: (val: DayOfWeek) => void;
  category: string;
  setCategory: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
}

export default function RoutineFormInputs({
  title,
  setTitle,
  description,
  setDescription,
  dayOfWeek,
  setDayOfWeek,
  category,
  setCategory,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: RoutineFormInputsProps) {
  return (
    <>
      <div style={{ marginBottom: "0.875rem" }}>
        <label className="input-label" htmlFor="routine-title">Routine Title *</label>
        <input
          id="routine-title"
          type="text"
          placeholder="e.g. Study React, Morning Workout"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
          autoFocus
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <div>
          <label className="input-label" htmlFor="routine-day">Day of Week</label>
          <select
            id="routine-day"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
            className="input-field"
          >
            {DAYS_OF_WEEK.map((d) => (
              <option key={d.key} value={d.key}>{d.fullLabel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label" htmlFor="routine-cat">Category</label>
          <select
            id="routine-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {ROUTINE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <div>
          <label className="input-label" htmlFor="routine-start">Start Time</label>
          <input
            id="routine-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="input-label" htmlFor="routine-end">End Time</label>
          <input
            id="routine-end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input-field"
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: "0.875rem" }}>
        <label className="input-label" htmlFor="routine-desc">Description (Optional)</label>
        <textarea
          id="routine-desc"
          placeholder="Optional notes or goals for this routine..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          rows={2}
        />
      </div>
    </>
  );
}

