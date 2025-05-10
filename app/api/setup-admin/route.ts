import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create a Supabase client with admin privileges
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const email = "admin@example.com"
    const password = "password"

    // Create user in Auth
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createUserError) {
      return NextResponse.json({ error: createUserError.message }, { status: 500 })
    }

    if (!newUser || !newUser.user) {
      return NextResponse.json({ error: "No user returned after creation" }, { status: 500 })
    }

    const userId = newUser.user.id

    // Add user to admin_users table
    const { error: adminError } = await supabase.from("admin_users").insert({
      id: userId,
      email: email,
      role: "admin",
    })

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user setup completed successfully",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
