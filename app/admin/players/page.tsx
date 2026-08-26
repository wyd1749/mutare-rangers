"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/data"

const teamOptions = [
  { id: "senior-boys", label: "Rangers Boys" },
  { id: "women", label: "Women" },
  { id: "juveniles-boys", label: "Juveniles Boys" },
  { id: "juveniles-girls", label: "Juveniles Girls" },
]

export default function PlayersAdmin() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")

  const loadPlayers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/players")
      if (!res.ok) throw new Error("Failed to load players")
      const data = (await res.json()) as Player[]
      setPlayers(data)
    } catch (err) {
      console.error(err)
      setError("Couldn't load players. Try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPlayers()
  }, [loadPlayers])

  const filtered = players.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))

  async function remove(id: string) {
    if (!confirm("Delete this player? This can't be undone.")) return
    try {
      const res = await fetch(`/api/players/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete player")
      const { players: updated } = (await res.json()) as { players: Player[] }
      setPlayers(updated)
    } catch (err) {
      console.error(err)
      alert("Failed to delete player. Please try again.")
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Manage Players</h1>
          <p className="text-sm text-muted-foreground">{players.length} players on the roster</p>
        </div>
        <Button asChild className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/players/new">
            <Plus className="mr-1 h-4 w-4" /> Add Player
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="relative mb-4 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Player</th>
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Position</th>
                <th className="pb-3 font-medium">Group</th>
                <th className="pb-3 font-medium">Team</th>
                <th className="pb-3 font-medium">PPG</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Loading players...
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Image src={r.photo || "/placeholder.svg"} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover object-top" />
                          <span className="font-medium">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-3 font-heading font-bold text-accent">{r.number}</td>
                      <td className="py-3 text-muted-foreground">{r.position}</td>
                      <td className="py-3">
                        <Badge variant="muted">{r.group}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {teamOptions.find((t) => t.id === r.team)?.label ?? r.team}
                      </td>
                      <td className="py-3 text-muted-foreground">{r.stats.ppg}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild size="sm" variant="outline" className="h-8 px-2 text-xs">
                            <Link href={`/admin/players/${r.id}/edit`}>
                              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit Full Profile
                            </Link>
                          </Button>
                          <button
                            onClick={() => remove(r.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                            aria-label={`Delete ${r.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No players found.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}