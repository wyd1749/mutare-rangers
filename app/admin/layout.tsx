import type React from "react"
import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
