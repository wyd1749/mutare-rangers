// lib/ai-context.ts
import {
  liveMatch,
  matches as fallbackMatches,
  playByPlay,
  standings as fallbackStandings,
  leagues,
  programs,
  news as fallbackNews,
  coaches,
  teams,
  products,
  videos,
  adverts,
  teamStats,
  type Match,
  type Standing,
  type NewsItem,
} from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

async function loadMatches(): Promise<Match[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("matches").select("*").order("date", { ascending: true })
    if (!error && data) return data as Match[]
  }
  return fallbackMatches
}

async function loadStandings(): Promise<Standing[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("standings").select("*").order("pos", { ascending: true })
    if (!error && data) return data as Standing[]
  }
  return fallbackStandings
}

async function loadNews(): Promise<NewsItem[]> {
  const supabase = getSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.from("news").select("*").order("date", { ascending: false })
    if (!error && data) return data as NewsItem[]
  }
  return fallbackNews
}

export async function getSiteContext(): Promise<string> {
  const [liveMatches, liveStandings, liveNews] = await Promise.all([loadMatches(), loadStandings(), loadNews()])

  const standingsByLeague = leagues
    .map(({ id, label }) => {
      const rows = liveStandings.filter((s) => s.league === id)
      if (rows.length === 0) return `${label}: no standings recorded yet.`
      return `${label}:\n${rows
        .map((s) => `  Pos ${s.pos}: ${s.team} (W: ${s.w}, L: ${s.l}, Win%: ${s.pct}, Pts: ${s.pts})`)
        .join("\n")}`
    })
    .join("\n\n")

  return `
MUTARE RANGERS BASKETBALL ACADEMY — FULL SITE DATA

[CLUB OVERVIEW]
Trophies won: ${teamStats.trophies} | Registered players: ${teamStats.players} | Coaching & support staff: ${teamStats.coaches} | Fanbase: ${teamStats.fans}

[TEAMS & ROSTER STRUCTURE]
${teams.map((t) => `- ${t.name} (${t.shortName}), category: ${t.category}. ${t.description}`).join("\n")}

[COACHING STAFF]
${coaches.map((c) => `- ${c.name} — ${c.role} (${c.team})`).join("\n")}

[LIVE MATCH]
${liveMatch.home} ${liveMatch.homeScore} — ${liveMatch.awayScore} ${liveMatch.away}, ${liveMatch.quarter}, clock ${liveMatch.clock}, fouls ${liveMatch.home}: ${liveMatch.homeFouls}, ${liveMatch.away}: ${liveMatch.awayFouls}
Recent play-by-play: ${playByPlay.map((p) => `${p.time} — ${p.player}: ${p.action} (${p.score})`).join("; ")}

[FIXTURES & RESULTS]
${liveMatches
  .map(
    (m) =>
      `- ${m.home} vs ${m.away} | ${m.date} ${m.time} | Venue: ${m.venue} | Category: ${m.category} | Status: ${m.status}${
        m.homeScore != null && m.awayScore != null ? ` | Score: ${m.homeScore}-${m.awayScore}` : ""
      }`,
  )
  .join("\n")}

[LEAGUE STANDINGS — THREE SEPARATE LEAGUES: JUVENILES, WOMEN LEAGUE, MAJOR LEAGUE]
${standingsByLeague}

[ACADEMY PROGRAMS]
${programs.map((p) => `- ${p.name} (${p.ageRange}) — ${p.tagline}, ${p.price}. ${p.description}`).join("\n")}

[LATEST NEWS]
${liveNews.map((n) => `- "${n.title}" (${n.category}, ${n.date}): ${n.excerpt}`).join("\n")}

[SHOP / MERCHANDISE]
${products.map((p) => `- ${p.name} — ${p.price} (${p.category})`).join("\n")}

[VIDEOS & HIGHLIGHTS]
${videos.map((v) => `- "${v.title}" (${v.category}, ${v.platform}, ${v.date})`).join("\n")}

[SPONSORS & ADVERTS]
${adverts.filter((a) => a.active).map((a) => `- ${a.title}, sponsored by ${a.sponsor}`).join("\n")}

[SITE CREDITS]
This website was designed and developed by Tinashe J Mbanje, Senior Software Engineer at Urban Tech Solutions.
Contact for development enquiries: 078 050 1764 | tinashejmbanje@gmail.com
`
}