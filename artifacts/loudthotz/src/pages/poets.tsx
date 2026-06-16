import { motion } from "framer-motion";
import { Feather, ExternalLink, User } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const poets = [
  { name: "Akeem Adetayo Oyalowo", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_64.html" },
  { name: "Lolade Ajayi Oye", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_39.html" },
  { name: 'Chukwuemeka "Deus" Njoku', url: "http://loudthotzpoetry.blogspot.com.ng/p/chukwuemeka-deus-njoku.html" },
  { name: "Ifeanyi Emmanuel", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_36.html" },
  { name: "Tolu Daniel", url: "http://loudthotzpoetry.blogspot.com.ng/p/tolu-daniel.html" },
  { name: "Henry Ahmami", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_77.html" },
  { name: "Wale O. Stevens", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_29.html" },
  { name: "Jovita Ekene", url: "http://loudthotzpoetry.blogspot.com.ng/p/jovita-ekene.html" },
  { name: "Elijah Ekiyan", url: "http://loudthotzpoetry.blogspot.com.ng/p/elijah-ekiyan.html" },
  { name: "Ubong Abasi", url: "http://loudthotzpoetry.blogspot.com.ng/p/ubong-abasi.html" },
  { name: "Florence Salawu", url: "http://loudthotzpoetry.blogspot.com.ng/p/florence-salawu.html" },
  { name: 'Kemi "Kemibon" Ahmed', url: "http://loudthotzpoetry.blogspot.com.ng/p/adekemi-kemibon-ahmed.html" },
  { name: "Joy Nwamaka Chime", url: "http://loudthotzpoetry.blogspot.com.ng/p/joy-nwamaka-chime.html" },
  { name: "Chris N. John", url: "http://loudthotzpoetry.blogspot.com.ng/p/chris-n-amos.html" },
  { name: "Ifeanyi Okwosha", url: "http://loudthotzpoetry.blogspot.com.ng/p/ifeanyi-okwosha.html" },
  { name: "Olamide J. Santos", url: "http://loudthotzpoetry.blogspot.com.ng/p/breathe.html" },
  { name: "Andrew White", url: "http://loudthotzpoetry.blogspot.com.ng/p/andrew-white.html" },
  { name: "Erhio Obodo", url: "http://loudthotzpoetry.blogspot.com.ng/p/erhio-obodo.html" },
  { name: "Soonest Nathaniel", url: "http://loudthotzpoetry.blogspot.com.ng/p/soonest-nathaniel.html" },
  { name: 'Ugochukwu "Hitch" Emebiriodo', url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_61.html" },
  { name: "Ifeanyi Mbah", url: "http://loudthotzpoetry.blogspot.com.ng/p/ifeanyi-mbah.html" },
  { name: 'Philip "Dokita Feel" Chukwu', url: "http://loudthotzpoetry.blogspot.com.ng/p/philip-dokita-feel-chukwu.html" },
  { name: "Stephen Tolulope Alayande", url: "http://loudthotzpoetry.blogspot.com.ng/p/stephen-tolulope-alayande.html" },
  { name: "Ilupeju Adebayo", url: "http://loudthotzpoetry.blogspot.com.ng/p/ilupeju-adebayo.html" },
  { name: "Marilyn Maduka", url: "http://loudthotzpoetry.blogspot.com.ng/p/marilyn-maduka.html" },
  { name: "Nneoma Onyeukwu", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_30.html" },
  { name: "Ijeoma Opoko", url: "http://loudthotzpoetry.blogspot.com.ng/p/ijeoma-opoko.html" },
  { name: "Oyinda Fakile", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_28.html" },
  { name: "Ajibola Adeoya", url: "http://loudthotzpoetry.blogspot.com.ng/p/ajibola-adeoya.html" },
  { name: "Immanuel Unekwuojo Ogu", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_41.html" },
  { name: "Michael Achile Umameh", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_3.html" },
  { name: "Teddy Ugonna Richard", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_37.html" },
  { name: 'Priscilla "zaraahaiwe" Ahaiwe', url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_49.html" },
  { name: "Fabian Mac-robe Ugbechie", url: "http://loudthotzpoetry.blogspot.com.ng/p/blog-page_21.html" },
  { name: "Amar Basil", url: "http://loudthotzpoetry.blogspot.com.ng/p/basil-amar-basil.html" },
];

function getInitials(name: string) {
  return name
    .replace(/["']/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
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
            {poets.length} voices that have graced the Loudthotz stage — from Nigeria and across the continent, these are the poets who make up our literary family.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
              <User className="h-4 w-4" />
              {poets.length} Featured Poets
            </div>
          </motion.div>
        </div>
      </section>

      {/* Poets Grid */}
      <section className="py-10 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {poets.map((poet, i) => {
              const color = avatarColors[i % avatarColors.length];
              return (
                <motion.a
                  key={poet.name}
                  href={poet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...fadeUp(Math.min(i * 0.03, 0.4))}
                  className="group flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${color} border flex items-center justify-center`}>
                    <span className="font-display text-sm font-bold text-white">{getInitials(poet.name)}</span>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                      {poet.name}
                    </p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors mt-0.5">
                      View profile
                    </p>
                  </div>

                  {/* Arrow */}
                  <ExternalLink className="h-3.5 w-3.5 text-gray-600 group-hover:text-primary transition-colors shrink-0" />
                </motion.a>
              );
            })}
          </div>

          {/* Blog link */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Explore full poet profiles and their works on the Loudthotz blog
            </p>
            <a
              href="https://loudthotzpoetry.blogspot.com/p/poets.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-medium px-6 py-3 rounded-xl transition-all text-sm"
            >
              Visit Poets Archive
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
