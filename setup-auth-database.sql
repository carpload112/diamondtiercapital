-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can delete admin users" ON admin_users;

-- Create new policies
CREATE POLICY "Admin users can view all admin users"
  ON admin_users
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can insert admin users"
  ON admin_users
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
    OR
    (SELECT COUNT(*) FROM admin_users) = 0  -- Allow first admin creation
  );

CREATE POLICY "Admin users can update admin users"
  ON admin_users
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete admin users"
  ON admin_users
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = uid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or update the admin_users_audit table for logging
CREATE TABLE IF NOT EXISTS admin_users_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  performed_by UUID,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION log_admin_users_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO admin_users_audit (admin_user_id, action, new_data, performed_by)
    VALUES (NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO admin_users_audit (admin_user_id, action, old_data, new_data, performed_by)
    VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO admin_users_audit (admin_user_id, action, old_data, performed_by)
    VALUES (OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace triggers
DROP TRIGGER IF EXISTS admin_users_audit_insert ON admin_users;
DROP TRIGGER IF EXISTS admin_users_audit_update ON admin_users;
DROP TRIGGER IF EXISTS admin_users_audit_delete ON admin_users;

CREATE TRIGGER admin_users_audit_insert
  AFTER INSERT ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_users_changes();

CREATE TRIGGER admin_users_audit_update
  AFTER UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_users_changes();

CREATE TRIGGER admin_users_audit_delete
  AFTER DELETE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_users_changes();

-- Create a view for admin dashboard stats
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM admin_users) AS total_admins,
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM admin_users_audit WHERE action = 'LOGIN' AND performed_at > NOW() - INTERVAL '24 hours') AS logins_last_24h;

-- Grant permissions
GRANT SELECT ON admin_dashboard_stats TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_users TO authenticated;
GRANT SELECT ON admin_users_audit TO authenticated;
