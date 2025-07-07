import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Clock, Check, AlertCircle, Save, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const saveStatusVariants = cva(
  "inline-flex items-center gap-2 text-sm font-medium transition-all duration-200",
  {
    variants: {
      status: {
        saving: "text-amber-600",
        saved: "text-green-600",
        error: "text-red-600",
        unsaved: "text-sage-500",
        offline: "text-slate-500",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      status: "unsaved",
      size: "default",
    },
  }
)

interface SaveStatusProps extends VariantProps<typeof saveStatusVariants> {
  className?: string
  lastSaved?: Date | null
  error?: string | null
  isOnline?: boolean
  showBadge?: boolean
  autoHide?: boolean
  hideDelay?: number
}

const statusConfig = {
  saving: {
    icon: Clock,
    label: "Saving...",
    animate: "animate-spin",
  },
  saved: {
    icon: Check,
    label: "Saved",
    animate: "",
  },
  error: {
    icon: AlertCircle,
    label: "Save failed",
    animate: "",
  },
  unsaved: {
    icon: Save,
    label: "Unsaved changes",
    animate: "",
  },
  offline: {
    icon: WifiOff,
    label: "Offline",
    animate: "",
  },
}

export const SaveStatus = React.forwardRef<HTMLDivElement, SaveStatusProps>(
  ({ 
    className, 
    status = "unsaved", 
    size = "default",
    lastSaved, 
    error, 
    isOnline = true,
    showBadge = false,
    autoHide = false,
    hideDelay = 3000,
    ...props 
  }, ref) => {
    const [visible, setVisible] = React.useState(true)

    // Determine actual status based on props
    const actualStatus = React.useMemo(() => {
      if (!isOnline) return "offline"
      if (error) return "error"
      return status
    }, [status, error, isOnline])

    const config = statusConfig[actualStatus]
    const Icon = config.icon

    // Auto-hide logic for saved status
    React.useEffect(() => {
      if (autoHide && actualStatus === "saved") {
        const timer = setTimeout(() => setVisible(false), hideDelay)
        return () => clearTimeout(timer)
      } else {
        setVisible(true)
      }
    }, [actualStatus, autoHide, hideDelay])

    // Format last saved time
    const formatLastSaved = (date: Date) => {
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 1) return "just now"
      if (diffInMinutes === 1) return "1 minute ago"
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
      return format(date, 'HH:mm')
    }

    if (!visible) return null

    const content = (
      <div
        ref={ref}
        className={cn(saveStatusVariants({ status: actualStatus, size }), className)}
        {...props}
      >
        <Icon className={cn("h-4 w-4 flex-shrink-0", config.animate)} />
        <span>
          {error ? `${config.label}: ${error}` : config.label}
          {lastSaved && actualStatus === "saved" && (
            <span className="ml-1 opacity-75">
              {formatLastSaved(lastSaved)}
            </span>
          )}
        </span>
      </div>
    )

    if (showBadge) {
      return (
        <Badge
          variant={actualStatus === "error" ? "destructive" : "secondary"}
          className={cn(
            "border-0",
            actualStatus === "saving" && "bg-amber-100 text-amber-700",
            actualStatus === "saved" && "bg-green-100 text-green-700",
            actualStatus === "unsaved" && "bg-sage-100 text-sage-700",
            actualStatus === "offline" && "bg-slate-100 text-slate-700"
          )}
        >
          {content}
        </Badge>
      )
    }

    return content
  }
)

SaveStatus.displayName = "SaveStatus"

// Hook for managing save status
export const useSaveStatus = () => {
  const [status, setStatus] = React.useState<"saving" | "saved" | "error" | "unsaved">("unsaved")
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const setSaving = React.useCallback(() => {
    setStatus("saving")
    setError(null)
  }, [])

  const setSaved = React.useCallback(() => {
    setStatus("saved")
    setLastSaved(new Date())
    setError(null)
  }, [])

  const setUnsaved = React.useCallback(() => {
    setStatus("unsaved")
    setError(null)
  }, [])

  const setSaveError = React.useCallback((errorMessage: string) => {
    setStatus("error")
    setError(errorMessage)
  }, [])

  return {
    status,
    lastSaved,
    error,
    setSaving,
    setSaved,
    setUnsaved,
    setError: setSaveError,
  }
}