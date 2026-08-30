import type { Video } from "@/lib/data"

/**
 * Converts a stored platform + url into an iframe-embeddable src.
 * Returns null if the URL can't be parsed for that platform.
 */
export function getEmbedUrl(video: Pick<Video, "platform" | "url">): string | null {
  const { platform, url } = video

  try {
    switch (platform) {
      case "youtube": {
        const id = extractYouTubeId(url)
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      case "tiktok": {
        const id = extractTikTokId(url)
        return id ? `https://www.tiktok.com/embed/v2/${id}` : null
      }
      case "facebook": {
        return `https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(
          url,
        )}&show_text=false`
      }
      case "instagram": {
        const cleaned = url.split("?")[0].replace(/\/$/, "")
        return `${cleaned}/embed`
      }
      default:
        return null
    }
  } catch {
    return null
  }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  // If they just pasted a bare ID
  if (/^[a-zA-Z0-9_-]{6,}$/.test(url.trim())) return url.trim()
  return null
}

function extractTikTokId(url: string): string | null {
  const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/)
  if (match) return match[1]
  // If they just pasted a bare numeric ID
  if (/^\d{6,}$/.test(url.trim())) return url.trim()
  return null
}

/** Human-readable platform label for badges/UI */
export const platformLabels: Record<Video["platform"], string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
}

/** Brand-ish background color per platform, used for placeholder tiles */
export const platformColors: Record<Video["platform"], string> = {
  youtube: "bg-red-600",
  tiktok: "bg-black",
  facebook: "bg-blue-600",
  instagram: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400",
}