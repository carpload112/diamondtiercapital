import { DashboardHeader } from "@/components/admin/DashboardHeader"
import { AffiliateFormWrapper } from "@/components/admin/AffiliateFormWrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function EditAffiliatePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Fetch affiliate data
  const { data: affiliate, error } = await supabase
    .from("affiliates")
    .select("id, name, email, status")
    .eq("id", params.id)
    .single()

  if (error || !affiliate) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Edit Affiliate"
        description="Update affiliate partner information"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/affiliates/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Affiliate
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Affiliate Information</CardTitle>
          <CardDescription>Update the details of your affiliate partner.</CardDescription>
        </CardHeader>
        <CardContent>
          <AffiliateFormWrapper mode="edit" initialData={affiliate} returnUrl={`/admin/affiliates/${params.id}`} />
        </CardContent>
      </Card>
    </div>
  )
}
