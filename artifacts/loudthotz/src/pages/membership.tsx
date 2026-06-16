import { motion } from "framer-motion";
import { Users, Check, ExternalLink, Star, BookOpen, Shirt, Globe, Feather, MessageCircle } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const tiers = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    color: "border-white/10",
    highlight: false,
    payLink: null,
    icon: MessageCircle,
    iconColor: "text-gray-400",
    description: "Get started with the Loudthotz community at no cost.",
    benefits: [
      "Added to our WhatsApp community",
      "Access to community discussions",
      "Monthly newsletter updates",
    ],
  },
  {
    name: "Basic",
    price: "₦24,000",
    period: "per year",
    color: "border-white/10",
    highlight: false,
    payLink: "https://paystack.com/pay/basicmember",
    icon: BookOpen,
    iconColor: "text-secondary",
    description: "Support the initiative and receive our annual anthology.",
    benefits: [
      "A copy of First Gong anthology at end of year",
      "Access to our Telegram community",
      "Recognition as a Basic Member",
    ],
  },
  {
    name: "Full",
    price: "₦48,000",
    period: "per year",
    color: "border-primary/30",
    highlight: true,
    payLink: "https://paystack.com/pay/fullloudthotz",
    icon: Star,
    iconColor: "text-primary",
    description: "The complete Loudthotz experience — merch included.",
    benefits: [
      "A copy of the First Gong anthology at end of year",
      "Exclusive Loudthotz T-shirt",
      "Access to our Telegram community",
      "Priority event invitations",
    ],
  },
  {
    name: "Golden",
    price: "₦60,000",
    period: "per year",
    color: "border-amber-500/30",
    highlight: false,
    payLink: "https://paystack.com/pay/goldenmember",
    icon: Feather,
    iconColor: "text-amber-400",
    description: "Our most exclusive tier — your poems live in the anthology.",
    benefits: [
      "A copy of the First Gong anthology at end of year",
      "Exclusive Loudthotz T-shirt",
      "Free outings with Loudthotz team",
      "A dedicated section of First Gong anthology for 10 of your poems",
      "Priority recognition across all platforms",
    ],
  },
];

const eligibility = [
  "All poets who write in English or translate works to English are eligible for membership.",
  "Free membership is open to anyone worldwide.",
  "Paid tiers support our mission to elevate literary culture across Africa.",
];

export default function Membership() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,162,232,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              <Users className="h-4 w-4" />
              Join the Community
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Loudthotz
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#00d4ff]">
              Membership
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="font-serif text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We have <span className="text-white font-semibold">4 membership levels</span> for poets who write in English or translate works to English. Join the Loudthotz family and help us elevate literary culture across the continent.
          </motion.p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-10 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                {...fadeUp(i * 0.08)}
                className={`relative flex flex-col rounded-2xl border ${tier.color} ${
                  tier.highlight
                    ? "bg-primary/5 shadow-xl shadow-primary/5"
                    : "bg-white/[0.02]"
                } p-6`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`mb-4 flex items-center gap-3`}>
                  <div className={`p-2 rounded-lg bg-white/5`}>
                    <tier.icon className={`h-5 w-5 ${tier.iconColor}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">{tier.name}</h3>
                </div>

                <p className="text-sm text-gray-400 mb-5 leading-relaxed">{tier.description}</p>

                <ul className="space-y-3 mb-6 flex-1">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>

                {tier.payLink ? (
                  <a
                    href={tier.payLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      tier.highlight
                        ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/10"
                        : tier.name === "Golden"
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    Join {tier.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <a
                    href="https://wa.me/loudthotz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  >
                    Join Free
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Note about prices */}
          <p className="text-center text-xs text-gray-600 mt-6">
            * Pricing for paid tiers is set on Paystack. Click "Join" to see current rates and complete your registration.
          </p>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              <Globe className="h-3.5 w-3.5" />
              Eligibility
            </div>
            <h2 className="font-display text-2xl font-bold">Who Can Join?</h2>
          </div>
          <div className="space-y-4">
            {eligibility.map((e, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{e}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership includes anthology */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent p-10">
            <Shirt className="h-10 w-10 text-secondary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-3">Wear Your Words</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Full and Golden members receive an exclusive Loudthotz T-shirt — a badge of belonging to Nigeria's premier poetry community.
            </p>
            <a
              href="https://paystack.com/pay/fullloudthotz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary text-black font-semibold px-8 py-3 rounded-xl hover:bg-secondary/90 transition-all text-sm"
            >
              Get Full Membership
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
