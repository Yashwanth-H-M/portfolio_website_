"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataMetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  variant?: "default" | "strong" | "subtle"
  glow?: "none" | "blue" | "amber" | "emerald" | "rose"
  className?: string
}

export function DataMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  glow = "none",
  className,
}: DataMetricCardProps) {
  return (
    <GlassCard variant={variant} glow={glow} className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className="size-4 text-slate-300" />
        </div>
      </div>
      
      <div>
        <div className="text-3xl font-mono font-bold text-white tracking-tight">
          {value}
        </div>
        
        {trend && (
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full border",
              trend.isPositive !== false
                ? "text-growth border-growth/30 bg-growth/10"
                : "text-decline border-decline/30 bg-decline/10"
            )}>
              {trend.isPositive !== false ? (
                <ArrowUpRight className="size-3 mr-1" />
              ) : (
                <ArrowDownRight className="size-3 mr-1" />
              )}
              {trend.value}%
            </span>
            <span className="text-xs text-slate-500">{trend.label}</span>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
