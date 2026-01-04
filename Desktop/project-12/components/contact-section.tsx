"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function ContactSection() {
    return (
        <section id="contact" className="relative flex min-h-[80vh] w-full flex-col items-center justify-center bg-cinema-black py-20 px-6 text-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
                <div className="h-[500px] w-[500px] animate-pulse rounded-full bg-cinema-gold blur-[150px]" />
            </div>

            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 mb-10 text-6xl font-black uppercase text-white md:text-9xl"
            >
                Let's Talk
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10 max-w-2xl text-xl text-white/60 md:text-2xl"
            >
                Have a project/idea in mind? Let's build something <span className="text-cinema-orange">extraordinary</span> together.
            </motion.p>

            <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-8">
                {[
                    { icon: FaEnvelope, href: "mailto:yashwanth.32997@gmail.com", label: "Email" },
                    { icon: FaGithub, href: "https://github.com/Yashwanth-H-M", label: "GitHub" },
                    { icon: FaLinkedin, href: "https://www.linkedin.com/in/yashwanth-h-m-02531a370", label: "LinkedIn" },
                ].map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-2"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl text-white transition-all duration-300 group-hover:scale-110 group-hover:border-cinema-gold group-hover:bg-cinema-gold group-hover:text-black">
                            <item.icon />
                        </div>
                        <span className="text-sm font-medium text-white/40 group-hover:text-white">
                            {item.label}
                        </span>
                    </a>
                ))}
            </div>

            <footer className="absolute bottom-6 w-full text-center text-sm text-white/20">
                © {new Date().getFullYear()} Yashwanth H M. Built with Next.js & GSAP.
            </footer>
        </section>
    );
}
