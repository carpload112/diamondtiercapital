export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          reference_id: string
          status: string
          credit_check_completed: boolean
          submitted_at: string
          notes: string | null
          affiliate_id: string | null
          affiliate_code: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          reference_id: string
          status?: string
          credit_check_completed?: boolean
          submitted_at: string
          notes?: string | null
          affiliate_id?: string | null
          affiliate_code?: string | null
        }
        Update: {
          id?: string
          reference_id?: string
          status?: string
          credit_check_completed?: boolean
          submitted_at?: string
          notes?: string | null
          affiliate_id?: string | null
          affiliate_code?: string | null
        }
      }
      applicant_details: {
        Row: {
          id: string
          application_id: string
          full_name: string
          email: string
          phone: string
          preferred_contact: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          application_id: string
          full_name: string
          email: string
          phone: string
          preferred_contact?: string
        }
        Update: {
          id?: string
          application_id?: string
          full_name?: string
          email?: string
          phone?: string
          preferred_contact?: string
        }
      }
      business_details: {
        Row: {
          id: string
          application_id: string
          business_name: string
          business_type: string
          industry: string
          years_in_business: string
          ein: string | null
          annual_revenue: string | null
          monthly_profit: string | null
          credit_score: string | null
          bankruptcy_history: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          application_id: string
          business_name: string
          business_type: string
          industry: string
          years_in_business: string
          ein?: string | null
          annual_revenue?: string | null
          monthly_profit?: string | null
          credit_score?: string | null
          bankruptcy_history?: boolean
        }
        Update: {
          id?: string
          application_id?: string
          business_name?: string
          business_type?: string
          industry?: string
          years_in_business?: string
          ein?: string | null
          annual_revenue?: string | null
          monthly_profit?: string | null
          credit_score?: string | null
          bankruptcy_history?: boolean
        }
      }
      funding_requests: {
        Row: {
          id: string
          application_id: string
          funding_amount: string
          funding_purpose: string
          timeframe: string
          collateral: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          application_id: string
          funding_amount: string
          funding_purpose: string
          timeframe: string
          collateral?: string | null
        }
        Update: {
          id?: string
          application_id?: string
          funding_amount?: string
          funding_purpose?: string
          timeframe?: string
          collateral?: string | null
        }
      }
      additional_information: {
        Row: {
          id: string
          application_id: string
          hear_about_us: string | null
          additional_info: string | null
          terms_agreed: boolean
          marketing_consent: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          application_id: string
          hear_about_us?: string | null
          additional_info?: string | null
          terms_agreed: boolean
          marketing_consent?: boolean
        }
        Update: {
          id?: string
          application_id?: string
          hear_about_us?: string | null
          additional_info?: string | null
          terms_agreed?: boolean
          marketing_consent?: boolean
        }
      }
      affiliates: {
        Row: {
          id: string
          name: string
          email: string
          referral_code: string
          tier: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          referral_code: string
          tier?: string
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          referral_code?: string
          tier?: string
          created_at?: string
          status?: string
        }
      }
      affiliate_tiers: {
        Row: {
          id: string
          name: string
          commission_rate: number
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          commission_rate: number
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          commission_rate?: number
          description?: string | null
        }
      }
      affiliate_commissions: {
        Row: {
          id: string
          affiliate_id: string
          application_id: string
          amount: number
          rate: number
          status: string
          created_at: string
          payout_date: string | null
          updated_at?: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          application_id: string
          amount: number
          rate: number
          status?: string
          created_at?: string
          payout_date?: string | null
        }
        Update: {
          id?: string
          affiliate_id?: string
          application_id?: string
          amount?: number
          rate?: number
          status?: string
          created_at?: string
          payout_date?: string | null
        }
      }
      affiliate_clicks: {
        Row: {
          id: string
          affiliate_id: string
          referral_code: string
          ip_address: string
          user_agent: string
          created_at: string
          landing_page?: string
          converted_to_lead?: boolean
          lead_id?: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          referral_code: string
          ip_address: string
          user_agent: string
          created_at?: string
          landing_page?: string
          converted_to_lead?: boolean
          lead_id?: string
        }
        Update: {
          id?: string
          affiliate_id?: string
          referral_code?: string
          ip_address?: string
          user_agent?: string
          created_at?: string
          landing_page?: string
          converted_to_lead?: boolean
          lead_id?: string
        }
      }
      affiliate_relationships: {
        Row: {
          id: string
          parent_affiliate_id: string
          child_affiliate_id: string
          created_at: string
        }
        Insert: {
          id?: string
          parent_affiliate_id: string
          child_affiliate_id: string
          created_at?: string
        }
        Update: {
          id?: string
          parent_affiliate_id?: string
          child_affiliate_id?: string
          created_at?: string
        }
      }
      affiliate_mlm_settings: {
        Row: {
          id: string
          level: number
          commission_percentage: number
          description: string | null
        }
        Insert: {
          id?: string
          level: number
          commission_percentage: number
          description?: string | null
        }
        Update: {
          id?: string
          level?: number
          commission_percentage?: number
          description?: string | null
        }
      }
    }
  }
}
