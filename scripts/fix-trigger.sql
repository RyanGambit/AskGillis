-- Fix: More resilient trigger + allow self-insert for profiles
-- Run this in Supabase SQL Editor

-- Allow users to insert their own profile row (fallback if trigger fails)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  seed_email TEXT;
  seed_name TEXT;
  seed_title TEXT;
  seed_role TEXT;
  seed_pod TEXT;
  seed_manages TEXT[];
BEGIN
  -- Get the email from the new auth user
  seed_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');

  IF seed_email IS NULL THEN
    RETURN NEW;
  END IF;

  -- Look up in seed table
  SELECT full_name, title, role, pod_id, manages
  INTO seed_name, seed_title, seed_role, seed_pod, seed_manages
  FROM user_seed
  WHERE email = LOWER(seed_email);

  IF seed_name IS NOT NULL THEN
    INSERT INTO profiles (id, email, full_name, title, role, pod_id, manages)
    VALUES (
      NEW.id,
      LOWER(seed_email),
      seed_name,
      seed_title,
      seed_role,
      seed_pod,
      seed_manages
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
    -- Unknown email: create with 'none' role
    INSERT INTO profiles (id, email, full_name, title, role)
    VALUES (
      NEW.id,
      LOWER(seed_email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(seed_email, '@', 1)),
      '',
      'none'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block auth signup
  RAISE WARNING 'handle_new_user trigger error: % %', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
