"use client"

import { useCallback, useEffect, useState } from "react"
import type { Program } from "@/lib/data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, X } from "lucide-react"

export default function AdminAcademyPage() {
  const [list, setList] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Program | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const loadPrograms = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/academy", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load programs")
      const data = (await res.json()) as Program[]
      setList(data)
    } catch (err) {
      console.error(err)
      setError("Couldn't load programs. Try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPrograms()
  }, [loadPrograms])

  function startAdd() {
    setEditing({
      id: "",
      name: "",
      tagline: "",
      ageRange: "",
      description: "",
      price: "",
      image: "/images/player-1.png",
    })
    setOpen(true)
  }

  function startEdit(p: Program) {
    setEditing({ ...p })
    setOpen(true)
  }

  async function remove(id: string) {
    if (!confirm("Delete this program? This can't be undone.")) return
    try {
      const res = await fetch("/api/academy", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Failed to delete program")
      const updated = (await res.json()) as Program[]
      setList(updated)
    } catch (err) {
      console.error(err)
      alert("Failed to delete program. Please try again.")
    }
  }

  async function save() {
    if (!editing || !editing.name.trim()) return
    setSaving(true)
    setError("")

    try {
      const isNew = !editing.id
      const method = isNew ? "POST" : "PUT"
      const payload: Program = {
        ...editing,
        id: isNew ? `prog-${Date.now()}` : editing.id,
      }

      const res = await fetch("/api/academy", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save program")
      const updated = (await res.json()) as Program[]
      setList(updated)
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      setError("Failed to save program. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">Academy Programs</h1>
          <p className="text-sm text-muted-foreground">Manage training programs and pricing</p>
        </div>
        <Button onClick={startAdd} className="gap-2">
          <Plus className="size-4" /> Add Program
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading programs...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((p) => (
            <Card key={p.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{p.name}</h3>
                  <p className="text-sm text-primary">{p.tagline}</p>
                </div>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                  {p.price}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{p.ageRange}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <div className="mt-auto flex gap-2 pt-2">
                <Button variant="secondary" size="sm" className="gap-1" onClick={() => startEdit(p)}>
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1 text-destructive hover:text-destructive"
                  onClick={() => remove(p.id)}
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              </div>
            </Card>
          ))}
          {list.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No programs yet.</p>
          )}
        </div>
      )}

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {editing.id ? "Edit Program" : "Add Program"}
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4">
              <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Field label="Tagline" value={editing.tagline} onChange={(v) => setEditing({ ...editing, tagline: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age Range" value={editing.ageRange} onChange={(v) => setEditing({ ...editing, ageRange: v })} />
                <Field label="Price" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={saving} onClick={save}>
                {saving ? "Saving..." : "Save Program"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
    </div>
  )
}
