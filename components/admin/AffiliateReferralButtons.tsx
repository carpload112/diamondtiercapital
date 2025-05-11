"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, LinkIcon, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AffiliateReferralButtonsProps {
  referralCode: string
  baseUrl: string
}

export function AffiliateReferralButtons({ referralCode, baseUrl }: AffiliateReferralButtonsProps) {
  const { toast } = useToast()
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopiedCode(true)
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      })
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyReferralLink = async () => {
    try {
      const referralLink = `${baseUrl}/applynow?ref=${referralCode}`
      await navigator.clipboard.writeText(referralLink)
      setCopiedLink(true)
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy link: ", err)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
        <code className="text-xs font-mono">{referralCode}</code>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyReferralCode} title="Copy referral code">
          {copiedCode ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>

      <Button size="sm" className="gap-1" onClick={copyReferralLink}>
        {copiedLink ? <Check className="h-3.5 w-3.5 text-green-500" /> : <LinkIcon className="h-3.5 w-3.5" />}
        <span>{copiedLink ? "Copied!" : "Copy Referral Link"}</span>
      </Button>
    </div>
  )
}
