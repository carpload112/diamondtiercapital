import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create a Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Test database connection
    const { data: testData, error: testError } = await supabase.from("admin_users").select("count").limit(1)

    if (testError) {
      return NextResponse.json({ error: "Database connection failed", details: testError.message }, { status: 500 })
    }

    // Check if admin user exists
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", "hysen@diamondtier.solutions")
      .single()

    if (adminError && adminError.code !== "PGRST116") {
      return NextResponse.json({ error: "Error checking admin user", details: adminError.message }, { status: 500 })
    }

    // Test auth functionality
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      return NextResponse.json({ error: "Auth system error", details: authError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tests: {
        databaseConnection: "OK",
        adminUserExists: adminUser ? "YES" : "NO",
        authSystem: "OK",
        userCount: authData.users.length,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
