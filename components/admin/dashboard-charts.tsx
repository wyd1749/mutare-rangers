"use client"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { performanceData, revenueBreakdown, adminStats } from "@/lib/data"

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
        />
        <Line
          type="monotone"
          dataKey="scored"
          name="Points Scored"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--chart-1)" }}
        />
        <Line
          type="monotone"
          dataKey="allowed"
          name="Points Allowed"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--chart-2)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function RevenueChart() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueBreakdown}
              dataKey="value"
              nameKey="label"
              innerRadius={54}
              outerRadius={78}
              paddingAngle={3}
              stroke="none"
            >
              {revenueBreakdown.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
              formatter={(v: number, n: string) => [`${v}%`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-lg font-bold">{adminStats.revenue}</span>
          <span className="text-[10px] uppercase text-muted-foreground">Total</span>
        </div>
      </div>
      <ul className="flex-1 space-y-2">
        {revenueBreakdown.map((r) => (
          <li key={r.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: r.color }} />
              {r.label}
            </span>
            <span className="font-semibold">{r.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
