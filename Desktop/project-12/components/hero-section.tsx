"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reveal animation
        const tl = gsap.timeline();
        const textChildren = Array.from(textRef.current?.children || []);

        tl.fromTo(textChildren,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.2 }
        );

        tl.fromTo(imageRef.current,
            { scale: 0.8, opacity: 0, rotationY: 10 },
            { scale: 1, opacity: 1, rotationY: 0, duration: 1.5, ease: "poster.out" },
            "-=1.0"
        );

        // Parallax on scroll
        gsap.to(imageRef.current, {
            y: 150,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        gsap.to(textRef.current, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

    }, []);

    return (
        <section ref={containerRef} className="relative flex min-h-screen w-full flex-col-reverse items-center justify-center gap-10 overflow-hidden px-6 pt-20 md:flex-row md:gap-20 md:px-20 md:pt-0">

            {/* Text Content */}
            <div ref={textRef} className="z-10 flex flex-col items-center text-center md:items-start md:text-left">
                <h2 className="mb-2 text-xl font-medium text-cinema-gold">Hello, I'm</h2>
                <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-[8rem] lg:text-[10rem]">
                    Yashwanth<br />
                    <span className="text-transparent" style={{ WebkitTextStroke: "2px #444" }}>H M</span>
                </h1>
                <p className="mt-8 max-w-lg text-lg text-white/60 md:text-2xl">
                    <span className="text-white">AI & Data Science Student</span> based in India.
                    Creating <span className="text-cinema-orange">immersive</span> web experiences.
                </p>

                <div className="mt-10 flex gap-6">
                    <a href="#projects" className="group relative flex h-12 w-40 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 font-medium text-white transition-all hover:border-cinema-gold hover:bg-cinema-gold/10">
                        <div className="absolute inset-0 translate-y-[102%] bg-cinema-gold transition-transform duration-300 ease-out group-hover:translate-y-0" />
                        <span className="relative z-10 group-hover:text-black">View Work</span>
                    </a>
                    <a href="#contact" className="group flex h-12 w-40 items-center justify-center rounded-full border border-white/10 font-medium text-white/80 transition-colors hover:border-white hover:bg-white/5 hover:text-white">
                        Contact Me
                    </a>
                </div>
            </div>

            {/* Image Content */}
            <div ref={imageRef} className="perspective-1000 relative">
                <div className="relative h-[300px] w-[300px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 md:h-[500px] md:w-[400px]">
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <Image
                        src="/profile.jpg"
                        alt="Yashwanth H M"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        priority
                    />

                    {/* Decorative elements */}
                    <div className="absolute -bottom-10 -right-10 z-0 h-40 w-40 rounded-full bg-cinema-orange blur-[80px]" />
                    <div className="absolute -top-10 -left-10 z-0 h-40 w-40 rounded-full bg-cinema-gold blur-[80px]" />
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>

        </section>
    )
}
