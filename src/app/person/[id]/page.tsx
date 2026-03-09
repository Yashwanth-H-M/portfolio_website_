"use client"

import * as React from "react"
import { GlassNav } from "@/components/layout/GlassNav"
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, Brain, Building2,
  Clock, Globe, Landmark, MapPin, Network, Briefcase, User,
  FileText, DollarSign, Flag, Search, Shield
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { DataFeedService, SecFiling } from "@/lib/services/DataFeedService"
import { useParams } from "next/navigation"
import { AIExecutiveSummary } from "@/components/ai/AIExecutiveSummary"
import { AskGIP } from "@/components/ai/AskGIP"

const ICE = "#0EA5E9"
const AMBER = "#F59E0B"
const GREEN = "#22C55E"
const RED = "#EF4444"
const PURPLE = "#A855F7"
const ORANGE = "#F97316"

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "financial", label: "Financial", icon: DollarSign },
  { id: "corporate", label: "Corporate", icon: Building2 },
  { id: "political", label: "Political", icon: Flag },
  { id: "psychological", label: "Psychological", icon: Brain },
  { id: "digital", label: "Digital Footprint", icon: Search },
]

const MOCK_NET_WORTH = [
  { year: "2020", value: 4.2 },
  { year: "2021", value: 5.8 },
  { year: "2022", value: 8.4 },
  { year: "2023", value: 7.1 },
  { year: "2024", value: 9.2 },
  { year: "2025", value: 11.4 },
  { year: "2026", value: 12.8 },
]

