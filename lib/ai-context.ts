// lib/ai-context.ts
import { liveMatch, matches, playByPlay, standings, programs, news, coaches, teams } from "@/lib/data"

export function getSiteContext() {
  return `
MUTARE RANGERS BASKETBALL ACADEMY SITE DATA:

[TEAMS & ROSTER]
${teams.map(t => `- Team: ${t.name} (${t.shortName}) | Description: ${t.description}`).join("\n")}
Coaches/Staff: ${coaches.map(c => `- ${c.name} (${c.role})`).join("; ")}

[LIVE MATCH]
Home: ${liveMatch.home} (${liveMatch.homeScore}), Away: ${liveMatch.away} (${liveMatch.awayScore})
Quarter: ${liveMatch.quarter}, Clock: ${liveMatch.clock}
Play-by-Play: ${playByPlay.map(p => `${p.time} - ${p.player}: ${p.action} (${p.score})`).join("; ")}

[UPCOMING MATCHES & FIXTURES]
${matches.map(m => `- ${m.home} vs ${m.away} | Date: ${m.date} ${m.time} | Venue: ${m.venue} | Category: ${m.category} | Status: ${m.status}`).join("\n")}

[LEAGUE STANDINGS]
${standings.map(s => `- Pos ${s.pos}: ${s.team} (W: ${s.w}, L: ${s.l}, Win%: ${s.pct}, Pts: ${s.pts})`).join("\n")}

[ACADEMY PROGRAMS]
${programs.map(p => `- Program: ${p.name} | Tagline: ${p.tagline} | Ages: ${p.ageRange} | Price: ${p.price} | Info: ${p.description}`).join("\n")}

[LATEST NEWS]
${news.map(n => `- Article: ${n.title} | Category: ${n.category} | Date: ${n.date} | Excerpt: ${n.excerpt}`).join("\n")}
`
}