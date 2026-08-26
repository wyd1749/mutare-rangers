import { promises as fs } from "fs"
import path from "path"
import type { Player } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// data/players.json is the local fallback when Supabase is not configured.
const DATA_FILE = path.join(process.cwd(), "data", "players.json")

export async function getAllPlayers(): Promise<Player[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("players").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return (data ?? []).map(fromRow)
  }

  const raw = await fs.readFile(DATA_FILE, "utf-8")
  return JSON.parse(raw) as Player[]
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const players = await getAllPlayers()
  return players.find((p) => p.id === id)
}

export async function createPlayer(player: Player): Promise<Player[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { error } = await supabase.from("players").insert(toRow(player))
    if (error) throw error
    return getAllPlayers()
  }

  const players = await getAllPlayers()
  players.unshift(player)
  await writeAllPlayers(players)
  return players
}

export async function updatePlayer(id: string, updates: Partial<Player>): Promise<Player[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { error } = await supabase.from("players").update(toRow(updates as Player)).eq("id", id)
    if (error) throw error
    return getAllPlayers()
  }

  const players = await getAllPlayers()
  const index = players.findIndex((p) => p.id === id)
  if (index === -1) throw new Error(`Player not found: ${id}`)
  players[index] = { ...players[index], ...updates }
  await writeAllPlayers(players)
  return players
}

export async function deletePlayer(id: string): Promise<Player[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { error } = await supabase.from("players").delete().eq("id", id)
    if (error) throw error
    return getAllPlayers()
  }

  const players = await getAllPlayers()
  const next = players.filter((p) => p.id !== id)
  await writeAllPlayers(next)
  return next
}

async function writeAllPlayers(players: Player[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(players, null, 2), "utf-8")
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function toRow(player: Partial<Player>) {
  return {
    ...(player.id === undefined ? {} : { id: player.id }),
    ...(player.name === undefined ? {} : { name: player.name }),
    ...(player.number === undefined ? {} : { number: player.number }),
    ...(player.position === undefined ? {} : { position: player.position }),
    ...(player.group === undefined ? {} : { group: player.group }),
    ...(player.team === undefined ? {} : { team: player.team }),
    ...(player.photo === undefined ? {} : { photo: player.photo }),
    ...(player.age === undefined ? {} : { age: player.age }),
    ...(player.dob === undefined ? {} : { dob: player.dob }),
    ...(player.nationality === undefined ? {} : { nationality: player.nationality }),
    ...(player.height === undefined ? {} : { height: player.height }),
    ...(player.weight === undefined ? {} : { weight: player.weight }),
    ...(player.college === undefined ? {} : { college: player.college }),
    ...(player.yearsPro === undefined ? {} : { yearsPro: player.yearsPro }),
    ...(player.joined === undefined ? {} : { joined: player.joined }),
    ...(player.bio === undefined ? {} : { bio: player.bio }),
    ...(player.stats === undefined
      ? {}
      : {
          ppg: player.stats.ppg,
          apg: player.stats.apg,
          rpg: player.stats.rpg,
          spg: player.stats.spg,
          bpg: player.stats.bpg,
          fgPct: player.stats.fgPct,
          threePct: player.stats.threePct,
          ftPct: player.stats.ftPct,
          eff: player.stats.eff,
        }),
  }
}

function fromRow(row: Record<string, unknown>): Player {
  return {
    id: row.id as string,
    name: row.name as string,
    number: row.number as number,
    position: row.position as string,
    group: row.group as Player["group"],
    team: row.team as string,
    photo: row.photo as string,
    age: row.age as number | undefined,
    dob: row.dob as string,
    nationality: row.nationality as string,
    height: row.height as string,
    weight: row.weight as string,
    college: row.college as string,
    yearsPro: row.yearsPro as number,
    joined: row.joined as string,
    bio: row.bio as string,
    stats: {
      ppg: (row.ppg as number) ?? 0,
      apg: (row.apg as number) ?? 0,
      rpg: (row.rpg as number) ?? 0,
      spg: (row.spg as number) ?? 0,
      bpg: (row.bpg as number) ?? 0,
      fgPct: (row.fgPct as number) ?? 0,
      threePct: (row.threePct as number) ?? 0,
      ftPct: (row.ftPct as number) ?? 0,
      eff: (row.eff as number) ?? 0,
    },
  }
}