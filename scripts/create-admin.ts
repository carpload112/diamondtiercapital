import { createClient } from "@supabase/supabase-js"

async function createAdmin() {
  // Replace with your Supabase URL and service role key
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase URL or service role key")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Admin credentials
  const email = "hysen@diamondtier.solutions"
  const password = "HYbr2016$$"

  try {
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return
    }

    console.log("Auth user created:", authData.user.id)

    // Add the user to the admin_users table
    const { error: adminError } = await supabase.from("admin_users").insert({
      id: authData.user.id,
      email: email,
      role: "super_admin",
    })

    if (adminError) {
      console.error("Error adding user to admin_users:", adminError)
      return
    }

    console.log("Admin user created successfully!")
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

createAdmin()
