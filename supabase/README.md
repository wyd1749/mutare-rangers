# Supabase setup

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Run `supabase/migrations/20260825000000_initial_schema.sql` in the Supabase SQL editor (or with the Supabase CLI).
4. Run `supabase/seed.sql` in the SQL editor to load news and products.
5. Run `npm run db:seed` to import the existing players from `data/players.json`.

The service-role key is used only by server routes and the local seed script. Never expose it to browser code or commit `.env.local`.
