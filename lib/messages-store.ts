"use client"

import { useEffect, useState, useCallback } from "react"

export type ContactMessage = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  message: string
  createdAt: string // ISO string
  read: boolean
}

export async function markMessageRead(id: string, read = true) {
  await fetch("/api/messages", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, read }),
  })
}

export async function deleteMessage(id: string) {
  await fetch("/api/messages", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
}

/** React hook that returns live contact messages from Supabase. */
export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/messages", { cache: "no-store" })
      if (res.ok) {
        const data = (await res.json()) as ContactMessage[]
        setMessages(data)
      }
    } catch (err) {
      console.error("Failed to load messages", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    messages,
    loading,
    unreadCount: messages.filter((m) => !m.read).length,
    markRead: async (id: string, read = true) => {
      await markMessageRead(id, read)
      await refresh()
    },
    remove: async (id: string) => {
      await deleteMessage(id)
      await refresh()
    },
    refresh,
  }
}
