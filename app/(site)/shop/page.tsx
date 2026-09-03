"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { type Product } from "@/lib/data"

export default function ShopPage() {
  // Initialized with empty array to prevent stale product flash
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setItems(data)
          }
        }
      } catch (err) {
        console.error("Failed to load products from API", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="relative min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
            Official Store
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Gear up with official Mutare Rangers apparel and merchandise.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading products...</div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No products available.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {items.map((product) => (
              <Card 
                key={product.id} 
                className="group flex w-full max-w-xs flex-col overflow-hidden border-border/80 bg-card/85 p-0 backdrop-blur-md sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <div className="relative h-60 w-full overflow-hidden bg-secondary/20 p-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge variant="accent" className="absolute left-3 top-3">
                    {product.category}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-lg font-bold uppercase text-foreground">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="font-heading text-xl font-bold text-accent">
                      {product.price}
                    </span>
                    <Button size="sm" className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90">
                      <ShoppingBag className="mr-1.5 h-4 w-4" /> Buy Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}