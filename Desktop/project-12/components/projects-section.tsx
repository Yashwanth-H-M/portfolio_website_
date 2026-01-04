"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const projects = [
    {
        title: "Immersive Portfolio",
        category: "Web Interaction",
        description: "A living digital environment built with Next.js & GSAP.",
        skills: ["Next.js", "GSAP", "Tailwind"],
    },
    {
        title: "Mediverify",
        category: "AI & Healthcare",
        description: "AI-integrated platform verifying prescriptions and medicine interactions.",
        skills: ["TypeScript", "HTML", "AI/ML Integration"],
    },
    {
        title: "Coming Soon",
        category: "In Development",
        description: "Something exciting is in the works. Stay tuned for updates.",
        skills: ["Loading..."],
    },
];

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Horizontal Scroll Setup (Desktop mainly)
            // For simplicity and stability, we'll use a vertical stack with huge reveal effects for now,
            // as horizontal scroll can be tricky with Lenis often requiring specific configuration.
            // Let's stick to a premium vertical listing with sticky headers or reveals.

            const cards = gsap.utils.toArray(".project-card");
            cards.forEach((card: any) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 30%",
                        scrub: 1,
                    },
                    scale: 0.9,
                    opacity: 0.5,
                    transformOrigin: "center center",
                });
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="projects" className="relative w-full bg-cinema-black py-20 px-6 md:px-20">
            <div className="mb-20">
                <h2 className="text-5xl font-black uppercase text-white md:text-8xl">
                    Selected <br /> <span className="text-outline text-transparent" style={{ WebkitTextStroke: "1px #666" }}>Works</span>
                </h2>
            </div>

            <div ref={containerRef} className="flex flex-col gap-20">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="project-card group relative flex min-h-[500px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-colors hover:border-cinema-gold/30 md:flex-row"
                    >
                        {/* Project Info */}
                        <div className="flex flex-1 flex-col justify-between p-10">
                            <div>
                                <span className="mb-4 inline-block rounded-full border border-cinema-gold/30 px-3 py-1 text-xs text-cinema-gold">
                                    {project.category}
                                </span>
                                <h3 className="mb-4 text-4xl font-bold text-white group-hover:text-cinema-gold transition-colors">{project.title}</h3>
                                <p className="max-w-md text-lg text-white/60">{project.description}</p>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {project.skills.map((skill) => (
                                    <span key={skill} className="text-sm font-medium text-white/40">{skill}</span>
                                ))}
                            </div>
                        </div>

                        {/* Visual Placeholder */}
                        <div className="relative min-h-[300px] flex-1 overflow-hidden bg-gradient-to-br from-gray-900 to-black md:min-h-full">
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 transition-opacity duration-500 group-hover:opacity-50">
                                <div className="h-40 w-40 rounded-full bg-cinema-orange blur-[80px]" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Could place an image here */}
                                <span className="text-8xl font-black text-white/5 opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100">
                                    {index + 1}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
