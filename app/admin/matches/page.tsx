"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Match, Standing } from "@/lib/data"

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
  const [rows, setRows] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<{ id: string; opponent: string; date: string; time: string; venue: string; home: boolean; status: Match["status"]; category: Match["category"] } | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data: Match[]) => {
        if (!cancelled) setRows(data)
      })
      .catch((err) => console.error("Failed to load matches", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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

  async function remove(id: string) {
    const prev = rows
    setRows((r) => r.filter((x) => x.id !== id))
    try {
      const res = await fetch("/api/matches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Delete failed")
    } catch (err) {
      console.error(err)
      setRows(prev) // roll back on failure
    }
  }

  async function save() {
    if (!editing || !editing.opponent.trim() || !editing.date.trim()) return
    setSaving(true)
    try {
      if (editing.id) {
        const updated: Match = {
          ...(rows.find((x) => x.id === editing.id) as Match),
          date: editing.date,
          time: editing.time,
          home: editing.home ? "Mutare Rangers" : editing.opponent,
          away: editing.home ? editing.opponent : "Mutare Rangers",
          venue: editing.venue,
          status: editing.status,
          category: editing.category,
        }
        const res = await fetch("/api/matches", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
        if (!res.ok) throw new Error("Update failed")
        const saved: Match = await res.json()
        setRows((r) => r.map((x) => (x.id === saved.id ? saved : x)))
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
        const res = await fetch("/api/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(m),
        })
        if (!res.ok) throw new Error("Create failed")
        const saved: Match = await res.json()
        setRows((r) => [...r, saved])
      }
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      // keep the modal open so the user can retry
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Schedule Match
        </Button>
      </div>

      <Card className="mt-4 p-5">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading fixtures…
          </div>
        ) : (
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
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      No fixtures scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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
              <Button type="button" variant="outline" className="bg-transparent" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing.id ? "Save Changes" : "Save Match"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

function StandingsPanel() {
  const [rows, setRows] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Standing | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/standings")
      .then((res) => res.json())
      .then((data: Standing[]) => {
        if (!cancelled) setRows(resequence(data))
      })
      .catch((err) => console.error("Failed to load standings", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function resequence(list: Standing[]) {
    return [...list].sort((a, b) => b.pts - a.pts).map((s, i) => ({ ...s, pos: i + 1 }))
  }

  // Fire-and-forget: persist recalculated positions after a local resequence.
  function syncPositions(list: Standing[]) {
    fetch("/api/standings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list.map((s) => ({ id: s.id, pos: s.pos }))),
    }).catch((err) => console.error("Failed to sync standings order", err))
  }

  function startAdd() {
    setEditing({ id: `s-${Date.now()}`, pos: rows.length + 1, team: "", w: 0, l: 0, pct: ".000", pts: 0 })
    setIsNew(true)
    setOpen(true)
  }

  function startEdit(s: Standing) {
    setEditing({ ...s })
    setIsNew(false)
    setOpen(true)
  }

  async function remove(id: string) {
    const prev = rows
    setRows((r) => resequence(r.filter((x) => x.id !== id)))
    try {
      const res = await fetch("/api/standings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Delete failed")
      syncPositions(resequence(prev.filter((x) => x.id !== id)))
    } catch (err) {
      console.error(err)
      setRows(prev) // roll back on failure
    }
  }

  async function save() {
    if (!editing || !editing.team.trim()) return
    setSaving(true)
    try {
      const games = editing.w + editing.l
      const pct = games > 0 ? (editing.w / games).toFixed(3).replace(/^0/, "") : ".000"
      const pts = editing.w * 2
      const entry: Standing = { ...editing, pct, pts }

      if (isNew) {
        const res = await fetch("/api/standings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        })
        if (!res.ok) throw new Error("Create failed")
        const saved: Standing = await res.json()
        const next = resequence([...rows, saved])
        setRows(next)
        syncPositions(next)
      } else {
        const res = await fetch("/api/standings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        })
        if (!res.ok) throw new Error("Update failed")
        const saved: Standing = await res.json()
        const next = resequence(rows.map((x) => (x.id === saved.id ? saved : x)))
        setRows(next)
        syncPositions(next)
      }
      setOpen(false)
      setEditing(null)
      setIsNew(false)
    } catch (err) {
      console.error(err)
      // keep the modal open so the user can retry
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mt-4 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} teams in the table</p>
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Team
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading standings…
        </div>
      ) : (
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
              {rows.map((s) => (
                <tr key={s.id}>
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
                        onClick={() => remove(s.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                        aria-label={`Delete ${s.team}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No teams in the table yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">{isNew ? "Add Team" : "Edit Standing"}</h2>
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
              <Button type="button" variant="outline" className="bg-transparent" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Team"}
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