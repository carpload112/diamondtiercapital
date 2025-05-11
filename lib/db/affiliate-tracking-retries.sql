-- Create table for tracking retry records
CREATE TABLE IF NOT EXISTS affiliate_tracking_retries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  error_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Add indexes for better performance
  CONSTRAINT affiliate_tracking_retries_unique UNIQUE (application_id, referral_code)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_retries_status ON affiliate_tracking_retries(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_retries_created_at ON affiliate_tracking_retries(created_at);

-- Add indexes to existing tables to improve affiliate tracking performance
CREATE INDEX IF NOT EXISTS idx_applications_affiliate_id ON applications(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_applications_affiliate_code ON applications(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_application_id ON affiliate_conversions(application_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_application_id ON affiliate_commissions(application_id);
