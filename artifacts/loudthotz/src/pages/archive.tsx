import { motion } from "framer-motion";
import { Archive, Calendar, ExternalLink, ChevronRight } from "lucide-react";
import { useState } from "react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

type Post = {
  date: string;
  title: string;
  url: string;
  season?: string;
  theme?: string;
};

const archivePosts: Post[] = [
  { date: "2023-09-19", title: "POEMS READ AT OUR LAST POETRY READING ON SEPTEMBER 14, 2023", url: "https://loudthotzpoetry.blogspot.com/2023/09/poems-read-at-our-last-poetry-reading.html", season: "Season 14", theme: "" },
  { date: "2023-08-09", title: "LOUDTHOTZ POETRY OPEN READING SEASON 14 EPISODE 08 — STRINGS EVENT", url: "https://loudthotzpoetry.blogspot.com/2023/08/loudthotz-poetry-open-reading-season-14.html", season: "Season 14", theme: "Strings" },
  { date: "2023-03-03", title: 'LOUDTHOTZ POETRY OPEN READING SEASON 14 EPISODE 3 — "SLITS" EVENT', url: "https://loudthotzpoetry.blogspot.com/2023/03/loudthotz-poetry-open-reading-season-14.html", season: "Season 14", theme: "Slits" },
  { date: "2023-02-05", title: "LOUDTHOTZ POETRY OPEN READING SEASON 14 EPISODE 2 — BENT EVENT", url: "https://loudthotzpoetry.blogspot.com/2023/02/loudthotz-poetry-open-reading-season-14.html", season: "Season 14", theme: "Bent" },
  { date: "2023-01-11", title: "LOUDTHOTZ POETRY OPEN READING SEASON 14 EPISODE 1 START — YOU ARE INVITED", url: "https://loudthotzpoetry.blogspot.com/2023/01/loudthotz-poetry-open-reading-season-14.html", season: "Season 14", theme: "" },
  { date: "2022-12-04", title: "LOUDTHOTZ POETRY OPEN READING SEASON 13 EPISODE 12 — CEASE", url: "https://loudthotzpoetry.blogspot.com/2022/12/loudthotz-poetry-open-reading-season-13.html", season: "Season 13", theme: "Cease" },
  { date: "2022-10-08", title: "OCTOBER 2022 LOUDTHOTZ POETRY READING", url: "https://loudthotzpoetry.blogspot.com/2022/10/october-2022-loudthotz-poetry-reading.html", season: "Season 13", theme: "" },
  { date: "2022-08-06", title: "LOUDTHOTZ POETRY OPEN READING SEASON 13 EPISODE 8 — SEVEN", url: "https://loudthotzpoetry.blogspot.com/2022/08/our-next-poetry-reading-at-loudthotz.html", season: "Season 13", theme: "Seven" },
  { date: "2022-07-02", title: 'LOUDTHOTZ POETRY OPEN READING SEASON 13 EPISODE 7 — "GOOD TIMES"', url: "https://loudthotzpoetry.blogspot.com/2022/07/our-next-poetry-reading-loudthotz.html", season: "Season 13", theme: "Good Times" },
  { date: "2022-06-14", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 6 — CHANGES", url: "https://loudthotzpoetry.blogspot.com/2022/06/poems-read-at-loudthotz-poetry-open.html", season: "Season 12", theme: "Changes" },
  { date: "2022-06-02", title: "OUR NEXT POETRY READING ON 9TH JUNE 2022", url: "https://loudthotzpoetry.blogspot.com/2022/06/our-next-poetry-reading-on-9th-june-2022.html", season: "Season 13", theme: "" },
  { date: "2022-05-15", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 13 EPISODE 5 — SELF", url: "https://loudthotzpoetry.blogspot.com/2022/05/poems-read-at-loudthotz-poetry-open_15.html", season: "Season 13", theme: "Self" },
  { date: "2022-05-10", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 13 EPISODE 4 — GREED", url: "https://loudthotzpoetry.blogspot.com/2022/05/poems-read-at-loudthotz-poetry-open.html", season: "Season 13", theme: "Greed" },
  { date: "2022-01-27", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 13 EPISODE 1 — ALPHA", url: "https://loudthotzpoetry.blogspot.com/2022/01/poems-read-at-our-last-poetry-reading.html", season: "Season 13", theme: "Alpha" },
  { date: "2022-01-11", title: "LOUDTHOTZ POETRY OPEN READING SEASON 13 EPISODE 1 (SEASON PREMIER) — ALPHA", url: "https://loudthotzpoetry.blogspot.com/2022/01/loudthotz-poetry-open-reading-season-13.html", season: "Season 13", theme: "Alpha" },
  { date: "2021-12-11", title: "POEMS READ AT THE SEASON FINALE — LOUDTHOTZ SEASON 12 EPISODE 12 — DISTANCE", url: "https://loudthotzpoetry.blogspot.com/2021/12/poems-read-at-season-finale-of.html", season: "Season 12", theme: "Distance" },
  { date: "2021-12-08", title: "LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 12 — DISTANCE (SEASON FINALE)", url: "https://loudthotzpoetry.blogspot.com/2021/12/loudthotz-poetry-open-reading-season-12.html", season: "Season 12", theme: "Distance" },
  { date: "2021-11-16", title: "POEMS READ AT LOUDTHOTZ SEASON 12 — THEME: REASON", url: "https://loudthotzpoetry.blogspot.com/2021/11/poems-read-at-our-last-poetry-reading.html", season: "Season 12", theme: "Reason" },
  { date: "2021-11-16", title: "POEMS READ AT LOUDTHOTZ SEASON 12 EPISODE 6 — ELEGANT (OCTOBER 2021)", url: "https://loudthotzpoetry.blogspot.com/2021/11/poems-read-at-our-open-poetry-reading.html", season: "Season 12", theme: "Elegant" },
  { date: "2021-09-16", title: "LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 10 — ELEGANT", url: "https://loudthotzpoetry.blogspot.com/2021/09/our-next-poetry-reading-loudthotz.html", season: "Season 12", theme: "Elegant" },
  { date: "2021-09-11", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 9 — TREE", url: "https://loudthotzpoetry.blogspot.com/2021/09/enjoy-poems-read-at-our-last-poetry.html", season: "Season 12", theme: "Tree" },
  { date: "2021-09-06", title: "LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 09 — TREE", url: "https://loudthotzpoetry.blogspot.com/2021/09/our-next-poetry-reading-event-loudthotz.html", season: "Season 12", theme: "Tree" },
  { date: "2021-08-15", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 8 — JUNGLE", url: "https://loudthotzpoetry.blogspot.com/2021/08/poems-read-at-our-last-poetry-reading.html", season: "Season 12", theme: "Jungle" },
  { date: "2021-07-21", title: "LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 8 — JUNGLE IS ON AUGUST 12", url: "https://loudthotzpoetry.blogspot.com/2021/07/our-next-poetry-reading-event-loudthotz.html", season: "Season 12", theme: "Jungle" },
  { date: "2021-07-21", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 7 — SENT", url: "https://loudthotzpoetry.blogspot.com/2021/07/poems-read-at-our-last-poetry-reading.html", season: "Season 12", theme: "Sent" },
  { date: "2021-06-16", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 6 — THESE TIMES", url: "https://loudthotzpoetry.blogspot.com/2021/06/poems-read-at-loudthotz-poetry-open.html", season: "Season 12", theme: "These Times" },
  { date: "2021-05-21", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 5 — DRAIN", url: "https://loudthotzpoetry.blogspot.com/2021/05/enjoy-poems-read-loudthotz-poetry-open.html", season: "Season 12", theme: "Drain" },
  { date: "2021-04-11", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 4 — GAIN", url: "https://loudthotzpoetry.blogspot.com/2021/04/poems-read-at-our-last-poetry-reading.html", season: "Season 12", theme: "Gain" },
  { date: "2021-03-19", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 3 — STORM", url: "https://loudthotzpoetry.blogspot.com/2021/03/poems-read-at-our-last-poetry-reading.html", season: "Season 12", theme: "Storm" },
  { date: "2021-02-18", title: "POEMS READ AT LOUDTHOTZ POETRY OPEN READING SEASON 12 EPISODE 2 — AWAKE", url: "https://loudthotzpoetry.blogspot.com/2021/02/poems-read-at-our-last-poetry-reading.html", season: "Season 12", theme: "Awake" },
];

const allSeasons = ["All", ...Array.from(new Set(archivePosts.map(p => p.season).filter(Boolean)))];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

function formatTitle(title: string) {
  return title
    .replace(/^POEMS READ AT (OUR LAST|THE) /i, "")
    .replace(/^LOUDTHOTZ POETRY OPEN READING /i, "")
    .replace(/^OUR NEXT POETRY READING /i, "")
    .replace(/^ENJOY POEMS READ (A |AT )/i, "")
    .replace(/^ANNOUNCEMENT! - /i, "");
}

export default function ArchivePage() {
  const [selectedSeason, setSelectedSeason] = useState("All");

  const filtered = selectedSeason === "All"
    ? archivePosts
    : archivePosts.filter(p => p.season === selectedSeason);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(181,230,29,0.06),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              <Archive className="h-4 w-4 text-primary" />
              Reading History
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Event
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d2ff34]">
              Archive
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="font-serif text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            A record of every Loudthotz Poetry Open Reading — from Season 12 through to today. Browse past events, themes, and the poems they produced.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex justify-center gap-3 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-semibold">
              <Calendar className="h-4 w-4" />
              {archivePosts.length} Events
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold">
              Since 2011
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {allSeasons.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s as string)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedSeason === s
                    ? "bg-primary text-black font-semibold"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Archive List */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <motion.a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp(Math.min(i * 0.03, 0.3))}
                className="group flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all"
              >
                {/* Date column */}
                <div className="flex-shrink-0 text-right hidden sm:block min-w-[110px]">
                  <span className="text-xs text-gray-500">{formatDate(post.date)}</span>
                </div>

                <div className="flex-shrink-0 w-px bg-white/10 self-stretch hidden sm:block" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {post.season && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                        {post.season}
                      </span>
                    )}
                    {post.theme && (
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                        Theme: {post.theme}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug capitalize">
                    {formatTitle(post.title).toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                  </p>
                  <span className="text-xs text-gray-600 sm:hidden mt-1 block">{formatDate(post.date)}</span>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors shrink-0 mt-1" />
              </motion.a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 text-sm mb-4">View the full archive including earlier seasons on our blog</p>
            <a
              href="https://loudthotzpoetry.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-medium px-6 py-3 rounded-xl transition-all text-sm"
            >
              Visit Full Blog Archive
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
