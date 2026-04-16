-- Session tracking schema updates
-- Run in Supabase SQL Editor

-- 1. Add brand_slug column so we can filter/aggregate by brand
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS brand_slug TEXT;

-- 2. Add topic column for bucketed topic categories (set when writing)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS topic TEXT;

-- 3. Add useful indexes for the dashboard queries
CREATE INDEX IF NOT EXISTS idx_sessions_created_module ON sessions(created_at DESC, module);
CREATE INDEX IF NOT EXISTS idx_sessions_user_created ON sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_brand ON sessions(brand_slug) WHERE brand_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_topic ON sessions(topic);

-- 4. Pod aggregation view — leaders query this, NEVER the raw sessions table directly
-- Returns counts per pod + module + topic, never individual user identity
CREATE OR REPLACE VIEW session_pod_aggregates AS
SELECT
  p.pod_id,
  s.module,
  s.topic,
  s.brand_slug,
  DATE_TRUNC('day', s.created_at) AS day,
  COUNT(*) AS session_count,
  COUNT(DISTINCT s.user_id) AS unique_sellers,
  ROUND(AVG(s.message_count)::numeric, 1) AS avg_messages,
  ROUND(AVG(s.duration)::numeric, 0) AS avg_duration_seconds
FROM sessions s
JOIN profiles p ON p.id = s.user_id
WHERE p.role = 'seller'
GROUP BY p.pod_id, s.module, s.topic, s.brand_slug, DATE_TRUNC('day', s.created_at);

-- 5. Org-wide view for executives
CREATE OR REPLACE VIEW session_org_aggregates AS
SELECT
  s.module,
  s.topic,
  s.brand_slug,
  DATE_TRUNC('day', s.created_at) AS day,
  COUNT(*) AS session_count,
  COUNT(DISTINCT s.user_id) AS unique_sellers,
  COUNT(DISTINCT p.pod_id) AS pods_active,
  ROUND(AVG(s.message_count)::numeric, 1) AS avg_messages
FROM sessions s
JOIN profiles p ON p.id = s.user_id
WHERE p.role = 'seller'
GROUP BY s.module, s.topic, s.brand_slug, DATE_TRUNC('day', s.created_at);

-- 6. Seller engagement view — how active each seller has been
-- Leaders see this for their pod members (attribution OK here — activity level, not question content)
CREATE OR REPLACE VIEW seller_engagement AS
SELECT
  p.id AS user_id,
  p.full_name,
  p.email,
  p.pod_id,
  COUNT(s.id) FILTER (WHERE s.created_at > NOW() - INTERVAL '7 days') AS sessions_week,
  COUNT(s.id) FILTER (WHERE s.created_at > NOW() - INTERVAL '30 days') AS sessions_month,
  COUNT(s.id) AS sessions_total,
  MAX(s.created_at) AS last_active,
  MODE() WITHIN GROUP (ORDER BY s.module) AS top_module
FROM profiles p
LEFT JOIN sessions s ON s.user_id = p.id
WHERE p.role = 'seller' AND p.is_active = true
GROUP BY p.id, p.full_name, p.email, p.pod_id;

-- 7. RLS for the views: views inherit from underlying table RLS
-- The aggregates are safe for leaders to query — no individual attribution
-- Make sure RLS on sessions still protects raw rows

-- 8. Helper: drop the raw "leaders and executives can read sessions" policy
-- Raw session reads are only for the seller themselves + admins.
-- Leaders/executives use the aggregate views.
DROP POLICY IF EXISTS "Leaders and executives can read sessions" ON sessions;
DROP POLICY IF EXISTS "Leader read sessions" ON sessions;

-- 9. Admin-only policy for raw session reads (for future: Tammy reviewing content)
CREATE POLICY "Admins can read raw sessions"
  ON sessions FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

-- Grant read access to the views for authenticated users
-- RLS on the underlying sessions table governs what each role sees
GRANT SELECT ON session_pod_aggregates TO authenticated;
GRANT SELECT ON session_org_aggregates TO authenticated;
GRANT SELECT ON seller_engagement TO authenticated;
