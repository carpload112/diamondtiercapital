"use client"

import { AffiliateForm } from "@/components/admin/AffiliateForm"
import { useRouter } from "next/navigation"

interface AffiliateFormWrapperProps {
  mode: "create" | "edit"
  initialData?: {
    id?: string
    name?: string
    email?: string
    status?: string
  }
  returnUrl?: string
}

export function AffiliateFormWrapper({
  mode,
  initialData,
  returnUrl = "/admin/affiliates",
}: AffiliateFormWrapperProps) {
  const router = useRouter()

  const handleSuccess = () => {
    router.push(returnUrl)
  }

  const handleCancel = () => {
    router.push(returnUrl)
  }

  return <AffiliateForm mode={mode} initialData={initialData} onSuccess={handleSuccess} onCancel={handleCancel} />
}
