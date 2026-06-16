import { motion } from "framer-motion";
import { Archive, Calendar, Mic2, ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useLivestreamSessions, useEvents } from "@/lib/firestore";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

type StaticSession = {
  date: string;
  title: string;
  season: string;
  theme: string;
};

const staticSessions: StaticSession[] = [
  { date: "2023-09-19", title: "Poems Read at Our Last Poetry Reading — September 14, 2023", season: "Season 14", theme: "" },
  { date: "2023-08-09", title: "Season 14 Episode 08 — Strings", season: "Season 14", theme: "Strings" },
  { date: "2023-03-03", title: "Season 14 Episode 03 — Slits", season: "Season 14", theme: "Slits" },
  { date: "2023-02-05", title: "Season 14 Episode 02 — Bent", season: "Season 14", theme: "Bent" },
  { date: "2023-01-11", title: "Season 14 Episode 01 — Season Premier", season: "Season 14", theme: "" },
  { date: "2022-12-04", title: "Season 13 Episode 12 — Cease", season: "Season 13", theme: "Cease" },
  { date: "2022-10-08", title: "October 2022 Open Reading", season: "Season 13", theme: "" },
  { date: "2022-08-06", title: "Season 13 Episode 08 — Seven", season: "Season 13", theme: "Seven" },
  { date: "2022-07-02", title: "Season 13 Episode 07 — Good Times", season: "Season 13", theme: "Good Times" },
  { date: "2022-06-14", title: "Season 12 Episode 06 — Changes (Poems Read)", season: "Season 12", theme: "Changes" },
  { date: "2022-06-02", title: "Next Reading — June 9, 2022", season: "Season 13", theme: "" },
  { date: "2022-05-15", title: "Season 13 Episode 05 — Self (Poems Read)", season: "Season 13", theme: "Self" },
  { date: "2022-05-10", title: "Season 13 Episode 04 — Greed (Poems Read)", season: "Season 13", theme: "Greed" },
  { date: "2022-01-27", title: "Season 13 Episode 01 — Alpha (Poems Read)", season: "Season 13", theme: "Alpha" },
  { date: "2022-01-11", title: "Season 13 Episode 01 — Alpha (Season Premier)", season: "Season 13", theme: "Alpha" },
  { date: "2021-12-11", title: "Season 12 Episode 12 — Distance (Poems Read)", season: "Season 12", theme: "Distance" },
  { date: "2021-12-08", title: "Season 12 Episode 12 — Distance (Season Finale)", season: "Season 12", theme: "Distance" },
  { date: "2021-11-16", title: "Season 12 — Reason (Poems Read)", season: "Season 12", theme: "Reason" },
  { date: "2021-11-16", title: "Season 12 Episode 06 — Elegant (October 2021, Poems Read)", season: "Season 12", theme: "Elegant" },
  { date: "2021-09-16", title: "Season 12 Episode 10 — Elegant", season: "Season 12", theme: "Elegant" },
  { date: "2021-09-11", title: "Season 12 Episode 09 — Tree (Poems Read)", season: "Season 12", theme: "Tree" },
  { date: "2021-09-06", title: "Season 12 Episode 09 — Tree", season: "Season 12", theme: "Tree" },
  { date: "2021-08-15", title: "Season 12 Episode 08 — Jungle (Poems Read)", season: "Season 12", theme: "Jungle" },
  { date: "2021-07-21", title: "Season 12 Episode 08 — Jungle (August 12)", season: "Season 12", theme: "Jungle" },
  { date: "2021-07-21", title: "Season 12 Episode 07 — Sent (Poems Read)", season: "Season 12", theme: "Sent" },
  { date: "2021-06-16", title: "Season 12 Episode 06 — These Times (Poems Read)", season: "Season 12", theme: "These Times" },
  { date: "2021-05-21", title: "Season 12 Episode 05 — Drain (Poems Read)", season: "Season 12", theme: "Drain" },
  { date: "2021-04-11", title: "Season 12 Episode 04 — Gain (Poems Read)", season: "Season 12", theme: "Gain" },
  { date: "2021-03-19", title: "Season 12 Episode 03 — Storm (Poems Read)", season: "Season 12", theme: "Storm" },
  { date: "2021-02-18", title: "Season 12 Episode 02 — Awake (Poems Read)", season: "Season 12", theme: "Awake" },
];

