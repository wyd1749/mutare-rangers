"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { matches as seedMatches, standings as seedStandings, type Match, type Standing } from "@/lib/data"

export default function MatchesAdmin() {
  const [tab, setTab] = useState<"fixtures" | "standings">("fixtures")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Matches</h1>
          <p className="text-sm text-muted-foreground">Manage fixtures and the league table</p>
        </div>
        <div className="flex rounded-md border border-border p-1">
          <button
            onClick={() => setTab("fixtures")}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              tab === "fixtures" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Fixtures
          </button>
          <button
            onClick={() => setTab("standings")}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              tab === "standings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            League Standings
          </button>
        </div>
      </div>

      {tab === "fixtures" ? <FixturesPanel /> : <StandingsPanel />}
    </div>
  )
}

function FixturesPanel() {
  const [rows, setRows] = useState<Match[]>(seedMatches)
  const [editing, setEditing] = useState<{ id: string; opponent: string; date: string; time: string; venue: string; home: boolean; status: Match["status"]; category: Match["category"] } | null>(null)
  const [open, setOpen] = useState(false)

  function startAdd() {
    setEditing({ id: "", opponent: "", date: "", time: "18:00", venue: "Mutare Sports Arena", home: true, status: "upcoming", category: "Men" })
    setOpen(true)
  }

  function startEdit(m: Match) {
    const isHome = m.home === "Mutare Rangers"
    setEditing({
      id: m.id,
      opponent: isHome ? m.away : m.home,
      date: m.date,
      time: m.time,
      venue: m.venue,
      home: isHome,
      status: m.status,
      category: m.category,
    })
    setOpen(true)
  }

  function remove(id: string) {
    setRows((r) => r.filter((x) => x.id !== id))
  }

  function save() {
    if (!editing || !editing.opponent.trim() || !editing.date.trim()) return
    if (editing.id) {
      setRows((r) =>
        r.map((x) =>
          x.id === editing.id
            ? {
                ...x,
                date: editing.date,
                time: editing.time,
                home: editing.home ? "Mutare Rangers" : editing.opponent,
                away: editing.home ? editing.opponent : "Mutare Rangers",
                venue: editing.venue,
                status: editing.status,
                category: editing.category,
              }
            : x,
        ),
      )
    } else {
      const m: Match = {
        id: `m-${Date.now()}`,
        date: editing.date,
        time: editing.time,
        home: editing.home ? "Mutare Rangers" : editing.opponent,
        away: editing.home ? editing.opponent : "Mutare Rangers",
        venue: editing.venue,
        status: "upcoming",
        category: editing.category,
      }
      setRows((r) => [...r, m])
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Schedule Match
        </Button>
      </div>

      <Card className="mt-4 p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Fixture</th>
                <th className="pb-3 font-medium">Venue</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 text-muted-foreground">
                    {m.date}
                    <span className="block text-xs">{m.time}</span>
                  </td>
                  <td className="py-3 font-medium">
                    {m.home} <span className="text-muted-foreground">vs</span> {m.away}
                  </td>
                  <td className="py-3 text-muted-foreground">{m.venue}</td>
                  <td className="py-3 text-muted-foreground">{m.category}</td>
                  <td className="py-3">
                    <Badge variant="outline">{m.status}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(m)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                        aria-label="Edit match"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(m.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                        aria-label="Delete match"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {editing.id ? "Edit Match" : "Schedule Match"}
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <Label>Opponent</Label>
                <Input value={editing.opponent} onChange={(v) => setEditing({ ...editing, opponent: v })} placeholder="e.g. Harare Royals" />
              </div>
              <div>
                <Label>Date</Label>
                <Input value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} placeholder="Jun 22, 2025" />
              </div>
              <div>
                <Label>Time</Label>
                <Input value={editing.time} onChange={(v) => setEditing({ ...editing, time: v })} placeholder="18:00" />
              </div>
              <div className="sm:col-span-3">
                <Label>Venue</Label>
                <Input value={editing.venue} onChange={(v) => setEditing({ ...editing, venue: v })} placeholder="Venue" />
              </div>
              <div>
                <Label>Home / Away</Label>
                <select
                  value={editing.home ? "home" : "away"}
                  onChange={(e) => setEditing({ ...editing, home: e.target.value === "home" })}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </select>
              </div>
              <div>
                <Label>Team Category</Label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as Match["category"] })}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
              {editing.id && (
                <div>
                  <Label>Status</Label>
                  <select
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as Match["status"] })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="final">Final</option>
                  </select>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save}>
                {editing.id ? "Save Changes" : "Save Match"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

function StandingsPanel() {
  const [rows, setRows] = useState<Standing[]>(seedStandings)
  const [editing, setEditing] = useState<Standing | null>(null)
  const [originalTeam, setOriginalTeam] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  function resequence(list: Standing[]) {
    return [...list].sort((a, b) => b.pts - a.pts).map((s, i) => ({ ...s, pos: i + 1 }))
  }

  function startAdd() {
    setEditing({ pos: rows.length + 1, team: "", w: 0, l: 0, pct: ".000", pts: 0 })
    setOriginalTeam(null)
    setOpen(true)
  }

  function startEdit(s: Standing) {
    setEditing({ ...s })
    setOriginalTeam(s.team)
    setOpen(true)
  }

  function remove(team: string) {
    setRows((r) => resequence(r.filter((x) => x.team !== team)))
  }

  function save() {
    if (!editing || !editing.team.trim()) return
    const games = editing.w + editing.l
    const pts = editing.w * 2
    const pct = games > 0 ? (editing.w / games).toFixed(3).replace(/^0/, "") : ".000"
    const entry = { ...editing, pct, pts }
    setRows((r) =>
      resequence(originalTeam ? r.map((x) => (x.team === originalTeam ? entry : x)) : [...r, entry]),
    )
    setOpen(false)
    setEditing(null)
    setOriginalTeam(null)
  }

  return (
    <Card className="mt-4 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} teams in the table</p>
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Team
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-3 font-medium">#</th>
              <th className="pb-3 font-medium">Team</th>
              <th className="pb-3 font-medium">W</th>
              <th className="pb-3 font-medium">L</th>
              <th className="pb-3 font-medium">PCT</th>
              <th className="pb-3 font-medium">PTS</th>
              <th className="pb-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {resequence(rows).map((s) => (
              <tr key={s.team}>
                <td className="py-3 font-heading font-bold">{s.pos}</td>
                <td className={cn("py-3 font-medium", s.team === "Mutare Rangers" && "text-primary")}>{s.team}</td>
                <td className="py-3 text-muted-foreground">{s.w}</td>
                <td className="py-3 text-muted-foreground">{s.l}</td>
                <td className="py-3 text-muted-foreground">{s.pct}</td>
                <td className="py-3 font-heading font-bold text-accent">{s.pts}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => startEdit(s)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                      aria-label={`Edit ${s.team}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(s.team)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                      aria-label={`Delete ${s.team}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">Edit Standing</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Team</Label>
                <Input value={editing.team} onChange={(v) => setEditing({ ...editing, team: v })} placeholder="Team name" />
              </div>
              <div>
                <Label>Wins</Label>
                <Input value={String(editing.w)} onChange={(v) => setEditing({ ...editing, w: Number(v) || 0 })} type="number" />
              </div>
              <div>
                <Label>Losses</Label>
                <Input value={String(editing.l)} onChange={(v) => setEditing({ ...editing, l: Number(v) || 0 })} type="number" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Points and win % are calculated automatically from W/L.</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save}>
                Save Team
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</label>
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  )
}
