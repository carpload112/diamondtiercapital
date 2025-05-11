"use server"

import { createServerClient } from "../supabase/server"
import { calculateCommission } from "../utils/affiliate-utils"
import { v4 as uuidv4 } from "uuid"

/**
 * Comprehensive affiliate tracking service
 * Handles all affiliate-related operations with improved reliability and error handling
 */
export class AffiliateTrackingService {
  private supabase = createServerClient()

  /**
   * Track a new application with affiliate information
   * @param applicationId The ID of the application
   * @param referenceId The reference ID of the application
   * @param referralCode The affiliate referral code
   * @param fundingAmount The requested funding amount (for commission calculation)
   */
  async trackApplication(
    applicationId: string,
    referenceId: string,
    referralCode: string | null | undefined,
    fundingAmount?: string,
  ): Promise<{ success: boolean; error?: string; affiliateId?: string }> {
    try {
      // If no referral code, nothing to track
      if (!referralCode) {
        return { success: true }
      }

      console.log(`Tracking application ${applicationId} with referral code ${referralCode}`)

      // Normalize referral code (trim whitespace, etc.)
      const normalizedCode = referralCode.trim()

      // Get the affiliate from the referral code
      const { data: affiliate, error: affiliateError } = await this.supabase
        .from("affiliates")
        .select("*")
        .eq("referral_code", normalizedCode)
        .single()

      if (affiliateError || !affiliate) {
        console.error("Error finding affiliate with referral code:", normalizedCode, affiliateError)
        return { success: false, error: "Invalid referral code" }
      }

      // Update the application with the affiliate ID
      const { error: updateError } = await this.supabase
        .from("applications")
        .update({
          affiliate_id: affiliate.id,
          affiliate_code: normalizedCode,
        })
        .eq("id", applicationId)

      if (updateError) {
        console.error("Error updating application with affiliate:", updateError)
        return { success: false, error: "Failed to update application with affiliate information" }
      }

      // Record the conversion in affiliate_conversions table
      await this.recordConversion(affiliate.id, applicationId, referenceId)

      // Calculate and create commission
      await this.createCommission(affiliate.id, applicationId, fundingAmount)

      // Create notification for real-time updates
      await this.createNotification(affiliate.id, applicationId, referenceId)

      // Process MLM commissions if applicable
      await this.processMLMCommissions(affiliate.id, applicationId, fundingAmount)

      return { success: true, affiliateId: affiliate.id }
    } catch (error) {
      console.error("Error in trackApplication:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error tracking affiliate application",
      }
    }
  }

  /**
   * Record a click on an affiliate link
   * @param referralCode The affiliate referral code
   * @param ipAddress The IP address of the visitor
   * @param userAgent The user agent of the visitor
   * @param landingPage The landing page URL
   */
  async recordClick(
    referralCode: string,
    ipAddress: string,
    userAgent: string,
    landingPage?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Normalize referral code
      const normalizedCode = referralCode.trim()

      // Get affiliate ID from referral code
      const { data: affiliate, error: affiliateError } = await this.supabase
        .from("affiliates")
        .select("id")
        .eq("referral_code", normalizedCode)
        .single()

      if (affiliateError || !affiliate) {
        console.error("Error finding affiliate with referral code:", normalizedCode, affiliateError)
        return { success: false, error: "Invalid referral code" }
      }

      // Check for duplicate clicks from the same IP in the last hour to prevent spam
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count: recentClicks, error: countError } = await this.supabase
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .eq("affiliate_id", affiliate.id)
        .eq("ip_address", ipAddress)
        .gte("created_at", oneHourAgo)

      if (countError) {
        console.error("Error checking recent clicks:", countError)
      } else if (recentClicks && recentClicks > 5) {
        // If more than 5 clicks from same IP in last hour, don't record to prevent spam
        console.log("Ignoring potential spam click from IP:", ipAddress)
        return { success: true } // Return success but don't record
      }

