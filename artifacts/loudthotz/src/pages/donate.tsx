import { motion } from "framer-motion";
import { Heart, Globe, BookOpen, ExternalLink, Mic2, Users } from "lucide-react";
import { useSiteSettings } from "@/lib/firestore";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Donate() {
  const { data: s } = useSiteSettings();

  const headline = s?.donationHeadline ?? "Keep the Mic On.";
  const message = s?.donationMessage ?? "Loudthotz Poetry is powered by the Naija Art Initiative. Your contributions directly fund our server costs, live session setups, and compensation for featured African poets.";
  const paystackLink = s?.donationPaystackLink || "https://paystack.shop/pay/loudthotzdonate";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(181,230,29,0.07),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              <Heart className="h-4 w-4" />
              Support the Arts
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            {headline}
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="font-serif text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            {message}
          </motion.p>

          <motion.div {...fadeUp(0.22)}>
            <a
              href={paystackLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-black font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-base"
            >
              <Heart className="h-5 w-5 fill-current" />
              Donate via Paystack
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* What your donation supports */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">What Your Donation Supports</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Every naira goes directly to keeping the Loudthotz community alive and thriving.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Mic2,
                title: "Live Sessions",
                desc: "Funding the setup, streaming tools, and production costs for every monthly open reading.",
              },
              {
                icon: BookOpen,
                title: "Annual Anthology",
                desc: "Covering the print and publishing costs of the First Gong anthology series.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Connecting Lagos to London — keeping our platforms online and our community growing.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.08)}
                className="flex flex-col items-center text-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community stats */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {[
              { value: s?.statsPoems || "3000+", label: "Poems" },
              { value: s?.statsPoets || "85+", label: "Featured Poets" },
              { value: s?.statsSessions || "204", label: "Live Sessions" },
              { value: s?.prizeCashAmount || "₦20,000", label: "Monthly Prize" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#090b06] p-6 text-center">
                <div className="font-display text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-10 text-center">
            <Users className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-3">Become a Member Instead</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
              Want to give ongoing support and get something back? Join as a paid member and receive the annual anthology, a T-shirt, and more.
            </p>
            <a
              href="/membership"
              className="inline-flex items-center gap-2 border border-secondary/30 text-secondary hover:bg-secondary hover:text-black font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              View Membership Tiers
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
