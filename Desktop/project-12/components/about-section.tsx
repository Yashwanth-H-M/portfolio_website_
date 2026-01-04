"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const text = textRef.current;
        if (!text) return;

        // Simple reveal
        gsap.fromTo(
            text,
            { opacity: 0.2, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    end: "bottom 70%",
                    scrub: 1,
                },
            }
        );
    }, []);

    return (
        <section
            ref={containerRef}
            id="about"
            className="relative flex min-h-[60vh] w-full items-center justify-center bg-cinema-black py-20 px-6 md:px-20"
        >
            <div className="max-w-4xl text-center">
                <h2 className="mb-10 text-sm font-bold uppercase tracking-widest text-white/40">
                    Philosophy
                </h2>
                <p
                    ref={textRef}
                    className="text-3xl font-medium leading-relaxed text-white md:text-5xl md:leading-tight"
                >
                    I believe the web should contain <span className="text-cinema-gold">magic</span>.
                    It’s not just about information—it’s about <span className="text-cinema-orange">feeling</span>.
                    I build digital environments that breathe, react, and leave a lasting impression.
                </p>
            </div>
        </section>
    );
}
