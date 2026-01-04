"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const experience = [
    {
        company: "YapaYasa Retail OPC Private Limited",
        role: "Software Engineering Intern",
        period: "Dec 2025 — Present",
        description: [
            "Developed responsive frontend components using React.js, improving page load speed and mobile compatibility.",
            "Integrated REST APIs to fetch dynamic user data, ensuring seamless communication between client and backend.",
            "Used Git for version control and team collaboration to maintain code integrity."
        ],
    }
];

export default function ExperienceSection() {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".exp-card");

            cards.forEach((card: any) => {
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="experience" className="relative w-full bg-cinema-black py-20 px-6 md:px-20">
            <div className="mb-16 text-center">
                <h2 className="text-4xl font-bold uppercase tracking-widest text-white md:text-5xl">
                    Professional <span className="text-cinema-orange">Journey</span>
                </h2>
                <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-cinema-gold" />
            </div>

            <div className="mx-auto flex max-w-4xl flex-col gap-10">
                {experience.map((exp, index) => (
                    <div
                        key={index}
                        className="exp-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-cinema-orange/50 hover:bg-white/10"
                    >
                        <div className="absolute inset-0 z-0 bg-gradient-to-r from-cinema-orange/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white group-hover:text-cinema-orange transition-colors">
                                    {exp.company}
                                </h3>
                                <p className="text-lg text-white/80">{exp.role}</p>
                            </div>
                            <div className="whitespace-nowrap rounded-full border border-white/20 px-4 py-1 text-sm text-cinema-gold">
                                {exp.period}
                            </div>
                        </div>

                        <ul className="relative z-10 mt-6 flex flex-col gap-2 text-white/60">
                            {exp.description.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 min-w-[6px] rounded-full bg-cinema-orange" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
