-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can delete admin users" ON admin_users;
DROP POLICY IF EXISTS "Public read access for admin_users" ON admin_users;

-- Create simple policies for admin_users table
CREATE POLICY "Public read access for admin_users"
  ON admin_users FOR SELECT
  USING (true);

CREATE POLICY "Admin users can insert admin users"
  ON admin_users FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admin_users)
    OR
    (SELECT COUNT(*) FROM admin_users) = 0  -- Allow first admin creation
  );

CREATE POLICY "Admin users can update admin users"
  ON admin_users FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin users can delete admin users"
  ON admin_users FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );
