import { NextResponse } from "next/server"
import { getPlayerById, updatePlayer, deletePlayer } from "@/lib/players-store"
import type { Player } from "@/lib/data"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = await getPlayerById(id)
  if (!player) return NextResponse.json({ error: "Player not found." }, { status: 404 })
  return NextResponse.json(player)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = (await request.json()) as Partial<Player>
    const players = await updatePlayer(id, updates)
    const player = players.find((p) => p.id === id)
    return NextResponse.json({ player, players })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update player." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const players = await deletePlayer(id)
    return NextResponse.json({ players })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete player." }, { status: 500 })
  }
}
