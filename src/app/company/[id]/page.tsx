"use client"

import * as React from "react"
import { GlassNav } from "@/components/layout/GlassNav"
import {
  AlertTriangle, ArrowUpRight, Building2, ChevronRight,
  Clock, Globe, Layers, MapPin, Network, Shield, Users
} from "lucide-react"
import { OwnershipGraph, GraphNode, GraphLink } from "@/components/ui/OwnershipGraph"
import { DataFeedService, SecFiling, RegistryData } from "@/lib/services/DataFeedService"
import { useParams } from "next/navigation"
import { AIExecutiveSummary } from "@/components/ai/AIExecutiveSummary"
import { AskGIP } from "@/components/ai/AskGIP"

const ICE = "#0EA5E9"
const AMBER = "#F59E0B"
const RED = "#EF4444"
const GREEN = "#22C55E"
const ORANGE = "#F97316"
const PURPLE = "#A855F7"

function Glass({
  children, strong = false, subtle = false, className = "", style = {},
}: {
  children: React.ReactNode; strong?: boolean; subtle?: boolean
  className?: string; style?: React.CSSProperties
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: strong ? "rgba(255,255,255,0.09)" : subtle ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid rgba(255,255,255,${strong ? 0.14 : subtle ? 0.04 : 0.08})`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Ownership Chain Visualizer ────────────────────────────────────────────────
const MOCK_NODES: GraphNode[] = [
  { id: "ubo", label: "Alexander Volkov", type: "person", risk: "high", isRoot: true, flag: "🇷🇺" },
  { id: "holding", label: "Volkov Holdings LP", type: "trust", risk: "high", flag: "🇰🇾", pct: 100 },
  { id: "apex", label: "Apex Global Solutions SA", type: "company", risk: "medium", flag: "🇨🇭", pct: 100 },
  { id: "target", label: "Volkov Investments Ltd", type: "company", risk: "high", flag: "🇻🇬", isRoot: false, pct: 100 },
  { id: "sub1", label: "Mediterranean Holdings", type: "company", risk: "medium", flag: "🇲🇹", pct: 100 },
  { id: "sub2", label: "Eurasian Capital GP", type: "company", risk: "high", flag: "🇬🇬", pct: 51 },
  { id: "proxy1", label: "Igor Petrov", type: "person", risk: "medium", flag: "🇨🇾" },
]

const MOCK_LINKS: GraphLink[] = [
  { source: "ubo", target: "holding", label: "UBO", type: "beneficial" },
  { source: "holding", target: "apex", label: "100%", type: "owns" },
  { source: "apex", target: "target", label: "100%", type: "owns" },
  { source: "target", target: "sub1", label: "100%", type: "owns" },
  { source: "target", target: "sub2", label: "51%", type: "owns" },
  { source: "proxy1", target: "target", label: "Director", type: "director" },
]

// ─── Subsidiaries ───────────────────────────────────────────────────────────────
const SUBSIDIARIES = [
  { name: "Mediterranean Holdings Ltd", jurisdiction: "Malta", type: "Real Estate", risk: "medium" },
  { name: "Eurasian Capital GP", jurisdiction: "Guernsey", type: "Investment", risk: "high" },
  { name: "Raven Tech Services", jurisdiction: "Delaware, US", type: "Technology", risk: "low" },
  { name: "Caspian Maritime Corp", jurisdiction: "Marshall Islands", type: "Shipping", risk: "high" },
]

const DIRECTORS = [
  { name: "Igor Petrov", role: "Nominee Director", flag: "🇨🇾", warning: true },
  { name: "Olena Marchuk", role: "Nominee Director", flag: "🇨🇾", warning: true },
  { name: "Aleksander Volkov Jr.", role: "Beneficial Owner Rep", flag: "🇷🇺", warning: false },
]

import { motion, Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
}

export default function CompanyProfile() {
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)
  const [secFilings, setSecFilings] = React.useState<SecFiling[]>([])
  const [registry, setRegistry] = React.useState<RegistryData | null>(null)

  React.useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      const [filings, reg] = await Promise.all([
        DataFeedService.getSecFilings(id),
        DataFeedService.getRegistryData(id)
      ])
      setSecFilings(filings)
      setRegistry(reg)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen">
        <GlassNav />
        <div className="mx-auto px-6 md:px-12 pt-32 pb-16 space-y-6 animate-pulse">
          <div className="h-52 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="grid grid-cols-4 gap-4">
            {[0,1,2,3].map(i => <div key={i} className="h-28 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <GlassNav />
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto px-6 md:px-12 pt-32 pb-16 space-y-6"
      >

        {/* Header */}
        <motion.div variants={itemVariants}>
          <Glass
            strong
            className="p-8 relative overflow-hidden"
            style={{ boxShadow: `0 0 40px ${ORANGE}10` }}
          >
            <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none">
              <Building2 style={{ width: 280, height: 280 }} />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start z-10 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="size-24 rounded-2xl shrink-0 flex items-center justify-center text-3xl"
                style={{ background: `${ICE}12`, border: `1px solid ${ICE}30` }}
              >
                🇻🇬
              </motion.div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-4xl font-extrabold text-white tracking-tight">Volkov Investments Ltd</h1>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ color: ORANGE, background: `${ORANGE}18`, border: `1px solid ${ORANGE}35` }}
                  >
                    <Layers className="size-3" /> Shell Company
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ color: AMBER, background: `${AMBER}18`, border: `1px solid ${AMBER}35` }}
                  >
                    <AlertTriangle className="size-3" /> High Risk
                  </span>
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed max-w-2xl">
                  British Virgin Islands holding company. Incorporated 2015. Previously named Volare Capital Ltd (renamed 2021). No disclosed operational activity — classified as a pure holding vehicle.
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-2"><MapPin className="size-4" /> British Virgin Islands</span>
                  <span className="flex items-center gap-2"><Globe className="size-4" /> Registered: 2015-03-12</span>
                  <span className="flex items-center gap-2"><Building2 className="size-4" /> Holding Company</span>
                  <span className="flex items-center gap-2"><Shield className="size-4" /> 3 Leaked Database Hits</span>
                  <span className="flex items-center gap-2"><Clock className="size-4" /> Updated 3h ago</span>
                </div>
              </div>
            </div>
          </Glass>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Declared Assets", value: "$1.4B", color: ICE, trend: "Estimated" },
            { label: "Subsidiaries", value: 4, color: GREEN, trend: "2 flagged" },
            { label: "Nominee Directors", value: 2, color: ORANGE, trend: "⚠ High risk" },
            { label: "Leaked DB Hits", value: 3, color: RED, trend: "Panama + Pandora" },
          ].map((m) => (
            <motion.div key={m.label} variants={itemVariants}>
              <Glass key={m.label} className="p-5 flex flex-col gap-3 h-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{m.label}</span>
                <span
                  className="text-3xl font-mono font-bold"
                  style={{ color: m.color === ICE ? "white" : m.color }}
                >
                  {m.value}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
                  style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}25` }}
                >
                  {m.trend}
                </span>
              </Glass>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* AI Executive Summary */}
            <motion.div variants={itemVariants}>
              <AIExecutiveSummary entityName="Volkov Investments Ltd" data={{ id: id, registry, secFilings }} />
            </motion.div>

            {/* Subsidiaries */}
            <motion.div variants={itemVariants}>
              <Glass className="overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold font-mono text-white text-sm">Known Subsidiaries</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ color: ICE, background: `${ICE}15`, border: `1px solid ${ICE}30` }}
                  >
                    {SUBSIDIARIES.length} entities
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["Company", "Jurisdiction", "Type", "Risk"].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SUBSIDIARIES.map((sub, i) => (
                        <tr
                          key={i}
                          className="cursor-pointer transition-colors"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-slate-200">{sub.name}</td>
                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">{sub.jurisdiction}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{sub.type}</td>
                          <td className="px-6 py-4">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                              style={{
                                color: sub.risk === "high" ? RED : sub.risk === "medium" ? AMBER : GREEN,
                                background: sub.risk === "high" ? `${RED}18` : sub.risk === "medium" ? `${AMBER}18` : `${GREEN}18`,
                                border: `1px solid ${sub.risk === "high" ? `${RED}30` : sub.risk === "medium" ? `${AMBER}30` : `${GREEN}30`}`,
                              }}
                            >
                              {sub.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Glass>
            </motion.div>
          </div>

          {/* Right — 1/3 */}
          <div className="space-y-6">
            {/* Ownership Graph */}
            <motion.div variants={itemVariants}>
              <Glass subtle className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Network className="size-4" style={{ color: ICE }} />
                  <h3 className="font-bold font-mono text-white text-sm">Ownership Graph</h3>
                </div>
                <div className="h-[420px] mb-4">
                  <OwnershipGraph nodes={MOCK_NODES} links={MOCK_LINKS} width={360} height={400} />
                </div>
                <button
                  className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: `${ICE}15`,
                    border: `1px solid ${ICE}35`,
                    color: ICE,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${ICE}25`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = `${ICE}15`)}
                >
                  <Network className="size-3.5" /> Expand Visualizer
                </button>
              </Glass>
            </motion.div>

            {/* Verified Data Feeds */}
            <motion.div variants={itemVariants}>
              <Glass className="p-5" style={{ border: `1px solid ${ICE}25`, background: `${ICE}07` }}>
                <h3 className="font-bold font-mono text-sm mb-4 flex items-center gap-2" style={{ color: ICE }}>
                  <Globe className="size-4" /> Verified Data Feeds
                </h3>
                
                {registry && (
                  <div className="mb-6 space-y-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Corporate Registry</div>
                    <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Status</span>
                        <span className="text-xs font-bold text-green-400">{registry.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Jurisdiction</span>
                        <span className="text-xs text-white">{registry.jurisdiction}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Reg #</span>
                        <span className="text-xs font-mono text-white">{registry.company_number}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-white/5 flex items-center gap-2">
                        <Building2 className="size-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500 italic">Source: {registry.source}</span>
                      </div>
                    </div>
                  </div>
                )}

                {secFilings.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SEC EDGAR Filings</div>
                    {secFilings.map(f => (
                      <div
                        key={f.id}
                        className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                        style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold font-mono">{f.type}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white truncate">{f.description}</div>
                          <div className="text-[10px] text-slate-500">{f.date}</div>
                        </div>
                        <ArrowUpRight className="size-3.5 text-slate-600 mt-0.5 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {!registry && secFilings.length === 0 && (
                  <div className="text-center py-6">
                    <Globe className="size-8 text-slate-700 mx-auto mb-2 opacity-20" />
                    <p className="text-xs text-slate-500">No verified regulatory feeds found for this entity.</p>
                  </div>
                )}
              </Glass>
            </motion.div>

            {/* Directors */}
            <motion.div variants={itemVariants}>
              <Glass className="overflow-hidden">
                <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <Users className="size-4 text-slate-400" />
                  <h3 className="font-bold font-mono text-white text-sm">Directors / UBOs</h3>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {DIRECTORS.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        className="size-8 rounded-full flex items-center justify-center text-base shrink-0"
                        style={{ background: d.warning ? `${ORANGE}15` : `${ICE}12` }}
                      >
                        {d.flag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-200 truncate">{d.name}</div>
                        <div className="text-xs text-slate-500">{d.role}</div>
                      </div>
                      {d.warning && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ color: ORANGE, background: `${ORANGE}18`, border: `1px solid ${ORANGE}30` }}
                        >
                          Nominee
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Glass>
            </motion.div>

            {/* Leaked DB Hits */}
            <motion.div variants={itemVariants}>
              <Glass className="p-5" style={{ border: `1px solid ${RED}25`, background: `${RED}07` }}>
                <h3 className="font-bold font-mono text-sm mb-4 flex items-center gap-2" style={{ color: RED }}>
                  <AlertTriangle className="size-4" /> Leaked Database Hits
                </h3>
                <div className="space-y-3">
                  {[
                    { db: "Panama Papers", year: "2021", entry: "Volare Capital Ltd" },
                    { db: "Pandora Papers", year: "2023", entry: "Volare Capital Ltd" },
                    { db: "FinCEN Files", year: "2020", entry: "Associated transaction" },
                  ].map((hit, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer"
                      style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <div className="size-1.5 rounded-full mt-1.5 shrink-0 animate-pulse" style={{ background: RED }} />
                      <div>
                        <div className="text-xs font-bold text-white">{hit.db}</div>
                        <div className="text-[11px] text-slate-500">{hit.entry} · {hit.year}</div>
                      </div>
                      <ArrowUpRight className="size-3.5 ml-auto text-slate-600 mt-0.5 shrink-0" />
                    </div>
                  ))}
                </div>
              </Glass>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <AskGIP />
    </div>
  )
}
