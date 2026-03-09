"use client"

import * as React from "react"
import { GlassNav } from "@/components/layout/GlassNav"
import { Search, ChevronRight } from "lucide-react"
import Link from "next/link"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { motion, AnimatePresence, Variants } from "framer-motion"

// Set access token from env
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

const ICE = "#0EA5E9"
const RED = "#EF4444"
const GREEN = "#22C55E"
const AMBER = "#F59E0B"
const PURPLE = "#A855F7"
const ORANGE = "#F97316"

// Entity pins for the map (using % positioning on a world SVG)
const ENTITIES = [
  { id: "1", name: "Volkov Investments Ltd", type: "company", risk: "high", lat: 18.4285, lng: -64.6185, flag: "🇻🇬", sector: "Finance" }, // BVI
  { id: "2", name: "Alexander Volkov", type: "person", risk: "high", lat: 55.7558, lng: 37.6173, flag: "🇷🇺", sector: "Personal" }, // Moscow
  { id: "3", name: "Apex Global SA", type: "company", risk: "medium", lat: 46.2044, lng: 6.1432, flag: "🇨🇭", sector: "Technology" }, // Geneva
  { id: "4", name: "Cayman Holdings", type: "company", risk: "high", lat: 19.3133, lng: -81.2546, flag: "🇰🇾", sector: "Finance" }, // Cayman
  { id: "5", name: "MediaHouse Intl", type: "company", risk: "low", lat: 51.5074, lng: -0.1278, flag: "🇬🇧", sector: "Media" }, // London
  { id: "6", name: "Dubai Trust 1", type: "company", risk: "medium", lat: 25.2048, lng: 55.2708, flag: "🇦🇪", sector: "Finance" }, // Dubai
  { id: "7", name: "Pacific Mining Ltd", type: "company", risk: "medium", lat: -33.8688, lng: 151.2093, flag: "🇦🇺", sector: "Energy" }, // Sydney
  { id: "8", name: "Lagos Ventures", type: "company", risk: "low", lat: 6.5244, lng: 3.3792, flag: "🇳🇬", sector: "Logistics" }, // Lagos
  { id: "9", name: "Shenzhen Tech BV", type: "company", risk: "medium", lat: 52.3676, lng: 4.9041, flag: "🇳🇱", sector: "Technology" }, // Amsterdam
  { id: "10", name: "Panama Shell 12", type: "company", risk: "high", lat: 8.9824, lng: -79.5199, flag: "🇵🇦", sector: "Legal" }, // Panama City
]

const sectorColor = (sector: string) => {
  switch (sector) {
    case "Technology": return ICE
    case "Finance": return GREEN
    case "Energy": return ORANGE
    case "Personal": return PURPLE
    case "Logistics": return AMBER
    default: return "#94a3b8"
  }
}

const riskColor = (risk: string) => risk === "high" ? RED : risk === "medium" ? AMBER : GREEN

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
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  }
}

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
}

