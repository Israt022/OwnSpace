
import Reveal from "./Reveal";

const STEPS = [
    {
        number: "01",
        title: "Start with a blank space.",
        body: "Create your account and begin with a workspace you can make your own.",
        note: "MAKE IT YOURS",
    },
    {
        number: "02",
        title: "Build a routine that fits.",
        body: "Add tasks, choose categories, set priorities and organize what matters to you.",
        note: "FIND YOUR FLOW",
    },
    {
        number: "03",
        title: "Show up. Make progress.",
        body: "Complete tasks, follow your progress and keep moving one day at a time.",
        note: "PROGRESS, NOT PRESSURE",
    },
];

export default function HowItWorks() {
    return (
        <section className="os-section os-how" id="how-it-works">
            <div className="os-container">
                <Reveal className="os-how-heading">
                    <span className="os-kicker">A SIMPLE DAILY RITUAL</span>
                    <h2 className="os-section-heading">
                        Your day.
                        <br />
                        <span>Under your control.</span>
                    </h2>
                    <p className="os-section-description">
                        No complicated systems. Just a little structure
                        to help you make the most of your time.
                    </p>
                </Reveal>

                <div className="os-timeline">
                    <div className="os-timeline-track">
                        <span />
                    </div>

                    {STEPS.map((step, index) => (
                        <Reveal
                            key={step.number}
                            className={`os-timeline-step step-${index + 1}`}
                            delay={index * 120}
                        >
                            <div className="os-timeline-marker">
                                <span>{step.number}</span>
                            </div>

                            <div className="os-timeline-content">
                                <span className="os-kicker">{step.note}</span>
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                            </div>

                            <span className="os-step-index">
                                STEP {step.number}
                            </span>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
