import Link from "next/link"
import Image from "next/image"
import { AtSign, Globe, Share2, MessageCircle } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-card">
      <div className="absolute inset-0">
        {/* Set opacity to 75% for background image visibility */}
        <Image
          src="/images/footer-basketball-splash.png"
          alt=""
          fill
          aria-hidden
          className="object-cover object-right opacity-75"
        />
        {/* Minimal gradient overlays to preserve full picture brightness */}
        <div className="absolute inset-0 bg-gradient-to-r from-card/70 via-card/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/rangers-logo.png"
                alt="Mutare Rangers Basketball Academy"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="font-heading text-lg font-bold uppercase">
                Mutare <span className="text-primary">Rangers</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              Where Iron Sharpens Iron. Developing champions, building leaders and strengthening our
              community through basketball.
            </p>
            <div className="flex gap-3">
              {[AtSign, MessageCircle, Share2, Globe].map((Icon, i) => (
                <span
                  key={i}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-400/40 text-slate-200 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <FooterCol
            title="Club"
            links={[
              { label: "News", href: "/news" },
              { label: "Matches", href: "/matches" },
              { label: "Team", href: "/team" },
              { label: "Shop", href: "/shop" },
            ]}
          />
          <FooterCol
            title="Academy"
            links={[
              { label: "Programs", href: "/academy" },
              { label: "Trials", href: "/academy" },
              { label: "Contact", href: "/contact" },
              { label: "Admin", href: "/admin" },
            ]}
          />

          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              Visit Us
            </h4>
            <p className="text-sm leading-relaxed text-slate-200">
              Sakubva Community Court
              <br />
              Sakubva Beithall Road
              <br />
              Mutare, Zimbabwe
            </p>
            <p className="text-sm text-slate-200">info@mutarerangers.co.zw</p>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-slate-300">
          © {new Date().getFullYear()} Mutare Rangers Basketball Academy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-slate-200 transition-colors hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}