export default function MapPage() {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const mapInstance = React.useRef<mapboxgl.Map | null>(null)
  const markers = React.useRef<{ [key: string]: mapboxgl.Marker }>({})
  
  const [selected, setSelected] = React.useState<typeof ENTITIES[0] | null>(null)
  const [filter, setFilter] = React.useState<"all" | "high" | "medium" | "low">("all")
  const [search, setSearch] = React.useState("")

  const filtered = ENTITIES.filter(e =>
    (filter === "all" || e.risk === filter) &&
    (search === "" || e.name.toLowerCase().includes(search.toLowerCase()))
  )

  // 1. Initialize Map
  React.useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [20, 30], 
      zoom: 1.8,
      projection: { name: "globe" } as any
    })

    const map = mapInstance.current

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(10, 20, 40)",
        "high-color": "rgb(6, 13, 24)",
        "horizon-blend": 0.02,
        "space-color": "rgb(2, 5, 10)",
        "star-intensity": 0.35
      })

      // Add connection lines (arcs)
      const connections: [number, number][][] = [
        [[55.27, 25.20], [-64.61, 18.42]], // Dubai -> BVI
        [[37.61, 55.75], [-81.25, 19.31]], // Moscow -> Cayman
      ]

      connections.forEach((coords, i) => {
        map.addSource(`route-${i}`, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords
            }
          }
        })

        map.addLayer({
          id: `route-${i}`,
          type: "line",
          source: `route-${i}`,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": RED,
            "line-width": 1,
            "line-dasharray": [4, 4],
            "line-opacity": 0.4
          }
        })
      })
    })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  // 2. Sync Markers
  React.useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current

    // Remove existing markers that aren't in filtered list
    Object.keys(markers.current).forEach(id => {
      if (!filtered.find(e => e.id === id)) {
        markers.current[id].remove()
        delete markers.current[id]
      }
    })

    // Add/Update markers
    filtered.forEach(entity => {
      if (markers.current[entity.id]) return

      const el = document.createElement("div")
      el.className = "group cursor-pointer flex flex-col items-center"
      
      const pin = document.createElement("div")
      pin.className = "relative flex items-center justify-center size-8 rounded-full border-2 transition-transform hover:scale-125"
      pin.style.background = `${riskColor(entity.risk)}22`
      pin.style.borderColor = riskColor(entity.risk)
      pin.style.boxShadow = `0 0 8px ${riskColor(entity.risk)}55`
      
      const sectorRing = document.createElement("div")
      sectorRing.className = "absolute inset-0 rounded-full border opacity-50"
      sectorRing.style.borderColor = sectorColor(entity.sector)
      
      const flag = document.createElement("span")
      flag.className = "text-xs z-10"
      flag.innerText = entity.flag

      pin.appendChild(sectorRing)
      pin.appendChild(flag)

      if (entity.risk === "high") {
        const ping = document.createElement("span")
        ping.className = "absolute -top-1 -right-1 size-3 rounded-full animate-ping opacity-60"
        ping.style.background = RED
        pin.appendChild(ping)
      }

      el.appendChild(pin)
      el.addEventListener("click", () => setSelected(entity))

      const marker = new mapboxgl.Marker(el)
        .setLngLat([entity.lng, entity.lat])
        .addTo(map)

      markers.current[entity.id] = marker
    })
  }, [filtered])

  // 3. Focus on selected
  React.useEffect(() => {
    if (!mapInstance.current || !selected) return
    mapInstance.current.flyTo({
      center: [selected.lng, selected.lat],
      zoom: 4,
      duration: 2000,
      essential: true
    })
  }, [selected])

  return (
    <div className="min-h-screen bg-[#060D18]">
      <GlassNav />
      <main className="pt-20 h-screen flex flex-col overflow-hidden">

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative flex-1 overflow-hidden"
        >
          <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

          {/* Overlays */}
          <motion.div
            variants={itemVariants}
            className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold z-10"
            style={{
              background: "rgba(10,20,35,0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              color: "#94a3b8",
            }}
          >
            <span className="size-2 rounded-full bg-green-400 animate-pulse" />
            Live Intelligence Hub · Mapbox GL Active
          </motion.div>

          <div className="absolute top-6 right-6 flex gap-3 z-10">
            {[
              { label: "High Risk", count: ENTITIES.filter(e => e.risk === "high").length, color: RED },
              { label: "Medium", count: ENTITIES.filter(e => e.risk === "medium").length, color: AMBER },
              { label: "Low", count: ENTITIES.filter(e => e.risk === "low").length, color: GREEN },
            ].map(s => (
              <motion.div
                variants={itemVariants}
                key={s.label}
                className="px-4 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: "rgba(10,20,35,0.85)",
                  border: `1px solid ${s.color}30`,
                  backdropFilter: "blur(20px)",
                  color: s.color,
                }}
              >
                {s.label}: <span className="font-mono font-bold">{s.count}</span>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                key="selected-panel"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={panelVariants}
                className="absolute bottom-6 left-6 w-80 p-5 rounded-2xl z-10"
                style={{
                  background: "rgba(10,20,35,0.92)",
                  border: `1px solid ${riskColor(selected.risk)}40`,
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="flex items-start gap-3 text-white">
                  <div
                    className="size-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{
                      background: `${riskColor(selected.risk)}18`,
                      border: `1px solid ${riskColor(selected.risk)}35`,
                    }}
                  >
                    {selected.flag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm leading-tight">{selected.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{
                          color: riskColor(selected.risk),
                          background: `${riskColor(selected.risk)}18`,
                          border: `1px solid ${riskColor(selected.risk)}30`,
                        }}
                      >
                        {selected.risk} risk
                      </span>
                      <span className="text-xs text-slate-500 capitalize">{selected.type}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-white transition-colors text-xs">✕</button>
                </div>
                <Link
                  href={selected.type === "person" ? `/person/${selected.id}` : `/company/${selected.id}`}
                  className="block w-full"
                >
                  <button
                    className="w-full mt-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    style={{
                      background: `${ICE}18`,
                      border: `1px solid ${ICE}35`,
                      color: ICE,
                    }}
                  >
                    View Full Profile <ChevronRight className="size-3" />
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="shrink-0 z-20"
          style={{
            background: "rgba(6,13,24,0.9)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="mx-auto px-6 md:px-12 py-4 flex items-center gap-6">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0, width: 220 }}
            >
              <Search className="size-4 text-slate-500" />
              <input
                type="text"
                placeholder="Filter entities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-white outline-none placeholder:text-slate-600 w-full"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              {(["all", "high", "medium", "low"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                  style={{
                    background: filter === f ? f === "all" ? `${ICE}20` : `${riskColor(f)}20` : "rgba(255,255,255,0.05)",
                    color: filter === f ? f === "all" ? ICE : riskColor(f) : "#64748b",
                    border: `1px solid ${filter === f ? f === "all" ? `${ICE}40` : `${riskColor(f)}40` : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto flex-1 h-10 no-scrollbar">
              <AnimatePresence mode="popLayout">
                {filtered.map(e => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0"
                    style={{
                      background: selected?.id === e.id ? `${riskColor(e.risk)}18` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selected?.id === e.id ? `${riskColor(e.risk)}40` : "rgba(255,255,255,0.07)"}`,
                      color: selected?.id === e.id ? riskColor(e.risk) : "#94a3b8",
                    }}
                  >
                    <span>{e.flag}</span>
                    {e.name}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
