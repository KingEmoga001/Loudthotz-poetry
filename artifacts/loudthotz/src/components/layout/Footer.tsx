import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 pt-16 pb-8 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-display text-2xl font-bold tracking-wider text-foreground">
              LOUD<span className="text-primary">THOTZ</span>
            </h3>
            <p className="text-muted-foreground max-w-md font-serif text-lg leading-relaxed">
              A living, breathing literary space for African and global spoken-word poets. 
              Raw and electric, like an open mic in a dimly lit Lagos art house.
            </p>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 w-fit">
              <img src={naijaArtLogo} alt="Naija Art Initiative" className="h-12 w-auto object-contain rounded" />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">An Initiative Of</p>
                <p className="text-sm font-medium">Naija Art Initiative</p>
                <p className="text-xs text-muted-foreground italic">Formerly Independent Poets Concerns</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/poems" className="text-muted-foreground hover:text-primary transition-colors text-sm">Curated Gallery</Link></li>
              <li><Link href="/live" className="text-muted-foreground hover:text-primary transition-colors text-sm">Live Readings</Link></li>
              <li><Link href="/books" className="text-muted-foreground hover:text-primary transition-colors text-sm">Anthologies</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Participate</h4>
            <ul className="space-y-3">
              <li><Link href="/submit" className="text-muted-foreground hover:text-primary transition-colors text-sm">Submit Poetry</Link></li>
              <li><Link href="/donate" className="text-muted-foreground hover:text-primary transition-colors text-sm">Support the Mission</Link></li>
              <li><Link href="/admin" className="text-muted-foreground hover:text-amber-500 transition-colors text-sm">Admin Access</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Naija Art Initiative. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}