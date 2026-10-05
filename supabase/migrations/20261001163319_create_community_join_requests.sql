/*
# Create community_join_requests table

## Purpose
Stores join requests for WhatsApp communities (Adults, Teens, Kids).
Replaces the old "instant join" model with an approval-based flow.
Admins review requests in the admin dashboard before sending the WhatsApp invite link.

## 1. New Tables
- `community_join_requests`
  - `id` (uuid, primary key)
  - `name` (text, not null) — requester's full name
  - `email` (text, not null) — requester's email
  - `phone` (text, nullable) — phone number for WhatsApp invite
  - `community` (text, not null) — which group: 'adults' | 'teens' | 'kids'
  - `country` (text, nullable) — requester's country
  - `city_region` (text, nullable) — requester's city/region
  - `parent_name` (text, nullable) — required for kids community: parent/guardian name
  - `parent_email` (text, nullable) — required for kids community: parent/guardian email
  - `age_range` (text, nullable) — for teens/kids: age range e.g. '13-15', '5-8'
  - `message` (text, nullable) — optional message from requester
  - `status` (text, not null, default 'pending') — 'pending' | 'approved' | 'rejected'
  - `admin_note` (text, nullable) — note from admin during moderation
  - `created_at` (timestamptz, default now())
  - `moderated_at` (timestamptz, nullable) — when admin approved/rejected

## 2. Security
- Enable RLS on `community_join_requests`.
- This is a no-auth public app: anon-key frontend inserts requests.
- INSERT: anyone (anon + authenticated) can submit a join request.
- SELECT/UPDATE/DELETE: only authenticated (admin) can read/moderate requests.
- The public never sees other people's requests.

## 3. Indexes
- Index on `status` for admin dashboard filtering (pending vs approved/rejected).
- Index on `community` for grouping by group type.
*/

CREATE TABLE IF NOT EXISTS community_join_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  community   text NOT NULL CHECK (community IN ('adults', 'teens', 'kids')),
  country     text,
  city_region text,
  parent_name text,
  parent_email text,
  age_range   text,
  message     text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  moderated_at timestamptz
);

ALTER TABLE community_join_requests ENABLE ROW LEVEL SECURITY;

-- Public can insert join requests (no auth needed)
DROP POLICY IF EXISTS "anon_insert_community_requests" ON community_join_requests;
CREATE POLICY "anon_insert_community_requests"
ON community_join_requests FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Only authenticated (admin) can view requests
DROP POLICY IF EXISTS "auth_select_community_requests" ON community_join_requests;
CREATE POLICY "auth_select_community_requests"
ON community_join_requests FOR SELECT
TO authenticated USING (true);

-- Only authenticated (admin) can update request status
DROP POLICY IF EXISTS "auth_update_community_requests" ON community_join_requests;
CREATE POLICY "auth_update_community_requests"
ON community_join_requests FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated (admin) can delete requests
DROP POLICY IF EXISTS "auth_delete_community_requests" ON community_join_requests;
CREATE POLICY "auth_delete_community_requests"
ON community_join_requests FOR DELETE
TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_community_requests_status ON community_join_requests(status);
CREATE INDEX IF NOT EXISTS idx_community_requests_community ON community_join_requests(community);