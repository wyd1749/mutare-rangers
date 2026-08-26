import { readFile } from "node:fs/promises"
import { createClient } from "@supabase/supabase-js"

try {
  const env = await readFile(new URL("../.env.local", import.meta.url), "utf8")
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "")
  }
} catch {
  // Environment variables may be provided by the shell in CI.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.")
}

const supabase = createClient(url, key, { auth: { persistSession: false } })
const players = JSON.parse(await readFile(new URL("../data/players.json", import.meta.url), "utf8"))
const rows = players.map(({ id, name, number, position, group, team, photo, age, dob, nationality, height, weight, college, yearsPro, joined, bio, stats }) => ({
  id,
  name,
  number,
  position,
  player_group: group,
  team,
  photo,
  age: age ?? null,
  dob,
  nationality,
  height,
  weight,
  college,
  years_pro: yearsPro,
  joined,
  bio,
  stats,
}))

for (let index = 0; index < rows.length; index += 50) {
  const { error } = await supabase.from("players").upsert(rows.slice(index, index + 50), { onConflict: "id" })
  if (error) throw error
}

console.log(`Seeded ${rows.length} players.`)
