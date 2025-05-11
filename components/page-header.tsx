import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  backLink?: string
  backLinkText?: string
  actions?: ReactNode
  className?: string
}

/**
 * Reusable page header component
 */
export function PageHeader({
  title,
  description,
  backLink,
  backLinkText = "Back",
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {backLink && (
        <Button variant="ghost" size="sm" className="mb-2 -ml-2 h-8 text-muted-foreground" asChild>
          <Link href={backLink}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            {backLinkText}
          </Link>
        </Button>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
