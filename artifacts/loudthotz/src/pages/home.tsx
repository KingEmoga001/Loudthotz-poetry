import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  useFeaturedPoems,
  useLivestreamStatus,
  useLivestreamSessions,
  useSiteStats,
  useHeroImages,
  useSiteSettings,
} from "@/lib/firestore";

import {
  Info, Calendar, Users, Globe2, ArrowRight, Star,
  Mic2, PlayCircle, ChevronRight, BookOpen, ChevronLeft, ImageOff,
} from "lucide-react";

import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";

function getYouTubeEmbedUrl(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&\s]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : "";
}

/* ---------- helpers ---------- */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= Math.round(value) ? "text-amber-400 fill-amber-400" : "text-gray-600"}`}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">{value.toFixed(1)}</span>
    </div>
  );
}

/* ---------- Hero Carousel ---------- */
function HeroCarousel() {
  const { data: images } = useHeroImages();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length, paused]);

  const hasImages = images.length > 0;
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const safeCurrent = Math.min(current, Math.max(0, images.length - 1));

  /* No images yet — show a branded placeholder */
  if (!hasImages) {
    return (
      <div className="relative w-full h-[60vh] min-h-[360px] flex items-center justify-center bg-gradient-to-br from-[#0e1208] via-[#111a08] to-[#090b06] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(181,230,29,0.06),transparent)]" />
        <div className="relative text-center px-6">
          <ImageOff className="h-10 w-10 text-primary/30 mx-auto mb-4" />
          <p className="text-white/40 text-sm font-medium">No carousel images yet</p>
          <p className="text-white/20 text-xs mt-1">Add images in the Admin → Hero Carousel panel</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[60vh] min-h-[360px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={images[safeCurrent]?.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={images[safeCurrent]?.url}
            alt={images[safeCurrent]?.caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Caption */}
      {images[safeCurrent]?.caption && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center px-4">
          <p className="text-xs text-white/70 font-medium tracking-wide drop-shadow">{images[safeCurrent].caption}</p>
          {images[safeCurrent].credit && (
            <p className="text-[10px] text-white/50 mt-0.5">📷 {images[safeCurrent].credit}</p>
          )}
        </div>
      )}

      {/* Arrows — only when multiple slides */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white/70 hover:text-white transition-all backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white/70 hover:text-white transition-all backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === safeCurrent ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- page ---------- */
const DEFAULT_FEATURED_VIDEO = "https://youtu.be/-UTQE47uNIY";

export default function Home() {
  const stats = useSiteStats();
  const statsLoading = false;
  const { data: featuredPoems, loading: poemsLoading } = useFeaturedPoems();
  const { data: liveStatus } = useLivestreamStatus();
  const { data: sessions } = useLivestreamSessions();
  const { data: settings } = useSiteSettings();

  const featuredVideoEmbedUrl = getYouTubeEmbedUrl(
    settings?.featuredVideoUrl || DEFAULT_FEATURED_VIDEO
  );

  const pastSessions = sessions.slice(0, 3);

  return (
    <div className="min-h-screen">

      {/* ═══════════════════════════════════════════════
          HERO CAROUSEL — full-width image at the top
      ═══════════════════════════════════════════════ */}
      <HeroCarousel />

      {/* ═══════════════════════════════════════════════
          HERO TEXT — headline, subtext, CTAs, stats
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(181,230,29,0.07),transparent)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

          {/* Two-col: text left, video right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text content */}
            <motion.div variants={stagger} initial="initial" animate="animate">
              {/* Alignment notice badge */}
              <motion.div {...fadeUp(0)} className="flex justify-start mb-8">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-gray-300 backdrop-blur-sm">
                  <Info className="h-3.5 w-3.5 text-secondary shrink-0" />
                  Institutional Alignment Notice
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1 {...fadeUp(0.08)} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
                Where Words Ignite
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d2ff34]">
                  Loud Thoughts
                </span>
              </motion.h1>

              {/* Sub-text */}
              <motion.p {...fadeUp(0.16)} className="font-serif text-lg text-gray-400 leading-relaxed mb-4 max-w-xl">
                Formerly managed under the{" "}
                <span className="text-gray-200 font-semibold">Independent Poets Concerns</span>,
                Loudthotz Poetry is now proudly hosted as an official event and literary vehicle under the{" "}
                <span className="text-secondary font-semibold">Naija Art Initiative</span>. We continue to
                elevate literary culture across the continent.
              </motion.p>

              {/* Stat badges */}
              <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-3 mt-8 mb-10">
                <span className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Monthly Open Readings
                </span>
                <span className="flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-xl text-sm font-medium">
                  <Users className="h-4 w-4" />
                  {`${(stats?.totalCommunityVoices ?? stats?.totalPoets ?? 0).toLocaleString()}+`} Community Voices
                </span>
                <span className="flex items-center gap-2 bg-white/5 text-gray-300 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium">
                  <Globe2 className="h-4 w-4" />
                  Global Distribution
                </span>
              </motion.div>

              {/* CTAs */}
              <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row items-start gap-3">
                <Link
                  href="/poems"
                  className="flex items-center gap-2 bg-primary text-black font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 text-sm"
                >
                  <BookOpen className="h-4 w-4" />
                  Read the Gallery
                </Link>
                <Link
                  href="/submit"
                  className="flex items-center gap-2 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-medium px-6 py-3 rounded-xl transition-all text-sm"
                >
                  Submit a Poem
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — featured video */}
            {featuredVideoEmbedUrl && (
              <motion.div {...fadeUp(0.2)} className="w-full">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black aspect-video">
                  <iframe
                    src={featuredVideoEmbedUrl}
                    title="Featured video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <p className="text-[11px] text-gray-600 text-center mt-3 uppercase tracking-widest font-semibold">Featured Session</p>
              </motion.div>
            )}
          </div>

          {/* Stats row */}
          {!statsLoading && (
            <motion.div
              {...fadeUp(0.36)}
              className="grid grid-cols-2 md:grid-cols-4 gap-px mt-12 bg-white/5 rounded-2xl overflow-hidden border border-white/5"
            >
              {[
                { label: "Poems Published", value: stats?.totalPoems ?? 0 },
                { label: "Featured Poets", value: stats?.totalPoets ?? 0 },
                { label: "Countries", value: stats?.totalCountries ?? 0 },
                { label: "Live Sessions", value: stats?.totalSessions ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#090b06] px-6 py-5 text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">{label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LIVESTREAM / PREVIOUS SESSIONS
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/5 bg-[#070906] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Stage & Screen</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Live Readings</h2>
              <p className="text-gray-400 font-serif text-base mt-2">
                Monthly open-mic poetry sessions — streamed and archived.
              </p>
            </div>
            <Link href="/live" className="hidden md:flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors shrink-0">
              Enter stage <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Main stage card */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/8 bg-black relative group">
              <div className="aspect-video flex flex-col items-center justify-center relative bg-gradient-to-tr from-[#0c0e09] via-[#111408] to-[#0c0e09]">
                {liveStatus?.isLive && liveStatus.embedUrl ? (
                  <iframe
                    src={liveStatus.embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,230,29,0.04),transparent_70%)]" />

                    {/* Pulsing mic */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse" />
                      <div className="relative h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Mic2 className="h-7 w-7 text-primary" />
                      </div>
                    </div>

                    <p className="font-display text-lg font-bold text-white/60 mb-1">
                      {liveStatus?.title ?? "Loudthotz Virtual Open Readings"}
                    </p>
                    <p className="text-xs text-gray-500 font-light">
                      {liveStatus?.scheduledAt
                        ? `Next session: ${new Date(liveStatus.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                        : "No live session currently active"}
                    </p>

                    {/* Soundwave bars */}
                    <div className="flex items-end gap-1 h-6 mt-5 opacity-30">
                      {[4, 6, 8, 5, 7, 3, 9, 6, 4, 8].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary rounded-full animate-pulse"
                          style={{ height: `${h * 3}px`, animationDelay: `${i * 80}ms` }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Live badge */}
                {liveStatus?.isLive && (
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-red-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      Live
                    </span>
                    {(liveStatus.viewerCount ?? 0) > 0 && (
                      <span className="flex items-center gap-1 bg-black/60 backdrop-blur text-gray-300 text-[10px] px-2.5 py-1 rounded-full border border-white/10">
                        <Users className="h-3 w-3 text-secondary" />
                        {liveStatus.viewerCount}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-white/5 bg-[#0c0e09]">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{liveStatus?.season ?? "Season 14"} · Ep. {liveStatus?.episode ?? "—"}</p>
                <p className="text-sm font-medium text-white mt-0.5">{liveStatus?.description ?? "Monthly poetry open readings hosted under Naija Art Initiative"}</p>
              </div>
            </div>

            {/* Past sessions list */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Previous Sessions</p>
              {pastSessions.length === 0 ? (
                <p className="text-gray-500 text-sm font-serif italic">No past sessions yet.</p>
              ) : (
                pastSessions.map((session: import("@/lib/firestore").FireLivestreamSession, i: number) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <PlayCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">{session.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {session.season} · {new Date(session.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-xs text-secondary mt-1 font-medium">{session.theme}</p>
                    </div>
                    {session.recordingUrl && (
                      <a href={session.recordingUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors shrink-0">
                        <PlayCircle className="h-4 w-4" />
                      </a>
                    )}
                  </motion.div>
                ))
              )}
              <Link href="/live" className="mt-auto">
                <button className="w-full py-2.5 rounded-xl border border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium flex items-center justify-center gap-2">
                  View all sessions <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CURATED GALLERY
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">The Curated Gallery</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Approved Works</h2>
              <p className="text-gray-400 font-serif text-base mt-2 max-w-xl">
                Poetry approved for showcase by the Loudthotz editorial committee.
              </p>
            </div>
            <Link href="/poems" className="hidden md:flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors shrink-0">
              Browse all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {poemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {featuredPoems?.map((poem: import("@/lib/firestore").FirePoem, i: number) => (
                <motion.div key={poem.id} variants={fadeUp(i * 0.05)}>
                  <Link href={`/poem/${poem.id}`} className="group block h-full">
                    <div className="h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div>
                          <StarRating value={poem.averageRating} />
                          <p className="text-[10px] text-gray-500 mt-1">{poem.ratingCount} {poem.ratingCount === 1 ? "rating" : "ratings"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{poem.country}</p>
                          {poem.theme && (
                            <span className="inline-block mt-1 text-[10px] text-secondary border border-secondary/20 bg-secondary/5 px-2 py-0.5 rounded-full">
                              {poem.theme}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-display text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {poem.title}
                      </h3>
                      <p className="font-serif italic text-gray-400 text-sm mb-4">by {poem.author}</p>

                      <p className="font-serif text-gray-300 text-sm leading-relaxed line-clamp-4 flex-1">
                        {poem.content.split("\n").filter(Boolean).slice(0, 4).join("\n")}
                      </p>

                      {/* Footer */}
                      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(poem.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Read poem <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-8 flex justify-center">
            <Link href="/poems">
              <button className="flex items-center gap-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-medium px-6 py-3 rounded-xl transition-all text-sm">
                <BookOpen className="h-4 w-4" />
                View the full gallery
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA STRIP
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/5 bg-[#070906] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(181,230,29,0.05),transparent_60%)]" />
            <div className="relative z-10 flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <img src={naijaArtLogo} alt="Naija Art Initiative" className="h-full w-full object-contain bg-white p-1" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white">Your voice belongs here.</p>
                <p className="font-serif text-gray-400 text-sm mt-1 max-w-md">
                  Submit your poetry for review and join the growing community of African and global spoken-word artists.
                </p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <Link href="/submit">
                <button className="flex items-center gap-2 bg-primary text-black font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/10">
                  Submit a Poem
                </button>
              </Link>
              <Link href="/donate">
                <button className="flex items-center gap-2 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-medium px-6 py-3 rounded-xl transition-all text-sm">
                  Support Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
