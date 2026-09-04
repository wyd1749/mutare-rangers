import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { createClient as createAuthClient } from "@/utils/supabase/server"

async function requireAuth() {
  const authClient = await createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  return user
}

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("order", { ascending: true })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to load achievements" }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const user = await requireAuth()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    const body = await req.json()
    const newAchievement = {
      id: `achievement-${Date.now()}`,
      title: body.title,
      description: body.description ?? "",
      year: body.year ?? "",
      order: body.order ?? 0,
    }

    const { data, error } = await supabase.from("achievements").insert(newAchievement).select().single()
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save achievement" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  const user = await requireAuth()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { id, ...updates } = body
    const { data, error } = await supabase
      .from("achievements")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const user = await requireAuth()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    const { id } = await req.json()
    const { error } = await supabase.from("achievements").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 400 })
  }
}