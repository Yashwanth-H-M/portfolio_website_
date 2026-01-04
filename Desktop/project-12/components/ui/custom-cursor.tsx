"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        // Disable on touch devices
        if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;

        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        // Center the cursor
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        gsap.set(follower, { xPercent: -50, yPercent: -50 });

        const pos = { x: 0, y: 0 };
        const mouse = { x: 0, y: 0 };
        const speed = 0.1; // Follower lag speed

        // Quick setters for performance
        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");
        const fwXSet = gsap.quickSetter(follower, "x", "px");
        const fwYSet = gsap.quickSetter(follower, "y", "px");

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            xSet(mouse.x);
            ySet(mouse.y);
        };

        // Animation loop for smooth follower
        const ticker = gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;
            fwXSet(pos.x);
            fwYSet(pos.y);
        });

        window.addEventListener("mousemove", onMouseMove);

        // Hover effect listeners
        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        // Attach to all interactive elements
        // Note: In a real SPA, this needs to be re-run or use event delegation.
        // We'll use event delegation on body for simplicity.
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.matches("a, button, input, textarea, [data-hover]")) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        // Better approach: use event capturing or delegation check on mousemove is expensive.
        // Instead we can just add listeners to body and check e.target
        // But for hover *state* transition, mouseover/out is better.
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", () => setIsHovering(false)); // Simplistic, might flicker

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", () => setIsHovering(false));
            gsap.ticker.remove(ticker);
        };
    }, []);

    useEffect(() => {
        const follower = followerRef.current;
        if (!follower) return;

        if (isHovering) {
            gsap.to(follower, {
                scale: 3,
                backgroundColor: "rgba(255, 215, 0, 0.1)", // Gold transparent
                borderColor: "rgba(255, 215, 0, 0.5)",
                duration: 0.3,
            });
        } else {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: "transparent",
                borderColor: "rgba(255, 255, 255, 0.3)",
                duration: 0.3,
            });
        }
    }, [isHovering]);

    return (
        <>
            <div
                ref={cursorRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-cinema-gold mix-blend-difference"
            />
            <div
                ref={followerRef}
                className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-white/20 transition-opacity duration-300"
            />
        </>
    );
}
