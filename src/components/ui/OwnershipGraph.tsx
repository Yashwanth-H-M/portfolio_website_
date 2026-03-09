"use client"

import * as React from "react"
import * as d3 from "d3"

const ICE = "#0EA5E9"
const AMBER = "#F59E0B"
const GREEN = "#22C55E"
const ORANGE = "#F97316"
const PURPLE = "#A855F7"
const RED = "#EF4444"

export interface GraphNode {
  id: string
  label: string
  type: "person" | "company" | "trust" | "gov"
  risk?: "high" | "medium" | "low"
  isRoot?: boolean
  pct?: number
  flag?: string
}

export interface GraphLink {
  source: string
  target: string
  label?: string
  type?: "owns" | "director" | "beneficial" | "associated"
}

interface OwnershipGraphProps {
  nodes: GraphNode[]
  links: GraphLink[]
  width?: number
  height?: number
}

function nodeColor(node: GraphNode): string {
  if (node.isRoot) return ICE
  if (node.type === "person") return PURPLE
  if (node.type === "trust") return AMBER
  if (node.type === "gov") return GREEN
  if (node.risk === "high") return RED
  if (node.risk === "medium") return ORANGE
  return "#38BDF8"
}

function nodeShape(node: GraphNode): string {
  if (node.type === "person") return "circle"
  if (node.type === "trust") return "diamond"
  if (node.type === "gov") return "triangle"
  return "rect"
}

export function OwnershipGraph({ nodes, links, width = 680, height = 420 }: OwnershipGraphProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = React.useState<{ x: number; y: number; node: GraphNode } | null>(null)

  React.useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Defs — arrow marker and glow filter
    const defs = svg.append("defs")

    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "rgba(255,255,255,0.2)")

    const glow = defs.append("filter").attr("id", "glow")
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur")
    const feMerge = glow.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    const g = svg.append("g")

    // Zoom
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.4, 3])
        .on("zoom", (event) => {
          g.attr("transform", event.transform)
        })
    )

    // Simulation
    const simNodes = nodes.map(n => ({ ...n } as d3.SimulationNodeDatum & GraphNode))
    const simLinks = links.map(l => ({ ...l } as d3.SimulationLinkDatum<typeof simNodes[0]> & GraphLink))

    const simulation = d3.forceSimulation(simNodes)
      .force("link", d3.forceLink(simLinks).id((d: any) => d.id).distance(110).strength(0.8))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(40))

    // Links
    const link = g.append("g")
      .selectAll("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.12)")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)")

    // Link labels
    const linkLabel = g.append("g")
      .selectAll("text")
      .data(simLinks.filter(l => l.label))
      .join("text")
      .text(d => d.label || "")
      .attr("fill", "rgba(255,255,255,0.3)")
      .attr("font-size", "9px")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("text-anchor", "middle")

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(simNodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        (d3.drag<SVGGElement, typeof simNodes[0]>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null; d.fy = null
          })) as any
      )
      .on("mouseenter", (event, d) => {
        setTooltip({ x: event.offsetX, y: event.offsetY, node: d })
      })
      .on("mouseleave", () => setTooltip(null))

    // Draw shapes per type
    simNodes.forEach((n, i) => {
      const el = d3.select(node.nodes()[i])
      const color = nodeColor(n)

      if (n.type === "person") {
        el.append("circle")
          .attr("r", n.isRoot ? 22 : 16)
          .attr("fill", `${color}22`)
          .attr("stroke", color)
          .attr("stroke-width", n.isRoot ? 2 : 1.5)
          .attr("filter", n.isRoot ? "url(#glow)" : "none")
      } else if (n.type === "trust") {
        // Diamond
        const size = 18
        el.append("polygon")
          .attr("points", `0,-${size} ${size},0 0,${size} -${size},0`)
          .attr("fill", `${color}22`)
          .attr("stroke", color)
          .attr("stroke-width", 1.5)
      } else {
        // Rect for company
        const w = n.isRoot ? 28 : 22, h = n.isRoot ? 22 : 17
        el.append("rect")
          .attr("x", -w / 2).attr("y", -h / 2)
          .attr("width", w).attr("height", h)
          .attr("rx", 4).attr("ry", 4)
          .attr("fill", `${color}22`)
          .attr("stroke", color)
          .attr("stroke-width", n.isRoot ? 2 : 1.5)
          .attr("filter", n.isRoot ? "url(#glow)" : "none")
      }

      // Flag emoji
      if (n.flag) {
        el.append("text")
          .text(n.flag)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("font-size", "12px")
          .attr("y", 0)
      }

      // Label below
      el.append("text")
        .text(n.label.length > 18 ? n.label.slice(0, 16) + "…" : n.label)
        .attr("y", (n.type === "person" ? (n.isRoot ? 30 : 25) : 26))
        .attr("text-anchor", "middle")
        .attr("fill", n.isRoot ? color : "rgba(255,255,255,0.7)")
        .attr("font-size", n.isRoot ? "11px" : "10px")
        .attr("font-family", "JetBrains Mono, monospace")
        .attr("font-weight", n.isRoot ? "700" : "400")
    })

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2 - 6)

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    return () => { simulation.stop() }
  }, [nodes, links, width, height])

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full rounded-xl"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 rounded-xl px-4 py-3 text-xs"
          style={{
            left: tooltip.x + 16,
            top: tooltip.y - 10,
            background: "rgba(10,20,35,0.95)",
            border: `1px solid ${nodeColor(tooltip.node)}45`,
            backdropFilter: "blur(16px)",
            boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
          }}
        >
          <div className="font-bold text-white mb-1">{tooltip.node.label}</div>
          <div className="text-slate-400 capitalize">{tooltip.node.type}</div>
          {tooltip.node.risk && (
            <div
              className="mt-1 font-semibold capitalize"
              style={{
                color: tooltip.node.risk === "high" ? RED : tooltip.node.risk === "medium" ? AMBER : GREEN
              }}
            >
              {tooltip.node.risk} risk
            </div>
          )}
          {tooltip.node.pct !== undefined && (
            <div className="text-slate-400 mt-1 font-mono">{tooltip.node.pct}% ownership</div>
          )}
        </div>
      )}
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 px-1">
        {[
          { shape: "circle", color: PURPLE, label: "Person" },
          { shape: "rect", color: ICE, label: "Company" },
          { shape: "diamond", color: AMBER, label: "Trust" },
          { shape: "rect", color: RED, label: "High Risk" },
        ].map(({ shape, color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg width="14" height="14">
              {shape === "circle"
                ? <circle cx="7" cy="7" r="5" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
                : shape === "diamond"
                ? <polygon points="7,1 13,7 7,13 1,7" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
                : <rect x="1" y="2" width="12" height="10" rx="2" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
              }
            </svg>
            {label}
          </div>
        ))}
        <span className="text-xs text-slate-600 ml-auto font-mono">Scroll to zoom · Drag to pan</span>
      </div>
    </div>
  )
}
