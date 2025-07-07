import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-border/80",
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
