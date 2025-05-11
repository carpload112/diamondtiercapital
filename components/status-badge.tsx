import { Badge } from "@/components/ui/badge"

type StatusType = "success" | "warning" | "error" | "info" | "default"

interface StatusBadgeProps {
  status: StatusType | string
  text?: string
  className?: string
}

/**
 * Reusable status badge component
 */
export function StatusBadge({ status, text, className = "" }: StatusBadgeProps) {
  // Map status to colors
  const getStatusStyles = (status: string): string => {
    switch (status.toLowerCase()) {
      case "success":
      case "approved":
      case "active":
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
      case "pending":
      case "in_review":
      case "in review":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "error":
      case "rejected":
      case "failed":
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "info":
      case "processing":
      case "in_progress":
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format status text
  const getStatusText = (status: string): string => {
    if (text) return text

    // Convert snake_case or kebab-case to Title Case
    return status
      .replace(/[-_]/g, " ")
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }

  return <Badge className={`font-medium ${getStatusStyles(status)} ${className}`}>{getStatusText(status)}</Badge>
}
