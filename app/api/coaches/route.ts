import { NextResponse } from "next/server"
import { coaches as initialCoaches, type Coach } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Global in-memory data store for local dev
let coachesStore: Coach[] = [...initialCoaches]

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("coaches").select("*").order("name", { ascending: true })
    if (error) return NextResponse.json({ error: "Failed to load coaches" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(coachesStore)
}

export async function POST(req: Request) {
  try {
    const newItem: Coach = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("coaches").insert(newItem).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    coachesStore = [...coachesStore, newItem]
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create coach" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedItem: Coach = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("coaches")
        .update(updatedItem)
        .eq("id", updatedItem.id)
        .select()
        .single()
      if (error) throw error
      return NextResponse.json(data)
    }
    coachesStore = coachesStore.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coach" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("coaches").delete().eq("id", id)
      if (error) throw error
    } else {
      coachesStore = coachesStore.filter((item) => item.id !== id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete coach" }, { status: 400 })
  }
}