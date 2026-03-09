"use client"

import * as React from "react"
import { ArrowRight, Search } from "lucide-react"

const ICE_BLUE = "#0EA5E9"

interface GlassSearchBarProps {
  onSearch?: (query: string) => void
  isLoading?: boolean
  defaultValue?: string
  placeholder?: string
  className?: string
}

export function GlassSearchBar({
  onSearch,
  isLoading,
  defaultValue = "",
  placeholder = "Search by name, company, or offshore entity...",
  className,
}: GlassSearchBarProps) {
  const [query, setQuery] = React.useState(defaultValue)
  const [isFocused, setIsFocused] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && onSearch) onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className ?? ""}`}>
      {/* Glow ring on focus */}
      {isFocused && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 0 2px ${ICE_BLUE}60, 0 0 30px ${ICE_BLUE}20`,
            borderRadius: 16,
          }}
        />
      )}

      <div
        className="flex items-center rounded-2xl overflow-hidden transition-all"
        style={{
          background: isFocused ? "rgba(14,165,233,0.06)" : "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: `1px solid ${isFocused ? `${ICE_BLUE}50` : "rgba(255,255,255,0.1)"}`,
        }}
      >
        <div className="pl-5 pr-3 text-slate-500">
          <Search className="size-5 transition-colors" style={{ color: isFocused ? ICE_BLUE : undefined }} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 py-4 bg-transparent border-none outline-none text-white text-base placeholder:text-slate-500"
        />

        <div className="pr-3">
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center justify-center size-9 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${ICE_BLUE}, #38BDF8)`,
              boxShadow: `0 0 16px ${ICE_BLUE}60`,
            }}
          >
            {isLoading ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="size-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
