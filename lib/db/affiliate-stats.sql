-- Function to get stats for a specific affiliate
CREATE OR REPLACE FUNCTION get_affiliate_stats(affiliate_id UUID)
RETURNS TABLE (
  total_clicks BIGINT,
  total_applications BIGINT,
  approved_applications BIGINT,
  pending_applications BIGINT,
  rejected_applications BIGINT,
  total_commissions DECIMAL,
  paid_commissions DECIMAL,
  pending_commissions DECIMAL,
  conversion_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH click_counts AS (
    SELECT COUNT(*) AS count
    FROM affiliate_clicks
    WHERE affiliate_id = $1
  ),
  application_counts AS (
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'approved') AS approved,
      COUNT(*) FILTER (WHERE status IN ('pending', 'in_review', 'draft')) AS pending,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
    FROM applications
    WHERE affiliate_id = $1
  ),
  commission_amounts AS (
    SELECT
      COALESCE(SUM(amount), 0) AS total,
      COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) AS paid,
      COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) AS pending
    FROM affiliate_commissions
    WHERE affiliate_id = $1
  )
  SELECT
    COALESCE(cc.count, 0) AS total_clicks,
    COALESCE(ac.total, 0) AS total_applications,
    COALESCE(ac.approved, 0) AS approved_applications,
    COALESCE(ac.pending, 0) AS pending_applications,
    COALESCE(ac.rejected, 0) AS rejected_applications,
    COALESCE(ca.total, 0) AS total_commissions,
    COALESCE(ca.paid, 0) AS paid_commissions,
    COALESCE(ca.pending, 0) AS pending_commissions,
    CASE 
      WHEN COALESCE(cc.count, 0) > 0 THEN 
        (COALESCE(ac.total, 0)::DECIMAL / COALESCE(cc.count, 0)) * 100
      ELSE 0
    END AS conversion_rate
  FROM click_counts cc
  CROSS JOIN application_counts ac
  CROSS JOIN commission_amounts ca;
END;
$$ LANGUAGE plpgsql;

-- Create an index on affiliate_id in applications table to speed up queries
CREATE INDEX IF NOT EXISTS idx_applications_affiliate_id ON applications(affiliate_id);

-- Create an index on affiliate_id in affiliate_clicks table to speed up queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);

-- Create an index on affiliate_id in affiliate_commissions table to speed up queries
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON affiliate_commissions(affiliate_id);

-- Function to get stats for all affiliates
CREATE OR REPLACE FUNCTION get_all_affiliate_stats()
RETURNS TABLE (
  affiliate_id UUID,
  total_clicks BIGINT,
  total_applications BIGINT,
  approved_applications BIGINT,
  pending_applications BIGINT,
  rejected_applications BIGINT,
  total_commissions NUMERIC,
  paid_commissions NUMERIC,
  pending_commissions NUMERIC,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH affiliate_list AS (
    SELECT id FROM affiliates
  ),
  click_counts AS (
    SELECT
      affiliate_id,
      COUNT(*) AS clicks
    FROM affiliate_clicks
    GROUP BY affiliate_id
  ),
  application_counts AS (
    SELECT
      affiliate_id,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'approved') AS approved,
      COUNT(*) FILTER (WHERE status = 'pending' OR status = 'in_review') AS pending,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
    FROM applications
    WHERE affiliate_id IS NOT NULL
    GROUP BY affiliate_id
  ),
  commission_amounts AS (
    SELECT
      affiliate_id,
      COALESCE(SUM(amount), 0) AS total,
      COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) AS paid,
      COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) AS pending
    FROM affiliate_commissions
    GROUP BY affiliate_id
  )
  SELECT
    a.id AS affiliate_id,
    COALESCE(c.clicks, 0) AS total_clicks,
    COALESCE(app.total, 0) AS total_applications,
    COALESCE(app.approved, 0) AS approved_applications,
    COALESCE(app.pending, 0) AS pending_applications,
    COALESCE(app.rejected, 0) AS rejected_applications,
    COALESCE(cm.total, 0) AS total_commissions,
    COALESCE(cm.paid, 0) AS paid_commissions,
    COALESCE(cm.pending, 0) AS pending_commissions,
    CASE
      WHEN COALESCE(c.clicks, 0) > 0 THEN (COALESCE(app.total, 0)::NUMERIC / c.clicks) * 100
      ELSE 0
    END AS conversion_rate
  FROM
    affiliate_list a
    LEFT JOIN click_counts c ON a.id = c.affiliate_id
    LEFT JOIN application_counts app ON a.id = app.affiliate_id
    LEFT JOIN commission_amounts cm ON a.id = cm.affiliate_id;
END;
$$ LANGUAGE plpgsql;
