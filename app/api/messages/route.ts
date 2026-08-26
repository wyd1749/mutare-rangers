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
  const user = await requireAuth()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("createdAt", { ascending: false })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    const body = await req.json()

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone ?? "",
      program: body.program ?? "",
      message: body.message ?? "",
      read: false,
    }

    const { data, error } = await supabase.from("messages").insert(newMessage).select().single()
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save message" }, { status: 400 })
  }
}

export async function PATCH(req: Request) {
  const user = await requireAuth()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    const { id, read } = await req.json()
    const { data, error } = await supabase
      .from("messages")
      .update({ read })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 400 })
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
    const { error } = await supabase.from("messages").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 400 })
  }
}
