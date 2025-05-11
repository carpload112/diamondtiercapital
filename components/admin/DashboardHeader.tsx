import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  description?: string
  backLink?: string
  backLinkText?: string
}

export function DashboardHeader({ title, description, backLink, backLinkText }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      {backLink && (
        <Link href={backLink} className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mb-2">
          <ArrowLeft className="h-3 w-3 mr-1" />
          {backLinkText || "Back"}
        </Link>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}
