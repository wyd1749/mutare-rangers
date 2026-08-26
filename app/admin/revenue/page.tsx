import { adminStats } from "@/lib/data"
import { Card } from "@/components/ui/card"
import { RevenueChart } from "@/components/admin/dashboard-charts"

const transactions = [
  { id: "t1", desc: "Season ticket sales", type: "Tickets", amount: "+$5,000", date: "May 17, 2025" },
  { id: "t2", desc: "Sponsorship — EcoBank", type: "Sponsorship", amount: "+$12,000", date: "May 14, 2025" },
  { id: "t3", desc: "Merchandise — Jersey batch", type: "Merchandise", amount: "+$2,340", date: "May 12, 2025" },
  { id: "t4", desc: "Academy fees — May", type: "Academy", amount: "+$3,600", date: "May 10, 2025" },
  { id: "t5", desc: "Arena rental", type: "Expense", amount: "-$1,800", date: "May 08, 2025" },
]

export default function AdminRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">Revenue</h1>
        <p className="text-sm text-muted-foreground">Financial overview for the 2024 / 2025 season</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: adminStats.revenue },
          { label: "Tickets", value: "$37,900" },
          { label: "Sponsorships", value: "$25,275" },
          { label: "Merchandise", value: "$12,600" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-heading text-lg font-bold uppercase tracking-wide text-foreground">
            Revenue Breakdown
          </h2>
          <RevenueChart />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-heading text-lg font-bold uppercase tracking-wide text-foreground">
            Recent Transactions
          </h2>
          <div className="divide-y divide-border">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.type} · {t.date}
                  </p>
                </div>
                <span
                  className={`font-heading text-sm font-bold ${
                    t.amount.startsWith("-") ? "text-destructive" : "text-primary"
                  }`}
                >
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
