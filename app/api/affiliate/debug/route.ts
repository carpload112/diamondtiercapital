import { type NextRequest, NextResponse } from "next/server"
import { checkAffiliateReferral, checkApplicationAffiliate } from "@/lib/utils/affiliate-debug"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const referralCode = searchParams.get("code")
  const applicationId = searchParams.get("app")

  if (referralCode) {
    const result = await checkAffiliateReferral(referralCode)
    return NextResponse.json(result)
  }

  if (applicationId) {
    const result = await checkApplicationAffiliate(applicationId)
    return NextResponse.json(result)
  }

  return NextResponse.json(
    {
      error: "Missing parameters",
      message: "Please provide either 'code' or 'app' parameter",
    },
    { status: 400 },
  )
}
