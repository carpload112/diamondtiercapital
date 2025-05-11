import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils/string-utils"

interface AvatarWithFallbackProps {
  src?: string | null
  alt: string
  fallbackText?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

/**
 * Avatar component with fallback for when image fails to load
 */
export function AvatarWithFallback({ src, alt, fallbackText, size = "md", className = "" }: AvatarWithFallbackProps) {
  // Determine size class
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }[size]

  // Get initials for fallback
  const initials = fallbackText || getInitials(alt)

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {src && <AvatarImage src={src || "/placeholder.svg"} alt={alt} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
