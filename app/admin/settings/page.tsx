"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  const [clubName, setClubName] = useState("Mutare Rangers Basketball Academy")
  const [email, setEmail] = useState("info@mutarerangers.co.zw")
  const [arena, setArena] = useState("Mutare Sports Arena")
  const [season, setSeason] = useState("2024 / 2025")
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage club information and preferences</p>
      </div>

      <Card className="max-w-2xl p-6">
        <h2 className="mb-4 font-heading text-lg font-bold uppercase tracking-wide text-foreground">Club Details</h2>
        <div className="grid gap-4">
          <Field label="Club Name" value={clubName} onChange={setClubName} />
          <Field label="Contact Email" value={email} onChange={setEmail} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Home Arena" value={arena} onChange={setArena} />
            <Field label="Current Season" value={season} onChange={setSeason} />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={save}>Save Changes</Button>
          {saved && <span className="text-sm text-primary">Settings saved.</span>}
        </div>
      </Card>

      <Card className="max-w-2xl p-6">
        <h2 className="mb-4 font-heading text-lg font-bold uppercase tracking-wide text-foreground">Admin Account</h2>
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-4">
          <div>
            <p className="font-medium text-foreground">Admin User</p>
            <p className="text-sm text-muted-foreground">admin@mutarerangers.co.zw</p>
          </div>
          <Button variant="secondary" size="sm">
            Change Password
          </Button>
        </div>
      </Card>
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