      // Record the click
      const { error: insertError } = await this.supabase.from("affiliate_clicks").insert({
        affiliate_id: affiliate.id,
        referral_code: normalizedCode,
        ip_address: ipAddress,
        user_agent: userAgent,
        landing_page: landingPage || null,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error recording affiliate click:", insertError)
        return { success: false, error: "Failed to record click" }
      }

      return { success: true }
    } catch (error) {
      console.error("Error in recordClick:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error recording affiliate click",
      }
    }
  }

  /**
   * Record a conversion (application submission) for an affiliate
   */
  private async recordConversion(affiliateId: string, applicationId: string, referenceId: string): Promise<void> {
    try {
      await this.supabase.from("affiliate_conversions").insert({
        affiliate_id: affiliateId,
        application_id: applicationId,
        reference_id: referenceId,
        conversion_type: "application",
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error recording conversion:", error)
      // Don't throw - we want to continue with other operations even if this fails
    }
  }

  /**
   * Create a commission record for an affiliate
   */
  private async createCommission(affiliateId: string, applicationId: string, fundingAmount?: string): Promise<void> {
    try {
      // Get the affiliate's tier and commission rate
      const { data: affiliate } = await this.supabase.from("affiliates").select("tier").eq("id", affiliateId).single()

      const { data: tierData } = await this.supabase
        .from("affiliate_tiers")
        .select("commission_rate")
        .eq("name", affiliate?.tier || "standard")
        .single()

      // Parse funding amount from string if available
      let commissionBaseAmount = 1000 // Default fallback amount
      if (fundingAmount) {
        // Extract numeric value from funding amount string (e.g. "$50,000-$100,000" -> 50000)
        const match = fundingAmount.match(/\$?(\d{1,3}(,\d{3})*(\.\d+)?)/)
        if (match && match[1]) {
          const numericValue = Number(match[1].replace(/,/g, ""))
          if (!isNaN(numericValue)) {
            commissionBaseAmount = numericValue
          }
        }
      }

      const commissionRate = tierData?.commission_rate || 10 // Default 10% if tier not found
      const commissionAmount = calculateCommission(commissionBaseAmount, commissionRate)

      // Create the commission record
      await this.supabase.from("affiliate_commissions").insert({
        affiliate_id: affiliateId,
        application_id: applicationId,
        amount: commissionAmount,
        rate: commissionRate,
        status: "pending",
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error creating commission:", error)
      // Don't throw - we want to continue with other operations even if this fails
    }
  }

  /**
   * Create a notification for real-time updates
   */
  private async createNotification(affiliateId: string, applicationId: string, referenceId: string): Promise<void> {
    try {
      await this.supabase.from("affiliate_notifications").insert({
        id: uuidv4(),
        affiliate_id: affiliateId,
        type: "new_application",
        application_id: applicationId,
        read: false,
        data: {
          application_reference: referenceId,
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error creating notification:", error)
      // Don't throw - we want to continue with other operations even if this fails
    }
  }

  /**
   * Process MLM commissions for parent affiliates
   */
  private async processMLMCommissions(
    affiliateId: string,
    applicationId: string,
    fundingAmount?: string,
  ): Promise<void> {
    try {
      // Get MLM settings
      const { data: mlmSettings } = await this.supabase
        .from("affiliate_mlm_settings")
        .select("*")
        .order("level", { ascending: true })

      if (!mlmSettings || mlmSettings.length === 0) {
        return // No MLM settings, nothing to do
      }

      // Get parent affiliates
      const { data: relationships } = await this.supabase
        .from("affiliate_relationships")
        .select("parent_affiliate_id, level")
        .eq("child_affiliate_id", affiliateId)
        .order("level", { ascending: true })

      if (!relationships || relationships.length === 0) {
        return // No parent affiliates, nothing to do
      }

      // Parse funding amount from string if available
      let commissionBaseAmount = 1000 // Default fallback amount
      if (fundingAmount) {
        // Extract numeric value from funding amount string (e.g. "$50,000-$100,000" -> 50000)
        const match = fundingAmount.match(/\$?(\d{1,3}(,\d{3})*(\.\d+)?)/)
        if (match && match[1]) {
          const numericValue = Number(match[1].replace(/,/g, ""))
          if (!isNaN(numericValue)) {
            commissionBaseAmount = numericValue
          }
        }
      }

      // Process each parent affiliate
      for (let i = 0; i < Math.min(relationships.length, mlmSettings.length); i++) {
        const parentId = relationships[i].parent_affiliate_id
        const mlmRate = mlmSettings[i].commission_percentage
        const mlmAmount = calculateCommission(commissionBaseAmount, mlmRate)

        // Create commission for the parent affiliate
        await this.supabase.from("affiliate_commissions").insert({
          affiliate_id: parentId,
          application_id: applicationId,
          amount: mlmAmount,
          rate: mlmRate,
          status: "pending",
          created_at: new Date().toISOString(),
        })

        // Create notification for the parent affiliate
        await this.supabase.from("affiliate_notifications").insert({
          id: uuidv4(),
          affiliate_id: parentId,
          type: "mlm_commission",
          application_id: applicationId,
          read: false,
          data: {
            amount: mlmAmount,
            level: i + 1,
            timestamp: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error processing MLM commissions:", error)
      // Don't throw - we want to continue with other operations even if this fails
    }
  }

  /**
   * Get comprehensive affiliate statistics
   */
  async getAffiliateStats(affiliateId: string): Promise<any> {
    try {
      // Get total clicks with optimized query
      const { count: totalClicks } = await this.supabase
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .eq("affiliate_id", affiliateId)

      // Get application counts with optimized query
      const { count: totalApplications } = await this.supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("affiliate_id", affiliateId)

      // Get application status counts
      const { data: statusCounts } = await this.supabase.rpc("get_affiliate_application_status_counts", {
        affiliate_id_param: affiliateId,
      })

      // If RPC fails, fallback to manual counting
      let approvedApplications = 0
      let pendingApplications = 0
      let rejectedApplications = 0

      if (statusCounts && statusCounts.length > 0) {
        // Use the RPC results
        for (const row of statusCounts) {
          if (row.status === "approved") approvedApplications = row.count
          else if (row.status === "pending" || row.status === "in_review") pendingApplications += row.count
          else if (row.status === "rejected") rejectedApplications = row.count
        }
      } else {
        // Fallback to manual query
        const { data: applications } = await this.supabase
          .from("applications")
          .select("status")
          .eq("affiliate_id", affiliateId)

        if (applications) {
          approvedApplications = applications.filter((app) => app.status === "approved").length
          pendingApplications = applications.filter(
            (app) => app.status === "pending" || app.status === "in_review",
          ).length
          rejectedApplications = applications.filter((app) => app.status === "rejected").length
        }
      }

      // Get commission totals
      const { data: commissionTotals } = await this.supabase.rpc("get_affiliate_commission_totals", {
        affiliate_id_param: affiliateId,
      })

      // If RPC fails, fallback to manual calculation
      let totalCommissions = 0
      let paidCommissions = 0
      let pendingCommissions = 0

      if (commissionTotals && commissionTotals.length > 0) {
        // Use the RPC results
        for (const row of commissionTotals) {
          if (row.status === "paid") paidCommissions = Number(row.total)
          else if (row.status === "pending") pendingCommissions = Number(row.total)
          totalCommissions += Number(row.total)
        }
      } else {
        // Fallback to manual query
        const { data: commissions } = await this.supabase
          .from("affiliate_commissions")
          .select("amount, status")
          .eq("affiliate_id", affiliateId)

        if (commissions) {
          totalCommissions = commissions.reduce((sum, commission) => sum + Number(commission.amount), 0)
          paidCommissions = commissions
            .filter((commission) => commission.status === "paid")
            .reduce((sum, commission) => sum + Number(commission.amount), 0)
          pendingCommissions = commissions
            .filter((commission) => commission.status === "pending")
            .reduce((sum, commission) => sum + Number(commission.amount), 0)
        }
      }

      // Calculate conversion rate
      const conversionRate = totalClicks > 0 ? (totalApplications / totalClicks) * 100 : 0

      return {
        data: {
          totalClicks: totalClicks || 0,
          totalApplications: totalApplications || 0,
          approvedApplications,
          pendingApplications,
          rejectedApplications,
          totalCommissions,
          paidCommissions,
          pendingCommissions,
          conversionRate,
        },
      }
    } catch (error) {
      console.error("Error getting affiliate stats:", error)
      return {
        data: {
          totalClicks: 0,
          totalApplications: 0,
          approvedApplications: 0,
          pendingApplications: 0,
          rejectedApplications: 0,
          totalCommissions: 0,
          paidCommissions: 0,
          pendingCommissions: 0,
          conversionRate: 0,
        },
      }
    }
  }
}

// Export a singleton instance
export const affiliateTrackingService = new AffiliateTrackingService()
