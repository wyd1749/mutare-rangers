import Image from "next/image"

export function SponsorSection() {
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="text-center font-heading text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Proudly Sponsored By
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-5 rounded-xl border border-border bg-white px-8 py-5">
            <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
              <Image
                src="/images/urban-tech-solutions-logo.png"
                alt="Urban Tech Solutions logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <p className="font-heading text-xl font-bold uppercase leading-none tracking-tight text-slate-900">
                Urban Tech Solutions
              </p>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.15em] text-blue-600">
                Smart Technology. Solid Solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
