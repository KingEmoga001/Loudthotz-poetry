import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PenTool, Mic2, Library, Heart, Shield, Menu, X, Trophy, Users, Feather, Archive, Info } from "lucide-react";
import { usePendingCount } from "@/lib/firestore";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781641089854.jpeg";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pendingCount = usePendingCount();

  const navLinks = [
    { href: "/about", label: "About", icon: Info },
    { href: "/poems", label: "Gallery", icon: BookOpen },
    { href: "/submit", label: "Submit", icon: PenTool },
    { href: "/live", label: "Live", icon: Mic2, isLive: true },
    { href: "/books", label: "Anthologies", icon: Library },
    { href: "/prize", label: "LPP Prize", icon: Trophy },
    { href: "/membership", label: "Membership", icon: Users },
    { href: "/poets", label: "Poets", icon: Feather },
    { href: "/archive", label: "Archive", icon: Archive },
    { href: "/donate", label: "Donate", icon: Heart },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090b06]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">

        {/* Logo */}
        <Link href="/" className="shrink-0 group">
          <img
            src={loudthotzLogo}
            alt="Loudthotz Poetry Open Reading"
            className="h-11 w-auto object-contain rounded-lg opacity-95 group-hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Desktop Nav — icons only on md, icons+labels on xl */}
        <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {navLinks.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  active ? "text-primary bg-primary/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={link.label}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span className="hidden xl:inline">{link.label}</span>
                {link.isLive && (
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                )}
              </Link>
            );
          })}

          <div className="h-5 w-px bg-white/10 mx-1 shrink-0" />

          <Link href="/admin">
            <div className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-500/10 transition-all ${location === "/admin" ? "bg-amber-500/10" : ""}`}>
              <Shield className="h-4 w-4 shrink-0" />
              <span className="hidden xl:inline">Admin</span>
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
            <nav className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-1">
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
                    <link.icon className="h-5 w-5 shrink-0" />
                    {link.label}
                    {link.isLive && (
                      <span className="ml-auto flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="col-span-2 h-px bg-white/5 my-1" />
              <Link href="/admin" onClick={closeMobile} className="col-span-2">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 ${location === "/admin" ? "bg-amber-500/10" : "hover:bg-amber-500/10"} transition-colors`}>
                  <Shield className="h-5 w-5" />
                  Admin CMS
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
