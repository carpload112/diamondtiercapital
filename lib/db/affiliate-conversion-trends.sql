-- Function to get affiliate conversion trends over time
CREATE OR REPLACE FUNCTION get_affiliate_conversion_trends()
RETURNS TABLE (
  date_period DATE,
  total_clicks BIGINT,
  total_applications BIGINT,
  conversion_rate DECIMAL,
  total_commissions DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      date_trunc('day', NOW() - INTERVAL '30 days'),
      date_trunc('day', NOW()),
      '1 day'::interval
    )::DATE AS date_period
  ),
  click_data AS (
    SELECT 
      date_trunc('day', created_at)::DATE AS click_date,
      COUNT(*) AS clicks
    FROM affiliate_clicks
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY click_date
  ),
  application_data AS (
    SELECT 
      date_trunc('day', created_at)::DATE AS app_date,
      COUNT(*) AS applications
    FROM applications
    WHERE 
      affiliate_id IS NOT NULL AND
      created_at >= NOW() - INTERVAL '30 days'
    GROUP BY app_date
  ),
  commission_data AS (
    SELECT 
      date_trunc('day', created_at)::DATE AS comm_date,
      SUM(amount) AS commissions
    FROM affiliate_commissions
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY comm_date
  )
  SELECT
    ds.date_period,
    COALESCE(cd.clicks, 0) AS total_clicks,
    COALESCE(ad.applications, 0) AS total_applications,
    CASE 
      WHEN COALESCE(cd.clicks, 0) > 0 THEN 
        (COALESCE(ad.applications, 0)::DECIMAL / COALESCE(cd.clicks, 0)) * 100
      ELSE 0
    END AS conversion_rate,
    COALESCE(cmd.commissions, 0) AS total_commissions
  FROM 
    date_series ds
    LEFT JOIN click_data cd ON ds.date_period = cd.click_date
    LEFT JOIN application_data ad ON ds.date_period = ad.app_date
    LEFT JOIN commission_data cmd ON ds.date_period = cmd.comm_date
  ORDER BY ds.date_period ASC;
END;
$$ LANGUAGE plpgsql;
