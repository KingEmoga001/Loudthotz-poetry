import { useBooks } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Books() {
  const { data: books, loading } = useBooks();

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="font-display text-5xl font-bold mb-6 tracking-tight">Anthologies</h1>
        <p className="font-serif text-2xl text-muted-foreground leading-relaxed">
          The finest pieces from our open mics and curated submissions,
          immortalized in print. Support the Naija Art Initiative by grabbing a copy.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : books?.length === 0 ? (
        <div className="text-center py-24 border border-white/5 rounded-2xl">
          <p className="text-gray-500">No anthologies published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books?.map(book => (
            <div key={book.id} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-colors group">
              {/* Book Cover */}
              <div
                className={`aspect-[2/3] relative flex flex-col p-8 justify-between border-b border-white/5 ${
                  book.accentColor === "lime"
                    ? "bg-gradient-to-br from-[#1a2a06] to-[#0d1a03]"
                    : "bg-gradient-to-br from-[#031a2a] to-[#020d1a]"
                }`}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-y-0 left-0 w-4 bg-black/20" />

                <div className="relative z-10 text-center space-y-4 pt-8">
                  <div className={`inline-block text-xs font-bold uppercase tracking-[0.3em] px-3 py-1 rounded border mb-2 ${
                    book.accentColor === "lime" ? "border-primary/30 text-primary" : "border-secondary/30 text-secondary"
                  }`}>
                    Naija Art Initiative
                  </div>
                  <h3 className="font-display text-3xl font-bold leading-tight drop-shadow-md text-white">{book.title}</h3>
                  <p className="font-serif text-lg italic text-white/80 drop-shadow">{book.subtitle}</p>
                </div>

                {book.coverTagline && (
                  <div className="relative z-10 text-center mt-auto pb-4">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/50">{book.coverTagline}</p>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{book.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display text-2xl font-bold">{book.price}</span>
                  <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#f90] hover:bg-[#f90]/90 text-black font-bold border-0 shadow-lg shadow-orange-500/20">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy on Amazon
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-32 bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-4">Submit to the Next Edition</h2>
        <p className="font-serif text-xl text-muted-foreground mb-8">
          We are currently accepting submissions for our upcoming anthology.
          Poems selected for publication are automatically considered.
        </p>
        <Link href="/submit">
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground h-12 px-8">
            Submit Your Work <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
