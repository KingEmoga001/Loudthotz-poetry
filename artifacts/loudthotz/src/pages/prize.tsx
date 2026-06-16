import { motion } from "framer-motion";
import { Trophy, Calendar, FileText, DollarSign, Mail, AlertCircle, CheckCircle, Star, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/lib/firestore";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const DEFAULT_RULES = [
  "The poem must not be more than 14 lines, a maximum of 6 words per line.",
  "On any topic.",
  "The deadline is the second Thursday of every month.",
  "Only one poem per participant per month.",
  "Winner will be announced the last day of every month on our blog and all social media platforms.",
  "All entries must come with a 3-line Bio, a picture, Phone Number, Email and Address.",
  "All submissions (both poem and bio) must be attached as a Microsoft Word document.",
  "Loudthotz decisions are final.",
  "Any entry that did not comply with ALL the rules will be disqualified.",
  "Poetry competition fee per month is ₦1,000.00.",
  "The winning poem every month will be included in our annual anthology published at the end of every year.",
  "Only Nigerians with a functional Nigerian NUBAN Bank Account are eligible for this competition.",
  'All submissions should be sent to loudthotz@gmail.com with the subject e.g "January 2025 LPP Poem".',
];

export default function Prize() {
  const { data: s } = useSiteSettings();

  const cashAmount = s?.prizeCashAmount ?? "₦10,000";
  const entryFee = s?.prizeEntryFee ?? "₦1,000";
  const paystackLink = s?.prizePaystackLink ?? "https://paystack.com/pay/lpp";
  const email = s?.prizeEmail ?? "loudthotz@gmail.com";
  const rules = s?.prizeRules
    ? s.prizeRules.split("\n").filter(Boolean)
    : DEFAULT_RULES;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(181,230,29,0.09),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              <Trophy className="h-4 w-4" />
              Monthly Poetry Competition
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Loudthotz
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d2ff34]">
              Poetry Prize
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="font-serif text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            In order to promote written poetry and the culture of reading in Nigeria and for the love of words, Loudthotz Poetry awards a cash prize of{" "}
            <span className="text-primary font-semibold">{cashAmount}</span> every month to the winner of the Loudthotz Poetry Prize.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={paystackLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 text-sm"
            >
              <DollarSign className="h-4 w-4" />
              Pay Entry Fee — {entryFee}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={`mailto:${email}?subject=LPP Poem Submission`}
              className="inline-flex items-center gap-2 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-medium px-6 py-3 rounded-xl transition-all text-sm"
            >
              <Mail className="h-4 w-4" />
              Submit via Email
            </a>
          </motion.div>
        </div>
      </section>

      {/* Prize Highlight */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {[
              { icon: DollarSign, label: "Cash Prize", value: cashAmount, sub: "Per winning poem" },
              { icon: Calendar, label: "Deadline", value: "2nd Thursday", sub: "Of every month" },
              { icon: Star, label: "Publication", value: "Annual Anthology", sub: "Winning poems included" },
            ].map((item) => (
              <div key={item.label} className="bg-[#090b06] p-8 text-center">
                <item.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                <div className="font-display text-2xl font-bold text-white mb-1">{item.value}</div>
                <div className="text-sm text-gray-500">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              <FileText className="h-3.5 w-3.5" />
              Competition Rules
            </div>
            <h2 className="font-display text-3xl font-bold">Rules &amp; Guidelines</h2>
          </motion.div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
            {rules.map((rule, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.04)}
                className="flex items-start gap-4 p-5"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{rule}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/80">
              Only Nigerians with a functional Nigerian NUBAN Bank Account are eligible for this competition. All entries that do not comply with ALL rules will be disqualified.
            </p>
          </div>
        </div>
      </section>

      {/* How to Enter */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-3">How to Enter</h2>
            <p className="text-gray-400">Three simple steps to submit your poem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Pay Entry Fee",
                desc: `Pay the ${entryFee} competition fee via Paystack and keep your receipt.`,
                action: { label: "Pay on Paystack", href: paystackLink },
              },
              {
                step: "02",
                title: "Prepare Your Submission",
                desc: "Write your poem (max 14 lines, 6 words per line). Attach a 3-line bio, photo, and payment receipt in a Word document.",
              },
              {
                step: "03",
                title: "Send to Us",
                desc: `Email everything to ${email} with subject: "Month Year LPP Poem" e.g "January 2025 LPP Poem".`,
                action: { label: "Send Email", href: `mailto:${email}?subject=LPP Poem Submission` },
              },
            ].map((s) => (
              <div key={s.step} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="font-display text-4xl font-bold text-primary/30">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
                {s.action && (
                  <a
                    href={s.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary/80 transition-colors mt-auto"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {s.action.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-10 text-center">
            <Trophy className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-3">Ready to compete?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Winners are announced on the last day of every month across all Loudthotz platforms.
            </p>
            <a
              href={paystackLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 text-sm"
            >
              Enter This Month's Competition
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
