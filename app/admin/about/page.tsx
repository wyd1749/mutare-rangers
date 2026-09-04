"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Plus, Pencil, Trash2, X, UploadCloud, ImagePlus, Loader2 } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"

function PhotoDropzone({
  photo,
  onChange,
  prefix,
}: {
  photo: string
  onChange: (url: string) => void
  prefix: string
}) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB.")
        return
      }
      setError("")
      setUploading(true)

      try {
        const fileExt = file.name.split(".").pop()
        const fileName = `${prefix}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(fileName, file, { cacheControl: "3600", upsert: true })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("site-assets").getPublicUrl(fileName)
        onChange(data.publicUrl)
      } catch (err) {
        console.error(err)
        setError("Upload failed. Please try again.")
      } finally {
        setUploading(false)
      }
    },
    [onChange, prefix],
  )

  return (
    <div>
      <div
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed p-3 transition-colors ${
          dragActive ? "border-accent bg-accent/10" : "border-border hover:border-accent/60 hover:bg-primary/5"
        } ${uploading ? "pointer-events-none opacity-70" : ""}`}
      >
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-border bg-muted">
          {uploading ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : photo ? (
            <Image src={photo} alt="" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImagePlus className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5 text-sm">
          <div className="flex items-center gap-1.5 font-medium text-foreground text-xs sm:text-sm">
            <UploadCloud className="h-4 w-4 shrink-0 text-accent" />
            {uploading ? "Uploading..." : "Click or drag & drop image"}
          </div>
          <div className="text-[11px] text-muted-foreground">PNG or JPG, up to 5MB</div>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

type Trophy = {
  id: string
  name: string
  competition: string
  year: string
  image: string
  order: number
}

type Achievement = {
  id: string
  title: string
  description: string
  year: string
  order: number
}

type BoardMember = {
  id: string
  name: string
  role: string
  photo: string
  bio: string
  order: number
}

type Tab = "trophies" | "achievements" | "board"

export default function AboutAdmin() {
  const [tab, setTab] = useState<Tab>("trophies")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">About Us</h1>
          <p className="text-sm text-muted-foreground">Manage the trophy cabinet, achievements, and board of governors</p>
        </div>
        <div className="flex rounded-md border border-border p-1">
          {(["trophies", "achievements", "board"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "trophies" ? "Trophy Cabinet" : t === "achievements" ? "Achievements" : "Board of Governors"}
            </button>
          ))}
        </div>
      </div>

      {tab === "trophies" && <TrophiesPanel />}
      {tab === "achievements" && <AchievementsPanel />}
      {tab === "board" && <BoardPanel />}
    </div>
  )
}

