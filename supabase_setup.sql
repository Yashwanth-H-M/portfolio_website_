-- ===========================================================
-- GIP.OS — SUPABASE DATABASE SETUP
-- Run this entire script once in your Supabase SQL Editor.
-- ===========================================================

-- ── STEP 0: CLEAN SLATE ─────────────────────────────────────
-- Drops anything that may already exist to avoid conflicts.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ── STEP 1: PROFILES TABLE ──────────────────────────────────
-- One row per registered user. Auto-linked to auth.users.
CREATE TABLE public.profiles (
  id               uuid        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email            text,
  full_name        text,
  organization_type text,
  role             text        NOT NULL DEFAULT 'user',
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ── STEP 2: ROW LEVEL SECURITY ──────────────────────────────
-- Enable RLS so users can only touch their own rows.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- A user can read their own profile.
CREATE POLICY "select_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- A user can update their own profile.
CREATE POLICY "update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role can insert (used by the trigger below).
CREATE POLICY "service_insert_profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- ── STEP 3: AUTO-CREATE PROFILE ON SIGNUP ───────────────────
-- Every time a user signs up via Supabase Auth,
-- this trigger automatically inserts a row into profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER          -- runs as the owner, bypassing RLS on INSERT
SET search_path = public  -- prevents search_path injection
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, organization_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'organization_type'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===========================================================
-- DONE. Your profiles table is ready.
-- ===========================================================
