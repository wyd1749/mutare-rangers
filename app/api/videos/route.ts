import { NextResponse } from "next/server"
import { videos as initialVideos, type Video } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

let videosStore: Video[] = [...initialVideos]

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("videos").select("*").order("date", { ascending: false })
    if (error) return NextResponse.json({ error: "Failed to load videos" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(videosStore)
}

export async function POST(req: Request) {
  try {
    const newItem: Video = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("videos").insert(newItem).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    videosStore = [newItem, ...videosStore]
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create video" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedItem: Video = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("videos").update(updatedItem).eq("id", updatedItem.id).select().single()
      if (error) throw error
      return NextResponse.json(data)
    }
    videosStore = videosStore.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update video" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("videos").delete().eq("id", id)
      if (error) throw error
    } else {
      videosStore = videosStore.filter((item) => item.id !== id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 400 })
  }
}