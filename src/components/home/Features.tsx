
import Reveal from "./Reveal";

const FEATURES = [
    {
        number: "01",
        title: "Make space for your priorities.",
        body: "Add, edit, organize and complete daily tasks without turning your day into another complicated system.",
        label: "TASK MANAGEMENT",
        visual: "task",
    },
    {
        number: "02",
        title: "Know what deserves your attention.",
        body: "Use urgent, high, medium and low priorities to decide what needs your attention first.",
        label: "SMART PRIORITIES",
        visual: "priority",
    },
    {
        number: "03",
        title: "See your progress take shape.",
        body: "Track completed tasks and understand how your everyday effort adds up over time.",
        label: "DAILY PROGRESS",
        visual: "progress",
    },
    {
        number: "04",
        title: "Your workspace, your permissions.",
        body: "Members manage personal tasks while admins have a dedicated space to oversee users and activities.",
        label: "WORKSPACE ACCESS",
        visual: "workspace",
    },
];

function FeatureVisual({ type }: { type: string }) {
    if (type === "task") {
        return (
            <div className="os-visual os-task-visual">
                <div className="os-visual-heading">
                    <span>Today's focus</span>
                    <span className="os-visual-counter">03 / 05</span>
                </div>
                {[
                    ["Finish important work", true],
                    ["Review daily goals", true],
                    ["Take a proper break", false],
                ].map(([title, done]) => (
                    <div className="os-mini-task" key={String(title)}>
                        <span className={`os-mini-check ${done ? "checked" : ""}`}>
                            {done ? "✓" : ""}
                        </span>
                        <span className={done ? "os-mini-done" : ""}>{title}</span>
                    </div>
                ))}
                <div className="os-mini-track">
                    <span style={{ width: "60%" }} />
                </div>
            </div>
        );
    }

    if (type === "priority") {
        return (
            <div className="os-visual os-priority-visual">
                {[
                    ["Urgent", "os-p-urgent", "Act now"],
                    ["High", "os-p-high", "Up next"],
                    ["Medium", "os-p-medium", "When ready"],
                    ["Low", "os-p-low", "No rush"],
                ].map(([name, cls, desc]) => (
                    <div className="os-priority-row" key={name}>
                        <span className={`os-priority-mark ${cls}`} />
                        <span>{name}</span>
                        <span className="os-priority-desc">{desc}</span>
                    </div>
                ))}
            </div>
        );
    }

    if (type === "progress") {
        return (
            <div className="os-visual os-progress-visual">
                <div className="os-progress-top">
                    <span>Daily completion</span>
                    <strong>75%</strong>
                </div>
                <div className="os-progress-ring">
                    <div className="os-progress-ring-inner">
                        <strong>75%</strong>
                        <span>completed</span>
                    </div>
                </div>
                <div className="os-progress-caption">
                    Small steps still count.
                </div>
            </div>
        );
    }

    return (
        <div className="os-visual os-workspace-visual">
            <div className="os-workspace-top">
                <span className="os-workspace-dot" />
                Workspace access
            </div>
            <div className="os-workspace-role">
                <span className="os-role-symbol">M</span>
                <span>
                    <strong>Member</strong>
                    <small>Personal tasks and progress</small>
                </span>
                <span className="os-access-check">✓</span>
            </div>
            <div className="os-workspace-role">
                <span className="os-role-symbol admin">A</span>
                <span>
                    <strong>Administrator</strong>
                    <small>User and activity management</small>
                </span>
                <span className="os-access-check">✓</span>
            </div>
        </div>
    );
}

export default function Features() {
    return (
        <section className="os-section os-features" id="features">
            <div className="os-container">
                <Reveal className="os-section-intro">
                    <span className="os-kicker">A BETTER WAY TO PLAN</span>
                    <h2 className="os-section-heading">
                        Less chaos.
                        <br />
                        <span>More of what matters.</span>
                    </h2>
                    <p className="os-section-description">
                        Everything you need to organize your day,
                        without making productivity another chore.
                    </p>
                </Reveal>

                <div className="os-feature-list">
                    {FEATURES.map((feature, index) => (
                        <Reveal
                            key={feature.number}
                            className={`os-feature-row ${index % 2 ? "reverse" : ""}`}
                            delay={index * 70}
                        >
                            <div className="os-feature-copy">
                                <span className="os-feature-number">{feature.number}</span>
                                <span className="os-kicker">{feature.label}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.body}</p>
                                <span className="os-feature-line" />
                            </div>

                            <div className="os-feature-art">
                                <FeatureVisual type={feature.visual} />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
