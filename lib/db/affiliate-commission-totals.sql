-- Function to get accurate commission totals for an affiliate
CREATE OR REPLACE FUNCTION get_affiliate_commission_totals(affiliate_id_param UUID)
RETURNS TABLE (
  total_amount NUMERIC,
  paid_amount NUMERIC,
  pending_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN amount IS NOT NULL THEN amount::NUMERIC ELSE 0 END), 0) AS total_amount,
    COALESCE(SUM(CASE WHEN status = 'paid' AND amount IS NOT NULL THEN amount::NUMERIC ELSE 0 END), 0) AS paid_amount,
    COALESCE(SUM(CASE WHEN (status != 'paid' OR status IS NULL) AND amount IS NOT NULL THEN amount::NUMERIC ELSE 0 END), 0) AS pending_amount
  FROM
    affiliate_commissions
  WHERE
    affiliate_id = affiliate_id_param;
END;
$$ LANGUAGE plpgsql;
