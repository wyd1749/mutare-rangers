"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const nav = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Matches", href: "/matches" },
  { label: "Team", href: "/team" },
  { label: "Academy", href: "/academy" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
]

interface SiteHeaderProps {
  onToggleAI?: () => void
}

export function SiteHeader({ onToggleAI }: SiteHeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="absolute inset-0 -z-10">
        {/* Boosted opacity from opacity-40 to opacity-100 */}
        <Image
          src="/images/header-court-splash.png"
          alt=""
          fill
          aria-hidden
          priority
          className="object-cover object-left opacity-100"
        />
        {/* Lightened overlay from bg-background/70 to bg-background/30 */}
        <div className="absolute inset-0 bg-background/30" />
      </div>
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/rangers-logo.png"
            alt="Mutare Rangers Basketball Academy"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="hidden font-heading text-lg font-bold uppercase tracking-wide sm:block">
            Mutare <span className="text-primary">Rangers</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden bg-accent font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90 sm:inline-flex"
          >
            <Link href="/academy">Join the Club</Link>
          </Button>

          {/* GREEN & YELLOW AI ASSISTANT BUTTON (REPLACES ADMIN) */}
          <Button
            type="button"
            onClick={onToggleAI}
            className="hidden items-center gap-1.5 rounded-md bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md hover:brightness-110 border border-amber-300/40 transition-all md:inline-flex"
          >
            <Bot className="h-4 w-4 text-slate-950" />
            <span>AI Assistant</span>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            {/* AI BUTTON IN MOBILE MENU */}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onToggleAI?.()
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400 px-3 py-2.5 text-xs font-bold uppercase text-slate-950"
            >
              <Bot className="h-4 w-4" />
              <span>Ask Rangers AI</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}