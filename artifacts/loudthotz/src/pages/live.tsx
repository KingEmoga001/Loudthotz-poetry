import { useLivestreamStatus, useLivestreamSessions, useSiteSettings } from "@/lib/firestore";
import { Mic2, Users, Calendar, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LiveReadings() {
  const { data: status, loading: statusLoading } = useLivestreamStatus();
  const { data: sessions, loading: sessionsLoading } = useLivestreamSessions();
  const { data: s } = useSiteSettings();
  const archiveSubtext = s?.liveArchiveSubtext || "Past readings and performances.";

  return (
    <div className="min-h-screen bg-background">
      {/* Live Stage Area */}
      <section className="border-b border-white/5 bg-black relative">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Main Stage (Video/Placeholder) */}
            <div className="flex-1 rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-video relative flex flex-col items-center justify-center shadow-2xl">
              {status?.isLive && status.embedUrl ? (
                <iframe
                  src={status.embedUrl}
                  className="w-full h-full absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : status?.scheduledImage ? (
                <img
                  src={status.scheduledImage}
                  alt="Upcoming event"
                  className="w-full h-full object-contain absolute inset-0"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
                  <Mic2 className="h-24 w-24 text-white/20 mb-8" />
                  <h2 className="font-display text-3xl font-bold text-white/50 mb-2">Stage is Empty</h2>
                  <p className="font-serif text-white/40 text-lg text-center px-8">
                    {status?.scheduledAt
                      ? `Next reading scheduled for ${new Date(status.scheduledAt).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}`
                      : "No live readings currently scheduled."}
                  </p>
                </>
              )}

              {/* Live Badge Overlay */}
              {status?.isLive && (
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/50 px-3 py-1 text-sm font-bold flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    LIVE NOW
                  </Badge>
                  {status.viewerCount > 0 && (
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur border-white/10">
                      <Users className="mr-1.5 h-3 w-3" /> {status.viewerCount}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Info Sidebar */}
            <div className="w-full lg:w-96 flex flex-col gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex-1 flex flex-col">
                <div className="mb-6 border-b border-white/5 pb-4">
                  <h3 className="font-display text-2xl font-bold mb-2">
                    {status?.isLive ? status.title : (status?.title ?? "Loudthotz Open Mic")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {status?.description ?? "Join us for our regular live poetry sessions — a space for unbridled expression."}
                  </p>
                  {(status?.season || status?.episode) && (
                    <div className="mt-4 flex gap-2">
                      <Badge variant="outline" className="border-white/10 text-white/60">{status.season}</Badge>
                      <Badge variant="outline" className="border-white/10 text-white/60">Episode {status.episode}</Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <p className="text-sm text-white/20 italic">
                    Live chat is only available during active broadcasts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Sessions */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12">
            <h2 className="font-display text-3xl font-bold mb-2">The Archives</h2>
            <p className="font-serif text-xl text-muted-foreground">{archiveSubtext}</p>
          </div>

          {sessionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions?.map(session => (
                <div key={session.id} className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors flex flex-col">
                  <div className="aspect-video bg-black/50 relative flex items-center justify-center border-b border-white/5">
                    {session.recordingUrl ? (
                      <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center group/play cursor-pointer">
                        <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center group-hover/play:bg-primary/40 group-hover/play:scale-110 transition-all backdrop-blur">
                          <PlayCircle className="h-8 w-8 text-primary" />
                        </div>
                      </a>
                    ) : (
                      <span className="text-white/20 text-sm">No recording available</span>
                    )}
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="bg-black/80 backdrop-blur border-white/10">
                        {session.theme}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{session.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{session.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/40 uppercase tracking-wider font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(session.date).toLocaleDateString("en-GB")}
                      </div>
                      <span>{session.season} · Ep {session.episode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
