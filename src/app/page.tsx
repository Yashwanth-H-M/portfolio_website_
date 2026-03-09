"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GlassNav } from "@/components/layout/GlassNav"
import { GlassSearchBar } from "@/components/ui/GlassSearchBar"
import { AlertTriangle, Database, Globe2, Shield, Users } from "lucide-react"

const METRICS = [
  { label: "Tracked Individuals", value: "2,405", icon: Users, trend: "+12%", color: "#0EA5E9" },
  { label: "Corporate Entities", value: "14,290", icon: Database, trend: "+4.2%", color: "#22C55E" },
  { label: "High-Risk Shells", value: "843", icon: AlertTriangle, trend: "+1.5%", color: "#F59E0B" },
  { label: "Jurisdictions Covered", value: "134", icon: Globe2, trend: "Global", color: "#A855F7" },
]

import { motion, Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export default function Home() {
  const router = useRouter()
  const [isSearching, setIsSearching] = React.useState(false)

  const handleSearch = (query: string) => {
    setIsSearching(true)
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }, 400)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background orbs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", top: "15%", left: "10%",
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(40px)",
          }}
        />
        <motion.div
           animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.06, 0.1, 0.06]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", bottom: "20%", right: "5%",
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(40px)",
          }}
        />
      </div>

      <GlassNav />

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-40 pb-24 min-h-screen">
        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto mb-14"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full glass text-sm text-slate-300 font-medium">
            <span className="size-2 rounded-full bg-green-400 animate-pulse" />
            Live Intelligence — 134 jurisdictions monitored
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6 text-[#f0f4f8]"
          >
            Track the world&apos;s{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #38BDF8, #0EA5E9, #7DD3FC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              wealth.
            </span>
            <br />
            <span className="text-slate-400 text-4xl md:text-5xl font-semibold">
              Wherever it hides.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Advanced financial intelligence for investigators, journalists, and compliance teams. Uncover shell companies, map global ownership, and track sanctioned networks.
          </motion.p>

          {/* Search */}
          <motion.div variants={itemVariants} className="w-full max-w-3xl mx-auto mt-12 mb-4">
            <GlassSearchBar onSearch={handleSearch} isLoading={isSearching} />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 mb-24 text-sm text-slate-500">
            <span>Try:</span>
            {["Elon Musk", "BlackRock", "Panama Papers", "Cayman Islands"].map((q) => (
              <button
                key={q}
                onClick={() => handleSearch(q)}
                className="px-3 py-1 rounded-full transition-colors hover:text-slate-200"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {q}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Metrics row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="w-full max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {METRICS.map((m) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.label}
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)" }}
                className="glass rounded-2xl p-5 flex flex-col gap-3 group transition-colors"
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</span>
                  <div
                    className="size-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
                  >
                    <Icon className="size-4" style={{ color: m.color }} />
                  </div>
                </div>
                <div className="text-3xl font-mono font-bold text-white">{m.value}</div>
                <div
                  className="text-xs font-medium px-2 py-0.5 rounded-full self-start"
                  style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}25` }}
                >
                  {m.trend}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-xs text-slate-600">
          <div className="flex items-center gap-1.5"><Shield className="size-3 text-slate-500" /> SOC 2 Compliant</div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5"><Shield className="size-3 text-slate-500" /> GDPR Aligned</div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5"><Shield className="size-3 text-slate-500" /> Editorial Standards</div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5"><Globe2 className="size-3 text-slate-500" /> 50+ Data Sources</div>
        </div>
      </main>
    </div>
  )
}
