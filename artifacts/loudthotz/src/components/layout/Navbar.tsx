import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BookOpen, PenTool, Mic2, Library, Heart, Shield, Menu, X, Circle } from "lucide-react";
import { useListSubmissions } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781511989631.jpeg";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: submissions } = useListSubmissions({ query: { enabled: true } });
  const pendingCount = submissions?.filter(s => s.status === 'pending').length || 0;

  const navLinks = [
    { href: "/poems", label: "Gallery", icon: BookOpen },
    { href: "/submit", label: "Submit", icon: PenTool },
    { href: "/live", label: "Live Readings", icon: Mic2, isLive: true },
    { href: "/books", label: "Anthologies", icon: Library },
    { href: "/donate", label: "Donate", icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-black flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
             <img src={loudthotzLogo} alt="Loudthotz" className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-foreground">
            LOUD<span className="text-primary">THOTZ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              {link.isLive && (
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Link>
          ))}

          <div className="h-6 w-px bg-white/10 mx-2" />

          <Link href="/admin">
            <Button variant="ghost" size="sm" className={`gap-2 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 ${location === '/admin' ? 'bg-amber-500/10' : ''}`}>
              <Shield className="h-4 w-4" />
              Review Room
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-0">
                  {pendingCount}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            className="md:hidden border-b border-white/5 bg-background overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center gap-3 p-2 rounded-md ${location === link.href ? "bg-white/5 text-primary" : "text-muted-foreground"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                  {link.isLive && <Circle className="h-2 w-2 fill-red-500 text-red-500 ml-auto animate-pulse" />}
                </Link>
              ))}
              <div className="h-px w-full bg-white/5 my-2" />
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 p-2 rounded-md text-amber-500 ${location === '/admin' ? 'bg-amber-500/10' : ''}`}>
                  <Shield className="h-5 w-5" />
                  Review Room
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-auto bg-amber-500/20 text-amber-500 border-0">
                      {pendingCount} Pending
                    </Badge>
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