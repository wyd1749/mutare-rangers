"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Coach } from "@/lib/data"

const teamOptions = [
  { id: "senior-boys", label: "Rangers Boys" },
  { id: "women", label: "Women" },
  { id: "juveniles-boys", label: "Juveniles Boys" },
  { id: "juveniles-girls", label: "Juveniles Girls" },
]

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</label>
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  )
}

export default function CoachesAdmin() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Coach | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/coaches")
      .then((res) => res.json())
      .then((data: Coach[]) => {
        if (!cancelled) setCoaches(data)
      })
      .catch((err) => console.error("Failed to load coaches", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function startAdd() {
    setEditing({ id: `c-${Date.now()}`, name: "", role: "", team: teamOptions[0].id, photo: "" })
    setIsNew(true)
    setOpen(true)
  }

  function startEdit(c: Coach) {
    setEditing({ ...c })
    setIsNew(false)
    setOpen(true)
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch("/api/coaches", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error("Failed to save coach")
      const saved: Coach = await res.json()
      setCoaches((prev) => (isNew ? [...prev, saved] : prev.map((c) => (c.id === saved.id ? saved : c))))
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      alert("Failed to save coach. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this coach? This can't be undone.")) return
    try {
      const res = await fetch("/api/coaches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Failed to delete coach")
      setCoaches((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete coach. Please try again.")
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Manage Coaches</h1>
          <p className="text-sm text-muted-foreground">{coaches.length} coaches & staff on record</p>
        </div>
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Coach
        </Button>
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Coach</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Team</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    Loading coaches...
                  </td>
                </tr>
              ) : coaches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No coaches added yet.
                  </td>
                </tr>
              ) : (
                coaches.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={c.photo || "/placeholder.svg"}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover object-top"
                        />
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{c.role}</td>
                    <td className="py-3 text-muted-foreground">
                      {teamOptions.find((t) => t.id === c.team)?.label ?? c.team}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-8 px-2 text-xs" onClick={() => startEdit(c)}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                        </Button>
                        <button
                          onClick={() => remove(c.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          aria-label={`Remove ${c.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wide">
              {isNew ? "Add Coach" : "Edit Coach"}
            </h2>

            <div className="mt-4 grid gap-4">
              <div>
                <Label>Name</Label>
                <Input value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="Coach's full name" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} placeholder="e.g. Head Coach, Assistant Coach" />
              </div>
              <div>
                <Label>Team</Label>
                <select
                  value={editing.team}
                  onChange={(e) => setEditing({ ...editing, team: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {teamOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Photo URL</Label>
                <Input value={editing.photo} onChange={(v) => setEditing({ ...editing, photo: v })} placeholder="/images/player-1.png" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setEditing(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={save}
                disabled={saving || !editing.name.trim()}
                className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90"
              >
                {saving ? "Saving..." : "Save Coach"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}