import * as React from "react"
import { SaveStatus } from "@/components/ui/save-status"
import { cn } from "@/lib/utils"

interface FloatingSaveStatusProps {
  status: "saving" | "saved" | "error" | "unsaved"
  lastSaved?: Date | null
  error?: string | null
  className?: string
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right"
  show?: boolean
}

export const FloatingSaveStatus = React.forwardRef<HTMLDivElement, FloatingSaveStatusProps>(
  ({ 
    status,
    lastSaved,
    error,
    className,
    position = "bottom-right",
    show = true,
    ...props 
  }, ref) => {
    const [visible, setVisible] = React.useState(false)

    // Show/hide logic
    React.useEffect(() => {
      if (!show) {
        setVisible(false)
        return
      }

      if (status === "saving") {
        setVisible(true)
      } else if (status === "saved") {
        setVisible(true)
        // Auto-hide after 2 seconds
        const timer = setTimeout(() => setVisible(false), 2000)
        return () => clearTimeout(timer)
      } else if (status === "error") {
        setVisible(true)
        // Keep error visible longer (5 seconds)
        const timer = setTimeout(() => setVisible(false), 5000)
        return () => clearTimeout(timer)
      } else {
        // For unsaved, only show briefly when there are unsaved changes
        setVisible(true)
        const timer = setTimeout(() => setVisible(false), 1500)
        return () => clearTimeout(timer)
      }
    }, [status, show])

    const positionClasses = {
      "bottom-left": "bottom-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "top-left": "top-4 left-4", 
      "top-right": "top-4 right-4",
    }

    if (!visible) return null

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 pointer-events-none",
          positionClasses[position],
          "transform transition-all duration-300 ease-in-out",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          className
        )}
        {...props}
      >
        <div className="bg-white/95 backdrop-blur-sm border border-sage-200 rounded-lg shadow-lg px-3 py-2">
          <SaveStatus
            status={status}
            lastSaved={lastSaved}
            error={error}
            size="sm"
          />
        </div>
      </div>
    )
  }
)

FloatingSaveStatus.displayName = "FloatingSaveStatus"