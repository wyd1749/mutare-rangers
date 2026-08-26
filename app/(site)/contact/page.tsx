"use client"

import { useState } from "react"
import Image from "next/image"
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const details = [
  { icon: MapPin, label: "Address", value: "Sakubva Community Court, Sakubva Beithall Road, Mutare" },
  { icon: Phone, label: "Phone", value: "+263 780 501 764" },
  { icon: Mail, label: "Email", value: "info@mutarerangers.co.zw" },
]

const programs = ["U12 Program", "U14 Program", "U16 Program", "Elite Program"]

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  program: programs[0],
  message: "",
}

export default function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("Please fill in your first name, last name and email.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          program: form.program,
          message: form.message.trim(),
        }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      setSubmitted(true)
      setForm(initialForm)
    } catch (err) {
      console.error(err)
      setError("Something went wrong sending your message. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* BACKGROUND IMAGE CONTAINER */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/news-bg.png"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover object-center"
        />
        {/* Dark overlay to keep forms & text easily readable */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px]" />
      </div>

      {/* PAGE CONTENT */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Badge variant="accent">Contact</Badge>
        <h1 className="mt-3 font-heading text-4xl font-bold uppercase tracking-tight">Get In Touch</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Have a question about our academy, matches or membership? Register your interest and our team
          will be in touch.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* CONTACT INFO DETAILS */}
          <div className="space-y-4">
            {details.map((d) => (
              <Card key={d.label} className="flex items-start gap-3 p-4 border-border/80 bg-card/80 backdrop-blur-md">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <d.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{d.label}</p>
                  <p className="text-sm font-medium">{d.value}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* FORM / SUCCESS MESSAGE CARD */}
          <Card className="p-6 lg:col-span-2 border-border/80 bg-card/80 backdrop-blur-md">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h2 className="font-heading text-xl font-bold uppercase tracking-tight">Message Sent</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Thanks for reaching out. Our team has received your details and will be in touch shortly.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 bg-transparent"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="First Name"
                  placeholder="Jayden"
                  value={form.firstName}
                  onChange={(v) => update("firstName", v)}
                />
                <Field
                  label="Last Name"
                  placeholder="Brown"
                  value={form.lastName}
                  onChange={(v) => update("lastName", v)}
                />
                <Field
                  label="Email"
                  placeholder="you@email.com"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                />
                <Field
                  label="Phone"
                  placeholder="+263 ..."
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                />
                <div className="sm:col-span-2">
                  <Label>Program of Interest</Label>
                  <select
                    value={form.program}
                    onChange={(e) => update("program", e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {programs.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Message</Label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                {error && <p className="sm:col-span-2 text-sm font-medium text-destructive">{error}</p>}
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</label>
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}