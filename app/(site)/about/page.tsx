"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Trophy, Award } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type TrophyItem = {
  id: string
  name: string
  competition: string
  year: string
  image: string
}

type Achievement = {
  id: string
  title: string
  description: string
  year: string
}

type BoardMember = {
  id: string
  name: string
  role: string
  photo: string
  bio: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function AboutPage() {
  const [trophies, setTrophies] = useState<TrophyItem[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [board, setBoard] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [trophiesRes, achievementsRes, boardRes] = await Promise.all([
          fetch("/api/trophies", { cache: "no-store" }),
          fetch("/api/achievements", { cache: "no-store" }),
          fetch("/api/board", { cache: "no-store" }),
        ])
        if (trophiesRes.ok) setTrophies(await trophiesRes.json())
        if (achievementsRes.ok) setAchievements(await achievementsRes.json())
        if (boardRes.ok) setBoard(await boardRes.json())
      } catch (err) {
        console.error("Failed to load about page data", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* FIXED BACKGROUND LAYER — stays in place while content scrolls */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/images/news-bg.png"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover object-top opacity-100 brightness-110"
        />
        <div className="absolute inset-0 bg-background/20 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <Badge variant="accent">About Us</Badge>
          <h1 className="mt-3 font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Mutare Rangers
          </h1>
          <p className="mt-3 text-muted-foreground">
            A club built on discipline, community, and a relentless pursuit of excellence on and off the court.
          </p>
        </motion.div>

        {/* TROPHY CABINET */}
        <section className="mt-14">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">Trophy Cabinet</h2>
          </div>

          {!loading && trophies.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No trophies added yet.</p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {trophies.map((t) => (
                <motion.div key={t.id} variants={itemVariants}>
                  <Card className="flex flex-col overflow-hidden p-0 border-border/40 bg-card/60 backdrop-blur-md h-full">
                    <div className="relative h-40 overflow-hidden bg-black/30">
                      <Image src={t.image || "/placeholder.svg"} alt={t.name} fill className="object-contain" />
                    </div>
                    <div className="p-4">
                      <p className="font-heading text-base font-bold uppercase leading-tight">{t.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t.competition}</p>
                      <p className="mt-1 text-xs font-semibold text-accent">{t.year}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ACHIEVEMENTS */}
        <section className="mt-14">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">Achievements</h2>
          </div>

          {!loading && achievements.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No achievements added yet.</p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 space-y-3"
            >
              {achievements.map((a) => (
                <motion.div key={a.id} variants={itemVariants}>
                  <Card className="flex items-start gap-4 p-5 border-border/40 bg-card/60 backdrop-blur-md">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Award className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{a.title}</p>
                        {a.year && <span className="text-xs text-muted-foreground">{a.year}</span>}
                      </div>
                      {a.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* BOARD OF GOVERNORS */}
        <section className="mt-14 pb-10">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">Board of Governors</h2>

          {!loading && board.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No board members added yet.</p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {board.map((m) => (
                <motion.div key={m.id} variants={itemVariants}>
                  <Card className="flex flex-col overflow-hidden p-0 border-border/40 bg-card/60 backdrop-blur-md h-full">
                    <div className="relative h-56 overflow-hidden">
                      <Image src={m.photo || "/placeholder.svg"} alt={m.name} fill className="object-cover object-top" />
                    </div>
                    <div className="p-4">
                      <p className="font-heading text-base font-bold uppercase leading-tight">{m.name}</p>
                      <p className="mt-1 text-xs font-semibold text-accent">{m.role}</p>
                      {m.bio && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.bio}</p>}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}