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
    .from("board_members")
    .select("*")
    .order("order", { ascending: true })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to load board members" }, { status: 500 })
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
    const newMember = {
      id: `board-${Date.now()}`,
      name: body.name,
      role: body.role ?? "",
      photo: body.photo ?? "",
      bio: body.bio ?? "",
      order: body.order ?? 0,
    }

    const { data, error } = await supabase.from("board_members").insert(newMember).select().single()
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save board member" }, { status: 400 })
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
      .from("board_members")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update board member" }, { status: 400 })
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
    const { error } = await supabase.from("board_members").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete board member" }, { status: 400 })
  }
}