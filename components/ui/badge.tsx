import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeProps = React.ComponentProps<"span"> & {
  variant?: "default" | "accent" | "outline" | "muted"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    outline: "border border-border text-muted-foreground",
    muted: "bg-secondary text-secondary-foreground",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
