"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const skills = [
    "Next.js", "React", "TypeScript", "GSAP", "Three.js",
    "Tailwind CSS", "Node.js", "Python", "Framer Motion",
    "WebGL", "PostgreSQL", "Docker", "AWS", "Git"
];

export default function SkillsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title Reveal
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });

            // Staggered Skills Reveal
            const skillTags = gsap.utils.toArray(".skill-tag");
            gsap.from(skillTags, {
                scrollTrigger: {
                    trigger: skillsRef.current,
                    start: "top 85%",
                },
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.7)",
            });

            // Floating Animation Loop
            skillTags.forEach((tag: any) => {
                gsap.to(tag, {
                    y: "random(-10, 10)",
                    x: "random(-5, 5)",
                    rotation: "random(-5, 5)",
                    duration: "random(2, 4)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 2,
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative flex min-h-[50vh] w-full flex-col items-center justify-center bg-cinema-black py-20">
            <h2 ref={titleRef} className="mb-16 text-4xl font-bold uppercase tracking-tighter text-white md:text-6xl">
                Technical <span className="text-cinema-orange">Arsenal</span>
            </h2>

            <div ref={skillsRef} className="flex max-w-5xl flex-wrap justify-center gap-4 px-6">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="skill-tag cursor-default rounded-full border border-white/10 bg-white/5 px-6 py-3 text-lg font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-cinema-gold hover:bg-cinema-gold/20 hover:text-white"
                    >
                        {skill}
                    </div>
                ))}
            </div>
        </section>
    );
}
