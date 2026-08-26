"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { liveMatch, matches, playByPlay, standings } from "@/lib/data"

const filters = ["All", "Men", "Women"] as const
type FilterValue = (typeof filters)[number]

export default function MatchesPage() {
  const [filter, setFilter] = useState<FilterValue>("All")
  const filteredMatches = matches.filter((m) => filter === "All" || m.category === filter)

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
        {/* Ambient background light glows */}
        <div className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        {/* Header Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <Badge variant="accent">Match Center</Badge>
            <h1 className="mt-3 font-heading text-4xl font-bold uppercase tracking-tight">Match Center</h1>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column: Live scoreboard + Image banner */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Live scoreboard Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <Card className="relative overflow-hidden border-border/40 bg-card/60 p-6 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-primary/40">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold uppercase tracking-wide">Live Game</h2>
                  
                  {/* Radar Live Indicator */}
                  <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                    </span>
                    Live
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-3 items-center gap-4">
                  <ScoreTeam name={liveMatch.home} score={liveMatch.homeScore} fouls={liveMatch.homeFouls} />
                  <div className="text-center">
                    <p className="font-heading text-sm font-bold uppercase text-accent tracking-widest">{liveMatch.quarter}</p>
                    <p className="font-heading text-3xl font-bold tabular-nums tracking-wider">{liveMatch.clock}</p>
                  </div>
                  <ScoreTeam name={liveMatch.away} score={liveMatch.awayScore} fouls={liveMatch.awayFouls} align="right" />
                </div>

                {/* Play by play */}
                <div className="mt-8">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    Play by Play
                  </h3>
                  <ul className="mt-3 divide-y divide-border/60">
                    {playByPlay.map((p, i) => (
                      <li key={i} className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:bg-muted/30 px-2 rounded-md">
                        <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{p.time}</span>
                        <span className="flex-1">
                          <span className="font-semibold text-foreground">{p.player}</span>{" "}
                          <span className="text-muted-foreground">{p.action}</span>
                        </span>
                        <span className="font-heading font-bold tabular-nums text-accent">{p.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Banner Image Card Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="group relative overflow-hidden border-border/40 p-0 shadow-lg transition-all duration-300 hover:border-primary/40 hover:shadow-primary/10">
                <img
                  src="/images/mutare-rangers-bg.png"
                  alt="Mutare Rangers Basketball Academy"
                  className="h-64 sm:h-80 w-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-accent">Mutare Rangers</span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-white drop-shadow-md">
                      Home Court Advantage
                    </h3>
                  </div>
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">Arena</Badge>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Upcoming fixtures Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-1"
          >
            <Card className="p-5 border-border/40 bg-card/60 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-lg font-bold uppercase tracking-wide">Upcoming Fixtures</h2>
              </div>

              <div className="mt-4 flex rounded-md border border-border/60 bg-secondary/40 p-1 w-full justify-around relative">
                {filters.map((f) => {
                  const isActive = filter === f
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`relative flex-1 rounded py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors z-10 ${
                        isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeFilterTab"
                          className="absolute inset-0 bg-accent rounded shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{f}</span>
                    </button>
                  )
                })}
              </div>

              <motion.ul layout className="mt-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredMatches.map((m) => (
                    <motion.li
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-lg border border-border/60 p-3 transition-all duration-200 hover:border-accent/50 hover:bg-muted/20"
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {m.date} · {m.time}
                        </span>
                        <Badge variant="outline" className="border-border/60">{m.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-semibold">
                        {m.home} <span className="text-muted-foreground text-xs font-normal">vs</span> {m.away}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.venue}</p>
                      <Button
                        size="sm"
                        className="mt-2 h-7 w-full bg-accent px-3 text-xs font-semibold uppercase text-accent-foreground hover:bg-accent/90"
                      >
                        Tickets
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>

                {filteredMatches.length === 0 && (
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    No fixtures in this category.
                  </motion.li>
                )}
              </motion.ul>
            </Card>
          </motion.div>
        </div>

        {/* Standings Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="mt-6 p-5 border-border/40 bg-card/60 backdrop-blur-md">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wide">League Standings</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3 font-medium">#</th>
                    <th className="pb-3 font-medium">Team</th>
                    <th className="pb-3 text-center font-medium">W</th>
                    <th className="pb-3 text-center font-medium">L</th>
                    <th className="pb-3 text-center font-medium">Win %</th>
                    <th className="pb-3 text-center font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {standings.map((s) => {
                    const isRangers = s.team === "Mutare Rangers"
                    return (
                      <tr 
                        key={s.pos} 
                        className={`transition-colors hover:bg-muted/30 ${
                          isRangers ? "bg-primary/10 text-primary font-semibold" : ""
                        }`}
                      >
                        <td className="py-3 px-1 font-heading font-bold">{s.pos}</td>
                        <td className="py-3 font-medium">{s.team}</td>
                        <td className="py-3 text-center text-muted-foreground">{s.w}</td>
                        <td className="py-3 text-center text-muted-foreground">{s.l}</td>
                        <td className="py-3 text-center text-muted-foreground">{s.pct}</td>
                        <td className="py-3 text-center font-heading font-bold">{s.pts}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function ScoreTeam({
  name,
  score,
  fouls,
  align = "left",
}: {
  name: string
  score: number
  fouls: number
  align?: "left" | "right"
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30 font-heading text-sm font-bold text-primary">
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </span>
        <div>
          <p className="font-heading text-4xl font-bold tabular-nums">{score}</p>
        </div>
      </div>
      <p className="mt-1.5 text-sm font-semibold uppercase tracking-wide">{name}</p>
      <p className="text-xs text-muted-foreground">Fouls: {fouls}</p>
    </div>
  )
}