"use client"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useClipboard } from "@/hooks/use-clipboard"

interface CopyButtonProps {
  text: string
  className?: string
  showIcon?: boolean
  showText?: boolean
  buttonText?: string
  successText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

/**
 * Button component for copying text to clipboard
 */
export function CopyButton({
  text,
  className = "",
  showIcon = true,
  showText = true,
  buttonText = "Copy",
  successText = "Copied!",
  variant = "outline",
  size = "default",
}: CopyButtonProps) {
  const { hasCopied, copyToClipboard } = useClipboard({
    showToast: false,
  })

  const handleCopy = async () => {
    await copyToClipboard(text)
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className={className}>
      {showIcon && (hasCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />)}
      {showText && (hasCopied ? successText : buttonText)}
    </Button>
  )
}
