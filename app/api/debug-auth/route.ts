import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get("email") || "hysen@diamondtier.solutions"

    // Create a Supabase client with admin privileges
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables", env: { url: !!supabaseUrl, key: !!supabaseServiceKey } },
        { status: 500 },
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user exists in Auth
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = authUsers?.users.find((user) => user.email === email)

    // Check if user exists in admin_users table
    const { data: adminUser } = await supabaseAdmin.from("admin_users").select("*").eq("email", email).single()

    return NextResponse.json({
      email,
      authUserExists: !!authUser,
      adminUserExists: !!adminUser,
      authUser: authUser
        ? {
            id: authUser.id,
            email: authUser.email,
            emailConfirmed: authUser.email_confirmed_at !== null,
            lastSignIn: authUser.last_sign_in_at,
          }
        : null,
      adminUser: adminUser || null,
      env: {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseServiceKey,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        details: "Error checking user status",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
