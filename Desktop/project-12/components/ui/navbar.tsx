"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FaHome, FaUser, FaProjectDiagram, FaEnvelope } from "react-icons/fa";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
    { name: "Home", href: "/", icon: FaHome },
    { name: "Work", href: "/#projects", icon: FaProjectDiagram },
    { name: "About", href: "/#about", icon: FaUser },
    { name: "Contact", href: "/#contact", icon: FaEnvelope },
];

export default function Navbar() {
    const pathname = usePathname();
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:border-cinema-gold/30 hover:bg-black/80"
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onMouseEnter={() => setHovered(item.name)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative flex flex-col items-center justify-center p-2"
                    >
                        {/* Hover Background */}
                        {hovered === item.name && (
                            <motion.div
                                layoutId="nav-hover"
                                className="absolute inset-0 rounded-xl bg-white/10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}

                        {/* Icon */}
                        <div className={clsx(
                            "relative z-10 text-xl transition-colors duration-300",
                            isActive || hovered === item.name ? "text-cinema-gold" : "text-white/60"
                        )}>
                            <Icon />
                        </div>

                        {/* Tooltip */}
                        {hovered === item.name && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: -45 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-cinema-gold px-2 py-1 text-xs font-bold text-black"
                            >
                                {item.name}
                                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-cinema-gold" />
                            </motion.div>
                        )}
                    </Link>
                );
            })}
        </motion.nav>
    );
}
