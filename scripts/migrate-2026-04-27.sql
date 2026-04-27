-- Migration: 2026-04-27 — Tammy's revised pod structure
-- Run this in Supabase SQL Editor.
--
-- Changes:
-- 1. NEW: Aimee Pod (parent of Kanina, Katie, Lili, Paula, Laura)
-- 2. REMOVED: Brady Pod
-- 3. MOVED: Tracy Pod now under Katie Pod (was already)
-- 4. DELETIONS: Serena Len, Heather Morgan, Brandon Stephenson
-- 5. ROLE CHANGES: Brady→Seller, Paula→Seller, Laura→Seller, Nicole→Leader,
--    Taylor Wilkinson→Admin, Alexandra Bernal→Admin, Josephine→Admin,
--    Bianca→Leader (Training Facilitator title)
-- 6. EMAIL CHANGES: Josephine surname spelled Enilolobo (was Enllokbo)
-- 7. POD MOVES: Many sellers moved to Aimee Pod direct, Gina to Kanina Pod

-- =============================================================
-- 1. UPDATE PODS TABLE
-- =============================================================

-- Insert Aimee Pod
INSERT INTO pods (id, name, parent_pod_id, leader_email)
VALUES ('aimee_pod', 'Aimee Pod', NULL, 'agirodat@gillissales.com')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, parent_pod_id = EXCLUDED.parent_pod_id, leader_email = EXCLUDED.leader_email;

-- Update existing pods to be under Aimee Pod
UPDATE pods SET parent_pod_id = 'aimee_pod' WHERE id IN ('kanina_pod', 'katie_pod', 'lili_pod', 'paula_pod', 'laura_pod');

-- Tracy Pod parent is Katie Pod (no change if already there)
UPDATE pods SET parent_pod_id = 'katie_pod' WHERE id = 'tracy_pod';

-- Remove Brady Pod (Brady is now a seller in Tracy Pod)
-- First make sure no profiles reference brady_pod, then drop
UPDATE profiles SET pod_id = 'tracy_pod' WHERE pod_id = 'brady_pod';
DELETE FROM pods WHERE id = 'brady_pod';

-- =============================================================
-- 2. DELETE USERS NO LONGER WITH GILLIS
-- =============================================================
-- Serena Len no longer employed
-- Heather Morgan removed
-- Brandon Stephenson removed

DELETE FROM user_seed WHERE email IN ('slen@gillissales.com', 'hmorgan@gillissales.com', 'bstephenson@gillissales.com');
DELETE FROM profiles  WHERE email IN ('slen@gillissales.com', 'hmorgan@gillissales.com', 'bstephenson@gillissales.com');
-- Also clean auth.users if these accounts exist (cascade will hit profiles via FK)
DELETE FROM auth.users WHERE email IN ('slen@gillissales.com', 'hmorgan@gillissales.com', 'bstephenson@gillissales.com');

-- =============================================================
-- 3. UPDATE USER SEED + PROFILES
-- =============================================================
-- Wholesale upsert per Tammy's revised list. Use ON CONFLICT to update.

-- Reset existing seed entries (cleaner than tracking individual changes)
TRUNCATE TABLE user_seed;

