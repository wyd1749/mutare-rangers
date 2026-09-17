"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton browser client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Some newer code expects a getter function — just return the same instance
export function getSupabaseBrowserClient() {
  return supabase
}