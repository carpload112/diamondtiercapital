import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create a Supabase client with admin privileges
    const supabase = createServerClient()

    const email = "hysen@diamondtier.solutions"
    const password = "HYbr2016$$"

    // First, try to delete the user if it exists (to ensure a clean slate)
    try {
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users.find((user) => user.email === email)

      if (existingUser) {
        console.log("Found existing user, deleting to recreate:", existingUser.id)
        await supabase.auth.admin.deleteUser(existingUser.id)

        // Also delete from admin_users table
        await supabase.from("admin_users").delete().eq("email", email)
      }
    } catch (deleteError) {
      console.error("Error during user cleanup:", deleteError)
      // Continue anyway
    }

    // Create user in Auth with explicit password
    console.log("Creating new auth user with email:", email)
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createUserError) {
      console.error("Error creating auth user:", createUserError)
      return NextResponse.json(
        {
          error: createUserError.message,
          details: "Failed to create auth user",
        },
        { status: 500 },
      )
    }

    if (!newUser || !newUser.user) {
      return NextResponse.json(
        {
          error: "No user returned after creation",
          details: "User creation appeared to succeed but no user was returned",
        },
        { status: 500 },
      )
    }

    const userId = newUser.user.id
    console.log("Created new auth user with ID:", userId)

    // Add user to admin_users table
    console.log("Adding user to admin_users table")
    const { error: adminError } = await supabase.from("admin_users").insert({
      id: userId,
      email: email,
      role: "super_admin",
    })

    if (adminError) {
      console.error("Error adding user to admin_users:", adminError)
      return NextResponse.json(
        {
          error: adminError.message,
          details: "Failed to add user to admin_users table",
        },
        { status: 500 },
      )
    }

    // Verify the user was created correctly
    const { data: verifyAuth } = await supabase.auth.admin.getUserById(userId)
    const { data: verifyAdmin } = await supabase.from("admin_users").select("*").eq("id", userId).single()

    return NextResponse.json({
      success: true,
      message: "Admin user setup completed successfully",
      user: {
        id: userId,
        email: email,
      },
      verification: {
        authUser: !!verifyAuth.user,
        adminUser: !!verifyAdmin,
      },
    })
  } catch (error: any) {
    console.error("Unexpected error in setup-admin:", error)
    return NextResponse.json(
      {
        error: error.message,
        details: "Unexpected error during admin setup",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
