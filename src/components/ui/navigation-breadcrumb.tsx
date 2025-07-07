import * as React from "react"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export interface NavigationBreadcrumbItem {
  label: string
  onClick?: () => void
  current?: boolean
}

interface NavigationBreadcrumbProps {
  items: NavigationBreadcrumbItem[]
  className?: string
  showHome?: boolean
  homeLabel?: string
  onHomeClick?: () => void
}

export const NavigationBreadcrumb = React.forwardRef<HTMLElement, NavigationBreadcrumbProps>(
  ({ 
    items, 
    className, 
    showHome = true, 
    homeLabel = "Library", 
    onHomeClick,
    ...props 
  }, ref) => {
    return (
      <Breadcrumb ref={ref} className={className} {...props}>
        <BreadcrumbList>
          {showHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onHomeClick}
                    className="h-auto px-2 py-1 text-sage-600 hover:text-sage-900 hover:bg-sage-100"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    {homeLabel}
                  </Button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {items.length > 0 && <BreadcrumbSeparator />}
            </>
          )}
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const isCurrent = item.current || isLast

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {isCurrent ? (
                    <BreadcrumbPage className="text-sage-900 font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={item.onClick}
                        className="h-auto px-2 py-1 text-sage-600 hover:text-sage-900 hover:bg-sage-100"
                      >
                        {item.label}
                      </Button>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
)

NavigationBreadcrumb.displayName = "NavigationBreadcrumb"