import { Loader2 } from "lucide-react"

interface SuspenseFallbackProps {
  message?: string
  className?: string
}

/**
 * Fallback component for React Suspense
 */
export function SuspenseFallback({ message = "Loading...", className = "" }: SuspenseFallbackProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
