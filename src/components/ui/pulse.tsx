import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pulseVariants = cva(
  "rounded-full animate-pulse",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-500",
        warning: "bg-amber-500",
        error: "bg-red-500",
        info: "bg-blue-500",
      },
      size: {
        sm: "h-2 w-2",
        default: "h-3 w-3",
        lg: "h-4 w-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface PulseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pulseVariants> {
  duration?: number
}

const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ className, variant, size, duration = 2, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(pulseVariants({ variant, size, className }))}
        style={{ animationDuration: `${duration}s` }}
        {...props}
      />
    )
  }
)
Pulse.displayName = "Pulse"

export { Pulse }