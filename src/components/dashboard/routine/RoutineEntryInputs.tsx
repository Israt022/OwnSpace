"use client";

import { DayOfWeek } from "@server/types";
import { DAYS_MONDAY_START, TIMETABLE_CATEGORIES } from "@/lib/constants/routine";

interface RoutineEntryInputsProps {
  title: string;
  setTitle: (val: string) => void;
  dayOfWeek: DayOfWeek;
  setDayOfWeek: (val: DayOfWeek) => void;
  category: string;
  setCategory: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

export default function RoutineEntryInputs({
  title,
  setTitle,
  dayOfWeek,
  setDayOfWeek,
  category,
  setCategory,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  location,
  setLocation,
  description,
  setDescription,
}: RoutineEntryInputsProps) {
  return (
    <>
      <div style={{ marginBottom: "0.875rem" }}>
        <label className="input-label" htmlFor="entry-title">Activity Title / Subject *</label>
        <input
          id="entry-title"
          type="text"
          placeholder="e.g. Operating Systems, Chemistry Lab, Deep Study"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
          autoFocus
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <div>
          <label className="input-label" htmlFor="entry-day">Day of Week</label>
          <select
            id="entry-day"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
            className="input-field"
          >
            {DAYS_MONDAY_START.map((d) => (
              <option key={d.key} value={d.key}>{d.fullLabel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label" htmlFor="entry-cat">Category / Type</label>
          <select
            id="entry-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {TIMETABLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <div>
          <label className="input-label" htmlFor="entry-start">Start Time</label>
          <input
            id="entry-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="input-label" htmlFor="entry-end">End Time</label>
          <input
            id="entry-end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input-field"
            required
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <div>
          <label className="input-label" htmlFor="entry-loc">Location / Room (Optional)</label>
          <input
            id="entry-loc"
            type="text"
            placeholder="e.g. Room 402, Campus Gym"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="input-label" htmlFor="entry-desc">Notes / Topic (Optional)</label>
          <input
            id="entry-desc"
            type="text"
            placeholder="e.g. Chapter 5 revision"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </>
  );
}

