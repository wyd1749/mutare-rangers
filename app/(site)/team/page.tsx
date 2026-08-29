"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { coaches, teams, type Player } from "@/lib/data"

const tabs = ["Players", "Coaches", "Staff"] as const
const positions = ["All Positions", "Guard", "Forward", "Center"]

// Container animation config for staggered child reveals
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

// Item animation config for individual cards
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export default function TeamPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [teamId, setTeamId] = useState<string>(teams[0].id)
  const [tab, setTab] = useState<(typeof tabs)[number]>("Players")
  const [pos, setPos] = useState("All Positions")

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data: Player[]) => setPlayers(data))
      .catch((err) => console.error("Failed to load players:", err))
      .finally(() => setLoading(false))
  }, [])

  const activeTeam = teams.find((t) => t.id === teamId) ?? teams[0]

  const teamPlayers = useMemo(() => players.filter((p) => p.team === teamId), [teamId, players])
  const teamCoaches = useMemo(() => coaches.filter((c) => c.team === teamId), [teamId])

  const filtered = useMemo(
    () => (pos === "All Positions" ? teamPlayers : teamPlayers.filter((p) => p.group === pos)),
    [pos, teamPlayers],
  )

  const avgAge = useMemo(() => {
    if (teamPlayers.length === 0) return "0.0"
    const now = new Date()
    const ages = teamPlayers.map((p) => {
      const dob = new Date(p.dob)
      let age = now.getFullYear() - dob.getFullYear()
      const hasHadBirthdayThisYear =
        now.getMonth() > dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate())
      if (!hasHadBirthdayThisYear) age -= 1
      return age
    })
    return (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1)
  }, [teamPlayers])

  const summary = [
    { label: "Total Players", value: teamPlayers.length },
    { label: "Guards", value: teamPlayers.filter((p) => p.group === "Guard").length },
    { label: "Forwards", value: teamPlayers.filter((p) => p.group === "Forward").length },
    { label: "Centers", value: teamPlayers.filter((p) => p.group === "Center").length },
    { label: "Avg. Age", value: avgAge },
  ]

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
        {/* Soft overlay matching News page */}
        <div className="absolute inset-0 bg-background/10 pointer-events-none" />
      </div>

      {/* PAGE CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Team
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Roster</span>
        </nav>

        {/* Header Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-4 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">{activeTeam.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{activeTeam.description}</p>
          </div>
        </motion.div>

        {/* Team selector Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTeamId(t.id)
                setPos("All Positions")
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors backdrop-blur-md",
                teamId === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/40 bg-card/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {t.shortName}
            </button>
          ))}
        </motion.div>

        {/* Filter Controls Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex gap-1 rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors",
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Players" && (
            <select
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="rounded-md border border-border/40 bg-card/60 backdrop-blur-md px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
            >
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </motion.div>

        {tab === "Players" && (
          <>
            {loading ? (
              <Card className="mt-6 border-border/40 bg-card/60 backdrop-blur-md p-8 text-center text-sm text-muted-foreground">
                Loading players...
              </Card>
            ) : filtered.length === 0 ? (
              <Card className="mt-6 border-border/40 bg-card/60 backdrop-blur-md p-8 text-center text-sm text-muted-foreground">
                No players found for this team and filter yet.
              </Card>
            ) : (
              <motion.div
                key={`${teamId}-${pos}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
              >
                {filtered.map((p) => (
                  <motion.div key={p.id} variants={itemVariants}>
                    <Link href={`/team/${p.id}`}>
                      <Card className="group overflow-hidden p-0 border-border/40 bg-card/60 backdrop-blur-md transition-all hover:border-primary">
                        <div className="relative h-56 overflow-hidden bg-secondary/50">
                          <span className="absolute left-3 top-3 z-10 font-heading text-2xl font-bold text-accent">
                            {p.number}
                          </span>
                          <Image
                            src={p.photo || "/placeholder.svg"}
                            alt={p.name}
                            fill
                            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                        </div>
                        <div className="p-3">
                          <p className="font-heading text-base font-bold uppercase leading-tight group-hover:text-primary">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.position}</p>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Summary Cards Reveal on Scroll */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5"
            >
              {summary.map((s) => (
                <Card key={s.label} className="border-border/40 bg-card/60 backdrop-blur-md p-4 text-center">
                  <p className="font-heading text-2xl font-bold">{s.value}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                </Card>
              ))}
            </motion.div>
          </>
        )}

        {tab !== "Players" && (
          <>
            {teamCoaches.length === 0 ? (
              <Card className="mt-6 border-border/40 bg-card/60 backdrop-blur-md p-8 text-center text-sm text-muted-foreground">
                No {tab.toLowerCase()} listed for this team yet.
              </Card>
            ) : (
              <motion.div
                key={`${teamId}-${tab}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
              >
                {teamCoaches.map((c) => (
                  <motion.div key={c.id} variants={itemVariants}>
                    <Card className="overflow-hidden p-0 border-border/40 bg-card/60 backdrop-blur-md">
                      <div className="relative h-56 overflow-hidden bg-secondary/50">
                        <Image src={c.photo || "/placeholder.svg"} alt={c.name} fill className="object-cover object-center" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      </div>
                      <div className="p-3">
                        <p className="font-heading text-base font-bold uppercase leading-tight">{c.name}</p>
                        <Badge variant="accent" className="mt-1">
                          {c.role}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}