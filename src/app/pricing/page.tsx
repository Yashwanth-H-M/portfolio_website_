"use client"

import * as React from "react"
import Link from "next/link"
import { GlassNav } from "@/components/layout/GlassNav"
import { Check, Shield, Zap } from "lucide-react"

const ICE = "#0EA5E9"
const GREEN = "#22C55E"
const PURPLE = "#A855F7"
const AMBER = "#F59E0B"

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For curious researchers and public interest",
    color: "#64748b",
    features: [
      "Basic public profiles",
      "10 search queries per day",
      "Top-level corporate data only",
      "No export or alerts",
      "No AI analysis",
    ],
    cta: "Start Free",
    ctaStyle: { background: "rgba(255,255,255,0.07)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.15)" },
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    description: "For investigative journalists and researchers",
    color: ICE,
    features: [
      "Unlimited search queries",
      "Full AI intelligence reports",
      "Shell company indicators",
      "Real-time alerts & monitoring",
      "PDF & Excel export",
      "10 active watchlists",
    ],
    cta: "Start 7-Day Trial",
    ctaStyle: {
      background: `linear-gradient(135deg, ${ICE}, #38BDF8)`,
      color: "#fff",
      boxShadow: `0 0 24px ${ICE}55`,
    },
    popular: true,
  },
  {
    name: "Investigator",
    price: "$199",
    period: "per month",
    description: "For law firms, compliance teams & PE analysts",
    color: PURPLE,
    features: [
      "Everything in Professional",
      "Full ownership chain maps",
      "Leaked database integration",
      "Beneficial owner tracing",
      "Bulk export up to 10,000 rows",
      "API access (10k req/mo)",
      "50 active watchlists",
      "Team collaboration (3 seats)",
    ],
    cta: "Get Investigator",
    ctaStyle: {
      background: `${PURPLE}25`,
      color: PURPLE,
      border: `1px solid ${PURPLE}50`,
    },
    popular: false,
  },
  {
    name: "Enterprise",
    price: "$499+",
    period: "per month",
    description: "For governments, hedge funds & institutions",
    color: AMBER,
    features: [
      "Everything in Investigator",
      "Unlimited API access",
      "White label options",
      "Custom report generation",
      "Government contract pricing",
      "Dedicated account manager",
      "SLA & uptime guarantee",
      "Unlimited team seats",
    ],
    cta: "Contact Sales",
    ctaStyle: {
      background: `${AMBER}20`,
      color: AMBER,
      border: `1px solid ${AMBER}45`,
    },
    popular: false,
  },
]

const COMPARISON_FEATURES = [
  { label: "Search queries", free: "10/day", pro: "Unlimited", inv: "Unlimited", ent: "Unlimited" },
  { label: "AI Intelligence Reports", free: false, pro: true, inv: true, ent: true },
  { label: "Shell company detection", free: false, pro: true, inv: true, ent: true },
  { label: "Beneficial owner tracing", free: false, pro: false, inv: true, ent: true },
  { label: "Leaked DB integration", free: false, pro: false, inv: true, ent: true },
  { label: "Ownership graph (D3)", free: false, pro: false, inv: true, ent: true },
  { label: "API access", free: false, pro: false, inv: "10k req/mo", ent: "Unlimited" },
  { label: "Team seats", free: "1", pro: "1", inv: "3", ent: "Unlimited" },
  { label: "Active watchlists", free: "1", pro: "10", inv: "50", ent: "Unlimited" },
  { label: "Export formats", free: false, pro: "PDF, Excel", inv: "PDF, Excel, API", ent: "All formats" },
  { label: "White label", free: false, pro: false, inv: false, ent: true },
]

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "boolean") {
    return val
      ? <Check className="size-4 mx-auto" style={{ color: GREEN }} />
      : <span className="text-slate-700 text-base">—</span>
  }
  return <span className="text-xs text-slate-300 font-mono">{val}</span>
}

export default function Pricing() {
  const [billing, setBilling] = React.useState<"monthly" | "annual">("monthly")

  return (
    <div className="min-h-screen">
      <GlassNav />
      <main className="mx-auto px-6 md:px-12 pt-36 pb-24">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm text-slate-300 font-medium"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Shield className="size-4" style={{ color: ICE }} /> SOC 2 · GDPR · No Advertising Policy
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">
            Intelligence that pays for itself
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            One hidden asset uncovered pays for years of subscription. Used by investigators, law firms, PE analysts, and tax authorities worldwide.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 p-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {(["monthly", "annual"] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all"
                style={{
                  background: billing === b ? `${ICE}25` : "transparent",
                  color: billing === b ? ICE : "#64748b",
                  border: billing === b ? `1px solid ${ICE}45` : "1px solid transparent",
                }}
              >
                {b} {b === "annual" && <span className="text-green-400 text-xs ml-1">-20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="relative flex flex-col rounded-2xl p-6 transition-all"
              style={{
                background: tier.popular ? `linear-gradient(160deg, ${ICE}10, rgba(255,255,255,0.05))` : "rgba(255,255,255,0.04)",
                border: `1px solid ${tier.popular ? `${ICE}40` : "rgba(255,255,255,0.08)"}`,
                backdropFilter: "blur(20px)",
                boxShadow: tier.popular ? `0 0 40px ${ICE}15` : "none",
              }}
            >
              {tier.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: `linear-gradient(90deg, ${ICE}, #38BDF8)`, color: "#fff" }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-mono font-extrabold text-white">
                    {billing === "annual" && tier.price !== "$0"
                      ? `$${Math.round(parseInt(tier.price.replace(/\$|,|\+/g, "")) * 0.8)}`
                      : tier.price}
                  </span>
                  <span className="text-slate-500 text-sm">{tier.period}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{tier.description}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="size-4 shrink-0 mt-0.5" style={{ color: tier.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={tier.ctaStyle as React.CSSProperties}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="px-8 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-xl font-bold text-white">Full Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-1/3">Feature</th>
                  {["Free", "Professional", "Investigator", "Enterprise"].map((t, i) => (
                    <th key={t} className="text-center px-4 py-4 text-xs font-bold uppercase tracking-wider"
                      style={{ color: [ICE, ICE, PURPLE, AMBER][i] }}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr
                    key={i}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-8 py-4 text-sm text-slate-300">{row.label}</td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.free} /></td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.pro} /></td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.inv} /></td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.ent} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust section */}
        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm mb-6">Trusted by investigators at</p>
          <div className="flex flex-wrap justify-center gap-8 text-slate-600 text-sm font-semibold">
            {["ICIJ", "Transparency International", "The Guardian", "Reuters", "BBC Panorama", "DW Investigates"].map(org => (
              <span key={org} className="px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                {org}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
