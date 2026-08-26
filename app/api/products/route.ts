import { NextResponse } from "next/server"
import { products as initialProducts, type Product } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

let productStore: Product[] = [...initialProducts]

export async function GET() {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(productStore)
}

export async function POST(req: Request) {
  try {
    const newProduct: Product = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("products").insert(newProduct).select().single()
      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
    productStore = [newProduct, ...productStore]
    return NextResponse.json(newProduct, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to add product" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedProduct: Product = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase.from("products").update(updatedProduct).eq("id", updatedProduct.id).select().single()
      if (error) throw error
      return NextResponse.json(data)
    }
    productStore = productStore.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    return NextResponse.json(updatedProduct)
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
      return NextResponse.json({ success: true })
    }
    productStore = productStore.filter((p) => p.id !== id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 400 })
  }
}