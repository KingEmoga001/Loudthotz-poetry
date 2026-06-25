import { motion } from "framer-motion";
import { useBooks, useSiteSettings } from "@/lib/firestore";
import { ShoppingCart, BookOpen, ExternalLink, CreditCard, Globe } from "lucide-react";
import { Link } from "wouter";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Books() {
  const { data: books, loading } = useBooks();
  const { data: s } = useSiteSettings();
  const heroSubtext = s?.booksHeroSubtext || "The finest voices from our open mics and curated submissions — immortalized in print. Support the Naija Art Initiative by grabbing a copy.";
  const submitSubtext = s?.booksSubmitSubtext || "We are currently accepting submissions for our upcoming anthology. Poems selected for publication are automatically considered.";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(181,230,29,0.07),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              <BookOpen className="h-4 w-4 text-primary" />
              Naija Art Initiative
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Our
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d2ff34]">
              Anthologies
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="font-serif text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {heroSubtext}
          </motion.p>
        </div>
      </section>

      {/* Books Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-white/5" />
                  <div className="p-5 space-y-3 bg-white/[0.02] border border-white/5 border-t-0">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !books || books.length === 0 ? (
            <div className="text-center py-24 border border-white/5 rounded-2xl">
              <BookOpen className="h-10 w-10 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No anthologies published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book, i) => {
                const hasLink = book.amazonUrl && book.amazonUrl.startsWith("http");
                const Wrapper = hasLink ? motion.a : motion.div;
                const wrapperProps = hasLink
                  ? { href: book.amazonUrl, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                <Wrapper
                  key={book.id}
                  {...fadeUp(i * 0.06)}
                  {...wrapperProps}
                  className={`group flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 ${hasLink ? "hover:border-primary/20 hover:bg-white/[0.04] cursor-pointer" : "cursor-default"}`}
                >
                  {/* Cover image or gradient fallback */}
                  {book.imageUrl ? (
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className={`aspect-[3/4] relative flex flex-col items-center justify-center p-8 ${
                      book.accentColor === "lime"
                        ? "bg-gradient-to-br from-[#1a2a06] to-[#0d1a03]"
                        : "bg-gradient-to-br from-[#031a2a] to-[#020d1a]"
                    }`}>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                      <div className="relative z-10 text-center space-y-3">
                        <div className={`text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded border mb-3 inline-block ${
                          book.accentColor === "lime" ? "border-primary/30 text-primary" : "border-secondary/30 text-secondary"
                        }`}>
                          Naija Art Initiative
                        </div>
                        <h3 className="font-display text-3xl font-bold text-white leading-tight">{book.title}</h3>
                        {book.subtitle && <p className="font-serif text-base italic text-white/70">{book.subtitle}</p>}
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-lg leading-tight">{book.title}</h3>
                      {book.subtitle && <p className="text-xs text-gray-500 mt-0.5">{book.subtitle}</p>}
                    </div>

                    {book.description && (
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">{book.description}</p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      {book.price ? (
                        <span className="font-display text-xl font-bold text-white">
                          {book.price.startsWith("₦") ? book.price : `₦${book.price}`}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Price on Amazon</span>
                      )}
                      {hasLink ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#f90]/10 border border-[#f90]/30 text-[#f90] text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-[#f90] group-hover:text-black transition-all">
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Buy on Amazon
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600 italic">Link coming soon</span>
                      )}
                    </div>
                  </div>
                </Wrapper>
                );
              })}
            </div>
          )}

          {/* Submit CTA */}
          <motion.div {...fadeUp(0.3)} className="mt-20 bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <BookOpen className="h-9 w-9 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold mb-3">Submit to the Next Edition</h2>
            <p className="font-serif text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              {submitSubtext}
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 border border-primary/50 text-primary hover:bg-primary hover:text-black font-semibold px-8 py-3 rounded-xl transition-all text-sm"
            >
              Submit Your Work
              <ExternalLink className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Book Listing CTA */}
          <BookListingSection s={s} />
        </div>
      </section>
    </div>
  );
}

function BookListingSection({ s }: { s: ReturnType<typeof useSiteSettings>["data"] }) {
  const feeNGN = s?.bookListingFeeNGN || "₦15,000";
  const feeUSD = s?.bookListingFeeUSD || "$10";
  const paystackLink = s?.bookListingPaystackLink || "";
  const foreignPayLink = s?.bookListingForeignPayLink || "";

  function PayBtn({ href, label, fee, icon: Icon }: { href: string; label: string; fee: string; icon: typeof CreditCard }) {
    const configured = href && href.startsWith("http");
    if (!configured) {
      return (
        <div className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] opacity-60 cursor-not-allowed">
          <Icon className="h-5 w-5 text-gray-500" />
          <span className="text-xs font-bold text-gray-400">{fee}</span>
          <span className="text-[10px] text-gray-600 text-center">{label}</span>
          <span className="text-[10px] text-amber-500/80 font-semibold">Coming Soon</span>
        </div>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-xs font-bold text-white">{fee}</span>
        <span className="text-[10px] text-gray-400 text-center">{label}</span>
        <ExternalLink className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}
      className="mt-10 rounded-2xl border border-white/10 bg-white/[0.015] p-8 md:p-12 max-w-3xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-6">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Paid Listing</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Feature Your Book with Us</h2>
          <p className="font-serif text-gray-400 text-sm leading-relaxed">
            Have a book or anthology you want listed on our platform? We feature titles that align with the Naija Art Initiative's voice. Pay the listing fee, then reach out with your book details.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <PayBtn href={paystackLink} label="Nigeria — Paystack" fee={feeNGN} icon={CreditCard} />
        <PayBtn href={foreignPayLink} label="International — Card / Gateway" fee={feeUSD} icon={Globe} />
      </div>

      <p className="text-[11px] text-gray-600 text-center">
        After payment, send your book title, cover image, description, and purchase link to us via the WhatsApp button in the footer.
      </p>
    </motion.div>
  );
}
