"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, UploadCloud, ImagePlus, Save, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Player } from "@/lib/data"
import { supabase } from "@/lib/supabase/client"

const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center", "Guard", "Forward"]
const teamOptions = [
  { id: "senior-boys", label: "Rangers Boys" },
  { id: "women", label: "Women" },
  { id: "juveniles-boys", label: "Juveniles Boys" },
  { id: "juveniles-girls", label: "Juveniles Girls" },
]

function groupFor(position: string): Player["group"] {
  if (position.includes("Guard")) return "Guard"
  if (position.includes("Center")) return "Center"
  return "Forward"
}

export default function EditPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const isNew = id === "new"

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [player, setPlayer] = useState<Omit<Player, "id"> & { id?: string }>({
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

  const fetchPlayer = useCallback(async () => {
    if (isNew) return
    try {
      const res = await fetch("/api/players")
      if (!res.ok) throw new Error("Failed to fetch players")
      const list = (await res.json()) as Player[]
      const found = list.find((p) => p.id === id)
      if (found) {
        setPlayer(found)
      } else {
        setError("Player not found")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to load player data")
    } finally {
      setLoading(false)
    }
  }, [id, isNew])

  useEffect(() => {
    fetchPlayer()
  }, [fetchPlayer])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!player.name.trim()) return
    setSaving(true)
    setError("")

    try {
      const payload = {
        ...player,
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

      const url = isNew ? "/api/players" : `/api/players/${id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save player details")
      router.push("/admin/players")
    } catch (err) {
      console.error(err)
      setError("Failed to save player. Please check inputs and try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading player profile...</div>
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/players">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">
              {isNew ? "Create Player Profile" : `Edit Profile: ${player.name}`}
            </h1>
            <p className="text-xs text-muted-foreground">
              Update biography, season statistics, and personal bio
            </p>
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

      {/* PHOTO DROPZONE */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">Player Media</h2>
        <PhotoDropzone
          photo={player.photo}
          playerId={isNew ? player.name || "new" : id}
          onChange={(url) => setPlayer({ ...player, photo: url })}
        />
      </Card>

      {/* BASIC DETAILS */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-accent">Personal &amp; Team Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Field
              label="Full Name"
              value={player.name}
              onChange={(v) => setPlayer({ ...player, name: v })}
              placeholder="e.g. Jayden Brown"
            />
          </div>
          <Field
            label="Jersey Number"
            value={String(player.number)}
            onChange={(v) => setPlayer({ ...player, number: Number(v) || 0 })}
            placeholder="23"
            type="number"
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Position</label>
            <select
              value={player.position}
              onChange={(e) =>
                setPlayer({
                  ...player,
                  position: e.target.value,
                  group: groupFor(e.target.value),
                })
              }
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

          <Field
            label="Date of Birth"
            value={player.dob}
            onChange={(v) => setPlayer({ ...player, dob: v })}
            placeholder="May 12, 2001"
          />
          <Field
            label="Nationality"
            value={player.nationality}
            onChange={(v) => setPlayer({ ...player, nationality: v })}
            placeholder="Zimbabwe"
          />
          <Field
            label="Height"
            value={player.height}
            onChange={(v) => setPlayer({ ...player, height: v })}
            placeholder="188 cm"
          />
          <Field
            label="Weight"
            value={player.weight}
            onChange={(v) => setPlayer({ ...player, weight: v })}
            placeholder="82 kg"
          />
          <Field
            label="College / Academy"
            value={player.college}
            onChange={(v) => setPlayer({ ...player, college: v })}
            placeholder="Texas State University"
          />
          <Field
            label="Years Pro"
            value={String(player.yearsPro)}
            onChange={(v) => setPlayer({ ...player, yearsPro: Number(v) || 0 })}
            placeholder="3"
            type="number"
          />
        </div>
      </Card>

      {/* BIOGRAPHY SECTION */}
      <Card className="p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent">Biography</h2>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Player Overview / Bio</label>
        <textarea
          value={player.bio}
          onChange={(e) => setPlayer({ ...player, bio: e.target.value })}
          rows={5}
          placeholder="Jayden Brown is the floor general for Mutare Rangers. Known for his quick handles..."
          className="mt-1.5 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring leading-relaxed"
        />
      </Card>

      {/* STATS SECTION */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">2024 / 2025 Season Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatField
            label="PPG"
            value={player.stats.ppg}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, ppg: v } })}
          />
          <StatField
            label="APG"
            value={player.stats.apg}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, apg: v } })}
          />
          <StatField
            label="RPG"
            value={player.stats.rpg}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, rpg: v } })}
          />
          <StatField
            label="SPG"
            value={player.stats.spg}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, spg: v } })}
          />
          <StatField
            label="BPG"
            value={player.stats.bpg}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, bpg: v } })}
          />
          <StatField
            label="FG%"
            value={player.stats.fgPct}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, fgPct: v } })}
          />
          <StatField
            label="3PT%"
            value={player.stats.threePct}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, threePct: v } })}
          />
          <StatField
            label="FT%"
            value={player.stats.ftPct}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, ftPct: v } })}
          />
          <StatField
            label="EFF"
            value={player.stats.eff}
            onChange={(v) => setPlayer({ ...player, stats: { ...player.stats, eff: v } })}
          />
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

function StatField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring font-medium"
      />
    </div>
  )
}

function PhotoDropzone({
  photo,
  playerId,
  onChange,
}: {
  photo: string
  playerId: string
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
        // Build a safe, unique file name so it doesn't clash with other players
        const fileExt = file.name.split(".").pop()
        const safeId = playerId.toLowerCase().replace(/[^a-z0-9-]/g, "-") || "player"
        const fileName = `${safeId}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("player-avatars")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("player-avatars").getPublicUrl(fileName)

        onChange(data.publicUrl)
      } catch (err) {
        console.error(err)
        setError("Upload failed. Please try again.")
      } finally {
        setUploading(false)
      }
    },
    [onChange, playerId],
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
        className={`flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed p-4 transition-colors ${
          dragActive ? "border-accent bg-accent/10" : "border-border hover:border-accent/60 hover:bg-primary/5"
        } ${uploading ? "pointer-events-none opacity-70" : ""}`}
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {uploading ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : photo ? (
            <Image src={photo} alt="" fill className="object-cover object-top" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <UploadCloud className="h-4 w-4" />
            {uploading ? "Uploading..." : "Click or drag & drop to change player photo"}
          </div>
          <div className="text-xs text-muted-foreground">PNG or JPG, up to 5MB</div>
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