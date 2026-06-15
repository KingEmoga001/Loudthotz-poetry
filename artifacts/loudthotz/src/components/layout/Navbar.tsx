import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PenTool, Mic2, Library, Heart, Shield, Menu, X } from "lucide-react";
import { useListSubmissions } from "@workspace/api-client-react";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781511989631.jpeg";
import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: submissions } = useListSubmissions({ query: { enabled: true, queryKey: ["listSubmissions"] } });
  const pendingCount = submissions?.filter((s) => s.status === "pending").length || 0;

  const navLinks = [
    { href: "/poems", label: "Gallery", icon: BookOpen },
    { href: "/submit", label: "Submit", icon: PenTool },
    { href: "/live", label: "Live Readings", icon: Mic2, isLive: true },
    { href: "/books", label: "Anthologies", icon: Library },
    { href: "/donate", label: "Donate", icon: Heart },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090b06]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="h-11 w-20 overflow-hidden rounded-lg border border-white/10 group-hover:border-primary/40 transition-colors">
            <img src={loudthotzLogo} alt="Loudthotz" className="h-full w-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-widest text-primary">LOUDTHOTZ</span>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10">Poetry Event</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-gray-500">hosted under</span>
              <img src={naijaArtLogo} alt="Naija Art Initiative" className="h-3.5 w-auto object-contain rounded opacity-80" />
              <span className="text-[10px] text-secondary font-medium">Naija Art Initiative</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {link.isLive && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                )}
              </Link>
            );
          })}

          <div className="h-5 w-px bg-white/10 mx-2" />

          <Link href="/admin">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-500/10 transition-all ${location === "/admin" ? "bg-amber-500/10" : ""}`}>
              <Shield className="h-4 w-4" />
              Review Room
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {pendingCount}
                </span>
              )}
            </div>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-white/5 bg-[#090b06] overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                    {link.isLive && (
                      <span className="ml-auto flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="h-px bg-white/5 my-2" />
              <Link href="/admin" onClick={closeMobile}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 ${location === "/admin" ? "bg-amber-500/10" : "hover:bg-amber-500/10"} transition-colors`}>
                  <Shield className="h-5 w-5" />
                  Review Room
                  {pendingCount > 0 && (
                    <span className="ml-auto bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pendingCount} pending
                    </span>
                  )}
                </div>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
