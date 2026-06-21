import { useState } from "react";
import { Link } from "wouter";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781939651416.jpeg";
import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";
import { BookOpen, Mic2, Library, PenTool, Heart, Shield, Info, Youtube, Facebook, Instagram, MessageCircle, Send, CheckCircle } from "lucide-react";
import { useSiteSettings, addFeedback } from "@/lib/firestore";

const DEFAULT_WHATSAPP = "2347064384235";

const DEFAULT_SOCIALS = {
  x: "https://x.com/intent/follow?original_referer=https%3A%2F%2Floudthotzpoetry.blogspot.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5ELoudthotz&screen_name=Loudthotz",
  youtube: "https://www.youtube.com/@IpcLoudthotz",
  facebook: "https://web.facebook.com/loudthotz.poetry/",
  spotify: "https://creators.spotify.com/pod/profile/loudthotzpoetry/episodes/LOUDTHOTZ-POETRY-OPEN-READING-SEASON-14-EPISODE-09-BROTHERS-e29gml8",
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.18 8.18 0 004.78 1.53V6.95a4.85 4.85 0 01-1.01-.26z" />
    </svg>
  );
}

function FeedbackForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await addFeedback(name.trim(), message.trim());
      setSubmitted(true);
      setName("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError("Failed to send feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-2 py-4">
        <CheckCircle className="h-6 w-6 text-primary" />
        <p className="text-sm text-gray-300 font-medium">Thank you for your feedback!</p>
        <p className="text-xs text-gray-500">We read every message and appreciate you taking the time.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
      />
      <textarea
        placeholder="Your message…"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        rows={3}
        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
      >
        <Send className="h-3.5 w-3.5" />
        {submitting ? "Sending…" : "Send Feedback"}
      </button>
    </form>
  );
}

export function Footer() {
  const { data: settings } = useSiteSettings();

  const socials = {
    x: settings?.socialX || DEFAULT_SOCIALS.x,
    youtube: settings?.socialYoutube || DEFAULT_SOCIALS.youtube,
    facebook: settings?.socialFacebook || DEFAULT_SOCIALS.facebook,
    spotify: settings?.socialSpotify || DEFAULT_SOCIALS.spotify,
    instagram: settings?.socialInstagram || "",
    tiktok: settings?.socialTiktok || "",
  };

  const socialLinks = [
    { key: "x", href: socials.x, label: "Follow on X", Icon: XIcon },
    { key: "youtube", href: socials.youtube, label: "YouTube Channel", Icon: Youtube },
    { key: "facebook", href: socials.facebook, label: "Facebook Page", Icon: Facebook },
    { key: "spotify", href: socials.spotify, label: "Spotify Podcast", IconCustom: SpotifyIcon },
    { key: "instagram", href: socials.instagram, label: "Instagram", Icon: Instagram },
    { key: "tiktok", href: socials.tiktok, label: "TikTok", IconCustom: TikTokIcon },
  ].filter(s => s.href);

  return (
    <footer className="bg-[#070906] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <img src={loudthotzLogo} alt="Loudthotz Poetry Open Reading" className="h-24 w-auto object-contain" />
            </div>
            <p className="text-gray-400 font-serif text-base leading-relaxed max-w-sm">
              {settings?.aboutText || "A living literary space for African and global spoken-word poets — raw and electric, like an open mic in a dimly lit Lagos art house."}
            </p>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
              <div className="h-9 w-9 rounded-lg overflow-hidden border border-white/10">
                <img src={naijaArtLogo} alt="Naija Art Initiative" className="h-full w-full object-contain bg-white p-0.5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">An event under</p>
                <p className="text-sm font-semibold text-secondary">Naija Art Initiative</p>
                <p className="text-[10px] text-gray-500 italic">Formerly Independent Poets Concerns</p>
              </div>
            </div>

            {/* Social icons */}
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-3">Follow Us</p>
              <div className="flex items-center flex-wrap gap-2">
                {socialLinks.map(({ key, href, label, Icon, IconCustom }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    aria-label={label}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : IconCustom ? <IconCustom className="h-4 w-4" /> : null}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Platform links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Platform</h4>
            <ul className="space-y-3">
              {[
                { href: "/poems", label: "Curated Gallery", icon: BookOpen },
                { href: "/live", label: "Live Readings", icon: Mic2 },
                { href: "/books", label: "Anthologies", icon: Library },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors group">
                    <Icon className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Participate links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Participate</h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Loudthotz", icon: Info },
                { href: "/submit", label: "Submit Poetry", icon: PenTool },
                { href: "/donate", label: "Support the Mission", icon: Heart },
                { href: "/admin", label: "Admin Access", icon: Shield, amber: true },
              ].map(({ href, label, icon: Icon, amber }) => (
                <li key={href}>
                  <Link href={href} className={`flex items-center gap-2 text-sm transition-colors group ${amber ? "text-amber-500/70 hover:text-amber-400" : "text-gray-400 hover:text-primary"}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Feedback row */}
        <div className="border-t border-white/5 pt-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Contact Us</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Have a question or want to reach us directly? Chat with us on WhatsApp — we're available for enquiries, collaborations, and event info.
            </p>
            <a
              href={`https://wa.me/${settings?.contactWhatsapp || DEFAULT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] hover:bg-[#25D366]/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <p className="text-[11px] text-gray-600">WhatsApp chat only — no calls.</p>
          </div>

          {/* Feedback */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Share Feedback</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ideas, suggestions, or something we could do better? Let us know — all feedback goes straight to our team.
            </p>
            <FeedbackForm />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Naija Art Initiative. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
