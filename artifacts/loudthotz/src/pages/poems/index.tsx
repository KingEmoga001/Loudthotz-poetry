import { useState } from "react";
import { Link } from "wouter";
import { usePoems, usePoemOfMonth, usePoets } from "@/lib/firestore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Loader2, Trophy, Globe, BookOpen, Feather, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const avatarColors = [
  "from-primary/30 to-primary/10",
  "from-secondary/30 to-secondary/10",
  "from-amber-500/30 to-amber-500/10",
  "from-purple-500/30 to-purple-500/10",
  "from-rose-500/30 to-rose-500/10",
  "from-emerald-500/30 to-emerald-500/10",
];

function getInitials(name: string) {
  return name.replace(/["']/g, "").split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(value) ? "text-amber-500 fill-amber-500" : "text-white/15"}`} />
      ))}
      <span className="text-xs text-gray-400 ml-1">{value.toFixed(1)}</span>
    </div>
  );
}

export default function PoemsGallery() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "popular" | "alphabetical">("latest");

  const { data: potm, loading: potmLoading } = usePoemOfMonth();
  const { data: allPoems, loading: poemsLoading } = usePoems(search || undefined, sort);
  const { data: poets } = usePoets();

  const potmPoet = potm
    ? poets.find((p) => (potm.poetId && p.id === potm.poetId) || p.name === potm.author) ?? null
    : null;

  const poetColorClass = potmPoet
    ? avatarColors[poets.indexOf(potmPoet) % avatarColors.length]
    : avatarColors[0];

  return (
    <div className="min-h-screen">

      {/* ── Poem of the Month ── */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(181,230,29,0.06),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Trophy className="h-3.5 w-3.5" />
              Poem of the Month
            </div>
          </motion.div>

          {potmLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : !potm ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
              <Trophy className="h-10 w-10 text-amber-500/30 mx-auto mb-4" />
              <p className="text-gray-500 font-serif">No poem of the month selected yet.</p>
              <p className="text-xs text-gray-600 mt-1">An admin can mark any poem as Poem of the Month from the admin panel.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start"
            >
              {/* Poet card */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  {potmPoet?.imageUrl ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={potmPoet.imageUrl}
                        alt={potmPoet.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className={`aspect-[4/3] bg-gradient-to-br ${poetColorClass} flex items-center justify-center`}>
                      <span className="font-display text-6xl font-bold text-white/80">
                        {getInitials(potm.author)}
                      </span>
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <p className="font-display text-lg font-bold text-white">{potm.author}</p>
                    {(potmPoet?.country || potm.country) && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Globe className="h-3 w-3" />
                        {potmPoet?.country || potm.country}
                      </p>
                    )}
                    {potmPoet?.bio && (
                      <p className="text-sm text-gray-400 font-serif leading-relaxed line-clamp-3 pt-1">
                        {potmPoet.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Poem card */}
              <div className="lg:col-span-3 flex flex-col justify-between h-full">
                <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.03] p-8 md:p-10 flex flex-col gap-6 h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                        {potm.title}
                      </h2>
                      {potm.averageRating > 0 && <StarRating value={potm.averageRating} />}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {potm.season && (
                        <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                          {potm.season}
                        </span>
                      )}
                      {potm.theme && (
                        <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                          {potm.theme}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Trophy className="h-2.5 w-2.5" /> POTM
                      </span>
                    </div>
                  </div>

                  <div className="w-12 h-px bg-amber-500/30" />

                  <p className="font-serif text-lg md:text-xl text-gray-300 leading-[1.9] line-clamp-6 whitespace-pre-line">
                    {potm.content}
                  </p>

                  <div className="pt-2">
                    <Link href={`/poems/${potm.id}`}>
                      <button className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all">
                        <BookOpen className="h-4 w-4" />
                        Read Full Poem
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── All Poems ── */}
      <section className="py-16 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 space-y-5"
          >
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                <Feather className="h-3.5 w-3.5" />
                All Poems
              </div>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight">The Full Gallery</h2>
            <p className="font-serif text-lg text-muted-foreground">Every poem published on this stage.</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title or author…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 text-base"
                />
              </div>
              <Select value={sort} onValueChange={(v: "latest" | "popular" | "alphabetical") => setSort(v)}>
                <SelectTrigger className="w-full sm:w-[200px] h-12 bg-white/5 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest Published</SelectItem>
                  <SelectItem value="popular">Highest Rated</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {poemsLoading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : allPoems.length === 0 ? (
            <div className="text-center py-32 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Feather className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-medium mb-2">No poems found</h3>
              <p className="text-muted-foreground text-sm">
                {search ? "Try adjusting your search terms." : "No poems have been published yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allPoems.map((poem, i) => (
                <motion.div
                  key={poem.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                >
                  <Link href={`/poems/${poem.id}`}>
                    <div className={`group flex flex-col h-full border rounded-xl p-7 transition-all duration-300 hover:border-primary/25 hover:bg-white/[0.04] ${
                      poem.isPoemOfMonth
                        ? "bg-amber-500/[0.03] border-amber-500/15"
                        : "bg-white/[0.02] border-white/5"
                    }`}>
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {poem.title}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-semibold">{poem.averageRating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="font-serif text-sm italic text-muted-foreground mb-4">
                        by <span className="not-italic font-semibold text-gray-300">{poem.author}</span>
                        {poem.country && <> &nbsp;·&nbsp; <span className="not-italic text-gray-500">{poem.country}</span></>}
                      </p>

                      <p className="font-serif text-sm text-foreground/70 line-clamp-3 leading-relaxed flex-1 mb-5">
                        {poem.content}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-muted-foreground">
                        <div className="flex gap-1.5 flex-wrap">
                          {poem.isPoemOfMonth && (
                            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <Trophy className="h-2.5 w-2.5" /> POTM
                            </span>
                          )}
                          {poem.season && <span className="px-2 py-0.5 bg-white/5 rounded-full">{poem.season}</span>}
                          {poem.theme && <span className="px-2 py-0.5 bg-white/5 rounded-full">{poem.theme}</span>}
                        </div>
                        <span className="flex items-center gap-1 text-gray-600 group-hover:text-primary transition-colors shrink-0">
                          Read <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
