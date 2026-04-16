-- Add Ryan to the user seed table so the trigger creates his profile on signup
INSERT INTO user_seed (email, full_name, title, role, pod_id, manages)
VALUES ('ryan@gambitco.io', 'Ryan', 'Platform Developer', 'admin', NULL, NULL)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  title = EXCLUDED.title,
  role = EXCLUDED.role;
