import Link from "next/link"
import Image from "next/image"
import { Users, CalendarDays, Trophy, DollarSign, UserPlus, CalendarPlus, FileText, FilePlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PerformanceChart, RevenueChart } from "@/components/admin/dashboard-charts"
import { adminStats, recentActivity } from "@/lib/data"

const kpis = [
  { label: "Players", value: adminStats.players, icon: Users },
  { label: "Matches", value: adminStats.matches, icon: CalendarDays },
  { label: "Wins", value: adminStats.wins, icon: Trophy },
  { label: "Total Revenue", value: adminStats.revenue, icon: DollarSign },
]

const quickActions = [
  { label: "Add Player", icon: UserPlus, href: "/admin/players" },
  { label: "Schedule Match", icon: CalendarPlus, href: "/admin/matches" },
  { label: "Add News", icon: FilePlus, href: "/admin/news" },
  { label: "View Reports", icon: FileText, href: "/admin" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
        </div>
        <span className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium">
          Season 2026 / 2027
        </span>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="flex items-center gap-4 p-5">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <k.icon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-heading text-2xl font-bold leading-none">{k.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide">Team Performance</h2>
          <p className="mb-4 text-xs text-muted-foreground">Points scored vs allowed per month</p>
          <PerformanceChart />
        </Card>
        <Card className="p-5">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide">Revenue Overview</h2>
          <p className="mb-4 text-xs text-muted-foreground">Breakdown by source</p>
          <RevenueChart />
        </Card>
      </div>

      {/* Quick actions + activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <a.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide">Recent Activity</h2>
          <ul className="mt-4 divide-y divide-border">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <Image
                  src={a.photo || "/placeholder.svg"}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
