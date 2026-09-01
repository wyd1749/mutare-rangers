"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { videos as initialVideos, adverts as initialAdverts, type Video, type Advert } from "@/lib/data"
import { getEmbedUrl, platformLabels, platformColors } from "@/lib/video-embed"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function WatchPage() {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [adverts, setAdverts] = useState<Advert[]>(initialAdverts)
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch("/api/videos", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/adverts", { cache: "no-store" }).then((res) => res.json()),
    ])
      .then(([videosData, advertsData]: [Video[], Advert[]]) => {
        if (cancelled) return
        if (Array.isArray(videosData)) setVideos(videosData)
        if (Array.isArray(advertsData)) setAdverts(advertsData.filter((a) => a.active))
      })
      .catch((err) => console.error("Failed to load watch page data", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/images/news-bg.png"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover object-center opacity-100 brightness-110"
        />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Badge variant="accent">Watch</Badge>
          <h1 className="mt-3 font-heading text-4xl font-bold uppercase tracking-tight">Watch & Highlights</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Catch up on match highlights, interviews and livestreams from Mutare Rangers — on YouTube, TikTok,
            Facebook and Instagram.
          </p>
        </motion.div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className={`w-full ${activeVideo.platform === "tiktok" ? "max-w-sm" : "max-w-4xl"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <VideoEmbed video={activeVideo} />
              <p className="mt-3 font-heading text-lg font-bold text-foreground">{activeVideo.title}</p>
              <button
                onClick={() => setActiveVideo(null)}
                className="mt-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Video Grid */}
        {loading ? (
          <div className="mt-8 py-10 text-center text-sm text-muted-foreground">Loading videos...</div>
        ) : videos.length === 0 ? (
          <Card className="mt-8 border-border/40 bg-card/60 p-8 text-center text-sm text-muted-foreground">
            No videos yet — check back soon.
          </Card>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {videos.map((v) => (
              <motion.div key={v.id} variants={itemVariants}>
                <button onClick={() => setActiveVideo(v)} className="group block w-full text-left">
                  <Card className="overflow-hidden p-0 border-border/40 bg-card/60 backdrop-blur-md transition-all hover:border-accent/50">
                    <div className="relative aspect-video overflow-hidden bg-secondary/50">
                      <VideoThumbnail video={v} />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Play className="h-6 w-6 fill-current" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{v.category}</Badge>
                        <Badge variant="outline">{platformLabels[v.platform]}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-snug group-hover:text-accent">{v.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{v.date}</p>
                    </div>
                  </Card>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Adverts Section */}
        {adverts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-14"
          >
            <h2 className="font-heading text-lg font-bold uppercase tracking-wide">Our Sponsors</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {adverts.map((a) => (
                <Link key={a.id} href={a.link || "#"} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="overflow-hidden p-0 border-border/40 bg-card/60 backdrop-blur-md transition-all hover:border-accent/50">
                    <div className="relative h-40 overflow-hidden bg-secondary/50">
                      <Image
                        src={a.image || "/placeholder.svg"}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{a.sponsor}</p>
                      <p className="mt-1 text-sm font-semibold group-hover:text-accent">{a.title}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function VideoThumbnail({ video }: { video: Video }) {
  if (video.platform === "youtube") {
    const id = video.url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{6,})/)?.[1]
    if (id) {
      return (
        <Image
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )
    }
  }

  // Branded placeholder tile for platforms without an easy thumbnail API
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${platformColors[video.platform]} text-white`}
    >
      <span className="font-heading text-sm font-bold uppercase tracking-widest opacity-90">
        {platformLabels[video.platform]}
      </span>
    </div>
  )
}

function VideoEmbed({ video }: { video: Video }) {
  const src = getEmbedUrl(video)

  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-card p-6 text-center text-sm text-muted-foreground">
        Couldn't load this video's embed.{" "}
        <Link href={video.url} target="_blank" className="ml-1 text-accent hover:underline">
          Watch on {platformLabels[video.platform]}
        </Link>
      </div>
    )
  }

  const isTikTok = video.platform === "tiktok"

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${isTikTok ? "aspect-[9/16]" : "aspect-video"}`}>
      <iframe
        src={src}
        title={video.title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}