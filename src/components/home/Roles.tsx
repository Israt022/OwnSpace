
import Reveal from "./Reveal";

const MEMBER = [
    "Personal daily task dashboard",
    "Task categories and priority levels",
    "Progress tracking for your own tasks",
];

const ADMIN = [
    "Dedicated admin dashboard",
    "User and role management",
    "Workspace activity oversight",
];

function RoleSection({
    number,
    title,
    description,
    items,
    variant,
}: {
    number: string;
    title: string;
    description: string;
    items: string[];
    variant: "member" | "admin";
}) {
    return (
        <div className={`os-role-panel ${variant}`}>
            <div className="os-role-panel-top">
                <span className="os-role-big-number">{number}</span>
                <span className="os-role-type">
                    {variant === "member" ? "PERSONAL SPACE" : "WORKSPACE CONTROL"}
                </span>
            </div>

            <h3>{title}</h3>
            <p className="os-role-description">{description}</p>

            <div className="os-role-divider" />

            <ul className="os-role-list">
                {items.map((item) => (
                    <li key={item}>
                        <span className="os-role-list-check">↗</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Roles() {
    return (
        <section className="os-section os-roles" id="roles">
            <div className="os-container">
                <Reveal className="os-roles-intro">
                    <span className="os-kicker">TWO ROLES. ONE WORKSPACE.</span>
                    <h2 className="os-section-heading">
                        Different responsibilities.
                        <br />
                        <span>One organized space.</span>
                    </h2>
                </Reveal>

                <div className="os-role-split">
                    <Reveal delay={0}>
                        <RoleSection
                            number="01"
                            title="For members."
                            description="Your day belongs to you. Organize your tasks and build a routine around your own goals."
                            items={MEMBER}
                            variant="member"
                        />
                    </Reveal>

                    <Reveal delay={120}>
                        <RoleSection
                            number="02"
                            title="For admins."
                            description="Keep the workspace organized with dedicated tools for users, permissions and activities."
                            items={ADMIN}
                            variant="admin"
                        />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
