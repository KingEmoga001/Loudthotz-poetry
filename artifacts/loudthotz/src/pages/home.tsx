import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetSiteStats, useGetFeaturedPoems } from "@workspace/api-client-react";
import { ArrowRight, BookOpen, Mic2, Star, Calendar, Users, Globe2 } from "lucide-react";
import naijaArtLogo from "@assets/7adc06f9-f8e6-4cd2-ab1c-2c2f7af5ba34_1781511989632.jpeg";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetSiteStats();
  const { data: featuredPoems, isLoading: featuredLoading } = useGetFeaturedPoems();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Brand Transition Notice */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
        Loudthotz Poetry is now officially an event under the <strong>Naija Art Initiative</strong> (formerly Independent Poets Concerns).
      </div>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden flex items-center justify-center border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none z-0" />
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-4xl">
          <Badge className="mb-6 bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 transition-colors cursor-default backdrop-blur-sm px-4 py-1.5 text-xs tracking-wider uppercase">
            A Living Literary Space
          </Badge>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground leading-[1.1]">
            Where Raw Voice <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300 italic">Meets Ink</span>
          </h1>
          
          <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            The premier platform for African and global spoken-word poets. 
            Step into the dimly lit open mic of the internet.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/poems" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-semibold">
                <BookOpen className="mr-2 h-5 w-5" />
                Read the Gallery
              </Button>
            </Link>
            <Link href="/submit" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 h-14 px-8 text-base">
                Submit a Poem
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/[0.02] border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={<BookOpen />} value={stats?.totalPoems || "--"} label="Poems Published" loading={statsLoading} />
            <StatCard icon={<Users />} value={stats?.totalPoets || "--"} label="Featured Poets" loading={statsLoading} />
            <StatCard icon={<Globe2 />} value={stats?.totalCountries || "--"} label="Countries" loading={statsLoading} />
            <StatCard icon={<Mic2 />} value={stats?.totalSessions || "--"} label="Live Sessions" loading={statsLoading} />
          </div>
        </div>
      </section>

      {/* Next Event Callout */}
      {stats?.upcomingEventTitle && (
        <section className="py-24 container mx-auto px-4">
          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-1000" />
            
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-primary font-medium text-sm tracking-widest uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                Upcoming Event
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">{stats.upcomingEventTitle}</h2>
              {stats.upcomingEventDate && (
                <div className="flex items-center gap-2 text-muted-foreground font-serif text-xl">
                  <Calendar className="h-5 w-5" />
                  {new Date(stats.upcomingEventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>

            <Link href="/live" className="relative z-10 shrink-0">
              <Button size="lg" className="rounded-full px-8">
                Join the Session <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured Poems */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-display text-4xl font-bold">Featured Works</h2>
              <p className="font-serif text-xl text-muted-foreground">Handpicked verses from our curated collection.</p>
            </div>
            <Link href="/poems" className="hidden md:flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              View all poems <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPoems?.map(poem => (
                <Link key={poem.id} href={`/poem/${poem.id}`} className="group h-full">
                  <div className="h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-amber-500">{poem.averageRating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{poem.country}</span>
                    </div>
                    
                    <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{poem.title}</h3>
                    <p className="font-serif italic text-muted-foreground mb-6">by {poem.author}</p>
                    
                    <p className="font-serif text-lg text-foreground/80 line-clamp-3 mb-8 flex-1 leading-relaxed">
                      "{poem.content.split('\n')[0]}"
                    </p>
                    
                    <div className="mt-auto flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                      Read full poem <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <Link href="/poems" className="mt-8 flex md:hidden items-center justify-center text-sm font-medium text-primary">
            View all poems <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* About / Brand Footer Banner */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
          <img src={naijaArtLogo} alt="Naija Art Initiative" className="h-20 w-auto mx-auto rounded opacity-80" />
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Loudthotz Poetry</h2>
            <p className="font-serif text-xl text-muted-foreground leading-relaxed">
              We are a community dedicated to the unfiltered expression of thought through poetry. 
              Formerly operating as Independent Poets Concerns, we are proud to continue our mission 
              under the Naija Art Initiative, bridging voices across Africa and the world.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label, loading }: { icon: React.ReactNode, value: string | number, label: string, loading: boolean }) {
  return (
    <div className="flex flex-col items-center text-center p-6 space-y-3">
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
        {icon}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-white/10 animate-pulse rounded" />
      ) : (
        <div className="font-display text-3xl font-bold">{value}</div>
      )}
      <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{label}</div>
    </div>
  );
}

// Temporary import for Badge since we didn't import it at the top to avoid clutter, let's fix it
import { Badge } from "@/components/ui/badge";