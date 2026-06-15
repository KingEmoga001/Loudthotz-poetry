import { useListBooks } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from "lucide-react";

export default function Books() {
  const { data: books, isLoading } = useListBooks();

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="font-display text-5xl font-bold mb-6 tracking-tight">Anthologies</h1>
        <p className="font-serif text-2xl text-muted-foreground leading-relaxed">
          The finest pieces from our open mics and curated submissions, 
          immortalized in print. Support the Naija Art Initiative by grabbing a copy.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books?.map(book => (
            <div key={book.id} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-colors group">
              {/* Fake Book Cover */}
              <div 
                className="aspect-[2/3] relative flex flex-col p-8 justify-between border-b border-white/5"
                style={{ backgroundColor: book.accentColor || '#1a1a1a' }}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-y-0 left-0 w-4 bg-black/20" /> {/* Spine shadow */}
                
                <div className="relative z-10 text-center space-y-4 pt-8">
                  <h3 className="font-display text-3xl font-bold leading-tight drop-shadow-md text-white">{book.title}</h3>
                  <p className="font-serif text-lg italic text-white/80 drop-shadow">{book.subtitle}</p>
                </div>
                
                {book.coverTagline && (
                  <div className="relative z-10 text-center mt-auto pb-4">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/60">{book.coverTagline}</p>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {book.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display text-2xl font-bold text-foreground">{book.price}</span>
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
          Poems selected for publication on the portal are automatically considered.
        </p>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground h-12 px-8">
          Read Submission Guidelines <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}