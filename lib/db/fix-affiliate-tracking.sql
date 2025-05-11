-- This script fixes applications that have affiliate_code but no affiliate_id

-- First, create a temporary table to store the applications that need fixing
CREATE TEMP TABLE applications_to_fix AS
SELECT 
  a.id AS application_id, 
  a.affiliate_code,
  aff.id AS affiliate_id
FROM 
  applications a
JOIN 
  affiliates aff ON a.affiliate_code = aff.referral_code
WHERE 
  a.affiliate_code IS NOT NULL 
  AND a.affiliate_id IS NULL;

-- Update the applications with the correct affiliate_id
UPDATE applications
SET 
  affiliate_id = f.affiliate_id,
  updated_at = NOW()
FROM 
  applications_to_fix f
WHERE 
  applications.id = f.application_id;

-- Create missing conversions
INSERT INTO affiliate_conversions (
  affiliate_id,
  application_id,
  reference_id,
  conversion_type,
  created_at
)
SELECT 
  f.affiliate_id,
  f.application_id,
  a.reference_id,
  'application',
  COALESCE(a.submitted_at, a.created_at, NOW())
FROM 
  applications_to_fix f
JOIN 
  applications a ON f.application_id = a.id
LEFT JOIN 
  affiliate_conversions ac ON ac.affiliate_id = f.affiliate_id AND ac.application_id = f.application_id
WHERE 
  ac.id IS NULL;

-- Create missing commissions
INSERT INTO affiliate_commissions (
  affiliate_id,
  application_id,
  amount,
  rate,
  status,
  created_at
)
SELECT 
  f.affiliate_id,
  f.application_id,
  1000, -- Default amount
  10, -- Default rate
  'pending',
  COALESCE(a.submitted_at, a.created_at, NOW())
FROM 
  applications_to_fix f
JOIN 
  applications a ON f.application_id = a.id
LEFT JOIN 
  affiliate_commissions ac ON ac.affiliate_id = f.affiliate_id AND ac.application_id = f.application_id
WHERE 
  ac.id IS NULL;

-- Report the results
SELECT 'Fixed ' || COUNT(*) || ' applications' AS result FROM applications_to_fix;

-- Drop the temporary table
DROP TABLE applications_to_fix;
