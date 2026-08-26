"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center", "Guard", "Forward"]
const teamOptions = [
  { id: "senior-boys", label: "Rangers Boys" },
  { id: "women", label: "Women" },
  { id: "juveniles-boys", label: "Juveniles Boys" },
  { id: "juveniles-girls", label: "Juveniles Girls" },
]

function groupFor(position: string) {
  if (position.includes("Guard")) return "Guard"
  if (position.includes("Center")) return "Center"
  return "Forward"
}

export default function NewPlayerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [player, setPlayer] = useState({
    name: "",
    number: 0,
    position: "Point Guard",
    group: "Guard",
    team: "senior-boys",
    photo: "/images/player-2.png",
    dob: "",
    nationality: "Zimbabwe",
    height: "",
    weight: "",
    college: "",
    yearsPro: 0,
    joined: "",
    bio: "",
    stats: { ppg: 0, apg: 0, rpg: 0, spg: 0, bpg: 0, fgPct: 0, threePct: 0, ftPct: 0, eff: 0 },
  })

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!player.name.trim()) return
    setSaving(true)
    setError("")

    try {
      const payload = {
        ...player,
        id: player.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now(),
        name: player.name.trim(),
        number: Number(player.number) || 0,
        group: groupFor(player.position),
        yearsPro: Number(player.yearsPro) || 0,
        stats: {
          ppg: Number(player.stats.ppg) || 0,
          apg: Number(player.stats.apg) || 0,
          rpg: Number(player.stats.rpg) || 0,
          spg: Number(player.stats.spg) || 0,
          bpg: Number(player.stats.bpg) || 0,
          fgPct: Number(player.stats.fgPct) || 0,
          threePct: Number(player.stats.threePct) || 0,
          ftPct: Number(player.stats.ftPct) || 0,
          eff: Number(player.stats.eff) || 0,
        },
      }

      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save player details")
      router.push("/admin/players")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Failed to save player. Please check server logs or inputs.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-4xl space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/players">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Create Player Profile</h1>
            <p className="text-xs text-muted-foreground">Add new player details, stats, and team assignment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/players">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving} className="bg-primary font-semibold uppercase text-primary-foreground">
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-accent">Personal & Team Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Name</label>
            <input
              required
              type="text"
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
              placeholder="e.g. Jayden Brown"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jersey Number</label>
            <input
              type="number"
              value={String(player.number)}
              onChange={(e) => setPlayer({ ...player, number: Number(e.target.value) || 0 })}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Position</label>
            <select
              value={player.position}
              onChange={(e) => setPlayer({ ...player, position: e.target.value, group: groupFor(e.target.value) })}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {positions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Team Roster</label>
            <select
              value={player.team}
              onChange={(e) => setPlayer({ ...player, team: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {teamOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/players">Cancel</Link>
        </Button>
        <Button type="submit" disabled={saving} className="bg-primary font-semibold uppercase text-primary-foreground">
          {saving ? "Saving Changes..." : "Save Profile"}
        </Button>
      </div>
    </form>
  )
}