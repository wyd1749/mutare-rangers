import { NextResponse } from "next/server"
import { news as initialNews, type NewsItem } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Global in-memory data store for local dev
let newsStore: NewsItem[] = [...initialNews]

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: "Failed to load news" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(newsStore)
}

export async function POST(req: Request) {
  try {
    const newItem: NewsItem = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("news").insert(newItem).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    newsStore = [newItem, ...newsStore]
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedItem: NewsItem = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("news").update(updatedItem).eq("id", updatedItem.id).select().single()
      if (error) throw error
      return NextResponse.json(data)
    }
    newsStore = newsStore.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("news").delete().eq("id", id)
      if (error) throw error
    } else {
      newsStore = newsStore.filter((item) => item.id !== id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 400 })
  }
}