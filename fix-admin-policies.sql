-- Drop existing RLS policies for admin_users table
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can delete admin users" ON admin_users;

-- Create simpler policies for admin_users table
CREATE POLICY "Public read access for admin_users"
ON admin_users FOR SELECT
USING (true);

CREATE POLICY "Admin users can insert admin users"
ON admin_users FOR INSERT
WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admin users can update admin users"
ON admin_users FOR UPDATE
USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY IF NOT EXISTS "Admin users can delete admin users"
ON admin_users FOR DELETE
USING (auth.uid() IN (SELECT id FROM admin_users));

-- Make sure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user's admin role
CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM admin_users
  WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
