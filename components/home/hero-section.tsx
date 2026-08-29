"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trophy, Users, ClipboardList, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { teamStats, matches } from "@/lib/data"

const stats = [
  { icon: Trophy, raw: teamStats.trophies, label: "Trophies Won" },
  { icon: Users, raw: teamStats.players, label: "Players" },
  { icon: ClipboardList, raw: teamStats.coaches, label: "Coaches & Staff" },
  { icon: Heart, raw: teamStats.fans, label: "Fans" },
]

/** Splits "15K+" into { number: 15, suffix: "K+" }, or "12" into { number: 12, suffix: "" } */
function splitStat(raw: string | number) {
  const str = String(raw)
  const match = str.match(/^(\d+)(.*)$/)
  if (!match) return { number: 0, suffix: str }
  return { number: Number(match[1]), suffix: match[2] }
}

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true

    let raf: number
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])

  return value
}

function AnimatedStat({ raw, active }: { raw: string | number; active: boolean }) {
  const { number, suffix } = splitStat(raw)
  const value = useCountUp(number, active)
  return (
    <p className="font-heading text-2xl font-bold leading-none tabular-nums">
      {value}
      {suffix}
    </p>
  )
}

export function HeroSection() {
  const nextMatch = matches[0]
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const scrollToNext = () => {
    const next = document.getElementById("hero-end")
    next?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden">
      {/* Cinematic background with slow zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src="/images/hero-dunk.png"
            alt="Mutare Rangers player dunking"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-right"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Floating basketball */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-16 hidden animate-hero-float opacity-80 sm:block lg:right-20 lg:top-24"
      >
        <Basketball className="h-16 w-16 lg:h-24 lg:w-24" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-xl">
          <p className="mb-4 font-heading text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Mutare Rangers Basketball Academy
          </p>
          <h1 className="font-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Where <span className="text-accent">Iron</span>
            <br />
            Sharpens
            <br />
            <span className="text-primary">Iron</span>
          </h1>
          <div className="mt-6 space-y-1 text-lg font-medium text-muted-foreground">
            <p>Developing Champions.</p>
            <p>Building Leaders.</p>
            <p>Strengthening Community.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-accent font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/matches">View Fixtures</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border bg-transparent font-semibold uppercase tracking-wide hover:bg-secondary"
            >
              <Link href="/academy">About Us</Link>
            </Button>
          </div>
        </div>

        {/* Next match card */}
        <div className="mt-12 w-full max-w-sm rounded-xl border border-border bg-card/90 p-5 backdrop-blur lg:absolute lg:right-6 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent">Next Match</p>
          <div className="mt-4 flex items-center justify-between">
            <TeamBadge name="Mutare Rangers" />
            <span className="font-heading text-2xl font-bold text-muted-foreground">VS</span>
            <TeamBadge name="City Hoopers" />
          </div>
          <div className="mt-4 border-t border-border pt-4 text-center">
            <p className="font-heading text-lg font-bold">
              {nextMatch.date} · {nextMatch.time}
            </p>
            <p className="text-sm text-muted-foreground">{nextMatch.venue}</p>
          </div>
          <Button
            asChild
            className="mt-4 w-full bg-accent font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/matches">Buy Tickets</Link>
          </Button>
        </div>
      </div>

      {/* Stats bar with count-up animation */}
      <div ref={statsRef} className="relative border-t border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <AnimatedStat raw={s.raw} active={statsActive} />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={scrollToNext}
          aria-label="Scroll to next section"
          className="absolute -bottom-14 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-accent sm:flex"
        >
          <span className="relative h-8 w-px overflow-hidden bg-border">
            <span className="absolute inset-x-0 top-0 h-full bg-accent animate-hero-scroll-line" />
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
      <div id="hero-end" />
    </section>
  )
}

function TeamBadge({ name }: { name: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-bold text-primary">
        {name
          .split(" ")
          .map((w) => w[0])
          .join("")}
      </span>
      <span className="text-xs font-semibold uppercase leading-tight text-foreground">{name}</span>
    </div>
  )
}

function Basketball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="oklch(0.82 0.16 88)" stroke="oklch(0.18 0.02 100)" strokeWidth="2" />
      <path
        d="M50 2v96M2 50h96M14 14c12 12 12 60 0 72M86 14c-12 12-12 60 0 72"
        stroke="oklch(0.18 0.02 100)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}