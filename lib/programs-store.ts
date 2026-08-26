import { promises as fs } from "fs"
import path from "path"
import type { Program } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// data/programs.json is the local fallback when Supabase is not configured.
const DATA_FILE = path.join(process.cwd(), "data", "programs.json")

export async function getAllPrograms(): Promise<Program[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("programs").select("*")
    if (error) throw error
    return (data ?? []) as Program[]
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw) as Program[]
  } catch {
    return []
  }
}

export async function getProgramById(id: string): Promise<Program | undefined> {
  const programs = await getAllPrograms()
  return programs.find((p) => p.id === id)
}

export async function createProgram(program: Program): Promise<Program[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { error } = await supabase.from("programs").insert(program)
    if (error) throw error
    return getAllPrograms()
  }

  const programs = await getAllPrograms()
  programs.unshift(program)
  await writeAllPrograms(programs)
  return programs
}

export async function updateProgram(id: string, updates: Partial<Program>): Promise<Program[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { error } = await supabase.from("programs").update(updates).eq("id", id)
    if (error) throw error
    return getAllPrograms()
  }

  const programs = await getAllPrograms()
  const index = programs.findIndex((p) => p.id === id)
  if (index === -1) throw new Error(`Program not found: ${id}`)
  programs[index] = { ...programs[index], ...updates }
  await writeAllPrograms(programs)
  return programs
}

export async function deleteProgram(id: string): Promise<Program[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { error } = await supabase.from("programs").delete().eq("id", id)
    if (error) throw error
    return getAllPrograms()
  }

  const programs = await getAllPrograms()
  const next = programs.filter((p) => p.id !== id)
  await writeAllPrograms(next)
  return next
}

async function writeAllPrograms(programs: Program[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(programs, null, 2), "utf-8")
}
