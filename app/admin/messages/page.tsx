"use client"

import { useMemo, useState } from "react"
import { Mail, Phone, Search, Trash2, X, MailOpen, Circle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useContactMessages, type ContactMessage } from "@/lib/messages-store"

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

export default function ReceivedMessagesPage() {
  const { messages, unreadCount, markRead, remove } = useContactMessages()
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return messages.filter(
      (m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.program.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q),
    )
  }, [messages, query])

  function openMessage(m: ContactMessage) {
    setSelected(m)
    if (!m.read) markRead(m.id, true)
  }

  function handleDelete(id: string) {
    remove(id)
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Received Messages</h1>
          <p className="text-sm text-muted-foreground">
            {messages.length} total submission{messages.length === 1 ? "" : "s"} from the Contact / Join the Club form
            {unreadCount > 0 && (
              <>
                {" "}
                &middot; <span className="font-semibold text-accent">{unreadCount} unread</span>
              </>
            )}
          </p>
        </div>
      </div>

      <Card className="p-5">
        <div className="relative mb-4 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Program</th>
                <th className="pb-3 font-medium">Message</th>
                <th className="pb-3 font-medium">Received</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => openMessage(m)}
                  className="cursor-pointer transition-colors hover:bg-primary/5"
                >
                  <td className="py-3">
                    {m.read ? (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MailOpen className="h-3.5 w-3.5" /> Read
                      </span>
                    ) : (
                      <Badge variant="accent" className="gap-1">
                        <Circle className="h-2 w-2 fill-current" /> New
                      </Badge>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={m.read ? "font-medium" : "font-bold"}>
                      {m.firstName} {m.lastName}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    <div className="flex flex-col gap-0.5">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {m.email}
                      </span>
                      {m.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" /> {m.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant="muted">{m.program}</Badge>
                  </td>
                  <td className="py-3 max-w-[240px] truncate text-muted-foreground">
                    {m.message || <span className="italic">No message</span>}
                  </td>
                  <td className="py-3 whitespace-nowrap text-muted-foreground">{formatDate(m.createdAt)}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(m.id)
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                      aria-label={`Delete message from ${m.firstName} ${m.lastName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    {messages.length === 0
                      ? "No messages yet. Submissions from the Contact page will appear here."
                      : "No messages match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {selected.firstName} {selected.lastName}
                </h2>
                <p className="text-xs text-muted-foreground">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${selected.email}`} className="font-medium text-primary hover:underline">
                  {selected.email}
                </a>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selected.phone}`} className="font-medium text-primary hover:underline">
                    {selected.phone}
                  </a>
                </div>
              )}
              <div>
                <Badge variant="muted">{selected.program}</Badge>
              </div>
              <div className="rounded-md border border-border bg-secondary/40 p-3 text-muted-foreground">
                {selected.message || <span className="italic">No message provided</span>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-transparent text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(selected.id)}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
              <Button
                className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-primary/90"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
