import { NextResponse } from "next/server"
import { matches as initialMatches, type Match } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Global in-memory data store for local dev
let matchesStore: Match[] = [...initialMatches]

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("matches").select("*").order("date", { ascending: true })
    if (error) return NextResponse.json({ error: "Failed to load matches" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(matchesStore)
}

export async function POST(req: Request) {
  try {
    const newItem: Match = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("matches").insert(newItem).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    matchesStore = [newItem, ...matchesStore]
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create match" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedItem: Match = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("matches")
        .update(updatedItem)
        .eq("id", updatedItem.id)
        .select()
        .single()
      if (error) throw error
      return NextResponse.json(data)
    }
    matchesStore = matchesStore.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update match" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("matches").delete().eq("id", id)
      if (error) throw error
    } else {
      matchesStore = matchesStore.filter((item) => item.id !== id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete match" }, { status: 400 })
  }
}