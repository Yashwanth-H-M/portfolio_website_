"use client"

import * as React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { GlassNav } from "@/components/layout/GlassNav"
import { Activity, AlertTriangle, Bell, Brain, Briefcase, Eye, Search, ShieldAlert, TrendingUp, Users, Zap, LayoutDashboard } from "lucide-react"
import { SituationRoom } from "@/components/dashboard/SituationRoom"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const feedItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const ICE = "#0EA5E9"
const AMBER = "#F59E0B"
const RED = "#EF4444"
const GREEN = "#22C55E"
const PURPLE = "#A855F7"

function Glass({
  children, strong = false, subtle = false, className = "", style = {},
}: {
  children: React.ReactNode; strong?: boolean; subtle?: boolean; className?: string; style?: React.CSSProperties
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: strong ? "rgba(255,255,255,0.09)" : subtle ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid rgba(255,255,255,${strong ? 0.13 : subtle ? 0.04 : 0.08})`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const METRICS = [
  { label: "Active Watchlists", value: 12, icon: Eye, color: ICE },
  { label: "Saved Searches", value: 84, icon: Search, color: PURPLE },
  { label: "High-Risk Alerts", value: 3, icon: ShieldAlert, color: AMBER, glow: true },
  { label: "Monitored Entities", value: "1.4k", icon: Users, color: GREEN, trend: "+12% this week" },
]

const ALERTS = [
  { time: "10m ago", entity: "Alexander Volkov", text: "$45M asset transfer detected from Apex Global SA.", risk: "high" },
  { time: "2h ago", entity: "Volkov Family Trust", text: "New corporate layer added to Mediterranean Holdings.", risk: "medium" },
  { time: "5h ago", entity: "Ivanov Enterprises", text: "Added to OFAC sanctions updated list.", risk: "critical" },
  { time: "1d ago", entity: "Global Tech Inc", text: "ICIJ publishes report on unrecorded BVI shell companies.", risk: "low" },
]

const RISK_COLORS: Record<string, string> = {
  critical: RED,
  high: AMBER,
  medium: ICE,
  low: "#334155",
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSituationRoomOpen, setIsSituationRoomOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen">
      <GlassNav />
      <main className="mx-auto px-6 md:px-12 pt-32 pb-16 space-y-8">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold font-mono text-white tracking-tight text-glow">Intelligence Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm">Real-time monitoring and alert management</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative size-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Bell className="size-5 text-slate-400" />
              <span
                className="absolute top-1.5 right-1.5 size-2 rounded-full"
                style={{ background: RED, boxShadow: `0 0 6px ${RED}` }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${ICE}70` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSituationRoomOpen(true)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${ICE}, #38BDF8)`,
                color: "#fff",
                boxShadow: `0 0 20px ${ICE}50`,
              }}
            >
              <LayoutDashboard className="size-4" />
              Situation Room
            </motion.button>
            <motion.button
              whileHover={{ background: "rgba(255,255,255,0.1)" }}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/10 bg-white/5 text-white"
            >
              New Investigation
            </motion.button>
          </div>
        </motion.div>

        <SituationRoom isOpen={isSituationRoomOpen} onClose={() => setIsSituationRoomOpen(false)} />

        {/* Metrics Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {METRICS.map((m) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.label}
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.15)" }}
              >
                <Glass
                  className="p-5 flex flex-col gap-3 h-full cursor-pointer"
                  style={m.glow ? { boxShadow: `0 0 20px ${m.color}20`, border: `1px solid ${m.color}30` } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{m.label}</span>
                    <div
                      className="size-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
                    >
                      <Icon className="size-4" style={{ color: m.color }} />
                    </div>
                  </div>
                  <span className="text-3xl font-mono font-bold text-white tracking-widest">{m.value}</span>
                  {m.trend && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
                      style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}25` }}
                    >
                      {m.trend}
                    </span>
                  )}
                </Glass>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Live Feed & Predictions */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="size-5" style={{ color: ICE }} />
                Live Intelligence Feed
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse"
                  style={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}30` }}
                >
                  ● Live
                </span>
              </h2>
              <Glass className="overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="divide-y divide-white/5">
                <AnimatePresence mode="wait">
                  {isLoading
                    ? [0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={`skeleton-${i}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-20 flex items-center px-6 gap-4"
                          style={{ background: "rgba(255,255,255,0.01)" }}
                        >
                           <div className="size-2 rounded-full bg-white/10 shrink-0" />
                           <div className="flex-1 space-y-2">
                              <div className="h-4 bg-white/5 rounded w-1/4" />
                              <div className="h-3 bg-white/5 rounded w-3/4" />
                           </div>
                        </motion.div>
                      ))
                    : ALERTS.map((alert, i) => (
                        <motion.div
                          key={alert.entity}
                          initial="hidden"
                          animate="visible"
                          variants={feedItemVariants}
                          custom={i}
                          className="flex gap-4 px-6 py-5 cursor-pointer group transition-colors hover:bg-white/[0.03]"
                          style={{ borderColor: "rgba(255,255,255,0.05)" }}
                        >
                          <div className="flex flex-col items-center pt-1.5 gap-1">
                            <motion.div
                              animate={alert.risk === 'critical' ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="size-2 rounded-full shrink-0"
                              style={{
                                background: RISK_COLORS[alert.risk],
                                boxShadow: alert.risk === "critical" ? `0 0 8px ${RED}` : undefined,
                              }}
                            />
                            {i < ALERTS.length - 1 && (
                              <div className="flex-1 w-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{alert.entity}</span>
                              <span className="text-xs text-slate-600 font-mono shrink-0 ml-2">{alert.time}</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-snug group-hover:text-slate-300 transition-colors">{alert.text}</p>
                          </div>
                        </motion.div>
                      ))
                  }
                </AnimatePresence>
                </div>
                <motion.div
                  className="px-6 py-4 text-center border-t border-white/5"
                  style={{ background: "rgba(0,0,0,0.1)" }}
                >
                  <button className="text-sm font-semibold transition-colors hover:text-white" style={{ color: ICE }}>
                    View All Global Alerts
                  </button>
                </motion.div>
              </Glass>
            </div>

            {/* Prediction Engine */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="size-5" style={{ color: AMBER }} />
                AI Prediction Engine
                <span className="ml-auto text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded-lg border border-white/5 bg-white/5">Neural v2.4</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { event: "Sanction Evasion via UAE", prob: 92, time: "48-72h", risk: "Critical", color: RED },
                  { event: "Major Shell Restructure", prob: 74, time: "1-2 weeks", risk: "High", color: AMBER },
                  { event: "Offshore Asset Liquidation", prob: 61, time: "3-5 days", risk: "Medium", color: ICE },
                  { event: "UBO Change Detected", prob: 45, time: <Zap className="size-3" />, risk: "Analyzing", color: PURPLE },
                ].map((p, i) => (
                  <Glass key={i} className="p-5 relative overflow-hidden group hover:border-white/20 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity"><TrendingUp className="size-16" style={{ color: p.color }} /></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>{p.risk}</span>
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">{p.time}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-200 mb-4">{p.event}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Confidence Index</span>
                          <span className="font-mono font-bold" style={{ color: p.color }}>{p.prob}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${p.prob}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full rounded-full" 
                            style={{ background: p.color }} 
                          />
                        </div>
                      </div>
                    </div>
                  </Glass>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-8"
          >
            {/* Sector Heat Map */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Sector Heat Map</h3>
                <span className="text-[10px] text-slate-600 font-mono italic">Volatility Index</span>
              </div>
              <Glass className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Energy", vol: "H", color: RED },
                    { name: "Tech", vol: "M", color: AMBER },
                    { name: "Finance", vol: "H", color: RED },
                    { name: "Real Estate", vol: "L", color: GREEN },
                    { name: "Shipping", vol: "M", color: AMBER },
                    { name: "Mining", vol: "H", color: RED },
                    { name: "Pharma", vol: "L", color: GREEN },
                    { name: "Luxury", vol: "M", color: AMBER },
                    { name: "Agri", vol: "L", color: GREEN },
                  ].map((s, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 group cursor-pointer transition-all shadow-sm"
                      style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}
                    >
                      <span className="text-[9px] font-bold text-white text-center px-1 leading-tight">{s.name}</span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: s.color }}>{s.vol}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <span className="flex items-center gap-1"><div className="size-1.5 rounded-sm" style={{ background: GREEN }} /> Low</span>
                  <span className="flex items-center gap-1"><div className="size-1.5 rounded-sm" style={{ background: AMBER }} /> Mid</span>
                  <span className="flex items-center gap-1"><div className="size-1.5 rounded-sm" style={{ background: RED }} /> High</span>
                </div>
              </Glass>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority Watchlists</h3>
                <button className="text-xs font-semibold" style={{ color: ICE }}>Manage</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Oligarch Tracking", count: 24, active: true },
                  { name: "Sanction Evasion Shells", count: 142, active: true },
                  { name: "Tech Monopolies Board", count: 45, active: false },
                ].map((list, i) => (
                  <motion.div
                    whileHover={{ x: 5 }}
                    key={i}
                  >
                    <Glass
                      className="flex items-center gap-3 p-4 transition-all cursor-pointer hover:border-white/15"
                    >
                      <div
                        className="p-2 rounded-lg shrink-0"
                        style={{
                          background: list.active ? `${ICE}18` : "rgba(255,255,255,0.05)",
                          border: `1px solid ${list.active ? `${ICE}30` : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        <Eye className="size-4" style={{ color: list.active ? ICE : "#334155" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-200 truncate">{list.name}</div>
                        <div className="text-xs text-slate-500">{list.count} entities</div>
                      </div>
                      {list.active && (
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="size-2 rounded-full shrink-0"
                          style={{ background: ICE, boxShadow: `0 0 6px ${ICE}` }}
                        />
                      )}
                    </Glass>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Glass subtle className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Export Compliance Report", icon: Briefcase },
                  { label: "Share Watchlist Access", icon: Users },
                  { label: "Schedule Alert Review", icon: AlertTriangle },
                ].map(({ label, icon: Icon }) => (
                  <motion.button
                    key={label}
                    whileHover={{ x: 3, background: "rgba(255,255,255,0.08)" }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 transition-colors hover:text-white text-left"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Icon className="size-4 text-slate-600" />
                    {label}
                  </motion.button>
                ))}
              </div>
            </Glass>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
