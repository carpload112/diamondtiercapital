import type React from "react"
export function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div className="pt-20">{children}</div>
}
