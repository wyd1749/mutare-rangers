"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Program, type NewsItem } from "@/lib/data"

const perks = [
  "Certified professional coaches",
  "Modern training facilities",
  "Individual skill development plans",
  "Pathway to college & pro basketball",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function AcademyPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [programsRes, newsRes] = await Promise.all([
          fetch("/api/academy", { cache: "no-store" }),
          fetch("/api/news", { cache: "no-store" }),
        ])
        if (programsRes.ok) {
          const data = await programsRes.json()
          if (Array.isArray(data)) setPrograms(data)
        }
        if (newsRes.ok) {
          const data = await newsRes.json()
          if (Array.isArray(data)) setNews(data)
        }
      } catch (err) {
        console.error("Failed to load academy data", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* FIXED BACKGROUND LAYER LOCKS TOP GRAPHICS IN VIEW */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/images/news-bg.png"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover object-top opacity-100 brightness-110"
        />
        <div className="absolute inset-0 bg-background/10 pointer-events-none" />
      </div>

      {/* PAGE CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Header Section Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          <Badge variant="accent">Academy</Badge>
          <h1 className="mt-3 font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Academy Programs
          </h1>
          <p className="mt-3 text-muted-foreground">
            At Mutare Rangers, we develop athletes at every stage. Our structured programs combine elite
            coaching, character building and competitive play to shape the next generation of champions.
          </p>
        </motion.div>

        {/* PROGRAM CARDS CENTERED GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap justify-center gap-5"
        >
          {programs.map((p) => (
            <motion.div 
              key={p.id} 
              variants={itemVariants}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] max-w-sm"
            >
              <Card className="flex flex-col overflow-hidden p-0 border-border/40 bg-card/60 backdrop-blur-md transition-all hover:border-accent/50 h-full">
                <div className="relative h-44 overflow-hidden">
                  <Image 
                    src={p.image || "/placeholder.svg"} 
                    alt={p.name} 
                    fill 
                    className="object-cover object-top" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 font-heading text-2xl font-bold uppercase">{p.name}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-sm font-semibold text-accent">{p.tagline}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.ageRange}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-heading text-lg font-bold text-primary">{p.price}</span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90"
                    >
                      <Link href="/contact">Enroll</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM SECTIONS WITH ON-SCROLL REVEAL */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 grid gap-6 lg:grid-cols-2"
        >
          <Card className="p-6 border-border/40 bg-card/60 backdrop-blur-md">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">Why Train With Us</h2>
            <ul className="mt-4 space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-6 bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/contact">Register for 2025 Trials</Link>
            </Button>
          </Card>

          <Card className="p-6 border-border/40 bg-card/60 backdrop-blur-md">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">Latest Academy News</h2>
            <ul className="mt-4 divide-y divide-border">
              {news
                .filter((n) => n.category === "Academy")
                .map((n) => (
                  <li key={n.id}>
                    <Link href={`/news/${n.id}`} className="group flex items-center gap-3 py-3">
                      <Image
                        src={n.image || "/placeholder.svg"}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold leading-snug group-hover:text-accent">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.date}</p>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}