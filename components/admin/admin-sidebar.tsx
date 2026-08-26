"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Newspaper,
  GraduationCap,
  ShoppingBag,
  Home,
  Inbox,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useContactMessages } from "@/lib/messages-store"

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Players", href: "/admin/players", icon: Users },
  { label: "Matches & Standings", href: "/admin/matches", icon: CalendarDays },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Academy", href: "/admin/academy", icon: GraduationCap },
  { label: "Shop", href: "/admin/shop", icon: ShoppingBag },
  { label: "Received Messages", href: "/admin/messages", icon: Inbox },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { unreadCount } = useContactMessages()

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <Image
          src="/images/rangers-logo.png"
          alt="Mutare Rangers"
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
        />
        <span className="font-heading text-sm font-bold uppercase leading-tight">
          Rangers
          <br />
          <span className="text-[10px] font-medium text-muted-foreground">Admin Panel</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <l.icon className="h-4 w-4" />
              <span className="flex-1">{l.label}</span>
              {l.href === "/admin/messages" && unreadCount > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                    active ? "bg-primary-foreground text-primary" : "bg-accent text-accent-foreground",
                  )}
                >
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}

export function AdminMobileNav() {
  const pathname = usePathname()
  const { unreadCount } = useContactMessages()
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "relative flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold uppercase",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <l.icon className="h-4 w-4" />
            {l.label}
            {l.href === "/admin/messages" && unreadCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
