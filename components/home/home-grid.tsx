import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { news, standings } from "@/lib/data"

export function HomeGrid() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home-grid-bg.png"
          alt=""
          fill
          aria-hidden
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest news */}
        <Card className="p-5 lg:col-span-1">
          <SectionTitle title="Latest News" href="/news" />
          <ul className="mt-4 divide-y divide-border">
            {news.slice(0, 3).map((n) => (
              <li key={n.id}>
                <Link href={`/news/${n.id}`} className="group flex items-center gap-3 py-3">
                  <Image
                    src={n.image || "/placeholder.svg"}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-snug group-hover:text-accent">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.date}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* League standings */}
        <Card className="p-5 lg:col-span-1">
          <SectionTitle title="League Standings" href="/matches" />
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Team</th>
                <th className="pb-2 text-center font-medium">W</th>
                <th className="pb-2 text-center font-medium">L</th>
                <th className="pb-2 text-center font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s) => {
                const isRangers = s.team === "Mutare Rangers"
                return (
                  <tr
                    key={s.pos}
                    className={isRangers ? "text-primary" : "text-foreground"}
                  >
                    <td className="py-2 font-heading font-bold">{s.pos}</td>
                    <td className="py-2 font-medium">{s.team}</td>
                    <td className="py-2 text-center text-muted-foreground">{s.w}</td>
                    <td className="py-2 text-center text-muted-foreground">{s.l}</td>
                    <td className="py-2 text-center font-heading font-bold">{s.pts}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>

        {/* Shop teaser */}
        <Card className="relative flex flex-col justify-between overflow-hidden lg:col-span-1">
          <div className="absolute inset-0">
            <Image src="/images/jersey.png" alt="" fill className="object-contain object-right p-4 opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
          </div>
          <div className="relative p-6">
            <p className="font-heading text-3xl font-bold uppercase leading-none">
              Wear
              <br />
              The Pride
            </p>
            <p className="mt-2 max-w-[60%] text-sm text-muted-foreground">
              Gear up with official Mutare Rangers kit and merchandise.
            </p>
          </div>
          <div className="relative p-6 pt-0">
            <Button
              asChild
              className="bg-accent font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </Card>
      </div>
      </div>
    </section>
  )
}

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-lg font-bold uppercase tracking-wide">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
      >
        View All <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
