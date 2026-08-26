"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { HeroSection } from "@/components/home/hero-section"
import { SponsorSection } from "@/components/home/sponsor-section"
import { HomeGrid } from "@/components/home/home-grid"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { programs } from "@/lib/data"

// Container animation config for staggered child reveals
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

// Item animation config for individual cards
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Sponsor Section with Fade-Up Scroll Effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SponsorSection />
      </motion.div>

      {/* Home Grid with Slide Effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <HomeGrid />
      </motion.div>

      {/* Academy Programs Teaser */}
      <section className="relative overflow-hidden border-y border-border/60">
        {/* Background Image Container */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/mutare-rangers-bg.png"
            alt=""
            fill
            aria-hidden
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/85" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          {/* Header Row Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <Badge variant="accent">Academy</Badge>
              <h2 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight">
                Development Programs
              </h2>
              <p className="mt-1 max-w-xl text-muted-foreground">
                From first dribbles to elite competition, we have a pathway for every young athlete.
              </p>
            </div>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/academy">
                All Programs <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Staggered Program Cards Reveal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {programs.map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <Card className="group overflow-hidden p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={p.image || "/placeholder.svg"}
                      alt={p.name}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 font-heading text-xl font-bold uppercase">
                      {p.name}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-accent">{p.tagline}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.ageRange}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section Slide-In */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
      >
        <Card className="relative overflow-hidden border-primary/30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-card to-card" />
          <div className="relative flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Ready to join the Rangers family?
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Register for our 2026/27 academy trials and take the first step toward becoming a champion.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-accent font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/contact">Register Now</Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </>
  )
}