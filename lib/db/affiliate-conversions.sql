-- Create affiliate_conversions table to track all conversions
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  reference_id VARCHAR(50),
  conversion_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for performance
  CONSTRAINT affiliate_conversions_type_check 
    CHECK (conversion_type IN ('application', 'lead', 'sale', 'other'))
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_id ON affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_application_id ON affiliate_conversions(application_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_created_at ON affiliate_conversions(created_at);

-- Enable row-level security
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Create policy for real-time updates
CREATE POLICY "Enable read access for all users" ON affiliate_conversions
  FOR SELECT USING (true);
