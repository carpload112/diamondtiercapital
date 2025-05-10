import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email = "hysen@diamondtier.solutions", password = "HYbr2016$$" } = body

    // Create a Supabase client
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create a Supabase client with cookie storage
    const cookieStore = cookies()
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "sb-auth-token",
        storage: {
          getItem: (key) => {
            const cookie = cookieStore.get(key)
            return cookie?.value
          },
          setItem: (key, value) => {
            cookieStore.set(key, value, { path: "/", maxAge: 60 * 60 * 24 * 7 }) // 1 week
          },
          removeItem: (key) => {
            cookieStore.set(key, "", { path: "/", maxAge: 0 })
          },
        },
      },
    })

    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
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
      return NextResponse.json({ error: "You do not have admin access" }, { status: 403 })
    }

    // Set cookies for the session
    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: adminData.role,
      },
    })

    // Return success
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
