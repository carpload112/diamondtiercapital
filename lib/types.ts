// Types for form data
export interface LoanApplication {
  id?: string
  fullName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  yearsInBusiness: number
  loanAmount: number
  loanPurpose: string
  collateral: string
  annualRevenue: number
  creditScore: string
  bankruptcy: string
  status: "new" | "in-review" | "approved" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreditRepairClient {
  id?: string
  fullName: string
  email: string
  phone: string
  currentScore: number
  desiredScore: number
  issues: string[]
  status: "new" | "in-progress" | "completed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}
