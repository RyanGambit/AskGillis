-- Fix infinite recursion in profiles RLS policy
-- The leaders/executives policy references profiles inside profiles policy
-- Solution: use a SECURITY DEFINER function that bypasses RLS for role lookup

-- Drop the recursive policy
DROP POLICY IF EXISTS "Leaders and executives can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Leaders read profiles" ON profiles;

-- Helper function that safely looks up a user's role without triggering RLS
CREATE OR REPLACE FUNCTION get_user_role(uid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = uid;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Now create the policy using the function
CREATE POLICY "Leaders and executives can read all profiles"
  ON profiles FOR SELECT
  USING (
    get_user_role(auth.uid()) IN ('leader', 'executive', 'admin')
  );

-- Same fix for sessions
DROP POLICY IF EXISTS "Leaders and executives can read sessions" ON sessions;
DROP POLICY IF EXISTS "Leader read sessions" ON sessions;

CREATE POLICY "Leaders and executives can read sessions"
  ON sessions FOR SELECT
  USING (
    get_user_role(auth.uid()) IN ('leader', 'executive')
  );
