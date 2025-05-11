/**
 * Application-wide constants
 */

// Form steps for application process
export const APPLICATION_STEPS = [
  {
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: "User",
  },
  {
    title: "Business Details",
    description: "Tell us about your business",
    icon: "Building2",
  },
  {
    title: "Financial Information",
    description: "Tell us about your finances",
    icon: "LineChart",
  },
  {
    title: "Funding Needs",
    description: "Tell us what you need",
    icon: "DollarSign",
  },
  {
    title: "Bank Statements",
    description: "Upload your last 3 months of business bank statements",
    icon: "FileText",
  },
  {
    title: "Additional Information",
    description: "Final details",
    icon: "FileText",
  },
]

// Application statuses
export const APPLICATION_STATUSES = {
  DRAFT: "draft",
  PENDING: "pending",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  ARCHIVED: "archived",
}

// Affiliate tiers
export const AFFILIATE_TIERS = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
  PLATINUM: "platinum",
}

// File size limits
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  LARGE_FILE_THRESHOLD: 20 * 1024 * 1024, // 20MB
  VERY_LARGE_FILE_THRESHOLD: 50 * 1024 * 1024, // 50MB
}
