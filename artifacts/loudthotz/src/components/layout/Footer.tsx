import { Link } from "wouter";
import loudthotzLogo from "@assets/correct_1781632949414.png";
import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";
import { BookOpen, Mic2, Library, PenTool, Heart, Shield, Info } from "lucide-react";

export function Footer() {
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
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
