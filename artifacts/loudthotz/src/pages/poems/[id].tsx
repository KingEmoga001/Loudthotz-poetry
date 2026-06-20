import { useParams, useSearch } from "wouter";
import { usePoem, ratePoem } from "@/lib/firestore";
import { Loader2, Star, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function PoemReader() {
  const { id } = useParams<{ id: string }>();
  const search = useSearch();
  const fromPoetId = new URLSearchParams(search).get("from");
  const { data: poem, loading } = usePoem(id ?? "");

  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [ratingPending, setRatingPending] = useState(false);
  const { toast } = useToast();

  const handleRate = async (stars: number) => {
    if (hasRated || !id) return;
    setRatingPending(true);
    try {
      await ratePoem(id, stars);
      setHasRated(true);
      toast({ title: "Rating submitted", description: "Thank you for your feedback." });
    } catch {
      toast({ title: "Error", description: "Failed to submit rating.", variant: "destructive" });
    } finally {
      setRatingPending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold">Poem not found</h1>
        <Link href="/poems" className="text-primary mt-4 inline-block hover:underline">Return to gallery</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Link href={fromPoetId ? `/poets?open=${fromPoetId}` : "/poems"}>
        <Button variant="ghost" className="mb-12 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {fromPoetId ? `Back to ${poem.author}` : "Back to Gallery"}
        </Button>
      </Link>

      <article className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-16 text-center">
        <div className="mb-12 space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{poem.title}</h1>
          <p className="font-serif text-xl md:text-2xl italic text-muted-foreground">
            by <span className="text-foreground">{poem.author}</span>
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
            <span className="uppercase tracking-widest">{poem.country}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{new Date(poem.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>

          {(poem.theme || poem.season) && (
            <div className="flex justify-center gap-2 pt-2">
              {poem.season && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">{poem.season}</span>}
              {poem.theme && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">{poem.theme}</span>}
            </div>
          )}
        </div>

        <div className="w-16 h-px bg-primary/50 mx-auto mb-16" />

        <div className="font-serif text-xl md:text-2xl leading-[2] md:leading-[2.2] text-foreground/90 whitespace-pre-wrap text-left md:text-center max-w-2xl mx-auto">
          {poem.content}
        </div>

        <div className="w-16 h-px bg-primary/50 mx-auto mt-24 mb-16" />

        {/* Rating Widget */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {hasRated ? "Thank you for rating" : "Rate this piece"}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                disabled={hasRated || ratingPending}
                onMouseEnter={() => !hasRated && setHoverRating(star)}
                onMouseLeave={() => !hasRated && setHoverRating(0)}
                onClick={() => handleRate(star)}
                className="focus:outline-none transition-transform hover:scale-110 disabled:hover:scale-100"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    (hoverRating || poem.averageRating) >= star ? "text-amber-500 fill-amber-500" : "text-white/20"
                  } ${hasRated ? "opacity-50" : ""}`}
                />
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {poem.averageRating.toFixed(1)} average from {poem.ratingCount} {poem.ratingCount === 1 ? "rating" : "ratings"}
          </div>
        </div>
      </article>
    </div>
  );
}
