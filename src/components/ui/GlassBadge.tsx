import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-ice",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-white/10",
        
        // Semantic Intel Variants
        shell: "border-shell/50 bg-shell/10 text-shell",
        verified: "border-verified/50 bg-verified/10 text-verified",
        warning: "border-warning/50 bg-warning/10 text-warning",
        growth: "border-growth/50 bg-growth/10 text-growth",
        decline: "border-decline/50 bg-decline/10 text-decline",
        industry: "border-white/20 bg-white/5 text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface GlassBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassBadgeVariants> {}

function GlassBadge({ className, variant, ...props }: GlassBadgeProps) {
  return (
    <div className={cn(glassBadgeVariants({ variant }), className)} {...props} />
  )
}

export { GlassBadge, glassBadgeVariants }
