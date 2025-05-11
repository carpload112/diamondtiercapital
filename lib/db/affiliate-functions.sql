-- Function to get application status counts for an affiliate
CREATE OR REPLACE FUNCTION get_affiliate_application_status_counts(affiliate_id_param UUID)
RETURNS TABLE (
  status TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    applications.status::TEXT,
    COUNT(*)::BIGINT
  FROM 
    applications
  WHERE 
    applications.affiliate_id = affiliate_id_param
  GROUP BY 
    applications.status;
END;
$$ LANGUAGE plpgsql;

-- Function to get commission totals by status for an affiliate
CREATE OR REPLACE FUNCTION get_affiliate_commission_totals(affiliate_id_param UUID)
RETURNS TABLE (
  status TEXT,
  total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    affiliate_commissions.status::TEXT,
    SUM(affiliate_commissions.amount)::NUMERIC
  FROM 
    affiliate_commissions
  WHERE 
    affiliate_commissions.affiliate_id = affiliate_id_param
  GROUP BY 
    affiliate_commissions.status;
END;
$$ LANGUAGE plpgsql;

-- Function to get conversion rate for an affiliate
CREATE OR REPLACE FUNCTION get_affiliate_conversion_rate(affiliate_id_param UUID)
RETURNS TABLE (
  clicks BIGINT,
  applications BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH click_count AS (
    SELECT COUNT(*)::BIGINT AS count
    FROM affiliate_clicks
    WHERE affiliate_id = affiliate_id_param
  ),
  app_count AS (
    SELECT COUNT(*)::BIGINT AS count
    FROM applications
    WHERE affiliate_id = affiliate_id_param
  )
  SELECT 
    click_count.count AS clicks,
    app_count.count AS applications,
    CASE 
      WHEN click_count.count > 0 THEN 
        (app_count.count::NUMERIC / click_count.count::NUMERIC) * 100
      ELSE 0
    END AS conversion_rate
  FROM 
    click_count, app_count;
END;
$$ LANGUAGE plpgsql;
