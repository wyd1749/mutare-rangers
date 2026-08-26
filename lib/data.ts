export type Team = {
  id: string
  name: string
  shortName: string
  category: string
  description: string
}

export const teams: Team[] = [
  {
    id: "senior-boys",
    name: "Rangers Senior Boys",
    shortName: "Senior Boys",
    category: "Senior",
    description: "The club's flagship men's team competing in the top league.",
  },
  {
    id: "women",
    name: "Rangers Women",
    shortName: "Women",
    category: "Senior",
    description: "The senior women's team representing Mutare Rangers in league competition.",
  },
  {
    id: "juveniles-boys",
    name: "Juveniles Boys",
    shortName: "Juveniles Boys",
    category: "Academy",
    description: "The academy's junior boys side, developing the club's next generation of talent.",
  },
  {
    id: "juveniles-girls",
    name: "Juveniles Girls",
    shortName: "Juveniles Girls",
    category: "Academy",
    description: "The academy's junior girls side, building fundamentals and a pathway to the Women's team.",
  },
]

export type Player = {
  id: string
  name: string
  number: number
  position: string
  group: "Guard" | "Forward" | "Center"
  team: string
  photo: string
  age?: number
  dob: string
  nationality: string
  height: string
  weight: string
  college: string
  yearsPro: number
  joined: string
  bio: string
  stats: {
    ppg: number
    apg: number
    rpg: number
    spg: number
    bpg: number
    fgPct: number
    threePct: number
    ftPct: number
    eff: number
  }
}

// NOTE: Player data used to be hardcoded here as a `players` array.
// It now lives in /data/players.json so it can be edited at runtime
// through the admin panel (see /lib/players-store.ts and /app/api/players).
//
// - In Server Components, read it with getAllPlayers()/getPlayerById()
//   from "@/lib/players-store".
// - In Client Components, fetch it from the API: fetch("/api/players").

export type Coach = {
  id: string
  name: string
  role: string
  team: string
  photo: string
}

export const coaches: Coach[] = [
  { id: "c1", name: "Coach Tendai Ncube", role: "Head Coach", team: "senior-boys", photo: "/images/player-3.png" },
  { id: "c2", name: "Coach Sarah Dube", role: "Assistant Coach", team: "senior-boys", photo: "/images/player-2.png" },
  { id: "c3", name: "Coach Michael Roberts", role: "Skills Trainer", team: "senior-boys", photo: "/images/player-1.png" },
  { id: "c4", name: "Coach Peter Chirwa", role: "Strength & Conditioning", team: "senior-boys", photo: "/images/player-4.png" },
  { id: "c5", name: "Coach Memory Chinyama", role: "Head Coach", team: "women", photo: "/images/player-2.png" },
  { id: "c6", name: "Coach Blessing Mhondiwa", role: "Assistant Coach", team: "women", photo: "/images/player-1.png" },
  { id: "c7", name: "Coach Tapiwa Nyathi", role: "Head Coach", team: "juveniles-boys", photo: "/images/player-4.png" },
  { id: "c8", name: "Coach Loveness Sithole", role: "Head Coach", team: "juveniles-girls", photo: "/images/player-3.png" },
]

export type Match = {
  id: string
  date: string
  time: string
  home: string
  away: string
  venue: string
  status: "upcoming" | "live" | "final"
  homeScore?: number
  awayScore?: number
  category: "Men" | "Women"
}

export const matches: Match[] = [
  { id: "m1", date: "May 25, 2025", time: "18:00", home: "Mutare Rangers", away: "City Hoopers", venue: "Mutare Sports Arena", status: "upcoming", category: "Men" },
  { id: "m2", date: "Jun 01, 2025", time: "18:00", home: "Harare Royals", away: "Mutare Rangers", venue: "Harare Sports Club", status: "upcoming", category: "Men" },
  { id: "m3", date: "Jun 08, 2025", time: "18:00", home: "Mutare Rangers", away: "Bulawayo Heat", venue: "Mutare Sports Arena", status: "upcoming", category: "Men" },
  { id: "m4", date: "Jun 15, 2025", time: "18:00", home: "Hoops Nation", away: "Mutare Rangers", venue: "National Indoor Arena", status: "upcoming", category: "Men" },
  { id: "m5", date: "May 28, 2025", time: "16:00", home: "Mutare Rangers Women", away: "Harare Royals Women", venue: "Mutare Sports Arena", status: "upcoming", category: "Women" },
  { id: "m6", date: "Jun 11, 2025", time: "16:00", home: "City Hoopers Women", away: "Mutare Rangers Women", venue: "City Sports Complex", status: "upcoming", category: "Women" },
]