function Glass({
  children, strong = false, subtle = false, className = "", style = {},
}: {
  children: React.ReactNode; strong?: boolean; subtle?: boolean; className?: string; style?: React.CSSProperties
}) {
  return (
    <div className={`rounded-2xl ${className}`} style={{
      background: strong ? "rgba(255,255,255,0.09)" : subtle ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.05)",
      backdropFilter: `blur(${strong ? 40 : 16}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${strong ? 40 : 16}px) saturate(180%)`,
      border: `1px solid rgba(255,255,255,${strong ? 0.14 : subtle ? 0.05 : 0.08})`,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── TAB CONTENT ────────────────────────────────────────────────────────────────

function OverviewTab({ id, filings }: { id: string, filings: SecFiling[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Wealth Chart */}
        <Glass className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white font-mono">Wealth Trajectory</h2>
            <div className="flex gap-2">
              {["5Y", "MAX"].map((t) => (
                <button key={t} className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: t === "5Y" ? `${ICE}20` : "rgba(255,255,255,0.05)", color: t === "5Y" ? ICE : "#64748b", border: `1px solid ${t === "5Y" ? `${ICE}40` : "rgba(255,255,255,0.08)"}` }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_NET_WORTH} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ICE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ICE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#334155" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0d1b2a", border: "1px solid #1e3a5f", borderRadius: 10, fontSize: 12 }}
                  itemStyle={{ color: ICE, fontWeight: 700 }} formatter={(v: unknown) => [`$${v}B`, "Net Worth"]} labelStyle={{ color: "#64748b" }} />
                <Area type="monotone" dataKey="value" stroke={ICE} strokeWidth={2.5} fill="url(#iceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Glass>

        {/* AI Executive Summary */}
        <motion.div variants={itemVariants}>
          <AIExecutiveSummary entityName="Alexander Volkov" data={{ id, filings }} />
        </motion.div>
      </div>

      {/* Right — Known Network */}
      <div className="space-y-6">
        <Glass className="overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-bold font-mono text-white text-sm">Known Network</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {[
              { name: "Volkov Investments Ltd", role: "100% Owner", type: "co" },
              { name: "Apex Global Solutions SA", role: "34% UBO", type: "co" },
              { name: "Elena Volkov", role: "Spouse", type: "person" },
              { name: "Mikhail Ivanov", role: "Proxy Director", type: "person" },
              { name: "Volkov Family Trust", role: "Beneficiary", type: "co" },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between px-5 py-4 cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div>
                  <div className="text-sm font-medium text-slate-200">{item.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.role}</div>
                </div>
                {item.type === "co" ? <Building2 className="size-4 text-slate-600 mt-0.5" /> : <User className="size-4 text-slate-600 mt-0.5" />}
              </div>
            ))}
          </div>
          <div className="p-4">
            <button className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: `${ICE}15`, border: `1px solid ${ICE}35`, color: ICE }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${ICE}25`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = `${ICE}15`)}>
              <Network className="size-3.5" /> View Ownership Graph
            </button>
          </div>
        </Glass>

        {/* IDs & Aliases */}
        <Glass className="p-5">
          <h3 className="font-bold font-mono text-white text-sm mb-4 flex items-center gap-2">
            <FileText className="size-4 text-slate-400" /> Known Aliases
          </h3>
          <div className="space-y-2">
            {["Aleksandr Volkov", "A. Volkov", "АлексаНдр ВолкОВ (Cyrillic)", "Alex Volkov (London press)"].map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="size-1.5 rounded-full shrink-0" style={{ background: PURPLE }} />
                {a}
              </div>
            ))}
          </div>
        </Glass>
      </div>
    </div>
  )
}

function FinancialTab() {
  const assets = [
    { category: "Energy Assets", value: "$6.4B", pct: 50, color: ORANGE },
    { category: "Real Estate", value: "$2.8B", pct: 22, color: ICE },
    { category: "Tech Equity", value: "$1.9B", pct: 15, color: PURPLE },
    { category: "Offshore Trusts", value: "$1.1B", pct: 9, color: AMBER },
    { category: "Art & Collectibles", value: "$0.5B", pct: 4, color: GREEN },
  ]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Glass className="p-6">
          <h3 className="font-bold text-white font-mono mb-5">Asset Allocation Breakdown</h3>
          <div className="space-y-4">
            {assets.map(a => (
              <div key={a.category}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-300">{a.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white font-semibold">{a.value}</span>
                    <span className="text-xs font-mono" style={{ color: a.color }}>{a.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
              </div>
            ))}
          </div>
        </Glass>
        <Glass className="overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-bold text-white font-mono text-sm">Recent Transactions</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Date", "Description", "Amount", "Type"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { date: "2026-02", desc: "Apex Global SA dividend", amount: "+$45M", type: "Inflow", color: GREEN },
                { date: "2025-11", desc: "UAE trust establishment", amount: "-$120M", type: "Transfer", color: ORANGE },
                { date: "2025-09", desc: "London RE acquisition", amount: "-£240M", type: "Real Estate", color: ICE },
                { date: "2025-06", desc: "Caspian Energy stake", amount: "+$310M", type: "Equity sale", color: GREEN },
              ].map((tx, i) => (
                <tr key={i} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{tx.desc}</td>
                  <td className="px-6 py-4 text-sm font-mono font-bold" style={{ color: tx.color }}>{tx.amount}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: tx.color, background: `${tx.color}15`, border: `1px solid ${tx.color}25` }}>{tx.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Glass>
      </div>
      <div className="space-y-5">
        {[
          { label: "Total Net Worth", value: "$12.8B", color: ICE },
          { label: "Offshore Exposure", value: "$3.2B", color: ORANGE },
          { label: "Liquid Assets", value: "$1.4B", color: GREEN },
          { label: "Estimated Tax Saved", value: "$890M", color: AMBER },
        ].map(m => (
          <Glass key={m.label} className="p-5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-3xl font-mono font-bold text-white">{m.value}</div>
          </Glass>
        ))}
      </div>
    </div>
  )
}

function CorporateTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Entities", value: "42", color: ICE },
          { label: "Shell Companies", value: "17", color: ORANGE },
          { label: "Jurisdictions", value: "8", color: PURPLE },
          { label: "Nominee Directors", value: "6", color: AMBER },
        ].map(m => (
          <Glass key={m.label} className="p-5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-3xl font-mono font-bold" style={{ color: m.color }}>{m.value}</div>
          </Glass>
        ))}
      </div>
      <Glass className="overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="font-bold text-white font-mono text-sm">Corporate Empire Map</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Entity", "Jurisdiction", "Type", "Ownership %", "Risk"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Volkov Investments Ltd", jur: "BVI", type: "Holding", pct: "100%", risk: "high" },
              { name: "Apex Global SA", jur: "Switzerland", type: "Operational", pct: "34%", risk: "medium" },
              { name: "Caspian Maritime Corp", jur: "Marshall Is.", type: "Shipping", pct: "51%", risk: "high" },
              { name: "Mediterranean Holdings", jur: "Malta", type: "Real Estate", pct: "100%", risk: "medium" },
              { name: "Raven Tech Services", jur: "Delaware, US", type: "Technology", pct: "67%", risk: "low" },
              { name: "Eurasian Capital GP", jur: "Guernsey", type: "Investment", pct: "100%", risk: "high" },
            ].map((e, i) => (
              <tr key={i} className="cursor-pointer transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(el) => (el.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(el) => (el.currentTarget.style.background = "transparent")}>
                <td className="px-6 py-4 text-sm font-medium text-slate-200">{e.name}</td>
                <td className="px-6 py-4 text-xs text-slate-400 font-mono">{e.jur}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{e.type}</td>
                <td className="px-6 py-4 text-xs font-mono font-bold text-white">{e.pct}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{ color: e.risk === "high" ? RED : e.risk === "medium" ? AMBER : GREEN, background: `${e.risk === "high" ? RED : e.risk === "medium" ? AMBER : GREEN}15`, border: `1px solid ${e.risk === "high" ? RED : e.risk === "medium" ? AMBER : GREEN}30` }}>
                    {e.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Glass>
    </div>
  )
}

function PoliticalTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Glass className="p-6" style={{ background: `linear-gradient(135deg, ${PURPLE}08, rgba(255,255,255,0.03))`, border: `1px solid ${PURPLE}25` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="size-2 rounded-full animate-pulse" style={{ background: PURPLE }} />
            <h3 className="text-sm font-bold tracking-widest uppercase font-mono" style={{ color: PURPLE }}>AI Political Analysis</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold ml-auto" style={{ background: `${AMBER}20`, color: AMBER, border: `1px solid ${AMBER}35` }}>87% Confidence</span>
          </div>
          <div className="space-y-4 text-slate-300 text-[15px] leading-relaxed">
            <p>Volkov maintains active connections to <span className="text-white font-semibold">Kremlin-adjacent political networks</span> through board membership in three state-adjacent energy companies. He attended the St. Petersburg Economic Forum in 2024 alongside senior Russian government officials. <span className="text-[11px] text-slate-500">[1]</span></p>
            <div className="flex gap-3 p-4 rounded-xl" style={{ background: `${RED}12`, border: `1px solid ${RED}30` }}>
              <AlertTriangle className="size-4 shrink-0 mt-0.5" style={{ color: RED }} />
              <p className="text-sm" style={{ color: RED }}><strong>SANCTIONED:</strong> Added to EU/UK Consolidated Sanctions List (2022-03-01). Active OFAC SDN designation since 2022-03-04.</p>
            </div>
            <p>Maintains an active European lobbying presence through <span style={{ color: PURPLE }}>Apex Policy Advisory Ltd</span>, which declared €340,000 in EU lobbying expenditure (2024). Connected to 4 MEPs in energy sector committees.</p>
          </div>
          <div className="mt-5 pt-4 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs text-slate-500">[1] SPIEF-2024 official attendee list</div>
          </div>
        </Glass>

        <Glass className="overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-bold text-white font-mono text-sm">Political Donations & Connections</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {[
              { entity: "United Russia Party", type: "Donation", amount: "$2.4M", year: "2021", flag: "🇷🇺", risk: "high" },
              { entity: "European Energy Forum", type: "Lobbying", amount: "€340K", year: "2024", flag: "🇪🇺", risk: "medium" },
              { entity: "Chatham House", type: "Donation", amount: "£120K", year: "2023", flag: "🇬🇧", risk: "low" },
              { entity: "UAE Energy Ministry", type: "Advisory Board", amount: "N/A", year: "2025", flag: "🇦🇪", risk: "medium" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div className="size-8 rounded-full flex items-center justify-center text-base" style={{ background: "rgba(255,255,255,0.05)" }}>{p.flag}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200">{p.entity}</div>
                  <div className="text-xs text-slate-500">{p.type} · {p.year}</div>
                </div>
                <div className="font-mono text-sm font-semibold text-white">{p.amount}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{ color: p.risk === "high" ? RED : p.risk === "medium" ? AMBER : GREEN, background: `${p.risk === "high" ? RED : p.risk === "medium" ? AMBER : GREEN}15`, border: `1px solid ${p.risk === "high" ? RED : p.risk === "medium" ? AMBER : GREEN}30` }}>
                  {p.risk}
                </span>
              </div>
            ))}
          </div>
        </Glass>
      </div>

      <div className="space-y-5">
        <Glass className="p-5" style={{ border: `1px solid ${RED}25`, background: `${RED}07` }}>
          <h3 className="font-bold text-sm mb-4" style={{ color: RED }}>Sanctions Status</h3>
          {[
            { regime: "EU Consolidated List", since: "2022-03-01", status: "ACTIVE" },
            { regime: "UK OFSI", since: "2022-03-04", status: "ACTIVE" },
            { regime: "OFAC SDN (US)", since: "2022-03-04", status: "ACTIVE" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div className="text-xs font-semibold text-slate-200">{s.regime}</div>
                <div className="text-[11px] text-slate-500">Since {s.since}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse" style={{ color: RED, background: `${RED}20`, border: `1px solid ${RED}40` }}>{s.status}</span>
            </div>
          ))}
        </Glass>

        <Glass className="p-5">
          <h3 className="font-bold text-sm text-white mb-4">PEP Classification</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2"><div className="size-2 rounded-full" style={{ background: RED }} /><span>Tier 1 PEP — Head of State level</span></div>
            <div className="flex items-center gap-2"><div className="size-2 rounded-full" style={{ background: ORANGE }} /><span>Russian national PEP list (2023)</span></div>
            <div className="flex items-center gap-2"><div className="size-2 rounded-full" style={{ background: AMBER }} /><span>IMF Watch List member</span></div>
          </div>
        </Glass>
      </div>
    </div>
  )
}

function PsychologicalTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Glass className="p-6" style={{ background: `linear-gradient(135deg, ${AMBER}07, rgba(255,255,255,0.03))`, border: `1px solid ${AMBER}22` }}>
          <div className="flex items-center gap-3 mb-5">
            <Brain className="size-4" style={{ color: AMBER }} />
            <h3 className="text-sm font-bold tracking-widest uppercase font-mono" style={{ color: AMBER }}>AI Behavioral Profile</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold ml-auto" style={{ background: `${AMBER}20`, color: AMBER, border: `1px solid ${AMBER}35` }}>76% Confidence</span>
          </div>
          <div className="space-y-4 text-slate-300 text-[15px] leading-relaxed">
            <p>Pattern analysis across <span className="text-white font-semibold">148 public statements, 23 interviews, and 7 court depositions</span> (2018–2026) reveals a consistent high conviction, low disclosure decision style.</p>
            <p>Decision timing analysis shows a statistically significant pattern of major asset moves <span className="text-white font-semibold">72–96 hours before major geopolitical events</span>, suggesting access to advance information networks. <span className="text-[11px] text-slate-500">[1]</span></p>
            <p>Negotiation pattern: aggressive opening positions, rarely uses intermediaries for final decisions, shows documented history of reneging on agreements after sanction pressure increases.</p>
          </div>
          <div className="mt-5 pt-4 text-xs text-slate-500" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            [1] Internal timing model based on public transaction dates vs. Reuters news archive
          </div>
        </Glass>

        <Glass className="p-6">
          <h3 className="font-bold text-white font-mono mb-5">Behavioral Traits (AI-Derived)</h3>
          <div className="space-y-4">
            {[
              { trait: "Risk Appetite", score: 82, label: "Aggressive", color: RED },
              { trait: "Transparency", score: 12, label: "Opaque", color: ORANGE },
              { trait: "Political Exposure", score: 91, label: "Extreme", color: RED },
              { trait: "Negotiation Aggression", score: 74, label: "High", color: AMBER },
              { trait: "Regulatory Compliance", score: 18, label: "Poor", color: RED },
            ].map(t => (
              <div key={t.trait}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-300">{t.trait}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: t.color, background: `${t.color}15`, border: `1px solid ${t.color}25` }}>{t.label}</span>
                    <span className="font-mono text-xs font-bold text-white">{t.score}/100</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${t.score}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </Glass>
      </div>

      <div className="space-y-5">
        <Glass className="p-5">
          <h3 className="font-bold text-white text-sm font-mono mb-4">Succession Risk</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl text-sm" style={{ background: `${AMBER}12`, border: `1px solid ${AMBER}25` }}>
              <div className="font-bold mb-1" style={{ color: AMBER }}>Key Person Risk: HIGH</div>
              <div className="text-xs text-slate-400">6 of 8 assessed companies show &gt;70% dependence on Volkov personally</div>
            </div>
            <div className="text-xs text-slate-400 space-y-2">
              <div><span className="text-slate-300 font-semibold">Named heirs:</span> Aleksander Volkov Jr. (27), Natalia Volkova (24)</div>
              <div><span className="text-slate-300 font-semibold">Succession docs:</span> Not publicly filed</div>
              <div><span className="text-slate-300 font-semibold">Divorce risk:</span> Low (no proceedings detected)</div>
            </div>
          </div>
        </Glass>

        <Glass className="p-5">
          <h3 className="font-bold text-white text-sm font-mono mb-4">Ghost Advisors</h3>
          <div className="space-y-2">
            {["Former FSB Director (unnamed)", "Swiss private banker (Credit Suisse alumni)", "London QC — asset protection specialist"].map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl text-xs text-slate-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="size-1.5 rounded-full shrink-0 mt-1" style={{ background: PURPLE }} />
                {a}
              </div>
            ))}
          </div>
        </Glass>
      </div>
    </div>
  )
}

function DigitalTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Glass className="overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-bold text-white font-mono text-sm">Media & Narrative Control</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {[
              { outlet: "Zvezda Media Group", role: "Indirect owner via Apex Global SA", country: "🇷🇺", risk: "high" },
              { outlet: "EuroPress Ltd", role: "Financial backer (via shadow fund)", country: "🇨🇾", risk: "medium" },
              { outlet: "Silk Road Digital", role: "Advertising funder", country: "🇦🇪", risk: "medium" },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span className="text-xl">{m.country}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200">{m.outlet}</div>
                  <div className="text-xs text-slate-500">{m.role}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{ color: m.risk === "high" ? RED : AMBER, background: `${m.risk === "high" ? RED : AMBER}15`, border: `1px solid ${m.risk === "high" ? RED : AMBER}30` }}>
                  {m.risk}
                </span>
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="p-6">
          <h3 className="font-bold text-white font-mono mb-5">Social Media & Domain Portfolio</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { platform: "Telegram", handle: "@volkov_energy_official", followers: "124K", verified: true },
              { platform: "Twitter/X", handle: "@avolkov_intl", followers: "89K", verified: false },
              { platform: "LinkedIn", handle: "/in/aleksandr-volkov", followers: "12K", verified: true },
              { platform: "VK", handle: "volkov.official", followers: "340K", verified: true },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">{s.platform}</span>
                  {s.verified && <span className="text-[10px] text-blue-400">● verified</span>}
                </div>
                <div className="text-sm text-slate-200 font-mono">{s.handle}</div>
                <div className="text-xs text-slate-500 mt-1">{s.followers} followers</div>
              </div>
            ))}
          </div>
        </Glass>
      </div>

      <div className="space-y-5">
        <Glass className="p-5">
          <h3 className="font-bold text-white text-sm font-mono mb-4">Domain Portfolio</h3>
          <div className="space-y-2">
            {["volkov-energy.com", "apex-global-sa.com", "caspianmaritime.io", "volkovestate.co.uk", "volkovfoundation.org"].map((d, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Globe className="size-3 text-slate-500" />
                {d}
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="p-5" style={{ border: `1px solid ${AMBER}25`, background: `${AMBER}07` }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: AMBER }}>Wikipedia Activity</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <div className="size-1.5 rounded-full shrink-0 mt-1" style={{ background: AMBER }} />
              <span>3 edits detected from IP ranges linked to Apex Global SA offices (2024-10)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="size-1.5 rounded-full shrink-0 mt-1" style={{ background: AMBER }} />
              <span>Sanctions section reverted 4 times by suspected paid editors</span>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
import { motion, AnimatePresence, Variants } from "framer-motion"

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

export default function PersonProfile() {
  const params = useParams()
  const id = params.id as string
  const [activeTab, setActiveTab] = React.useState("overview")
  const [isLoading, setIsLoading] = React.useState(true)
  const [filings, setFilings] = React.useState<SecFiling[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      const companyId = id === "2" ? "c1" : id 
      const data = await DataFeedService.getSecFilings(companyId)
      setFilings(data)
      setIsLoading(false)
    }
    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen"><GlassNav />
        <div className="mx-auto px-6 md:px-12 pt-32 pb-16 space-y-6 animate-pulse">
          <div className="h-52 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="grid grid-cols-3 gap-6">{[0, 1, 2].map(i => <div key={i} className="h-28 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
        </div>
      </div>
    )
  }

  const tabContent: Record<string, React.ReactNode> = {
    overview: <OverviewTab id={id} filings={filings} />,
    financial: <FinancialTab />,
    corporate: <CorporateTab />,
    political: <PoliticalTab />,
    psychological: <PsychologicalTab />,
    digital: <DigitalTab />,
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
          <Glass strong className="p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden" style={{ boxShadow: `0 0 40px ${ICE}15` }}>
            <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none"><Network style={{ width: 260, height: 260 }} /></div>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="size-28 rounded-2xl shrink-0 flex items-center justify-center text-4xl font-mono font-bold select-none"
              style={{ background: `linear-gradient(135deg, ${ICE}20, ${ICE}08)`, border: `1px solid ${ICE}30`, color: `${ICE}99` }}
            >
              AV
            </motion.div>
            <div className="flex-1 z-10">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Alexander Volkov</h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full" style={{ color: RED, background: `${RED}18`, border: `1px solid ${RED}35` }}><AlertTriangle className="size-3" /> Sanctioned</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full" style={{ color: ICE, background: `${ICE}18`, border: `1px solid ${ICE}35` }}>PEP Tier 1</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full" style={{ color: ORANGE, background: `${ORANGE}18`, border: `1px solid ${ORANGE}35` }}>Shell Owner</span>
              </div>
              <p className="text-slate-300 mb-5 max-w-2xl leading-relaxed">Russian industrialist with diversified holdings in energy, technology, and real estate. Associated with multiple offshore trusts identified in Panama, Pandora and FinCEN leaks.</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><MapPin className="size-4" /> Moscow / Dubai / London</span>
                <span className="flex items-center gap-2"><Briefcase className="size-4" /> Energy · Technology · Real Estate</span>
                <span className="flex items-center gap-2"><Landmark className="size-4" /> 4 Known Passports</span>
                <span className="flex items-center gap-2"><Globe className="size-4" /> 8 Jurisdictions</span>
                <span className="flex items-center gap-2"><Clock className="size-4" /> Updated 2h ago</span>
              </div>
            </div>
          </Glass>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Est. Net Worth", value: "$12.8B", trend: "+14.2% YTD", color: GREEN },
            { label: "Corporate Entities", value: "42", trend: "4 this quarter", color: ICE },
            { label: "Offshore Trusts", value: "8", trend: "2 flagged", color: AMBER },
            { label: "Leaked DB Hits", value: "5", trend: "Panama · Pandora · FinCEN", color: RED },
          ].map(m => (
            <motion.div key={m.label} variants={itemVariants}>
              <Glass className="p-5 flex flex-col gap-3 h-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{m.label}</span>
                <span className="text-3xl font-mono font-bold text-white">{m.value}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full self-start" style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}25` }}>{m.trend}</span>
              </Glass>
            </motion.div>
          ))}
        </div>

        {/* Regulatory Exposure (Cross-referenced) */}
        <motion.div variants={itemVariants}>
          <Glass className="p-5" style={{ border: `1px solid ${PURPLE}25`, background: `${PURPLE}05` }}>
            <h3 className="font-bold font-mono text-white text-sm mb-4 flex items-center gap-2">
              <Shield className="size-4" style={{ color: PURPLE }} /> Regulatory Exposure
            </h3>
            <div className="space-y-3">
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Cross-referenced identification with SEC Form 4 (Insider) and Schedule 13D/G (Beneficial Ownership) filings.
              </p>
              {filings.map(f => (
                <div
                  key={f.id}
                  className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold font-mono">{f.type}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">{f.description}</div>
                    <div className="text-[10px] text-slate-500">{f.date}</div>
                  </div>
                  <ArrowUpRight className="size-3.5 text-slate-600 mt-0.5 shrink-0" />
                </div>
              ))}
              {filings.length === 0 && (
                <div className="text-center py-4 border border-dashed border-white/5 rounded-xl">
                  <Search className="size-6 text-slate-800 mx-auto mb-1 opacity-20" />
                  <p className="text-[10px] text-slate-600">No regulatory filings found for this individual name.</p>
                </div>
              )}
            </div>
          </Glass>
        </motion.div>

        {/* Tab Bar */}
        <motion.div variants={itemVariants} className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
                style={{
                  color: active ? ICE : "#64748b",
                }}
              >
                {active && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      background: `${ICE}18`, 
                      border: `1px solid ${ICE}40`,
                      zIndex: 0 
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="size-3.5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </motion.main>
      <AskGIP />
    </div>
  )
}
