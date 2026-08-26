import { NextResponse } from "next/server"
import { getAllPlayers, createPlayer, slugify } from "@/lib/players-store"
import type { Player } from "@/lib/data"

export async function GET() {
  try {
    const players = await getAllPlayers()
    return NextResponse.json(players)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to load players." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<Player, "id">
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 })
    }
    const id = `${slugify(body.name)}-${Date.now()}`
    const player: Player = { ...body, id }
    const players = await createPlayer(player)
    return NextResponse.json({ player, players }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create player." }, { status: 500 })
  }
}
