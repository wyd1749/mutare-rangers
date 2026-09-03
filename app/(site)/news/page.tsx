"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { news as initialNews, type NewsItem } from "@/lib/data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews)
  const [loading, setLoading] = useState(true)
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setNewsList(data)
          }
        }
      } catch (error) {
        console.error("Failed to load news from API", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  // Auto-advance the featured (large) article every 15 seconds
  useEffect(() => {
    if (newsList.length <= 1) return
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % newsList.length)
    }, 15000)
    return () => clearInterval(interval)
  }, [newsList.length])

  if (loading && newsList.length === 0) {
    return <div className="min-h-screen p-8 text-center text-muted-foreground">Loading news...</div>
  }

  const featured = newsList[featuredIndex]
  const rest = newsList.filter((_, i) => i !== featuredIndex)

  return (
    <div className="relative min-h-screen">
      {/* STATIC BACKGROUND LAYER - stays fixed while content scrolls */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/images/news-bg.png"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover object-center opacity-100 brightness-110"
        />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* PAGE CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Badge variant="accent">News</Badge>
          <h1 className="mt-3 font-heading text-4xl font-bold uppercase tracking-tight">Latest News</h1>
        </motion.div>

        {featured && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Link href={`/news/${featured.id}`} className="group">
                    <Card className="overflow-hidden p-0 border-border/80 bg-card/85 backdrop-blur-md">
                      <div className="relative h-72 overflow-hidden sm:h-96">
                        <div className="absolute inset-0 animate-hero-zoom">
                          <Image
                            src={featured.image || "/placeholder.svg"}
                            alt={featured.title}
                            fill
                            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                        <div className="absolute bottom-0 p-6">
                          <Badge variant="accent">{featured.category}</Badge>
                          <h2 className="mt-3 max-w-lg font-heading text-2xl font-bold uppercase leading-tight group-hover:text-accent sm:text-3xl">
                            {featured.title}
                          </h2>
                          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{featured.excerpt}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{featured.date}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {newsList.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5 lg:justify-start">
                  {newsList.map((n, i) => (
                    <button
                      key={n.id}
                      onClick={() => setFeaturedIndex(i)}
                      aria-label={`Show featured article ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === featuredIndex ? "w-6 bg-accent" : "w-1.5 bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {rest.map((n) => (
                <motion.div key={n.id} variants={itemVariants}>
                  <Link href={`/news/${n.id}`}>
                    <Card className="group flex gap-4 overflow-hidden p-3 border-border/80 bg-card/85 backdrop-blur-md transition-all hover:border-accent/50">
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md">
                        <Image src={n.image || "/placeholder.svg"} alt="" fill className="object-cover object-top" />
                      </div>
                      <div>
                        <Badge variant="outline">{n.category}</Badge>
                        <p className="mt-1.5 text-sm font-semibold leading-snug group-hover:text-accent">{n.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}