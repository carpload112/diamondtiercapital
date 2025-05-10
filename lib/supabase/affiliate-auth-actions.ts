"use server"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { generateReferralCode } from "@/lib/utils/affiliate-utils"

export async function affiliateLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if the user is an affiliate
  const { data: affiliate, error: affiliateError } = await supabase
    .from("affiliates")
    .select("*")
    .eq("email", email)
    .single()

  if (affiliateError || !affiliate) {
    // Sign out the user if they're not an affiliate
    await supabase.auth.signOut()
    return { error: "You are not registered as an affiliate" }
  }

  return { success: true, data }
}

export async function affiliateLogout() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect("/affiliate/login")
}

export async function affiliateRegister(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const website = formData.get("website") as string
  const paymentMethod = formData.get("paymentMethod") as string
  const paymentDetails = formData.get("paymentDetails") as string
  const marketingChannels = formData.get("marketingChannels") as string
  const referralSource = formData.get("referralSource") as string

  if (!email || !password || !firstName || !lastName) {
    return { error: "Required fields are missing" }
  }

  const supabase = createServerClient()

  // First, create the affiliate record
  const referralCode = await generateReferralCode(`${firstName}${lastName}`)

  const { data: affiliate, error: affiliateError } = await supabase
    .from("affiliates")
    .insert({
      name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      email: email,
      company: company,
      phone: phone,
      website: website,
      referral_code: referralCode,
      payment_method: paymentMethod,
      payment_details: paymentDetails,
      notes: marketingChannels,
      referral_source: referralSource,
      status: "pending", // Affiliates start as pending until approved
      tier: "bronze", // Default tier
    })
    .select()
    .single()

  if (affiliateError) {
    return { error: affiliateError.message }
  }

  // Then, create the user account
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        affiliate_id: affiliate.id,
      },
    },
  })

  if (error) {
    // If user creation fails, delete the affiliate record
    await supabase.from("affiliates").delete().eq("id", affiliate.id)
    return { error: error.message }
  }

  // Send welcome email (in a real implementation)
  // await sendWelcomeEmail(email, firstName, referralCode);

  return {
    success: true,
    message: "Registration successful! Please check your email to confirm your account.",
    data,
  }
}

// Add the missing affiliateResetPassword function
export async function affiliateResetPassword(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  const supabase = createServerClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.diamondtiercapital.com"

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/affiliate/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: "Password reset instructions have been sent to your email",
  }
}

// Add the missing affiliateUpdatePassword function
export async function affiliateUpdatePassword(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return { error: "Password is required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const supabase = createServerClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: "Password has been updated successfully",
  }
}

export async function getAffiliateSession() {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return { error: "Not authenticated" }
  }

  // Get the affiliate data
  const { data: affiliate, error: affiliateError } = await supabase
    .from("affiliates")
    .select("*, tier:affiliate_tiers(*)")
    .eq("email", data.session.user.email)
    .single()

  if (affiliateError || !affiliate) {
    return { error: "Affiliate not found" }
  }

  return { success: true, session: data.session, affiliate }
}

// Alias resetPassword to affiliateResetPassword for backward compatibility
export const resetPassword = affiliateResetPassword

// Alias updatePassword to affiliateUpdatePassword for backward compatibility
export const updatePassword = affiliateUpdatePassword
