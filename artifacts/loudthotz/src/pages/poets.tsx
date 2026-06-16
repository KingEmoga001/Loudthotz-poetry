import { motion } from "framer-motion";
import { Feather, User, BookOpen, Globe, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { usePoets } from "@/lib/firestore";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const staticPoets = [
  "Akeem Adetayo Oyalowo", "Lolade Ajayi Oye", 'Chukwuemeka "Deus" Njoku',
  "Ifeanyi Emmanuel", "Tolu Daniel", "Henry Ahmami", "Wale O. Stevens",
  "Jovita Ekene", "Elijah Ekiyan", "Ubong Abasi", "Florence Salawu",
  'Kemi "Kemibon" Ahmed', "Joy Nwamaka Chime", "Chris N. John",
  "Ifeanyi Okwosha", "Olamide J. Santos", "Andrew White", "Erhio Obodo",
  "Soonest Nathaniel", 'Ugochukwu "Hitch" Emebiriodo', "Ifeanyi Mbah",
  'Philip "Dokita Feel" Chukwu', "Stephen Tolulope Alayande", "Ilupeju Adebayo",
  "Marilyn Maduka", "Nneoma Onyeukwu", "Ijeoma Opoko", "Oyinda Fakile",
  "Ajibola Adeoya", "Immanuel Unekwuojo Ogu", "Michael Achile Umameh",
  "Teddy Ugonna Richard", 'Priscilla "zaraahaiwe" Ahaiwe', "Fabian Mac-robe Ugbechie",
  "Amar Basil",
];

function getInitials(name: string) {
  return name.replace(/["']/g, "").split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");
}

const avatarColors = [
  "from-primary/30 to-primary/10 border-primary/20",
  "from-secondary/30 to-secondary/10 border-secondary/20",
  "from-amber-500/30 to-amber-500/10 border-amber-500/20",
  "from-purple-500/30 to-purple-500/10 border-purple-500/20",
  "from-rose-500/30 to-rose-500/10 border-rose-500/20",
  "from-emerald-500/30 to-emerald-500/10 border-emerald-500/20",
];

export default function Poets() {
  const { data: firestorePoets, loading } = usePoets();

  const useFirestore = !loading && firestorePoets.length > 0;
  const totalCount = useFirestore ? firestorePoets.length : staticPoets.length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(181,230,29,0.07),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              <Feather className="h-4 w-4 text-primary" />
              Our Community
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            The
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d2ff34]">
              Poets
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="font-serif text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {totalCount} voices that have graced the Loudthotz stage — from Nigeria and across the continent, these are the poets who make up our literary family.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex justify-center gap-3 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
              <User className="h-4 w-4" />
              {totalCount} Featured Poets
            </div>
            <a
              href="https://loudthotzpoetry.blogspot.com/p/poets.html?m=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              <Globe className="h-4 w-4" />
              View on Blog
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Poets Grid */}
      <section className="py-10 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : useFirestore ? (
            /* Rich Firestore cards with photo/bio */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {firestorePoets.map((poet, i) => {
                const color = avatarColors[i % avatarColors.length];
                return (
                  <motion.div
                    key={poet.id}
                    {...fadeUp(Math.min(i * 0.03, 0.4))}
                    className="flex flex-col bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-primary/20 hover:bg-white/[0.04] transition-all"
                  >
                    {/* Avatar / Photo */}
                    {poet.imageUrl ? (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={poet.imageUrl}
                          alt={poet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`aspect-square bg-gradient-to-br ${color} border-b border-white/5 flex items-center justify-center`}>
                        <span className="font-display text-3xl font-bold text-white">{getInitials(poet.name)}</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-3 flex-1">
                      <p className="text-sm font-semibold text-white leading-snug">{poet.name}</p>
                      {poet.country && (
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <Globe className="h-2.5 w-2.5" /> {poet.country}
                        </p>
                      )}
                      {poet.bio && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{poet.bio}</p>
                      )}
                      {poet.social && (
                        <a
                          href={poet.social.startsWith("http") ? poet.social : `https://${poet.social}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-semibold"
                        >
                          <ExternalLink className="h-2.5 w-2.5" /> Profile
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Static fallback — names only */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {staticPoets.map((name, i) => {
                const color = avatarColors[i % avatarColors.length];
                return (
                  <motion.div
                    key={name}
                    {...fadeUp(Math.min(i * 0.03, 0.4))}
                    className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${color} border flex items-center justify-center`}>
                      <span className="font-display text-sm font-bold text-white">{getInitials(name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Loudthotz poet</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <motion.div {...fadeUp(0.3)} className="mt-16 text-center rounded-2xl border border-primary/20 bg-primary/5 p-10">
            <Feather className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-white mb-2">Are you a poet?</h3>
            <p className="text-gray-400 font-serif text-base max-w-md mx-auto mb-6">
              Submit your original work to be considered for the gallery and featured in our next open reading session.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Submit a Poem
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
