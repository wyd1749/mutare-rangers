// components/ai-drawer.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Loader2, Sparkles, Trash2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Message = {
  role: "user" | "assistant"
  content: string
}

const INITIAL_WELCOME: Message = {
  role: "assistant",
  content: "Welcome to Mutare Rangers! How can I help you today with scores, academy programs, or fixtures?",
}

interface AIDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// Renders assistant replies as formatted markdown (bold, bullet/numbered lists,
// paragraph spacing, links) instead of dumping raw "**text**" and "*" characters.
function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="space-y-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="ml-4 list-disc space-y-1 marker:text-accent">{children}</ul>,
          ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1 marker:text-accent">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent/80"
            >
              {children}
            </a>
          ),
          h1: ({ children }) => <p className="font-heading font-bold uppercase tracking-wide">{children}</p>,
          h2: ({ children }) => <p className="font-heading font-bold uppercase tracking-wide">{children}</p>,
          h3: ({ children }) => <p className="font-semibold">{children}</p>,
          code: ({ children }) => (
            <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-[11px]">{children}</code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function AIDrawer({ isOpen, onClose }: AIDrawerProps) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, isOpen])

  const handleClearHistory = () => {
    setMessages([INITIAL_WELCOME])
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput("")

    const currentMessages: Message[] = [...messages, { role: "user", content: userMsg }]
    const recentHistory = currentMessages.length > 5 
      ? [INITIAL_WELCOME, ...currentMessages.slice(-4)] 
      : currentMessages

    setMessages(recentHistory)
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentHistory }),
      })

      const data = await res.json()
      
      const updatedMessages: Message[] = [...recentHistory, { role: "assistant", content: data.reply }]
      const trimmedFinal = updatedMessages.length > 5 
        ? [INITIAL_WELCOME, ...updatedMessages.slice(-4)] 
        : updatedMessages

      setMessages(trimmedFinal)
    } catch {
      setMessages([
        ...recentHistory,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          /* CHANGED TO right-4 TO MOVE TO OPPOSITE SIDE */
          className="fixed top-16 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md"
        >
          <Card className="flex h-[480px] flex-col overflow-hidden border-border/80 bg-card/95 backdrop-blur-md shadow-2xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-amber-400 text-slate-950 font-bold">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wide">Rangers AI Assistant</h3>
                  <p className="text-[10px] text-muted-foreground">Ask about scores, schedules & academy</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground" 
                  onClick={handleClearHistory}
                  title="Reset chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent text-accent-foreground font-medium rounded-br-none"
                        : "bg-muted/80 text-foreground border border-border/60 rounded-bl-none"
                    }`}
                  >
                    {m.role === "assistant" ? <MarkdownMessage content={m.content} /> : m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-muted/80 px-3.5 py-2 text-xs border border-border/60 rounded-bl-none">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                    <span className="text-muted-foreground">Checking team stats...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex shrink-0 items-center gap-2 border-t border-border/60 p-3 bg-card">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-md border border-border/80 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Button type="submit" size="sm" disabled={loading || !input.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}