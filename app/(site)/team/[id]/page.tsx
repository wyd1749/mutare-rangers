import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPlayerById } from "@/lib/players-store"

// Player data can change at runtime via the admin panel, so this page
// must always render fresh rather than being cached as a static page.
export const dynamic = "force-dynamic"

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = await getPlayerById(id)
  if (!player) notFound()

  const bio = [
    { label: "Date of Birth", value: player.dob },
    { label: "Nationality", value: player.nationality },
    { label: "Height", value: player.height },
    { label: "Weight", value: player.weight },
    { label: "College", value: player.college },
    { label: "Years Pro", value: `${player.yearsPro} Years` },
    { label: "Joined", value: player.joined },
  ]

  const primaryStats = [
    { label: "PPG", value: player.stats.ppg },
    { label: "APG", value: player.stats.apg },
    { label: "RPG", value: player.stats.rpg },
    { label: "SPG", value: player.stats.spg },
    { label: "BPG", value: player.stats.bpg },
    { label: "FG%", value: `${player.stats.fgPct}%` },
  ]

  const pctStats = [
    { label: "3PT%", value: `${player.stats.threePct}%` },
    { label: "FT%", value: `${player.stats.ftPct}%` },
    { label: "EFF", value: player.stats.eff },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/team" className="hover:text-foreground">
          Players
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{player.name}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">Player Profile</h1>
        <Button variant="outline" className="bg-transparent" asChild>
          <Link href={`/admin/players?edit=${player.id}`}>Edit Profile</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left: photo + bio table */}
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-start gap-4">
            <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-lg bg-secondary">
              <Image src={player.photo || "/placeholder.svg"} alt={player.name} fill className="object-cover object-top" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-2xl font-bold uppercase leading-none">{player.name}</h2>
                <span className="font-heading text-2xl font-bold text-accent">#{player.number}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{player.position}</p>
            </div>
          </div>

          <dl className="mt-5 divide-y divide-border text-sm">
            {bio.map((row) => (
              <div key={row.label} className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Right: stats + biography */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex gap-4 border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide">
            <span className="border-b-2 border-accent pb-2 text-accent">Overview</span>
            <span className="pb-2 text-muted-foreground">Statistics</span>
            <span className="pb-2 text-muted-foreground">Career</span>
            <span className="pb-2 text-muted-foreground">Media</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
                2026 / 2027 Season Stats
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {primaryStats.map((s) => (
                  <div key={s.label}>
                    <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-4">
                {pctStats.map((s) => (
                  <div key={s.label}>
                    <p className="font-heading text-2xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Biography
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{player.bio}</p>
            </Card>
          </div>

          <Button
            asChild
            className="w-full bg-accent font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/team">Back to Roster</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
