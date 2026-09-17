import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export type TvVideo = {
  id: string
  video_url: string
  position: number
}

// Global in-memory data store for local dev
let tvVideosStore: TvVideo[] = []

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("tv_videos").select("*").order("position", { ascending: true })
    if (error) return NextResponse.json({ error: "Failed to load TV videos" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(tvVideosStore)
}

export async function POST(req: Request) {
  try {
    const newItem: TvVideo = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("tv_videos").insert(newItem).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    tvVideosStore = [...tvVideosStore, newItem]
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add TV video" }, { status: 400 })
  }
}

// Bulk reorder — pass an array of { id, position } to update play order.
export async function PATCH(req: Request) {
  try {
    const rows: Pick<TvVideo, "id" | "position">[] = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const updates = rows.map((r) => supabase.from("tv_videos").update({ position: r.position }).eq("id", r.id))
      const results = await Promise.all(updates)
      const failed = results.find((r) => r.error)
      if (failed?.error) throw failed.error
      return NextResponse.json({ success: true })
    }
    tvVideosStore = tvVideosStore.map((item) => {
      const match = rows.find((r) => r.id === item.id)
      return match ? { ...item, position: match.position } : item
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to reorder TV videos" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("tv_videos").delete().eq("id", id)
      if (error) throw error
    } else {
      tvVideosStore = tvVideosStore.filter((item) => item.id !== id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete TV video" }, { status: 400 })
  }
}