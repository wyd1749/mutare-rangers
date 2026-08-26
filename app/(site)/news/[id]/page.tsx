"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NewsItem } from "@/lib/data"

export default function SingleArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" })
        if (res.ok) {
          const list: NewsItem[] = await res.json()
          const found = list.find((item) => item.id === id)
          if (found) setArticle(found)
        }
      } catch (err) {
        console.error("Failed to load article from API", err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/news"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading article...</div>
        ) : article ? (
          <article className="overflow-hidden rounded-xl border border-border/80 bg-card/85 p-6 backdrop-blur-md">
            {/* Image container using object-contain to prevent cropping */}
            <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-lg bg-black/40 sm:h-96">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <Badge variant="accent">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>

              <h1 className="mt-4 font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                {article.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground break-words sm:text-lg">
                {article.excerpt}
              </p>

              {article.body && (
                <div className="mt-6 space-y-4 border-t border-border/60 pt-6 text-foreground">
                  {article.body.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed break-words">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="py-12 text-center text-muted-foreground">Article not found.</div>
        )}
      </div>
    </div>
  )
}