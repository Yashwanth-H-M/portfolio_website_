"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Map, Network, Search, Shield, LayoutDashboard } from "lucide-react"
import { SituationRoom } from "@/components/dashboard/SituationRoom"

const ICE_BLUE = "#0EA5E9"

const links = [
  { href: "/", label: "Home", icon: Search },
  { href: "/map", label: "Global Map", icon: Map },
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/pricing", label: "Pricing", icon: Shield },
]

export function GlassNav() {
  const pathname = usePathname()
  const [isSituationRoomOpen, setIsSituationRoomOpen] = React.useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4">
      <div className="mx-auto">
        <div
          className="flex items-center justify-between px-6 py-3 rounded-full"
          style={{
            background: "rgba(10, 20, 40, 0.75)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="size-8 rounded-xl flex items-center justify-center"
              style={{
                background: `${ICE_BLUE}22`,
                border: `1px solid ${ICE_BLUE}55`,
              }}
            >
              <Network className="size-4" style={{ color: ICE_BLUE }} />
            </div>
            <span className="font-mono font-bold text-white tracking-widest text-sm">
              GIP<span style={{ color: ICE_BLUE }}>.</span>OS
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    color: isActive ? "#fff" : "#94a3b8",
                    background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                >
                  <Icon className="size-4" style={{ color: isActive ? ICE_BLUE : undefined }} />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsSituationRoomOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
              title="Open Situation Room"
            >
              <LayoutDashboard className="size-5" />
              <span className="text-sm font-medium hidden lg:inline">Situation Room</span>
            </button>
            <Link href="/auth" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${ICE_BLUE}, #38BDF8)`,
                color: "#fff",
                boxShadow: `0 0 20px ${ICE_BLUE}60`,
              }}
            >
              Get Access
            </Link>
          </div>
          <SituationRoom isOpen={isSituationRoomOpen} onClose={() => setIsSituationRoomOpen(false)} />
        </div>
      </div>
    </nav>
  )
}
