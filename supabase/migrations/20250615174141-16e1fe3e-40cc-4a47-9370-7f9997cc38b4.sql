
-- Create a table for storing contact messages from users
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable row-level security (RLS)
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public-facing "contact us" form)
CREATE POLICY "Allow public to insert contact requests"
  ON public.contact_requests
  FOR INSERT
  WITH CHECK (true);

-- Allow developers (you) to select all contact requests: you will fetch these from the backend. (Fetching could be restricted to authenticated/dev, customize as needed)
CREATE POLICY "Allow select for all"
  ON public.contact_requests
  FOR SELECT
  USING (true);