export const liveMatch = {
  home: "Mutare Rangers",
  away: "City Hoopers",
  homeScore: 86,
  awayScore: 78,
  quarter: "Q4",
  clock: "02:34",
  homeFouls: 4,
  awayFouls: 5,
}

export type Standing = {
  pos: number
  team: string
  w: number
  l: number
  pct: string
  pts: number
}

export const standings: Standing[] = [
  { pos: 1, team: "Mutare Rangers", w: 18, l: 4, pct: ".818", pts: 40 },
  { pos: 2, team: "Harare Royals", w: 16, l: 6, pct: ".727", pts: 38 },
  { pos: 3, team: "City Hoopers", w: 15, l: 7, pct: ".682", pts: 37 },
  { pos: 4, team: "Bulawayo Heat", w: 14, l: 8, pct: ".636", pts: 36 },
  { pos: 5, team: "Hoops Nation", w: 12, l: 10, pct: ".545", pts: 34 },
]

export type NewsItem = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  image: string
  body?: string
}

export const news: NewsItem[] = [
  {
    id: "n1",
    title: "Rangers edge past City Hoopers",
    date: "May 18, 2025",
    category: "Match Report",
    excerpt: "A thrilling 86-78 win over City Hoopers keeps the Rangers on top of the league table.",
    image: "/images/hero-dunk.png",
    body: "The Mutare Rangers held off a late surge from City Hoopers to secure an 86-78 victory in front of a packed home crowd on Saturday night.\n\nRangers came out of the gate strong, building an 18-point lead by halftime behind a dominant shooting display from the backcourt. City Hoopers fought back in the third quarter, cutting the deficit to single digits, but composed free-throw shooting down the stretch sealed the win for the home side.\n\nThe result keeps Mutare Rangers firmly at the top of the league standings heading into the final stretch of the regular season. The team returns to action next weekend on the road.",
  },
  {
    id: "n2",
    title: "Academy trials for 2025 now open",
    date: "May 15, 2025",
    category: "Academy",
    excerpt: "Aspiring young players can now register for the 2025 Mutare Rangers Academy trials.",
    image: "/images/player-2.png",
    body: "Mutare Rangers Academy has officially opened registration for its 2025 trials, inviting young players from across the region to compete for a place in the club's development programs.\n\nTrials are open to players across all age groups, from U12 through Elite, and will be held over three sessions at the Rangers training facility. Coaches will be evaluating fundamentals, basketball IQ, and competitive spirit.\n\nParents and guardians can register their children through the club's contact page. Spaces are limited, and early registration is strongly encouraged as previous trial intakes have filled up quickly.",
  },
  {
    id: "n3",
    title: "Meet our new head coach",
    date: "May 10, 2025",
    category: "Club News",
    excerpt: "Coach Tendai Ncube joins the Rangers with a wealth of championship experience.",
    image: "/images/player-3.png",
    body: "Mutare Rangers are pleased to announce the appointment of Tendai Ncube as the club's new head coach, effective immediately.\n\nCoach Ncube arrives with over a decade of experience at both club and national level, having previously led sides to multiple regional championships. Known for a disciplined, defense-first system paired with an up-tempo offensive philosophy, he is expected to bring a renewed competitive edge to the roster.\n\n\"I'm excited to get to work with this talented group,\" Ncube said. \"There's a strong foundation here, and I believe we have what it takes to compete for the title this season.\"\n\nCoach Ncube will take charge of his first training session this week ahead of the club's next fixture.",
  },
  {
    id: "n4",
    title: "U16 team wins ZBA Championship",
    date: "May 12, 2025",
    category: "Academy",
    excerpt: "Our U16 squad brought home the trophy after an undefeated tournament run.",
    image: "/images/player-4.png",
    body: "The Mutare Rangers U16 Academy side capped off a perfect tournament run by winning the ZBA Championship, finishing the competition undefeated across six games.\n\nThe young squad showed remarkable composure throughout the tournament, overcoming a tough semifinal contest before dominating the final from start to finish. Several players were recognized on the all-tournament team for their standout performances.\n\nThe championship marks the Academy's continued success in developing competitive, tournament-ready talent and reflects the hard work put in by both players and coaching staff throughout the season.",
  },
  {
    id: "n5",
    title: "College scholarship for academy star",
    date: "May 05, 2025",
    category: "Academy",
    excerpt: "One of our brightest talents has earned a full scholarship to a US college program.",
    image: "/images/player-1.png",
    body: "Mutare Rangers Academy is proud to celebrate one of its own after a standout graduate earned a full basketball scholarship to a college program in the United States.\n\nHaving come through the Academy's development pathway from the U14 level, the player's growth over the past few seasons caught the attention of college scouts during a series of regional showcases. The scholarship covers tuition, accommodation, and full access to the program's athletic facilities.\n\nThis achievement highlights the strength of the Academy's coaching pathway and its ability to help talented young athletes reach the next level of their basketball careers. The club wishes the player every success in this new chapter.",
  },
]