function TrophiesPanel() {
  const [rows, setRows] = useState<Trophy[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Trophy | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/trophies")
      if (res.ok) setRows(await res.json())
    } catch (err) {
      console.error("Failed to load trophies", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function startAdd() {
    setEditing({ id: "", name: "", competition: "", year: "", image: "", order: rows.length })
    setOpen(true)
  }

  function startEdit(t: Trophy) {
    setEditing({ ...t })
    setOpen(true)
  }

  async function remove(id: string) {
    if (!confirm("Delete this trophy?")) return
    try {
      const res = await fetch("/api/trophies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setRows((r) => r.filter((x) => x.id !== id))
    } catch (err) {
      console.error("Failed to delete trophy", err)
    }
  }

  async function save() {
    if (!editing || !editing.name.trim()) return
    setSaving(true)
    try {
      const isNew = !editing.id
      const method = isNew ? "POST" : "PUT"
      const res = await fetch("/api/trophies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error("Failed to save trophy")
      await load()
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      alert("Failed to save trophy. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mt-4 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} trophies</p>
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Trophy
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Competition</th>
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 font-medium">{t.name}</td>
                  <td className="py-3 text-muted-foreground">{t.competition}</td>
                  <td className="py-3 text-muted-foreground">{t.year}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(t)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary" aria-label="Edit trophy">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(t.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive" aria-label="Delete trophy">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">{editing.id ? "Edit Trophy" : "Add Trophy"}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <Label>Trophy Name</Label>
                <Input value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="e.g. ZBA National Championship" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Competition</Label>
                  <Input value={editing.competition} onChange={(v) => setEditing({ ...editing, competition: v })} placeholder="e.g. ZBA League" />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input value={editing.year} onChange={(v) => setEditing({ ...editing, year: v })} placeholder="e.g. 2024" />
                </div>
              </div>
              <div>
                <Label>Trophy Photo</Label>
                <div className="mt-1.5">
                  <PhotoDropzone photo={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} prefix="trophy" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={saving} className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save}>
                {saving ? "Saving..." : "Save Trophy"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}

function AchievementsPanel() {
  const [rows, setRows] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/achievements")
      if (res.ok) setRows(await res.json())
    } catch (err) {
      console.error("Failed to load achievements", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function startAdd() {
    setEditing({ id: "", title: "", description: "", year: "", order: rows.length })
    setOpen(true)
  }

  function startEdit(a: Achievement) {
    setEditing({ ...a })
    setOpen(true)
  }

  async function remove(id: string) {
    if (!confirm("Delete this achievement?")) return
    try {
      const res = await fetch("/api/achievements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setRows((r) => r.filter((x) => x.id !== id))
    } catch (err) {
      console.error("Failed to delete achievement", err)
    }
  }

  async function save() {
    if (!editing || !editing.title.trim()) return
    setSaving(true)
    try {
      const isNew = !editing.id
      const method = isNew ? "POST" : "PUT"
      const res = await fetch("/api/achievements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error("Failed to save achievement")
      await load()
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      alert("Failed to save achievement. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mt-4 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} achievements</p>
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Achievement
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 font-medium">{a.title}</td>
                  <td className="py-3 text-muted-foreground">{a.year}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(a)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary" aria-label="Edit achievement">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(a.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive" aria-label="Delete achievement">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">{editing.id ? "Edit Achievement" : "Add Achievement"}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <Label>Title</Label>
                <Input value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="e.g. Undefeated regional season" />
              </div>
              <div>
                <Label>Year</Label>
                <Input value={editing.year} onChange={(v) => setEditing({ ...editing, year: v })} placeholder="e.g. 2023" />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  placeholder="Short description..."
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={saving} className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save}>
                {saving ? "Saving..." : "Save Achievement"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}

function BoardPanel() {
  const [rows, setRows] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BoardMember | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/board")
      if (res.ok) setRows(await res.json())
    } catch (err) {
      console.error("Failed to load board members", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function startAdd() {
    setEditing({ id: "", name: "", role: "", photo: "", bio: "", order: rows.length })
    setOpen(true)
  }

  function startEdit(m: BoardMember) {
    setEditing({ ...m })
    setOpen(true)
  }

  async function remove(id: string) {
    if (!confirm("Delete this board member?")) return
    try {
      const res = await fetch("/api/board", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setRows((r) => r.filter((x) => x.id !== id))
    } catch (err) {
      console.error("Failed to delete board member", err)
    }
  }

  async function save() {
    if (!editing || !editing.name.trim()) return
    setSaving(true)
    try {
      const isNew = !editing.id
      const method = isNew ? "POST" : "PUT"
      const res = await fetch("/api/board", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error("Failed to save board member")
      await load()
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      alert("Failed to save board member. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mt-4 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} board members</p>
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Member
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 font-medium">{m.name}</td>
                  <td className="py-3 text-muted-foreground">{m.role}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(m)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary" aria-label="Edit board member">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(m.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive" aria-label="Delete board member">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">{editing.id ? "Edit Board Member" : "Add Board Member"}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <Label>Name</Label>
                <Input value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="Full name" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} placeholder="e.g. Chairperson" />
              </div>
              <div>
                <Label>Photo</Label>
                <div className="mt-1.5">
                  <PhotoDropzone photo={editing.photo} onChange={(url) => setEditing({ ...editing, photo: url })} prefix="board" />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <textarea
                  value={editing.bio}
                  onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                  rows={3}
                  placeholder="Short bio..."
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={saving} className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90" onClick={save}>
                {saving ? "Saving..." : "Save Member"}
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

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  )
}