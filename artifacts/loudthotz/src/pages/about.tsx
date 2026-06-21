import { motion } from "framer-motion";
import { Link } from "wouter";
import { Mic2, BookOpen, Users, Globe2, Heart, ArrowRight, Calendar, Star, Feather, PenTool } from "lucide-react";
import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781939651416.jpeg";
import { useSiteSettings, useSiteStats } from "@/lib/firestore";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

export default function About() {
  const { data: s } = useSiteSettings();
  const stats = useSiteStats();

  const pageHeadline = s?.aboutPageHeadline || "Where African Poetry Finds Its Voice";
  const pageSubtext = s?.aboutPageSubtext || "Loudthotz Poetry Open Reading is a living literary stage — a monthly gathering where poets from across Africa and beyond share raw, electric spoken word.";

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(181,230,29,0.07),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.div {...fadeUp(0)}>
            <img src={loudthotzLogo} alt="Loudthotz" className="h-28 w-auto object-contain mx-auto mb-8" />
          </motion.div>
          <motion.h1 {...fadeUp(0.08)} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            {pageHeadline.includes("Voice") ? (
              <>
                {pageHeadline.split("Voice")[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d2ff34]">
                  Voice
                </span>
                {pageHeadline.split("Voice")[1] ?? ""}
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d2ff34]">
                {pageHeadline}
              </span>
            )}
          </motion.h1>
          <motion.p {...fadeUp(0.16)} className="font-serif text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {pageSubtext}
          </motion.p>
        </div>
      </section>

      {/* ── What is Loudthotz ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp(0)} className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Our Story</p>
            <h2 className="font-display text-3xl font-bold text-white leading-snug">
              A Stage Built on the Power of the Word
            </h2>
            <p className="text-gray-400 font-serif leading-relaxed">
              Loudthotz was born from a simple conviction: that poetry — spoken aloud, raw and
              unfiltered — is one of the most powerful forces for community, identity, and truth.
              What started as an intimate open mic has grown into a celebrated monthly event drawing
              voices from Nigeria, Uganda, Kenya, Ghana, the diaspora, and beyond.
            </p>
            <p className="text-gray-400 font-serif leading-relaxed">
              Every session carries a theme — brotherhood, womanhood, memory, grief, joy — and
              poets respond with performances that linger long after the mic goes quiet. We are not
              just a stage. We are an archive of African literary life in motion.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 gap-4">
            {[
              { icon: Mic2, label: "Live Sessions", value: stats.displaySessions, color: "primary" },
              { icon: Users, label: "Poets Featured", value: stats.displayPoets, color: "secondary" },
              { icon: Globe2, label: "Countries", value: stats.displayCountries, color: "primary" },
              { icon: Star, label: "Poems Published", value: stats.displayPoems, color: "secondary" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`p-5 rounded-2xl border ${color === "primary" ? "border-primary/20 bg-primary/5" : "border-secondary/20 bg-secondary/5"}`}>
                <Icon className={`h-5 w-5 mb-3 ${color === "primary" ? "text-primary" : "text-secondary"}`} />
                <p className={`font-display text-2xl font-bold ${color === "primary" ? "text-primary" : "text-secondary"}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="bg-white/[0.02] border-y border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">What We Do</p>
            <h2 className="font-display text-3xl font-bold text-white">More Than a Poetry Night</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Mic2,
                title: "Monthly Open Readings",
                desc: "Every month, poets gather — live and virtually — to perform original work around a chosen theme. Open to all voices.",
              },
              {
                icon: BookOpen,
                title: "Curated Gallery",
                desc: "Our online gallery archives standout performances and poems, preserving the voices that have graced our stage.",
              },
              {
                icon: Feather,
                title: "Poet Spotlights",
                desc: "We celebrate individual poets through dedicated spotlight sessions — deep dives into a single voice and their craft.",
              },
              {
                icon: Globe2,
                title: "Global Reach",
                desc: "From Lagos to London, Kampala to Toronto — Loudthotz connects African poets and poetry lovers across the world.",
              },
              {
                icon: Calendar,
                title: "Thematic Seasons",
                desc: "Each season explores a broad theme — from kinship and gender to memory and resilience — with curated programming.",
              },
              {
                icon: Heart,
                title: "Community First",
                desc: "We are a family. Loudthotz nurtures emerging voices alongside established poets in a space of mutual respect.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} {...fadeUp(0.05)} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="font-semibold text-white text-sm">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional Alignment ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div {...fadeUp(0)} className="rounded-2xl border border-secondary/20 bg-secondary/5 p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="shrink-0">
              <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10 bg-white">
                <img src={naijaArtLogo} alt="Naija Art Initiative" className="h-full w-full object-contain p-1" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Institutional Alignment</p>
                <h2 className="font-display text-2xl font-bold text-white">Now Under Naija Art Initiative</h2>
              </div>
              <p className="text-gray-400 font-serif leading-relaxed">
                Loudthotz Poetry was originally conceived and managed under the{" "}
                <span className="text-gray-200 font-semibold">Independent Poets Concerns</span> — a grassroots
                collective committed to the development of spoken word culture across Nigeria. Under that
                umbrella, the event grew from a local gathering into a nationally recognised platform.
              </p>
              <p className="text-gray-400 font-serif leading-relaxed">
                In a milestone institutional move, Loudthotz is now proudly hosted as an official event
                and literary vehicle under the{" "}
                <span className="text-secondary font-semibold">Naija Art Initiative</span> — a broader
                creative organisation dedicated to amplifying Nigerian and African art in all its forms.
                This alignment strengthens our infrastructure, expands our reach, and deepens our
                commitment to literary excellence.
              </p>
              <p className="text-gray-400 font-serif leading-relaxed">
                Our mission remains unchanged: to provide a platform where words ignite loud thoughts,
                and where every poet — emerging or established — finds a home.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── LPP Prize ── */}
      <section className="bg-white/[0.02] border-y border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeUp(0)} className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Recognition</p>
              <h2 className="font-display text-3xl font-bold text-white leading-snug">
                The LPP Poetry Prize
              </h2>
              <p className="text-gray-400 font-serif leading-relaxed">
                The <span className="text-primary font-semibold">Loudthotz Poetry Prize (LPP)</span> is
                our flagship award — a monthly competition open to all poets writing in English.
                Win a cash prize of{" "}
                <span className="text-primary font-semibold">{s?.prizeCashAmount || "₦20,000"}</span> and
                have your poem featured in our annual anthology.
              </p>
              <p className="text-gray-400 font-serif leading-relaxed">
                Past editions have uncovered remarkable talents who have gone on to publish anthologies,
                perform on international stages, and represent Africa at global literary festivals.
              </p>
              <Link
                href="/prize"
                className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all mt-2"
              >
                Learn about the LPP Prize <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="space-y-4">
              {[
                { label: "Open to", value: "All poets writing in English" },
                { label: "Format", value: "Original poem — max 14 lines, 6 words per line" },
                { label: "Prize", value: `${s?.prizeCashAmount || "₦20,000"} cash + anthology publication` },
                { label: "Frequency", value: "Monthly" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
                    <p className="text-sm text-gray-200 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Get Involved ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Get Involved</h2>
          <p className="text-gray-400 text-base">There are many ways to be part of the Loudthotz community.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: "/submit", label: "Submit a Poem", desc: "Share your work for consideration in our gallery or next session.", color: "primary", icon: PenTool },
            { href: "/membership", label: "Join as a Member", desc: "Support the platform and enjoy exclusive benefits as a Loudthotz member.", color: "secondary", icon: Users },
            { href: "/poets", label: "Meet Our Poets", desc: "Explore the voices that have graced our stage across all seasons.", color: "primary", icon: Feather },
            { href: "/donate", label: "Support the Mission", desc: "Help us keep the stage alive. Every contribution makes a difference.", color: "secondary", icon: Heart },
          ].map(({ href, label, desc, color, icon: Icon }) => (
            <Link key={href} href={href}
              className={`group p-5 rounded-2xl border transition-all ${color === "primary" ? "border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10" : "border-secondary/20 hover:border-secondary/40 bg-secondary/5 hover:bg-secondary/10"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <p className={`font-display font-bold text-base ${color === "primary" ? "text-primary" : "text-secondary"}`}>{label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
                <ArrowRight className={`h-4 w-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${color === "primary" ? "text-primary" : "text-secondary"}`} />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
