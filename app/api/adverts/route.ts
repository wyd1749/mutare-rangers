import { NextResponse } from "next/server"
import { adverts as initialAdverts, type Advert } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

let advertsStore: Advert[] = [...initialAdverts]

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("adverts").select("*").order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: "Failed to load adverts" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(advertsStore)
}

export async function POST(req: Request) {
  try {
    const newItem: Advert = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("adverts").insert(newItem).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    advertsStore = [newItem, ...advertsStore]
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create advert" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedItem: Advert = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("adverts").update(updatedItem).eq("id", updatedItem.id).select().single()
      if (error) throw error
      return NextResponse.json(data)
    }
    advertsStore = advertsStore.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update advert" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("adverts").delete().eq("id", id)
      if (error) throw error
    } else {
      advertsStore = advertsStore.filter((item) => item.id !== id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete advert" }, { status: 400 })
  }
}