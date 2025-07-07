import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const formMessageVariants = cva(
  "flex items-center gap-2 text-sm font-medium",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        error: "text-red-600",
        success: "text-green-600",
        warning: "text-amber-600",
        info: "text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
}

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formMessageVariants> {
  showIcon?: boolean
}

const FormMessage = React.forwardRef<HTMLDivElement, FormMessageProps>(
  ({ className, variant = "default", showIcon = true, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"]
    
    if (!children) return null
    
    return (
      <div
        ref={ref}
        className={cn(formMessageVariants({ variant }), className)}
        {...props}
      >
        {showIcon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span>{children}</span>
      </div>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { FormMessage }