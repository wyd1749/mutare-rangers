import { NextResponse } from "next/server"
import { standings as initialStandings, type Standing } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Global in-memory data store for local dev
let standingsStore: Standing[] = [...initialStandings]

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("standings").select("*").order("pos", { ascending: true })
    if (error) return NextResponse.json({ error: "Failed to load standings" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(standingsStore)
}

export async function POST(req: Request) {
  try {
    const newItem: Standing = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("standings").insert(newItem).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    standingsStore = [...standingsStore, newItem]
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create standing" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedItem: Standing = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("standings")
        .update(updatedItem)
        .eq("id", updatedItem.id)
        .select()
        .single()
      if (error) throw error
      return NextResponse.json(data)
    }
    standingsStore = standingsStore.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update standing" }, { status: 400 })
  }
}

// This route also handles bulk resequencing (recalculating `pos` for every
// row after a sort). Passing an array instead of a single object triggers
// a bulk upsert of positions only.
export async function PATCH(req: Request) {
  try {
    const rows: Pick<Standing, "id" | "pos">[] = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const updates = rows.map((r) =>
        supabase.from("standings").update({ pos: r.pos }).eq("id", r.id),
      )
      const results = await Promise.all(updates)
      const failed = results.find((r) => r.error)
      if (failed?.error) throw failed.error
      return NextResponse.json({ success: true })
    }
    standingsStore = standingsStore.map((item) => {
      const match = rows.find((r) => r.id === item.id)
      return match ? { ...item, pos: match.pos } : item
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to resequence standings" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("standings").delete().eq("id", id)
      if (error) throw error
    } else {
      standingsStore = standingsStore.filter((item) => item.id !== id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete standing" }, { status: 400 })
  }
}
