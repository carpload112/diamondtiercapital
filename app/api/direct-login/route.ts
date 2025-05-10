import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email = "hysen@diamondtier.solutions", password = "HYbr2016$$" } = body

    // Create a Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (adminError || !adminData) {
      console.error("Admin check error:", adminError?.message || "No admin data found")
      return NextResponse.json({ error: "You do not have admin access" }, { status: 403 })
    }

    // Set cookies for the session
    const cookieStore = cookies()

    // Set the session cookie
    if (data.session) {
      cookieStore.set("sb-access-token", data.session.access_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })

      cookieStore.set("sb-refresh-token", data.session.refresh_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    }

    // Return success
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: adminData.role,
      },
    })
  } catch (error: any) {
    console.error("Unexpected error in direct-login:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
