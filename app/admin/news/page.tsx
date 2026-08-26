"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Pencil, Trash2, X, UploadCloud, ImagePlus, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { NewsItem } from "@/lib/data"
import { supabase } from "@/lib/supabase/client"

const categories = ["Match Report", "Academy", "Club News"]

export default function NewsAdmin() {
  const router = useRouter()
  const [rows, setRows] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<NewsItem | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Fetch articles from API
  const loadNews = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/news")
      if (res.ok) {
        const data = await res.json()
        setRows(data)
      }
    } catch (err) {
      console.error("Failed to load news", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNews()
  }, [loadNews])

  function startAdd() {
    setEditing({
      id: "",
      title: "",
      category: "Club News",
      excerpt: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      image: "/images/hero-dunk.png",
      body: "",
    })
    setOpen(true)
  }

  function startEdit(n: NewsItem) {
    setEditing({ ...n })
    setOpen(true)
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setRows((r) => r.filter((x) => x.id !== id))
        router.refresh()
      }
    } catch (err) {
      console.error("Failed to delete article", err)
    }
  }

  async function save() {
    if (!editing || !editing.title.trim()) return
    setSaving(true)

    try {
      const isNew = !editing.id
      const method = isNew ? "POST" : "PUT"

      const payload = {
        ...editing,
        id: isNew ? `n-${Date.now()}` : editing.id,
      }

      // Send both POST and PUT directly to /api/news
      const res = await fetch("/api/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save article")

      await loadNews()
      router.refresh()
      setOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
      alert("Failed to save article. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Manage News</h1>
          <p className="text-sm text-muted-foreground">{rows.length} published articles</p>
        </div>
        <Button onClick={startAdd} className="bg-accent font-semibold uppercase text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Add Article
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading news articles...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((n) => (
            <Card key={n.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative h-36 overflow-hidden">
                <Image src={n.image || "/placeholder.svg"} alt="" fill className="object-cover" />
                <Badge variant="accent" className="absolute left-3 top-3">
                  {n.category}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm font-semibold leading-snug">{n.title}</p>
                <p className="mt-1 flex-1 text-xs text-muted-foreground">{n.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{n.date}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(n)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                      aria-label="Edit article"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(n.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                      aria-label="Delete article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/80 p-4">
          <Card className="my-8 max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {editing.id ? "Edit Article" : "Add Article"}
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Cover Image
                </label>
                <PhotoDropzone
                  photo={editing.image}
                  onChange={(dataUrl) => setEditing({ ...editing, image: dataUrl })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Article headline"
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</label>
                <textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Short summary..."
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Full Article
                </label>
                <textarea
                  value={editing.body ?? ""}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  rows={6}
                  placeholder="Full article body. Separate paragraphs with a blank line..."
                  className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={saving}
                className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90"
                onClick={save}
              >
                {saving ? "Saving..." : editing.id ? "Save Changes" : "Publish"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function PhotoDropzone({
  photo,
  onChange,
}: {
  photo: string
  onChange: (url: string) => void
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
        const fileName = `article-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("news-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("news-images").getPublicUrl(fileName)

        onChange(data.publicUrl)
      } catch (err) {
        console.error(err)
        setError("Upload failed. Please try again.")
      } finally {
        setUploading(false)
      }
    },
    [onChange],
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
            {uploading ? "Uploading..." : "Click or drag & drop article image"}
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