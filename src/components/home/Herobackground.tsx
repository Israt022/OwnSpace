/** Decorative animated hero background. Keep this component presentational. */
const PARTICLES = [
    { x: "8%", y: "22%", delay: "0s", size: "5px" },
    { x: "18%", y: "70%", delay: "-3s", size: "4px" },
    { x: "31%", y: "38%", delay: "-6s", size: "6px" },
    { x: "46%", y: "82%", delay: "-2s", size: "4px" },
    { x: "61%", y: "24%", delay: "-8s", size: "5px" },
    { x: "73%", y: "61%", delay: "-4s", size: "4px" },
    { x: "86%", y: "32%", delay: "-7s", size: "6px" },
    { x: "94%", y: "78%", delay: "-1s", size: "4px" },
];

export default function HeroBackground() {
    return (
        <div className="hero-bg" aria-hidden="true">
            <div className="hero-bg-grid" />
            <div className="hero-bg-glow hero-bg-glow-one" />
            <div className="hero-bg-glow hero-bg-glow-two" />
            <div className="hero-bg-lines">
                <span className="hero-bg-line hero-bg-line-one" />
                <span className="hero-bg-line hero-bg-line-two" />
                <span className="hero-bg-line hero-bg-line-three" />
            </div>
            {PARTICLES.map((particle, index) => (
                <span
                    key={index}
                    className="hero-bg-particle"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        animationDelay: particle.delay,
                        width: particle.size,
                        height: particle.size,
                    }}
                />
            ))}
        </div>
    );
}
