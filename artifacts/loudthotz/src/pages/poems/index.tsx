import { useState } from "react";
import { Link } from "wouter";
import { usePoems } from "@/lib/firestore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Loader2, Trophy } from "lucide-react";

export default function PoemsGallery() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "popular" | "alphabetical">("latest");

  const { data: allPoems, loading } = usePoems(search || undefined, sort);

  const poems = allPoems.filter((p) => p.isPoemOfMonth);

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12 space-y-6">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <Trophy className="h-3.5 w-3.5" />
            Poem of the Month
          </div>
        </div>
        <h1 className="font-display text-5xl font-bold tracking-tight">The Curated Gallery</h1>
        <p className="font-serif text-2xl text-muted-foreground">Our finest — each a monthly winner.</p>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
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
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : poems.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.02] border border-white/5 rounded-2xl">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No poems yet</h3>
          <p className="text-muted-foreground">
            {search ? "Try adjusting your search terms." : "No poem-of-the-month selections have been made yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {poems.map((poem) => (
            <Link key={poem.id} href={`/poem/${poem.id}`}>
              <div className="group flex flex-col h-full bg-white/[0.02] border border-white/5 p-8 rounded-xl hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-display text-2xl font-bold group-hover:text-primary transition-colors line-clamp-1">{poem.title}</h2>
                  <div className="flex items-center gap-1.5 shrink-0 bg-white/5 px-2 py-1 rounded-md">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">{poem.averageRating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="font-serif text-lg italic text-muted-foreground mb-6">
                  by {poem.author} <span className="text-white/20 mx-2">•</span> <span className="not-italic text-sm">{poem.country}</span>
                </p>

                <div className="font-serif text-lg text-foreground/80 whitespace-pre-line line-clamp-4 flex-1 mb-8 leading-relaxed">
                  {poem.content}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 text-sm text-muted-foreground">
                  <div className="flex gap-2 flex-wrap">
                    {poem.season && <span className="px-2 py-1 bg-white/5 rounded text-xs">{poem.season}</span>}
                    {poem.theme && <span className="px-2 py-1 bg-white/5 rounded text-xs">{poem.theme}</span>}
                    <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-semibold flex items-center gap-1">
                      <Trophy className="h-2.5 w-2.5" /> POTM
                    </span>
                  </div>
                  <span>{new Date(poem.publishedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