const themeColors: Record<string, string> = {
  Strings: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Slits: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Bent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Cease: "text-secondary bg-secondary/10 border-secondary/20",
  Seven: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Good Times": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Changes: "text-primary bg-primary/10 border-primary/20",
  Self: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Greed: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Alpha: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Distance: "text-secondary bg-secondary/10 border-secondary/20",
  Reason: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Elegant: "text-primary bg-primary/10 border-primary/20",
  Tree: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Jungle: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Sent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "These Times": "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Drain: "text-secondary bg-secondary/10 border-secondary/20",
  Gain: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Storm: "text-primary bg-primary/10 border-primary/20",
  Awake: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "Kinship & Brotherhood": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "Diaspora & Identity": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Womanhood & Power": "text-rose-400 bg-rose-500/10 border-rose-500/20",
  "Urban Africa": "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

type DisplaySession = {
  key: string;
  date: string;
  title: string;
  season: string;
  theme: string;
  recordingUrl?: string;
  blogUrl?: string;
  description?: string;
  source?: "event" | "session" | "static";
};

export default function ArchivePage() {
  const { data: firestoreSessions, loading: sessionsLoading } = useLivestreamSessions();
  const { data: allEvents, loading: eventsLoading } = useEvents();
  const [selectedSeason, setSelectedSeason] = useState("All");

  const loading = sessionsLoading || eventsLoading;
  const now = new Date();

  /* Past events from the events collection (date already passed) */
  const pastEvents = allEvents.filter((e) => new Date(e.date) <= now);

  const eventDisplayed: DisplaySession[] = pastEvents.map((e) => ({
    key: `event-${e.id}`,
    date: e.date,
    title: e.title,
    season: e.season ?? "",
    theme: e.theme ?? "",
    recordingUrl: e.youtubeUrl,
    blogUrl: e.blogUrl,
    description: e.description,
    source: "event",
  }));

  const sessionDisplayed: DisplaySession[] = firestoreSessions.map((s) => ({
    key: s.id,
    date: s.date,
    title: s.title,
    season: s.season,
    theme: s.theme,
    recordingUrl: s.recordingUrl,
    blogUrl: s.blogUrl,
    description: s.description,
    source: "session",
  }));

  const staticDisplayed: DisplaySession[] = staticSessions.map((s) => ({
    key: `${s.date}-${s.title}`,
    date: s.date,
    title: s.title,
    season: s.season,
    theme: s.theme,
    source: "static",
  }));

  /* Merge: if Firestore has any data, use Firestore + events; always append static as historical base */
  const hasFirestoreData = firestoreSessions.length > 0 || pastEvents.length > 0;

  /* Deduplicate by normalised title+date in case event and session overlap */
  const seen = new Set<string>();
  const allSessions: DisplaySession[] = [
    ...eventDisplayed,
    ...sessionDisplayed,
    ...staticDisplayed,
  ]
    .filter((s) => {
      if (!hasFirestoreData && s.source !== "static") return false;
      const key = `${s.date.slice(0, 10)}-${s.title.toLowerCase().trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allSeasons = ["All", ...Array.from(new Set(allSessions.map((s) => s.season).filter(Boolean)))];

  const filtered = selectedSeason === "All"
    ? allSessions
    : allSessions.filter((s) => s.season === selectedSeason);

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
            A record of every Loudthotz Poetry Open Reading — from Season 12 through to today. Browse past events by season and theme.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex justify-center gap-3 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-semibold">
              <Calendar className="h-4 w-4" />
              {loading ? "…" : allSessions.length} Sessions
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold">
              Since 2021
            </div>
          </motion.div>
        </div>
      </section>

      {/* Season filter */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {allSeasons.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
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

      {/* Session list */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((session, i) => {
                const link = session.recordingUrl || session.blogUrl;
                const inner = (
                  <motion.div
                    {...fadeUp(Math.min(i * 0.03, 0.3))}
                    className={`flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl transition-all ${
                      link ? "hover:border-primary/20 hover:bg-white/[0.04] cursor-pointer group" : ""
                    }`}
                  >
                    {/* Date column */}
                    <div className="flex-shrink-0 text-right hidden sm:block min-w-[110px]">
                      <span className="text-xs text-gray-500">{formatDate(session.date)}</span>
                    </div>
                    <div className="flex-shrink-0 w-px bg-white/10 self-stretch hidden sm:block" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {session.season && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                            {session.season}
                          </span>
                        )}
                        {session.theme && (
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${themeColors[session.theme] ?? "text-gray-400 bg-white/5 border-white/10"}`}>
                            {session.theme}
                          </span>
                        )}
                        {session.recordingUrl && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Play className="h-2.5 w-2.5" /> Recording
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 leading-snug">{session.title}</p>
                      {session.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{session.description}</p>
                      )}
                      <span className="text-xs text-gray-600 sm:hidden mt-1 block">{formatDate(session.date)}</span>
                    </div>

                    {/* Link icon */}
                    {link && (
                      <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </motion.div>
                );

                return link ? (
                  <a key={session.key} href={link} target="_blank" rel="noopener noreferrer" className="block">
                    {inner}
                  </a>
                ) : (
                  <div key={session.key}>{inner}</div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-600">
                  <Archive className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No sessions found for this season.</p>
                </div>
              )}
            </div>
          )}

          {/* CTA to live sessions page */}
          <motion.div {...fadeUp(0.3)} className="mt-12 text-center rounded-2xl border border-white/5 bg-white/[0.02] p-8">
            <Mic2 className="h-7 w-7 text-primary mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-white mb-2">Watch Past Recordings</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
              Some sessions have video recordings available. Visit the Live stage to browse the sessions archive with replay links.
            </p>
            <Link
              href="/live"
              className="inline-flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all"
            >
              <Mic2 className="h-4 w-4" />
              Go to Live Stage &amp; Sessions
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
