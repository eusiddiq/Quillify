import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200 hover:border-border/80",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring focus-visible:border-ring",
        error: "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500 text-red-900 placeholder:text-red-400 hover:border-red-400",
        success: "border-green-500 focus-visible:ring-green-500 focus-visible:border-green-500 text-green-900 placeholder:text-green-400 hover:border-green-400",
        warning: "border-amber-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 text-amber-900 placeholder:text-amber-400 hover:border-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