export type Program = {
  id: string
  name: string
  tagline: string
  ageRange: string
  description: string
  price: string
  image: string
}

export const programs: Program[] = [
  { id: "u12", name: "U12 Program", tagline: "Building Fundamentals", ageRange: "Ages 8-12", description: "Introduces young players to the fundamentals of basketball in a fun, supportive environment.", price: "$40 / month", image: "/images/player-2.png" },
  { id: "u14", name: "U14 Program", tagline: "Skill Development", ageRange: "Ages 12-14", description: "Focuses on developing core skills, teamwork and basketball IQ for growing athletes.", price: "$50 / month", image: "/images/player-4.png" },
  { id: "u16", name: "U16 Program", tagline: "Competitive Training", ageRange: "Ages 14-16", description: "Intensive competitive training preparing players for league and tournament play.", price: "$65 / month", image: "/images/player-3.png" },
  { id: "elite", name: "Elite Program", tagline: "Future Stars", ageRange: "Ages 16+", description: "Elite-level coaching for the most dedicated athletes chasing professional and college careers.", price: "$90 / month", image: "/images/player-1.png" },
]

export type Product = {
  id: string
  name: string
  price: string
  image: string
  category: string
}

export const products: Product[] = [
  { id: "p1", name: "Home Jersey 2025", price: "$45", image: "/images/jersey.png", category: "Apparel" },
  { id: "p2", name: "Away Jersey 2025", price: "$45", image: "/images/jersey.png", category: "Apparel" },
  { id: "p3", name: "Training Shorts", price: "$25", image: "/images/jersey.png", category: "Apparel" },
  { id: "p4", name: "Warm-up Hoodie", price: "$55", image: "/images/jersey.png", category: "Apparel" },
]

export const teamStats = {
  trophies: 12,
  players: 24,
  coaches: 8,
  fans: "15K+",
}

export const adminStats = {
  players: 24,
  matches: 12,
  wins: 18,
  revenue: "$84,250",
}

export const revenueBreakdown = [
  { label: "Tickets", value: 45, color: "var(--chart-1)" },
  { label: "Sponsorships", value: 30, color: "var(--chart-2)" },
  { label: "Merchandise", value: 15, color: "var(--chart-3)" },
  { label: "Other", value: 10, color: "var(--chart-5)" },
]

export const performanceData = [
  { month: "Jul", scored: 72, allowed: 68 },
  { month: "Aug", scored: 78, allowed: 70 },
  { month: "Sep", scored: 74, allowed: 66 },
  { month: "Oct", scored: 85, allowed: 72 },
  { month: "Nov", scored: 80, allowed: 75 },
  { month: "Dec", scored: 88, allowed: 70 },
  { month: "Jan", scored: 82, allowed: 68 },
  { month: "Feb", scored: 90, allowed: 74 },
  { month: "Mar", scored: 86, allowed: 71 },
  { month: "Apr", scored: 92, allowed: 78 },
  { month: "May", scored: 86, allowed: 78 },
]

export const recentActivity = [
  { id: "a1", text: "New player Marcus Lee added", date: "May 18, 2025", photo: "/images/player-2.png" },
  { id: "a2", text: "Match vs City Hoopers updated", date: "May 18, 2025", photo: "/images/hero-dunk.png" },
  { id: "a3", text: "Payment of $5,000 received", date: "May 17, 2025", photo: "/images/player-1.png" },
  { id: "a4", text: "New academy registration", date: "May 17, 2025", photo: "/images/player-4.png" },
]

export const playByPlay = [
  { time: "02:35 Q4", player: "Jayden Brown", action: "2PT Jump Shot Made", score: "86 - 78" },
  { time: "02:58 Q4", player: "City Hoopers", action: "Turnover", score: "84 - 78" },
  { time: "03:20 Q4", player: "David Okoro", action: "Defensive Rebound", score: "84 - 78" },
  { time: "03:41 Q4", player: "Marcus Lee", action: "3PT Made", score: "84 - 78" },
  { time: "04:05 Q4", player: "Isaac Kone", action: "Block", score: "81 - 78" },
]
