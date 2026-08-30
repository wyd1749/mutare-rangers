"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Video, Advert } from "@/lib/data"
import { platformLabels } from "@/lib/video-embed"

export default function WatchAdvertsAdmin() {
  const [tab, setTab] = useState<"videos" | "adverts">("videos")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Watch & Adverts</h1>
          <p className="text-sm text-muted-foreground">Manage videos and sponsor adverts</p>
        </div>
        <div className="flex rounded-md border border-border p-1">
          <button
            onClick={() => setTab("videos")}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              tab === "videos" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Videos
          </button>
          <button
            onClick={() => setTab("adverts")}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              tab === "adverts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Adverts
          </button>
        </div>
      </div>

      {tab === "videos" ? <VideosPanel /> : <AdvertsPanel />}
    </div>
  )
}

function VideosPanel() {
  const [rows, setRows] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Video | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data: Video[]) => {
        if (!cancelled) setRows(data)
      })
      .catch((err) => console.error("Failed to load videos", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function startAdd() {
    setEditing({ id: `v-${Date.now()}`, title: "", platform: "youtube", url: "", category: "Highlights", date: "" })
    setIsNew(true)
    setOpen(true)
  }

  function startEdit(v: Video) {
    setEditing({ ...v })
    setIsNew(false)
    setOpen(true)
  }

  async function remove(id: string) {
    const prev = rows
    setRows((r) => r.filter((x) => x.id !== id))
    try {
      const res = await fetch("/api/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Delete failed")
    } catch (err) {
      console.error(err)
      setRows(prev)
    }
  }

  async function save() {
    if (!editing || !editing.title.trim() || !editing.url.trim()) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        })
        if (!res.ok) throw new Error("Create failed")
        const saved: Video = await res.json()
        setRows((r) => [saved, ...r])
      } else {
        const res = await fetch("/api/videos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        })
        if (!res.ok) throw new Error("Update failed")
        const saved: Video = await res.json()
        setRows((r) => r.map((x) => (x.id === saved.id ? saved : x)))
      }
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Video
        </Button>
      </div>

      <Card className="mt-4 p-5">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading videos…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Video Source</th>
                  <th className="pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((v) => (
                  <tr key={v.id}>
                    <td className="py-3 font-medium">{v.title}</td>
                    <td className="py-3">
                      <Badge variant="outline">{v.category}</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{v.date}</td>
                    <td className="max-w-[200px] truncate py-3 text-xs text-muted-foreground">
                      {platformLabels[v.platform]} — {v.url}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(v)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                          aria-label="Edit video"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(v.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          aria-label="Delete video"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      No videos yet.
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
              <h2 className="font-heading text-xl font-bold text-foreground">{isNew ? "Add Video" : "Edit Video"}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <Label>Title</Label>
                <Input value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Video title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Platform</Label>
                  <select
                    value={editing.platform}
                    onChange={(e) => setEditing({ ...editing, platform: e.target.value as Video["platform"] })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value as Video["category"] })}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Highlights">Highlights</option>
                    <option value="Live">Live</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Video URL</Label>
                <Input
                  value={editing.url}
                  onChange={(v) => setEditing({ ...editing, url: v })}
                  placeholder="Paste the full video link from YouTube, TikTok, Facebook or Instagram"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} placeholder="Jun 22, 2025" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" className="bg-transparent" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Video"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

function AdvertsPanel() {
  const [rows, setRows] = useState<Advert[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Advert | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/adverts")
      .then((res) => res.json())
      .then((data: Advert[]) => {
        if (!cancelled) setRows(data)
      })
      .catch((err) => console.error("Failed to load adverts", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function startAdd() {
    setEditing({ id: `ad-${Date.now()}`, title: "", image: "", sponsor: "", link: "", active: true })
    setIsNew(true)
    setOpen(true)
  }

  function startEdit(a: Advert) {
    setEditing({ ...a })
    setIsNew(false)
    setOpen(true)
  }

  async function remove(id: string) {
    const prev = rows
    setRows((r) => r.filter((x) => x.id !== id))
    try {
      const res = await fetch("/api/adverts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Delete failed")
    } catch (err) {
      console.error(err)
      setRows(prev)
    }
  }

  async function toggleActive(a: Advert) {
    const updated = { ...a, active: !a.active }
    setRows((r) => r.map((x) => (x.id === a.id ? updated : x)))
    try {
      const res = await fetch("/api/adverts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error("Update failed")
    } catch (err) {
      console.error(err)
      setRows((r) => r.map((x) => (x.id === a.id ? a : x)))
    }
  }

  async function save() {
    if (!editing || !editing.title.trim() || !editing.image.trim()) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch("/api/adverts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        })
        if (!res.ok) throw new Error("Create failed")
        const saved: Advert = await res.json()
        setRows((r) => [saved, ...r])
      } else {
        const res = await fetch("/api/adverts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        })
        if (!res.ok) throw new Error("Update failed")
        const saved: Advert = await res.json()
        setRows((r) => r.map((x) => (x.id === saved.id ? saved : x)))
      }
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Advert
        </Button>
      </div>

      <Card className="mt-4 p-5">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading adverts…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Sponsor</th>
                  <th className="pb-3 font-medium">Link</th>
                  <th className="pb-3 font-medium">Active</th>
                  <th className="pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 font-medium">{a.title}</td>
                    <td className="py-3 text-muted-foreground">{a.sponsor}</td>
                    <td className="max-w-[180px] truncate py-3 text-muted-foreground">{a.link}</td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleActive(a)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold uppercase",
                          a.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {a.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(a)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                          aria-label="Edit advert"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(a.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          aria-label="Delete advert"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      No adverts yet.
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
              <h2 className="font-heading text-xl font-bold text-foreground">{isNew ? "Add Advert" : "Edit Advert"}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <Label>Title</Label>
                <Input value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Advert title" />
              </div>
              <div>
                <Label>Sponsor Name</Label>
                <Input value={editing.sponsor} onChange={(v) => setEditing({ ...editing, sponsor: v })} placeholder="e.g. Molten" />
              </div>
              <div>
                <Label>Image Path</Label>
                <Input value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} placeholder="/images/sponsor.png" />
              </div>
              <div>
                <Label>Link URL</Label>
                <Input value={editing.link} onChange={(v) => setEditing({ ...editing, link: v })} placeholder="https://sponsor-website.com" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                Show on public page
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" className="bg-transparent" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Advert"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</label>
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  )
}