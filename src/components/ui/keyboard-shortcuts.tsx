import * as React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Keyboard, Command, Save, Search, Plus, ArrowLeft, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeyboardShortcut {
  key: string[]
  description: string
  category: string
  action?: () => void
}

interface KeyboardShortcutsProps {
  shortcuts?: KeyboardShortcut[]
  onShortcutTrigger?: (shortcut: KeyboardShortcut) => void
}

const defaultShortcuts: KeyboardShortcut[] = [
  {
    key: ["Ctrl", "S"],
    description: "Save current work",
    category: "General",
  },
  {
    key: ["Ctrl", "N"],
    description: "Create new story/chapter",
    category: "General",
  },
  {
    key: ["Ctrl", "K"],
    description: "Open command palette",
    category: "General",
  },
  {
    key: ["Ctrl", "F"],
    description: "Search stories",
    category: "Navigation",
  },
  {
    key: ["Ctrl", "←"],
    description: "Previous chapter",
    category: "Navigation",
  },
  {
    key: ["Ctrl", "→"],
    description: "Next chapter",
    category: "Navigation",
  },
  {
    key: ["Escape"],
    description: "Close dialogs/cancel",
    category: "General",
  },
  {
    key: ["?"],
    description: "Show keyboard shortcuts",
    category: "Help",
  },
]

const KeyIcon = ({ keyName }: { keyName: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    "Ctrl": <Command className="h-3 w-3" />,
    "Cmd": <Command className="h-3 w-3" />,
    "←": <ArrowLeft className="h-3 w-3" />,
    "→": <ArrowRight className="h-3 w-3" />,
    "Escape": <X className="h-3 w-3" />,
  }

  return iconMap[keyName] || <span className="text-xs font-mono">{keyName}</span>
}

const KeyBadge = ({ keyName }: { keyName: string }) => (
  <Badge variant="outline" className="px-2 py-1 bg-white border-sage-300 text-sage-700">
    <KeyIcon keyName={keyName} />
  </Badge>
)

const ShortcutRow = ({ shortcut }: { shortcut: KeyboardShortcut }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-sage-700">{shortcut.description}</span>
    <div className="flex items-center gap-1">
      {shortcut.key.map((key, index) => (
        <React.Fragment key={key}>
          <KeyBadge keyName={key} />
          {index < shortcut.key.length - 1 && (
            <span className="text-sage-400 text-xs mx-1">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
)

export const KeyboardShortcuts = ({ shortcuts = defaultShortcuts, onShortcutTrigger }: KeyboardShortcutsProps) => {
  const [open, setOpen] = useState(false)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const ctrlKey = event.ctrlKey || event.metaKey
      
      setPressedKeys(prev => new Set([...prev, key]))

      // Check for shortcut matches
      shortcuts.forEach(shortcut => {
        const shortcutKeys = shortcut.key.map(k => 
          k === "Ctrl" ? (navigator.platform.includes("Mac") ? "Cmd" : "Ctrl") : k
        )
        
        let matches = true
        if (shortcutKeys.includes("Ctrl") || shortcutKeys.includes("Cmd")) {
          if (!ctrlKey) matches = false
          if (shortcutKeys[1] && shortcutKeys[1].toLowerCase() !== key.toLowerCase()) matches = false
        } else if (shortcutKeys[0] === "?") {
          if (key !== "?" || ctrlKey) matches = false
        } else if (shortcutKeys[0] === "Escape") {
          if (key !== "Escape") matches = false
        }

        if (matches) {
          event.preventDefault()
          if (shortcut.key[0] === "?" || (shortcut.key[0] === "Ctrl" && shortcut.key[1] === "K")) {
            setOpen(true)
          } else if (shortcut.action) {
            shortcut.action()
          } else if (onShortcutTrigger) {
            onShortcutTrigger(shortcut)
          }
        }
      })
    }

    const handleKeyUp = () => {
      setPressedKeys(new Set())
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [shortcuts, onShortcutTrigger])

  const categories = [...new Set(shortcuts.map(s => s.category))]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-sage-300 text-sage-700 hover:bg-sage-50">
          <Keyboard className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-sage-900">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="font-medium text-sage-900 mb-3">{category}</h3>
              <div className="space-y-1">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <ShortcutRow key={index} shortcut={shortcut} />
                  ))}
              </div>
              {category !== categories[categories.length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-sage-50 rounded-lg border border-sage-200">
            <p className="text-sm text-sage-600">
              <strong>Tip:</strong> Press <KeyBadge keyName="?" /> at any time to open this shortcuts guide.
              On Mac, use <KeyBadge keyName="Cmd" /> instead of <KeyBadge keyName="Ctrl" />.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easy keyboard shortcut management
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const [triggered, setTriggered] = useState<KeyboardShortcut | null>(null)

  const handleShortcutTrigger = (shortcut: KeyboardShortcut) => {
    setTriggered(shortcut)
    setTimeout(() => setTriggered(null), 100) // Reset after brief moment
  }

  return {
    triggered,
    KeyboardShortcutsComponent: () => (
      <KeyboardShortcuts shortcuts={shortcuts} onShortcutTrigger={handleShortcutTrigger} />
    )
  }
}