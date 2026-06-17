import { Link } from "wouter";
import loudthotzLogo from "@assets/correct_1781632949414.png";
import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";
import { BookOpen, Mic2, Library, PenTool, Heart, Shield, Info, Twitter, Youtube, Facebook, Instagram } from "lucide-react";
import { useSiteSettings } from "@/lib/firestore";

const DEFAULT_SOCIALS = {
  x: "https://x.com/intent/follow?original_referer=https%3A%2F%2Floudthotzpoetry.blogspot.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5ELoudthotz&screen_name=Loudthotz",
  youtube: "https://www.youtube.com/@IpcLoudthotz",
  facebook: "https://web.facebook.com/loudthotz.poetry/",
  spotify: "https://creators.spotify.com/pod/profile/loudthotzpoetry/episodes/LOUDTHOTZ-POETRY-OPEN-READING-SEASON-14-EPISODE-09-BROTHERS-e29gml8",
};

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
    { key: "x", href: socials.x, label: "Follow on X", Icon: Twitter },
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
              <img src={loudthotzLogo} alt="Loudthotz Poetry Open Reading" className="h-14 w-auto object-contain" />
            </div>
            <p className="text-gray-400 font-serif text-base leading-relaxed max-w-sm">
              A living literary space for African and global spoken-word poets — raw and electric,
              like an open mic in a dimly lit Lagos art house.
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

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Naija Art Initiative. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
