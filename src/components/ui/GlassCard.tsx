import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassCardVariants = cva(
  "rounded-lg overflow-hidden transition-all duration-300 relative",
  {
    variants: {
      variant: {
        default: "glass glass-hover",
        strong: "glass-strong",
        subtle: "glass-subtle",
        interactive: "glass glass-hover cursor-pointer active:scale-[0.98]",
      },
      padding: {
        none: "",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
      },
      glow: {
        none: "",
        blue: "shadow-ice",
        amber: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
        emerald: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        rose: "shadow-[0_0_15px_rgba(244,63,94,0.3)]"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      glow: "none"
    },
  }
)

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, padding, glow, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassCardVariants({ variant, padding, glow, className }))}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard, glassCardVariants }
