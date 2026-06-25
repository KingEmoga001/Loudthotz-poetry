import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, FileText, DollarSign, AlertCircle, CheckCircle, Star, ExternalLink, Settings, Clock, Globe } from "lucide-react";
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
  "Poetry competition fee per month is ₦2,000.00.",
  "The winning poem every month will be included in our annual anthology published at the end of every year.",
  "Only Nigerians with a functional Nigerian NUBAN Bank Account are eligible for this competition.",
  'All submissions should be sent to loudthotz@gmail.com with the subject e.g "January 2025 LPP Poem".',
];

function useCountdown(deadline: string | undefined) {
  const getRemaining = () => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    if (!deadline) return;
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return remaining;
}

function CountdownBanner({ deadline }: { deadline: string | undefined }) {
  const remaining = useCountdown(deadline);
  if (!deadline || !remaining) return null;

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Clock className="h-4 w-4 shrink-0" />
          {remaining.expired ? "Submissions closed for this month" : "Submission deadline"}
        </div>
        {!remaining.expired && (
          <div className="flex items-center gap-2 sm:gap-4">
            {units.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center min-w-[52px]">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}
        {!remaining.expired && (
          <div className="text-xs text-gray-500 hidden sm:block">
            {new Date(deadline).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </div>
  );
}

function ForeignEntryButton({ href, fee, large = false }: { href: string; fee: string; large?: boolean }) {
  const configured = href && href.startsWith("http");
  const px = large ? "px-8 py-3" : "px-6 py-3";
  if (!configured) {
    return (
      <span className={`inline-flex items-center gap-2 ${px} rounded-xl text-sm font-semibold cursor-not-allowed border border-white/5 text-gray-600`}
        title="International payment link not yet configured — set it in Admin → Payments & Pricing">
        <Globe className="h-4 w-4" />
        {fee} — Coming Soon
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${px} rounded-xl text-sm font-semibold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all`}>
      <Globe className="h-4 w-4" />
      {fee} — International
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function PaystackButton({
  href,
  label,
  entryFee,
  primary = false,
  large = false,
}: {
  href: string;
  label: string;
  entryFee: string;
  primary?: boolean;
  large?: boolean;
}) {
  const configured = href && href.startsWith("http");
  const px = large ? "px-8 py-3" : "px-6 py-3";
  const disabledTitle = "Paystack link not yet configured — set it in Admin → Settings";

  if (!configured) {
    return (
      <span
        title={disabledTitle}
        className={`inline-flex items-center gap-2 ${px} rounded-xl text-sm font-semibold cursor-not-allowed ${
          primary
            ? "bg-primary/30 text-black/40"
            : "border border-white/5 text-gray-600"
        }`}
      >
        <Settings className="h-4 w-4" />
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 ${px} rounded-xl text-sm font-semibold transition-all ${
        primary
          ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/10"
          : "border border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
      }`}
    >
      {primary && <DollarSign className="h-4 w-4" />}
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

export default function Prize() {
  const { data: s } = useSiteSettings();

  const cashAmount = s?.prizeCashAmount ?? "₦20,000";
  const entryFee = s?.prizeEntryFee ?? "₦2,000";
  const paystackLink = s?.prizePaystackLink ?? "";
  const foreignEntryFee = s?.lppForeignEntryFeeUSD ?? "$2";
  const foreignPayLink = s?.lppForeignPayLink ?? "";
  const email = s?.prizeEmail ?? "loudthotz@gmail.com";
  const rules = s?.prizeRules
    ? s.prizeRules.split("\n").filter(Boolean)
    : DEFAULT_RULES;
  const deadline = s?.prizeDeadline || undefined;

  return (
    <div className="min-h-screen">
      {/* Countdown banner */}
      <CountdownBanner deadline={deadline} />

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

          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">🇳🇬 Nigeria</span>
              <PaystackButton href={paystackLink} label={`Pay Entry Fee — ${entryFee}`} entryFee={entryFee} primary />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">🌍 International</span>
              <ForeignEntryButton href={foreignPayLink} fee={foreignEntryFee} />
            </div>
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
              All entries that do not comply with ALL rules will be disqualified. Nigerian prize winners must have a functional NUBAN bank account to receive the cash award.
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
                desc: `Nigerians: pay ${entryFee} via Paystack. International entrants: pay ${foreignEntryFee} via our foreign gateway. Keep your payment receipt.`,
              },
              {
                step: "02",
                title: "Prepare Your Entry",
                desc: "Write your poem (max 14 lines, 6 words per line). Include a 3-line bio, your photo, phone, email, address, and payment receipt — all in one Word document (.doc / .docx).",
              },
              {
                step: "03",
                title: "Submit Your Entry",
                desc: "After payment you'll be automatically redirected to the submission portal. Fill in your details and upload your Word document (poem + bio + photo + receipt).",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="font-display text-4xl font-bold text-primary/30">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
                {s.step === "01" && (
                  <div className="flex flex-col gap-2 mt-auto">
                    {paystackLink ? (
                      <a href={paystackLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                        <CheckCircle className="h-4 w-4" />
                        🇳🇬 Pay on Paystack
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-gray-600 text-sm cursor-not-allowed">
                        <CheckCircle className="h-4 w-4" />
                        🇳🇬 Paystack — Coming Soon
                      </span>
                    )}
                    {foreignPayLink ? (
                      <a href={foreignPayLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-gray-400 text-sm font-medium hover:text-white transition-colors">
                        <Globe className="h-4 w-4" />
                        🌍 International Gateway
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-gray-600 text-sm cursor-not-allowed">
                        <Globe className="h-4 w-4" />
                        🌍 International — Coming Soon
                      </span>
                    )}
                  </div>
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
              Pay the entry fee for your region — you'll be routed to the submission portal to upload your poem. Winners are announced the last day of every month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">🇳🇬 Nigeria</span>
                <PaystackButton href={paystackLink} label={`Pay Entry Fee — ${entryFee}`} entryFee={entryFee} primary large />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">🌍 International</span>
                <ForeignEntryButton href={foreignPayLink} fee={foreignEntryFee} large />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-5">After payment, you'll be directed to the submission portal to upload your poem and details.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
