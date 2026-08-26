import { NextResponse } from "next/server"
import { getAllPrograms, createProgram, updateProgram, deleteProgram } from "@/lib/programs-store"
import type { Program } from "@/lib/data"

export async function GET() {
  try {
    const programs = await getAllPrograms()
    return NextResponse.json(programs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to load programs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const newProgram: Program = await req.json()
    const programs = await createProgram(newProgram)
    return NextResponse.json(programs, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create program" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedProgram: Program = await req.json()
    const programs = await updateProgram(updatedProgram.id, updatedProgram)
    return NextResponse.json(programs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update program" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const programs = await deleteProgram(id)
    return NextResponse.json(programs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete program" }, { status: 400 })
  }
}