INSERT INTO user_seed (email, full_name, title, role, pod_id, manages) VALUES
  -- Executives
  ('tgillis@gillissales.com',    'Tammy Gillis',       'CEO and Founder',                         'executive', 'executive_team', ARRAY['executive_team']),
  ('agirodat@gillissales.com',   'Aimee Girodat',      'VP of Sales Performance',                 'executive', 'executive_team', ARRAY['aimee_pod']),
  ('nsharpley@gillissales.com',  'Nikki Sharpley',     'VP of Operations',                        'executive', 'executive_team', ARRAY['nikki_ops_pod']),
  ('sstrobusch@gillissales.com', 'Shannon Strobusch',  'VP of Business Development',              'executive', 'executive_team', NULL),

  -- Leaders
  ('kbrinkey@gillissales.com',   'Kanina Brinkey',     'Executive Director of Sales Performance', 'leader',   'aimee_pod',     ARRAY['kanina_pod']),
  ('kgarrett@gillissales.com',   'Katie Garrett',      'Sr. Executive Director of Sales',         'leader',   'aimee_pod',     ARRAY['katie_pod']),
  ('tmorris@gillissales.com',    'Tracy Morris',       'Executive Director of Sales Performance', 'leader',   'aimee_pod',     ARRAY['tracy_pod']),
  ('lmatias@gillissales.com',    'Lili Matias',        'Executive Director of Sales Performance', 'leader',   'aimee_pod',     ARRAY['lili_pod']),
  ('bcarlson@gillissales.com',   'Bianca Carlson',     'Training Facilitator',                    'leader',   'nikki_ops_pod', ARRAY['nikki_ops_pod']),
  ('ngillespie@gillissales.com', 'Nicole Gillespie',   'People and Culture Specialist',           'leader',   'nikki_ops_pod', ARRAY['nikki_ops_pod']),

  -- Sellers — Aimee Pod direct
  ('pjamieson@gillissales.com',  'Paula Jamieson',     'National Director of Sales',              'seller',   'aimee_pod', ARRAY['paula_pod']),
  ('lpayne@gillissales.com',     'Laura Payne',        'National Director of Sales',              'seller',   'aimee_pod', ARRAY['laura_pod']),
  ('wdavilahill@gillissales.com', 'Wendy Davila Hill', 'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('lely@gillissales.com',       'Linda Ely',          'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('dfavel@gillissales.com',     'Darin Favel',        'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('jbelval@gillissales.com',    'Jules Belval',       'Senior Regional Director of Sales',       'seller',   'aimee_pod', NULL),
  ('pkerfont@gillissales.com',   'Paul Kerfont',       'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('gpatterson@gillissales.com', 'Geri Patterson',     'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('ksmith@gillissales.com',     'Kristi Smith',       'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('aauvil@gillissales.com',     'Ashley Auvil',       'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('lmcneill@gillissales.com',   'Lachelle McNeill',   'Senior Regional Director of Sales',       'seller',   'aimee_pod', NULL),
  ('lelmo@gillissales.com',      'Lynsey Elmo',        'Regional Director of Sales',              'seller',   'aimee_pod', NULL),
  ('cverdin@gillissales.com',    'Connie Verdin',      'Regional Director of Sales',              'seller',   'aimee_pod', NULL),

  -- Sellers — Kanina Pod
  ('aeysallenne@gillissales.com',   'Ariel Eysallenne',     'Regional Director of Sales',        'seller',   'kanina_pod', NULL),
  ('jpeperfelty@gillissales.com',   'Jennifer Peper-Felty', 'Regional Director of Sales',        'seller',   'kanina_pod', NULL),
  ('cgonzalez@gillissales.com',     'Cindy Gonzalez',       'Regional Director of Sales',        'seller',   'kanina_pod', NULL),
  ('ascott@gillissales.com',        'Alexa Scott',          'Regional Director of Sales',        'seller',   'kanina_pod', NULL),
  ('ajansen@gillissales.com',       'Amber Jansen',         'Regional Director of Sales',        'seller',   'kanina_pod', NULL),
  ('kthompson@gillissales.com',     'Kimberly Thompson',    'Senior Regional Director of Sales', 'seller',   'kanina_pod', NULL),
  ('gzanniflorian@gillissales.com', 'Gina Zannie-Florian',  'Regional Director of Sales',        'seller',   'kanina_pod', NULL),

  -- Sellers — Lili Pod
  ('kbennett@gillissales.com',  'Kenzle Bennett',   'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('sbroderick@gillissales.com', 'Suzan Broderick', 'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('rcohen@gillissales.com',    'Rebecca Cohen',    'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('ndaly@gillissales.com',     'Natalie Daly',     'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('jjones@gillissales.com',    'Janae Jones',      'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('hschimizzi@gillissales.com', 'Haley Schimizzi', 'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('jtirocke@gillissales.com',  'Jodi Tirocke',     'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('bwilbourn@gillissales.com', 'Bekah Wilbourn',   'Regional Director of Sales',        'seller', 'lili_pod', NULL),
  ('bduchessi@gillissales.com', 'Bethany Duchessi', 'Senior Regional Director of Sales', 'seller', 'lili_pod', NULL),

  -- Sellers — Tracy Pod (Brady is now a seller here)
  ('barmstrong@gillissales.com',  'Brady Armstrong',   'Regional Director of Sales',        'seller', 'tracy_pod', NULL),
  ('kking@gillissales.com',       'KayLou King',       'Senior Regional Director of Sales', 'seller', 'tracy_pod', NULL),
  ('kbradley@gillissales.com',    'Kim Bradley',       'Regional Director of Sales',        'seller', 'tracy_pod', NULL),
  ('smcnaughton@gillissales.com', 'Stacey McNaughton', 'Regional Director of Sales',        'seller', 'tracy_pod', NULL),
  ('khall@gillissales.com',       'Kay Hall',          'Regional Director of Sales',        'seller', 'tracy_pod', NULL),
  ('jtyre@gillissales.com',       'Jessica Tyre',      'Regional Director of Sales',        'seller', 'tracy_pod', NULL),
  ('tjones@gillissales.com',      'Taylor Jones',      'Regional Director of Sales',        'seller', 'tracy_pod', NULL),
  ('cwillis@gillissales.com',     'Cassie Willis',     'Regional Director of Sales',        'seller', 'tracy_pod', NULL),
  ('mhibner@gillissales.com',     'Monica Hibner',     'Regional Director of Sales',        'seller', 'tracy_pod', NULL),

  -- Sellers / Ops Support — Nikki Ops Pod
  ('tmclean@gillissales.com', 'Terri McLean', 'Dynamic Strategy Analyst', 'seller', 'nikki_ops_pod', NULL),
  ('ltews@gillissales.com',   'Laura Tews',   'Sales Specialist',         'seller', 'nikki_ops_pod', NULL),

  -- Admin (now have chat access via app routing)
  ('ryan@gambitco.io',          'Ryan',                 'Platform Developer (Gambit)',         'admin', NULL,            NULL),
  ('talmond@gillissales.com',   'Tysha Almond',         'Business Analyst, Operations',        'admin', 'aimee_pod',     NULL),
  ('kemmons@gillissales.com',   'Kevin Emmons',         'Salesforce Administrator',            'admin', 'aimee_pod',     NULL),
  ('achristy@gillissales.com',  'Alissa Christy',       'Manager, New Client Implementation',  'admin', 'nikki_ops_pod', NULL),
  ('twilkinson@gillissales.com', 'Taylor Wilkinson',    'Talent Coordinator',                  'admin', 'nikki_ops_pod', NULL),
  ('abernal@gillissales.com',   'Alexandra Bernal',     'Senior Finance Administrator',        'admin', 'nikki_ops_pod', NULL),
  ('jenllokbo@gillissales.com', 'Josephine Enilolobo',  'Accounting and Administrative',       'admin', 'nikki_ops_pod', NULL);

-- =============================================================
-- 4. SYNC EXISTING PROFILES TO MATCH NEW SEED
-- =============================================================
-- For users that already have auth accounts, update their profile rows
-- so the dashboard reflects the new structure.

UPDATE profiles p SET
  full_name = s.full_name,
  title     = s.title,
  role      = s.role,
  pod_id    = s.pod_id,
  manages   = s.manages,
  updated_at = now()
FROM user_seed s
WHERE p.email = s.email;

-- Verify counts
-- SELECT role, COUNT(*) FROM profiles GROUP BY role ORDER BY role;
-- Expected: executive=4, leader=6, seller=33, admin=7
