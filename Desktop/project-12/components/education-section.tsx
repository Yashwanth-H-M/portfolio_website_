"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const education = [
    {
        institution: "Anikethana P U College",
        degree: "Higher Secondary Education",
        year: "2023 — 2025",
        location: "Mandya, KA",
        description: "Foundation in Science and Mathematics.",
    },
    {
        institution: "NxtWave Institute x Sanjay Ghodawat University",
        degree: "B.Tech in AI & Data Science",
        year: "2025 — 2029",
        location: "Kolhapur, MH",
        description: "Specializing in Artificial Intelligence and scalable system architectures.",
    }
];

export default function EducationSection() {
    const containerRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Timeline Line Animation
            gsap.fromTo(lineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: "none",
                    transformOrigin: "top",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1,
                    }
                }
            );

            // Card Reveals
            const cards = gsap.utils.toArray(".edu-card");
            cards.forEach((card: any) => {
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
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
        <section ref={containerRef} id="education" className="relative w-full bg-cinema-black py-20 px-6 md:px-20">

            {/* Header */}
            <div className="mb-20 flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold uppercase tracking-widest text-white md:text-5xl">
                    Academic <span className="text-cinema-gold">Timeline</span>
                </h2>
                <div className="mt-4 h-1 w-20 rounded-full bg-cinema-orange" />
            </div>

            <div className="relative mx-auto max-w-4xl">
                {/* Vertical Line */}
                <div
                    ref={lineRef}
                    className="absolute left-[19px] top-0 h-full w-[2px] bg-gradient-to-b from-cinema-gold to-transparent md:left-1/2 md:-translate-x-1/2"
                />

                {/* Education Items */}
                <div className="flex flex-col gap-12 md:gap-20">
                    {education.map((item, index) => (
                        <div
                            key={index}
                            className={`edu-card relative flex flex-col gap-6 md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >

                            {/* Timeline Dot */}
                            <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-cinema-gold bg-black shadow-[0_0_20px_rgba(255,215,0,0.3)] md:left-1/2 md:-translate-x-1/2">
                                <div className="h-3 w-3 rounded-full bg-cinema-orange" />
                            </div>

                            {/* Content Card */}
                            <div className="ml-16 w-full md:ml-0 md:w-[45%]">
                                <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-cinema-gold/30 hover:bg-white/10">
                                    <span className="mb-2 inline-block text-sm font-medium text-cinema-gold">
                                        {item.year}
                                    </span>
                                    <h3 className="mb-1 text-2xl font-bold text-white group-hover:text-cinema-orange transition-colors">
                                        {item.institution}
                                    </h3>
                                    <p className="mb-4 text-lg text-white/80">
                                        {item.degree} <span className="text-white/40">• {item.location}</span>
                                    </p>
                                    <p className="text-base text-white/50">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* Empty Space for Grid alignment */}
                            <div className="hidden w-[45%] md:block" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
