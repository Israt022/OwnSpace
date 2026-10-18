"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Bell, Shield, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SessionUser } from "@/lib/session";
import ConfirmDialog from "../shared/ConfirmDialog";

interface UserSettingsFormProps {
  user: SessionUser;
}

export default function UserSettingsForm({ user }: UserSettingsFormProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [defaultCategory, setDefaultCategory] = useState("Work");
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const savedNotifs = localStorage.getItem("ownspace_pref_notifs");
    if (savedNotifs !== null) setNotifications(savedNotifs === "true");

    const savedCat = localStorage.getItem("ownspace_pref_cat");
    if (savedCat) setDefaultCategory(savedCat);
  }, []);

  const handleNotifToggle = () => {
    const nextVal = !notifications;
    setNotifications(nextVal);
    localStorage.setItem("ownspace_pref_notifs", String(nextVal));
  };

  const handleCatChange = (cat: string) => {
    setDefaultCategory(cat);
    localStorage.setItem("ownspace_pref_cat", cat);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "680px" }}>
      {/* Appearance Section */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
          Appearance & Theme
        </h3>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          Customize how OwnSpace looks across your workspace.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
          {[
            { id: "light", label: "Light", icon: Sun },
            { id: "dark", label: "Dark", icon: Moon },
            { id: "system", label: "System", icon: Laptop },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem",
                borderRadius: "0.75rem",
                border: theme === item.id ? "2px solid var(--color-brand-500)" : "1px solid var(--border)",
                background: theme === item.id ? "rgba(99, 102, 241, 0.1)" : "var(--card)",
                cursor: "pointer",
                color: "var(--foreground)",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Preferences */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
          Task Workspace Preferences
        </h3>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          Default defaults when creating tasks.
        </p>

        <div style={{ marginBottom: "1.25rem" }}>
          <label className="input-label" htmlFor="pref-default-cat">Default Category</label>
          <select
            id="pref-default-cat"
            value={defaultCategory}
            onChange={(e) => handleCatChange(e.target.value)}
            className="input-field"
          >
            {["Work", "Personal", "Study", "Health", "Fitness", "General"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>
              Audio & Haptic Task Celebrations
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              Play subtle satisfaction feedback when checking off items.
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={handleNotifToggle}
            className="custom-checkbox"
          />
        </div>
      </div>

      {/* Account Session / Danger Zone */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
          Account & Session
        </h3>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          Signed in as {user.email}
        </p>

        <button
          onClick={() => setConfirmSignOut(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.25rem",
            borderRadius: "0.625rem",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          <LogOut size={16} /> Sign Out of OwnSpace
        </button>
      </div>

      <ConfirmDialog
        isOpen={confirmSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out of your OwnSpace account?"
        confirmLabel="Sign Out"
        isDestructive={true}
        isLoading={signingOut}
        onConfirm={handleSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </div>
  );
}
