"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { GlassNav } from "@/components/layout/GlassNav"
import { GlassSearchBar } from "@/components/ui/GlassSearchBar"
import { AlertTriangle, Building2, ChevronRight, MapPin, User } from "lucide-react"

const ICE = "#0EA5E9"
const AMBER = "#F59E0B"

const MOCK_RESULTS = [
  {
    id: "p1",
    type: "person",
    name: "Alexander Volkov",
    subtitle: "Russian Oligarch • Diversified Holdings",
    matches: ["Found in Panama Papers (2021)", "Linked to 4 offshore entities"],
    riskScore: 85,
  },
  {
    id: "c1",
    type: "company",
    name: "Volkov Investments Ltd",
    subtitle: "Holding Company • British Virgin Islands",
    matches: ["Direct associate of Alexander Volkov"],
    riskScore: 92,
  },
  {
    id: "c2",
    type: "company",
    name: "Apex Global Solutions SA",
    subtitle: "Technology • Switzerland",
    matches: ["Beneficial owner: Alexander Volkov (34%)"],
    riskScore: 24,
  },
]

function Glass({
  children, strong = false, subtle = false, className = "", style = {},
  hover = false, onClick,
}: {
  children: React.ReactNode; strong?: boolean; subtle?: boolean; className?: string
  style?: React.CSSProperties; hover?: boolean; onClick?: () => void
}) {
  return (
    <div
      className={`rounded-2xl transition-all ${hover ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
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

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(t)
  }, [query])

  return (
    <>
      {/* Search bar */}
      <div className="mb-10">
        <GlassSearchBar defaultValue={query} className="mb-6" />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-mono text-white">
            Results for{" "}
            <span style={{ color: ICE }}>&quot;{query}&quot;</span>
          </h1>
          <span className="text-sm text-slate-500">
            {isLoading ? "Searching global registries..." : `${MOCK_RESULTS.length} matches · 0.42s`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)", animationDelay: `${i * 100}ms` }}
              />
            ))
          ) : (
            <>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-1">Top Match</div>
              {MOCK_RESULTS.map((result, idx) => (
                <Link
                  key={result.id}
                  href={result.type === "person" ? `/person/${result.id}` : `/company/${result.id}`}
                >
                  <div
                    className="group rounded-2xl p-6 flex items-center justify-between gap-6 transition-all hover:border-white/15 mb-4"
                    style={{
                      background: idx === 0 ? "rgba(14,165,233,0.07)" : "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: `1px solid ${idx === 0 ? `${ICE}30` : "rgba(255,255,255,0.08)"}`,
                      boxShadow: idx === 0 ? `0 0 30px ${ICE}10` : "none",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-xl shrink-0"
                        style={{
                          background: idx === 0 ? `${ICE}20` : "rgba(255,255,255,0.06)",
                          border: `1px solid ${idx === 0 ? `${ICE}40` : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        {result.type === "person"
                          ? <User className="size-5" style={{ color: idx === 0 ? ICE : "#64748b" }} />
                          : <Building2 className="size-5" style={{ color: idx === 0 ? ICE : "#64748b" }} />
                        }
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2
                            className="text-lg font-bold text-white transition-colors"
                            style={{}}
                          >
                            {result.name}
                          </h2>
                          {result.riskScore > 80 && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ color: AMBER, background: `${AMBER}18`, border: `1px solid ${AMBER}35` }}
                            >
                              <AlertTriangle className="size-2.5" /> High Risk
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{result.subtitle}</p>
                        <div className="flex flex-col gap-1">
                          {result.matches.map((m, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="size-1.5 rounded-full" style={{ background: ICE, opacity: 0.5 }} />
                              {m}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className="size-5 shrink-0 transition-colors group-hover:text-white"
                      style={{ color: "#334155" }}
                    />
                  </div>
                </Link>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-12 py-4">
                <button disabled className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed">
                  <ChevronRight className="size-4 rotate-180" />
                </button>
                {[1, 2, 3, "...", 12].map((p, i) => (
                  <button key={i} className={`size-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all ${p === 1 ? 'bg-[#0EA5E9] text-white shadow-[0_0_15px_#0EA5E9]' : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {p}
                  </button>
                ))}
                <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar filters */}
        <div className="hidden lg:block sticky top-32 h-fit">
          <Glass subtle className="p-6">
            <h3 className="font-bold font-mono text-white mb-6 text-sm">Filter Results</h3>
            <div className="space-y-6 text-sm">
              <div>
                <h4 className="text-slate-500 mb-3 font-semibold text-xs uppercase tracking-wide">Entity Type</h4>
                <div className="space-y-2.5">
                  {[
                    { label: "Persons", count: 1, checked: true },
                    { label: "Companies", count: 2, checked: true },
                    { label: "Trusts", count: 0, checked: false, disabled: true },
                  ].map(({ label, count, checked, disabled }) => (
                    <label
                      key={label}
                      className={`flex items-center gap-2 ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <input
                        type="checkbox"
                        defaultChecked={checked}
                        disabled={disabled}
                        className="rounded"
                        style={{ accentColor: ICE }}
                      />
                      <span className="text-slate-300">{label}</span>
                      <span className="ml-auto text-xs text-slate-500">{count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
                <h4 className="text-slate-500 mb-3 font-semibold text-xs uppercase tracking-wide">Jurisdiction</h4>
                <div className="space-y-2.5">
                  {[{ name: "BVI", count: 1 }, { name: "Switzerland", count: 1 }].map((j) => (
                    <div key={j.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-300 text-xs">
                        <MapPin className="size-3 text-slate-500" /> {j.name}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.07)", color: "#64748b" }}
                      >
                        {j.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wealth Range */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
                <h4 className="text-slate-500 mb-3 font-semibold text-xs uppercase tracking-wide">Wealth Range</h4>
                <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#0EA5E9] mb-2" />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>$0</span>
                  <span>$100B+</span>
                </div>
              </div>

              {/* Advanced Flags */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
                <h4 className="text-slate-500 mb-3 font-semibold text-xs uppercase tracking-wide">Risk Indicators</h4>
                <div className="space-y-3">
                  {["Sanctioned Only", "PEP Hits", "Shell Indicators", "Leaked DB Mentions"].map(flag => (
                    <label key={flag} className="flex items-center gap-2 cursor-pointer">
                      <div className="relative size-4 rounded border border-white/10 bg-white/5">
                        <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="absolute inset-0.5 rounded-sm bg-[#0EA5E9] opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-slate-400">{flag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Glass>
        </div>
      </div>
    </>
  )
}

export default function SearchResults() {
  return (
    <div className="min-h-screen">
      <GlassNav />
      <main className="mx-auto px-6 md:px-12 pt-32 pb-16">
        <React.Suspense
          fallback={
            <div className="pt-16 text-center" style={{ color: ICE }}>
              Searching...
            </div>
          }
        >
          <SearchResultsContent />
        </React.Suspense>
      </main>
    </div>
  )
}
