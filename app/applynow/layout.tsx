import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Apply Now - Diamond Tier Capital",
  description:
    "Apply for business funding with Diamond Tier Capital. Complete our simple application to get matched with the best funding options for your business.",
}

export default function ApplyNowLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
