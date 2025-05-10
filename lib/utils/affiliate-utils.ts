/**
 * Utility functions for affiliate management
 */

/**
 * Generate a unique referral code
 * @param firstName First name of the affiliate
 * @param lastName Last name of the affiliate
 * @returns A unique referral code
 */
export function generateReferralCode(firstName: string, lastName: string): string {
  const prefix = `${firstName.substring(0, 1)}${lastName.substring(0, 3)}`.toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}${randomPart}`
}

/**
 * Calculate commission amount based on amount and rate
 * @param amount The base amount
 * @param rate The commission rate (percentage)
 * @returns The calculated commission amount
 */
export function calculateCommission(amount: number, rate: number): number {
  return (amount * rate) / 100
}

/**
 * Determine the appropriate tier for an affiliate based on performance
 * @param referrals Number of referrals
 * @param approvedApplications Number of approved applications
 * @param revenue Total revenue generated
 * @param tiers Available tiers with their requirements
 * @returns The appropriate tier name
 */
export function determineAffiliateTier(
  referrals: number,
  approvedApplications: number,
  revenue: number,
  tiers: Array<{
    name: string
    min_referrals: number
    min_approved_applications: number
    min_revenue: number
  }>,
): string {
  // Sort tiers by most demanding requirements first
  const sortedTiers = [...tiers].sort((a, b) => {
    const aScore = a.min_referrals + a.min_approved_applications + a.min_revenue
    const bScore = b.min_referrals + b.min_approved_applications + b.min_revenue
    return bScore - aScore
  })

  // Find the highest tier the affiliate qualifies for
  for (const tier of sortedTiers) {
    if (
      referrals >= tier.min_referrals &&
      approvedApplications >= tier.min_approved_applications &&
      revenue >= tier.min_revenue
    ) {
      return tier.name
    }
  }

  // Default to the lowest tier if no match
  return sortedTiers[sortedTiers.length - 1].name
}

/**
 * Format currency amount
 * @param amount The amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
