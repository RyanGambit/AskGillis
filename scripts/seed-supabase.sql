-- AskGillis Supabase Schema + Seed Data
-- Run this in the Supabase SQL Editor
-- =====================================================

-- 1. PODS TABLE (self-referencing for nested hierarchy)
-- =====================================================
CREATE TABLE IF NOT EXISTS pods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_pod_id TEXT REFERENCES pods(id),
  leader_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  role TEXT NOT NULL CHECK (role IN ('executive','leader','seller','admin','none')),
  pod_id TEXT REFERENCES pods(id),
  manages TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_pod ON profiles(pod_id);

-- 3. SESSIONS TABLE (future migration from localStorage)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  category TEXT,
  first_message TEXT,
  message_count INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  messages JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at);

-- 4. SEED POD DATA
-- =====================================================
INSERT INTO pods (id, name, parent_pod_id, leader_email) VALUES
  ('executive_team', 'Executive Team', NULL, 'tgillis@gillissales.com'),
  ('kanina_pod', 'Kanina Pod', NULL, 'kbrinkey@gillissales.com'),
  ('katie_pod', 'Katie Pod', NULL, 'kgarrett@gillissales.com'),
  ('lili_pod', 'Lili Pod', NULL, 'lmatias@gillissales.com'),
  ('nikki_ops_pod', 'Nikki Ops Pod', NULL, 'nsharpley@gillissales.com'),
  ('tracy_pod', 'Tracy Pod', 'katie_pod', 'tmorris@gillissales.com'),
  ('brady_pod', 'Brady Pod', 'katie_pod', 'barmstrong@gillissales.com'),
  ('paula_pod', 'Paula Pod', 'nikki_ops_pod', 'pjamieson@gillissales.com'),
  ('laura_pod', 'Laura Pod', 'nikki_ops_pod', 'lpayne@gillissales.com')
ON CONFLICT (id) DO NOTHING;

-- 5. AUTO-CREATE PROFILE ON AUTH SIGNUP
-- This trigger creates a profile row when a user signs up or is invited.
-- The profile data comes from a lookup table (user_seed) populated below.
-- =====================================================

-- Temporary seed lookup table
CREATE TABLE IF NOT EXISTS user_seed (
  email TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  title TEXT,
  role TEXT NOT NULL,
  pod_id TEXT,
  manages TEXT[]
);

