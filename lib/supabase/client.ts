import { createClient } from "@supabase/supabase-js"

let client: ReturnType<typeof createClient> | null = null

/**
 * Browser-side Supabase client, used for uploads that need to go straight
 * from the visitor's browser to Supabase Storage — bypassing the Next.js
 * server entirely. This matters for anything that could exceed Vercel's
 * default 4.5MB serverless function body limit (e.g. video files), which
 * a server-side upload route (like /api/upload) can never get past no
 * matter how it's written.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
 * be set — these are safe to expose to the browser (unlike the service
 * role key used in lib/supabase/server.ts), since Storage access is
 * governed by the RLS policies on the bucket, not by this key.
 */
export function getSupabaseBrowserClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    return null
  }

  client = createClient(url, anonKey)
  return client
}