-- Seed all 59 users into the lookup table
INSERT INTO user_seed (email, full_name, title, role, pod_id, manages) VALUES
  -- Executives (4)
  ('tgillis@gillissales.com', 'Tammy Gillis', 'CEO and Founder', 'executive', 'executive_team', ARRAY['executive_team']),
  ('agirodat@gillissales.com', 'Aimee Girodat', 'VP of Sales Performance', 'executive', 'executive_team', NULL),
  ('nsharpley@gillissales.com', 'Nikki Sharpley', 'VP of Operations', 'executive', 'executive_team', ARRAY['nikki_ops_pod']),
  ('sstrobusch@gillissales.com', 'Shannon Strobusch', 'VP of Business Development', 'executive', 'executive_team', NULL),
  -- Leaders (8)
  ('kbrinkey@gillissales.com', 'Kanina Brinkey', 'Executive Director of Sales Performance', 'leader', 'kanina_pod', ARRAY['kanina_pod']),
  ('kgarrett@gillissales.com', 'Katie Garrett', 'Sr. Executive Director of Sales', 'leader', 'katie_pod', ARRAY['katie_pod']),
  ('tmorris@gillissales.com', 'Tracy Morris', 'Executive Director of Sales Performance', 'leader', 'tracy_pod', ARRAY['tracy_pod']),
  ('barmstrong@gillissales.com', 'Brady Armstrong', 'Senior Regional Director of Sales', 'leader', 'brady_pod', ARRAY['brady_pod']),
  ('lmatias@gillissales.com', 'Lili Matias', 'Executive Director of Sales Performance', 'leader', 'lili_pod', ARRAY['lili_pod']),
  ('pjamieson@gillissales.com', 'Paula Jamieson', 'National Director of Sales', 'leader', 'paula_pod', ARRAY['paula_pod']),
  ('lpayne@gillissales.com', 'Laura Payne', 'National Director of Sales', 'leader', 'laura_pod', ARRAY['laura_pod']),
  ('bcarlson@gillissales.com', 'Bianca Carlson', 'Training Facilitator', 'leader', 'executive_team', NULL),
  -- Sellers - Kanina Pod (6)
  ('aeysallenne@gillissales.com', 'Ariel Eysallenne', 'Regional Director of Sales', 'seller', 'kanina_pod', NULL),
  ('jpeperfelty@gillissales.com', 'Jennifer Peper-Felty', 'Regional Director of Sales', 'seller', 'kanina_pod', NULL),
  ('cgonzalez@gillissales.com', 'Cindy Gonzalez', 'Regional Director of Sales', 'seller', 'kanina_pod', NULL),
  ('ascott@gillissales.com', 'Alexa Scott', 'Regional Director of Sales', 'seller', 'kanina_pod', NULL),
  ('ajansen@gillissales.com', 'Amber Jansen', 'Regional Director of Sales', 'seller', 'kanina_pod', NULL),
  ('kthompson@gillissales.com', 'Kimberly Thompson', 'Regional Director of Sales', 'seller', 'kanina_pod', NULL),
  -- Sellers - Katie Pod (4)
  ('wdavilahill@gillissales.com', 'Wendy Davila Hill', 'Regional Director of Sales', 'seller', 'katie_pod', NULL),
  ('lely@gillissales.com', 'Linda Ely', 'Regional Director of Sales', 'seller', 'katie_pod', NULL),
  ('dfavel@gillissales.com', 'Darin Favel', 'Regional Director of Sales', 'seller', 'katie_pod', NULL),
  ('jbelval@gillissales.com', 'Jules Belval', 'Senior Regional Director of Sales', 'seller', 'katie_pod', NULL),
  -- Sellers - Tracy Pod (1)
  ('kking@gillissales.com', 'KayLou King', 'Senior Regional Director of Sales', 'seller', 'tracy_pod', NULL),
  -- Sellers - Brady Pod (6)
  ('kbradley@gillissales.com', 'Kim Bradley', 'Regional Director of Sales', 'seller', 'brady_pod', NULL),
  ('smcnaughton@gillissales.com', 'Stacey McNaughton', 'Regional Director of Sales', 'seller', 'brady_pod', NULL),
  ('khall@gillissales.com', 'Kay Hall', 'Regional Director of Sales', 'seller', 'brady_pod', NULL),
  ('jtyre@gillissales.com', 'Jessica Tyre', 'Regional Director of Sales', 'seller', 'brady_pod', NULL),
  ('tjones@gillissales.com', 'Taylor Jones', 'Regional Director of Sales', 'seller', 'brady_pod', NULL),
  ('cwillis@gillissales.com', 'Cassie Willis', 'Regional Director of Sales', 'seller', 'brady_pod', NULL),
  -- Sellers - Lili Pod (12)
  ('pkerfont@gillissales.com', 'Paul Kerfont', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('gpatterson@gillissales.com', 'Geri Patterson', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('ksmith@gillissales.com', 'Kristi Smith', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('kbennett@gillissales.com', 'Kenzle Bennett', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('sbroderick@gillissales.com', 'Suzan Broderick', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('rcohen@gillissales.com', 'Rebecca Cohen', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('ndaly@gillissales.com', 'Natalie Daly', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('jjones@gillissales.com', 'Janae Jones', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('hschimizzi@gillissales.com', 'Haley Schimizzi', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('jtirocke@gillissales.com', 'Jodi Tirocke', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('bwilbourn@gillissales.com', 'Bekah Wilbourn', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  ('bduchessi@gillissales.com', 'Bethany Duchessi', 'Regional Director of Sales', 'seller', 'lili_pod', NULL),
  -- Sellers - Nikki Ops Pod (7)
  ('aauvil@gillissales.com', 'Ashley Auvil', 'Regional Director of Sales', 'seller', 'nikki_ops_pod', NULL),
  ('lmcneill@gillissales.com', 'Lachelle McNeill', 'Regional Director of Sales', 'seller', 'nikki_ops_pod', NULL),
  ('lelmo@gillissales.com', 'Lynsey Elmo', 'Regional Director of Sales', 'seller', 'nikki_ops_pod', NULL),
  ('mhibner@gillissales.com', 'Monica Hibner', 'Regional Director of Sales', 'seller', 'nikki_ops_pod', NULL),
  ('cverdin@gillissales.com', 'Connie Verdin', 'Regional Director of Sales', 'seller', 'nikki_ops_pod', NULL),
  ('gzanniflorian@gillissales.com', 'Gina Zannie-Florian', 'Regional Director of Sales', 'seller', 'nikki_ops_pod', NULL),
  ('slen@gillissales.com', 'Serena Len', 'Regional Director of Sales', 'seller', 'nikki_ops_pod', NULL),
  -- Operations Support (seller access) (6)
  ('tmclean@gillissales.com', 'Terri McLean', 'Dynamic Strategy Analyst', 'seller', 'kanina_pod', NULL),
  ('hmorgan@gillissales.com', 'Heather Morgan', 'Dynamic Strategy Analyst', 'seller', 'kanina_pod', NULL),
  ('ltews@gillissales.com', 'Laura Tews', 'Sales Specialist', 'seller', 'kanina_pod', NULL),
  ('bstephenson@gillissales.com', 'Brandon Stephenson', 'Client Program Coordinator', 'seller', 'executive_team', NULL),
  ('ngillespie@gillissales.com', 'Nicole Gillespie', 'People and Culture Specialist', 'seller', 'executive_team', NULL),
  ('twilkinson@gillissales.com', 'Taylor Wilkinson', 'Talent Coordinator', 'seller', 'executive_team', NULL),
  -- Admin (3)
  ('talmond@gillissales.com', 'Tysha Almond', 'Business Analyst, Operations', 'admin', NULL, NULL),
  ('kemmons@gillissales.com', 'Kevin Emmons', 'Salesforce Administrator', 'admin', NULL, NULL),
  ('achristy@gillissales.com', 'Alissa Christy', 'Manager, New Client Implementation', 'admin', NULL, NULL),
  -- No Access (2)
  ('abernal@gillissales.com', 'Alexandra Bernal', 'Senior Finance Administrator', 'none', NULL, NULL),
  ('jenllokbo@gillissales.com', 'Josephine Enllokbo', 'Accounting and Administrative', 'none', NULL, NULL)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  title = EXCLUDED.title,
  role = EXCLUDED.role,
  pod_id = EXCLUDED.pod_id,
  manages = EXCLUDED.manages;

-- 6. TRIGGER: Auto-create profile when user signs up
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  seed_row user_seed%ROWTYPE;
BEGIN
  SELECT * INTO seed_row FROM user_seed WHERE email = NEW.email;
  IF FOUND THEN
    INSERT INTO profiles (id, email, full_name, title, role, pod_id, manages)
    VALUES (
      NEW.id,
      NEW.email,
      seed_row.full_name,
      seed_row.title,
      seed_row.role,
      seed_row.pod_id,
      seed_row.manages
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      title = EXCLUDED.title,
      role = EXCLUDED.role,
      pod_id = EXCLUDED.pod_id,
      manages = EXCLUDED.manages,
      updated_at = now();
  ELSE
    -- Unknown email: create as 'none' role (no access)
    INSERT INTO profiles (id, email, full_name, title, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'), '', 'none')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. POD VISIBILITY FUNCTION (recursive tree walk)
-- =====================================================
CREATE OR REPLACE FUNCTION get_visible_pods(target_user_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  user_role TEXT;
  user_manages TEXT[];
  result TEXT[];
BEGIN
  SELECT role, manages INTO user_role, user_manages
  FROM profiles WHERE id = target_user_id;

  -- Executives see everything
  IF user_role = 'executive' THEN
    SELECT array_agg(id) INTO result FROM pods;
    RETURN result;
  END IF;

  -- Leaders see their managed pods + all nested children
  IF user_role = 'leader' AND user_manages IS NOT NULL THEN
    WITH RECURSIVE pod_tree AS (
      SELECT id FROM pods WHERE id = ANY(user_manages)
      UNION ALL
      SELECT p.id FROM pods p JOIN pod_tree pt ON p.parent_pod_id = pt.id
    )
    SELECT array_agg(id) INTO result FROM pod_tree;
    RETURN result;
  END IF;

  -- Everyone else sees nothing
  RETURN '{}';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Pods: all authenticated users can read
CREATE POLICY "Authenticated users can read pods"
  ON pods FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Profiles: users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: leaders/executives/admins can read all profiles
CREATE POLICY "Leaders and executives can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles me
      WHERE me.id = auth.uid()
      AND me.role IN ('leader', 'executive', 'admin')
    )
  );

-- Sessions: users own their sessions (full CRUD)
CREATE POLICY "Users own their sessions"
  ON sessions FOR ALL
  USING (user_id = auth.uid());

-- Sessions: leaders/executives can read all sessions (scoping done in app)
CREATE POLICY "Leaders and executives can read sessions"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles me
      WHERE me.id = auth.uid()
      AND me.role IN ('leader', 'executive')
    )
  );

-- 9. HELPER VIEW: Get pod members with rollup
-- =====================================================
CREATE OR REPLACE VIEW pod_members AS
SELECT
  p.id AS pod_id,
  p.name AS pod_name,
  p.parent_pod_id,
  p.leader_email,
  pr.id AS user_id,
  pr.email,
  pr.full_name,
  pr.title,
  pr.role,
  pr.is_active
FROM pods p
LEFT JOIN profiles pr ON pr.pod_id = p.id
WHERE pr.is_active = true OR pr.id IS NULL;
