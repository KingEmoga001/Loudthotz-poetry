import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LayoutDashboard, FileText, BookOpen, Radio, Library,
  Settings, LogOut, CheckCircle, XCircle, Clock, Star, Trash2,
  Edit3, Plus, Save, Eye, EyeOff, Mic2, Calendar, Link2,
  Users, Globe2, BarChart3, RefreshCw, ChevronDown, ChevronUp,
  AlertCircle, BookMarked, Play, X, Database, Image, GripVertical,
  ToggleLeft, ToggleRight, Feather, Archive, Trophy, MessageSquare, MailOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useSubmissions, usePoems, useBooks, useLivestreamStatus,
  useLivestreamSessions, useSiteSettings, useSiteStats,
  approveSubmission, rejectSubmission, updatePoem, deletePoem,
  createBook, updateBook, deleteBook, updateLivestreamStatus,
  addLivestreamSession, updateLivestreamSession, deleteLivestreamSession,
  updateSiteSettings, seedDatabase,
  useAllHeroImages, addHeroImage, updateHeroImage, deleteHeroImage, uploadHeroImage,
  usePoets, createPoet, updatePoet, deletePoet, seedStaticPoets,
  usePoetPoems, createPoetPoem,
  useEvents, createEvent, updateEvent, deleteEvent,
  importStaticSessions,
  useLppSubmissions, useFeedback, markFeedbackRead, deleteFeedback,
  type FireSubmission, type FirePoem, type FireBook, type FireLivestreamSession,
  type FireHeroImage, type FirePoet, type FireEvent, type FireLppSubmission, type FireFeedback,
} from "@/lib/firestore";
import loudthotzIcon from "@assets/loudthouz-small-screen-logo_1781609118102.png";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781511989631.jpeg";

/* ──────────────────────────── types ──────────────────────────── */
type Tab = "dashboard" | "submissions" | "poems" | "livestream" | "books" | "poets" | "events" | "hero" | "settings" | "feedback";

/* ──────────────────────────── helpers ──────────────────────────── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium shadow-2xl max-w-sm ${
        type === "success" ? "bg-primary/10 border-primary/30 text-primary" : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
    </motion.div>
  );
}

function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const show = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : status === "approved" ? "bg-primary/10 text-primary border-primary/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${cls}`}>{status}</span>;
}

/* ──────────────────────────── Dashboard ──────────────────────────── */
function Dashboard() {
  const stats = useSiteStats();
  const { data: submissions } = useSubmissions();
  const { data: liveStatus } = useLivestreamStatus();
  const pending = submissions?.filter(s => s.status === "pending").length ?? 0;

  const cards = [
    { label: "Published Poems", value: stats.totalPoems, icon: BookOpen, color: "text-primary" },
    { label: "Featured Poets", value: stats.totalPoets, icon: Users, color: "text-primary" },
    { label: "Countries", value: stats.totalCountries, icon: Globe2, color: "text-secondary" },
    { label: "Live Sessions", value: stats.totalSessions, icon: Radio, color: "text-secondary" },
    { label: "Pending Review", value: pending, icon: Clock, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Dashboard</h2>
        <p className="text-gray-500 text-sm">Site overview and quick controls</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <Icon className={`h-5 w-5 ${color} mb-3`} />
            <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Live Status Card */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${liveStatus?.isLive ? "bg-red-500/20 border border-red-500/30" : "bg-white/5 border border-white/10"}`}>
            <Radio className={`h-5 w-5 ${liveStatus?.isLive ? "text-red-400 animate-pulse" : "text-gray-500"}`} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{liveStatus?.isLive ? "LIVE NOW" : "Stream Offline"}</p>
            <p className="text-gray-500 text-xs">{liveStatus?.title ?? "—"}</p>
            {liveStatus?.isLive && <p className="text-xs text-secondary mt-0.5">{liveStatus.viewerCount} viewers</p>}
          </div>
        </div>
        <div className="text-xs text-gray-500 italic">Go to Livestream tab to control</div>
      </div>

      {/* Pending submissions alert */}
      {pending > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 flex items-center gap-4">
          <Clock className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-400">{pending} submission{pending > 1 ? "s" : ""} awaiting review</p>
            <p className="text-xs text-gray-500 mt-0.5">Go to Submissions tab to approve or reject</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── LPP Prize Submissions ──────────────────────────── */
function LppPrizeSubmissionsPanel() {
  const { data: subs, loading } = useLppSubmissions();

  const downloadAll = () => {
    if (subs.length === 0) return;
    subs.forEach((s, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = s.fileUrl;
        a.download = s.fileName || `lpp-submission-${i + 1}.docx`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 600);
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-gray-500 text-sm">Word document entries submitted via the LPP Prize submission page.</p>
        </div>
        <button onClick={downloadAll} disabled={subs.length === 0}
          className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary font-semibold px-4 py-2 rounded-xl text-sm hover:bg-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          <BookMarked className="h-4 w-4" /> Download All ({subs.length})
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading submissions…</div>
      ) : subs.length === 0 ? (
        <div className="text-center py-16 border border-white/5 rounded-xl">
          <Trophy className="h-10 w-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No LPP Prize submissions yet.</p>
          <p className="text-gray-600 text-xs mt-1">Submissions come from the /lpp-submit page after Paystack payment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subs.map((s: FireLppSubmission) => (
            <div key={s.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display text-base font-bold text-white">{s.poemTitle || "(Untitled)"}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">{s.month}</span>
                  </div>
                  <p className="text-sm text-gray-400">by <span className="font-semibold text-white">{s.name}</span></p>
                  <p className="text-xs text-gray-600 mt-0.5">{s.email} · {s.phone}</p>
                  {s.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2 font-serif italic">"{s.bio}"</p>}
                  <p className="text-xs text-gray-700 mt-1">{new Date(s.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <a href={s.fileUrl} target="_blank" rel="noreferrer" download={s.fileName}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:text-primary hover:border-primary/30 font-medium px-4 py-2 rounded-xl text-xs transition-all shrink-0">
                  <BookMarked className="h-3.5 w-3.5" /> {s.fileName || "Download"}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── Submissions ──────────────────────────── */
function Submissions({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: submissions, loading } = useSubmissions();
  const [subTab, setSubTab] = useState<"poems" | "lpp">("poems");
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const filtered = (submissions ?? []).filter(s => filter === "all" ? true : s.status === filter);

  const handleApprove = async (s: FireSubmission) => {
    try { await approveSubmission(s); show(`"${s.title}" approved and published!`); }
    catch { show("Approval failed. Try again.", "error"); }
  };

  const handleReject = async (id: string) => {
    try { await rejectSubmission(id, rejectNote); setRejectNote(""); show("Submission rejected."); }
    catch { show("Rejection failed.", "error"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Submissions</h2>
      </div>

      {/* Sub-tab toggle */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        <button onClick={() => setSubTab("poems")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${subTab === "poems" ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"}`}>
          Poem Submissions
        </button>
        <button onClick={() => setSubTab("lpp")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${subTab === "lpp" ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"}`}>
          LPP Prize Submissions
        </button>
      </div>

      {subTab === "lpp" && <LppPrizeSubmissionsPanel />}

      {subTab === "poems" && <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-gray-500 text-sm">Review poems submitted by the community</p>
        </div>
        <div className="flex gap-1.5 bg-white/[0.03] border border-white/5 rounded-xl p-1">
          {(["pending", "approved", "rejected", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading submissions…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-white/5 rounded-xl">
          <FileText className="h-10 w-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No {filter === "all" ? "" : filter} submissions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display text-base font-bold text-white">{s.title}</h3>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-sm text-gray-400 font-serif italic">by {s.author} · {s.country}</p>
                  <p className="text-xs text-gray-600 mt-1">{new Date(s.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="p-2 text-gray-500 hover:text-white transition-colors">
                    {expanded === s.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {s.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(s)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => handleReject(s.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {expanded === s.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <pre className="font-serif text-sm text-gray-300 leading-relaxed whitespace-pre-wrap bg-white/[0.02] rounded-xl p-4 border border-white/5">{s.content}</pre>
                      {s.status === "pending" && (
                        <div className="mt-3 flex gap-2">
                          <input value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                            placeholder="Optional rejection note…"
                            className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary/40" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
      </>}
    </div>
  );
}

/* ──────────────────────────── Poems ──────────────────────────── */
function PoemsManager({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: poems, loading } = usePoems();
  const [editing, setEditing] = useState<FirePoem | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleToggleFeatured = async (p: FirePoem) => {
    try { await updatePoem(p.id, { isFeatured: !p.isFeatured }); show(`${p.isFeatured ? "Removed from" : "Added to"} featured.`); }
    catch { show("Update failed.", "error"); }
  };

  const handleTogglePoemOfMonth = async (p: FirePoem) => {
    try { await updatePoem(p.id, { isPoemOfMonth: !p.isPoemOfMonth }); show(`${p.isPoemOfMonth ? "Removed from" : "Added to"} Poem of the Month.`); }
    catch { show("Update failed.", "error"); }
  };

  const handleDelete = async (p: FirePoem) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try { await deletePoem(p.id); show("Poem deleted."); }
    catch { show("Delete failed.", "error"); }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try { await updatePoem(editing.id, { title: editing.title, author: editing.author, season: editing.season, theme: editing.theme, isFeatured: editing.isFeatured, isPoemOfMonth: editing.isPoemOfMonth }); setEditing(null); show("Poem updated."); }
    catch { show("Update failed.", "error"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Published Poems</h2>
        <p className="text-gray-500 text-sm">Manage all poems in the gallery</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading…</div>
      ) : (
        <div className="space-y-3">
          {poems?.map((p) => (
            <div key={p.id} className={`bg-white/[0.02] border rounded-xl overflow-hidden transition-colors ${p.isFeatured ? "border-primary/20" : "border-white/5"}`}>
              <div className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-sm font-bold text-white">{p.title}</p>
                    {p.isFeatured && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">Featured</span>}
                    {p.isPoemOfMonth && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20">POTM</span>}
                    {p.theme && <span className="text-[10px] text-secondary border border-secondary/20 px-2 py-0.5 rounded">{p.theme}</span>}
                  </div>
                  <p className="text-xs text-gray-400 font-serif italic mt-0.5">by {p.author} · {p.country}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" /> {p.averageRating.toFixed(1)} ({p.ratingCount})</span>
                    <span>{new Date(p.publishedAt).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="p-1.5 text-gray-500 hover:text-white transition-colors">
                    {expanded === p.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setEditing(p)} className="p-1.5 text-gray-500 hover:text-primary transition-colors"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => handleTogglePoemOfMonth(p)} title={p.isPoemOfMonth ? "Remove from Poem of the Month" : "Set as Poem of the Month"} className={`p-1.5 transition-colors ${p.isPoemOfMonth ? "text-amber-400" : "text-gray-500 hover:text-amber-400"}`}><Trophy className="h-4 w-4" /></button>
                  <button onClick={() => handleToggleFeatured(p)} className={`p-1.5 transition-colors ${p.isFeatured ? "text-primary" : "text-gray-500 hover:text-primary"}`}><Star className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <AnimatePresence>
                {expanded === p.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <pre className="font-serif text-sm text-gray-400 leading-relaxed whitespace-pre-wrap px-5 pb-5 border-t border-white/5 pt-4">{p.content}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0d100a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-lg font-bold text-white">Edit Poem</h3>
              {(["title", "author", "season", "theme"] as const).map(field => (
                <div key={field}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 capitalize">{field}</label>
                  <input value={(editing[field] ?? "") as string}
                    onChange={e => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 transition-colors" />
                </div>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setEditing({ ...editing, isFeatured: !editing.isFeatured })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${editing.isFeatured ? "bg-primary" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${editing.isFeatured ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-gray-300">Featured poem</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setEditing({ ...editing, isPoemOfMonth: !editing.isPoemOfMonth })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${editing.isPoemOfMonth ? "bg-amber-500" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${editing.isPoemOfMonth ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-gray-300">Poem of the Month (appears in Gallery)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Save className="h-4 w-4" /> Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────── Livestream ──────────────────────────── */
function LivestreamControl({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: status } = useLivestreamStatus();
  const { data: sessions } = useLivestreamSessions();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", season: "", episode: "", embedUrl: "", streamUrl: "", scheduledAt: "" });
  const [addSessionForm, setAddSessionForm] = useState({ title: "", description: "", theme: "", season: "", episode: "", date: "", recordingUrl: "" });

  const handleToggleLive = async () => {
    const next = !status?.isLive;
    try {
      await updateLivestreamStatus({ isLive: next, viewerCount: next ? (status?.viewerCount ?? 0) : 0 });
      show(next ? "Stream is now LIVE!" : "Stream set to offline.");
    } catch { show("Failed to update.", "error"); }
  };

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      const upd: Record<string, unknown> = {};
      if (form.title) upd.title = form.title;
      if (form.description) upd.description = form.description;
      if (form.season) upd.season = form.season;
      if (form.episode) upd.episode = parseInt(form.episode);
      if (form.embedUrl) upd.embedUrl = form.embedUrl;
      if (form.streamUrl) upd.streamUrl = form.streamUrl;
      if (form.scheduledAt) upd.scheduledAt = form.scheduledAt;
      await updateLivestreamStatus(upd as never);
      show("Livestream settings saved.");
      setForm({ title: "", description: "", season: "", episode: "", embedUrl: "", streamUrl: "", scheduledAt: "" });
    } catch { show("Save failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleAddSession = async () => {
    try {
      await addLivestreamSession({ ...addSessionForm, episode: parseInt(addSessionForm.episode) || 1 });
      setAddSessionForm({ title: "", description: "", theme: "", season: "", episode: "", date: "", recordingUrl: "" });
      show("Session added.");
    } catch { show("Failed to add session.", "error"); }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    try { await deleteLivestreamSession(id); show("Session deleted."); }
    catch { show("Delete failed.", "error"); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Livestream Control</h2>
        <p className="text-gray-500 text-sm">Manage the live stream stage and session archive</p>
      </div>

      {/* Live Toggle */}
      <div className={`rounded-2xl border p-6 ${status?.isLive ? "border-red-500/30 bg-red-500/5" : "border-white/5 bg-white/[0.02]"}`}>
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${status?.isLive ? "bg-red-500/20 border border-red-500/30" : "bg-white/5 border border-white/10"}`}>
              <Radio className={`h-6 w-6 ${status?.isLive ? "text-red-400 animate-pulse" : "text-gray-500"}`} />
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg">{status?.isLive ? "STREAMING LIVE" : "Stream Offline"}</p>
              <p className="text-gray-400 text-sm">{status?.title ?? "No title set"}</p>
              {status?.isLive && <p className="text-xs text-secondary mt-0.5">{status.viewerCount} viewers</p>}
            </div>
          </div>
          <button onClick={handleToggleLive}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${status?.isLive ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30" : "bg-primary text-black hover:bg-primary/90"}`}>
            {status?.isLive ? "Go Offline" : "Go Live"}
          </button>
        </div>
        {status?.embedUrl && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <Link2 className="h-3.5 w-3.5" />
            <span className="truncate">{status.embedUrl}</span>
          </div>
        )}
      </div>

      {/* Edit stream settings */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Update Stream Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "title", label: "Stream Title", placeholder: status?.title ?? "e.g. Brothers — Season 14" },
            { key: "description", label: "Description", placeholder: status?.description ?? "A brief description of this session" },
            { key: "season", label: "Season", placeholder: status?.season ?? "Season 14" },
            { key: "episode", label: "Episode #", placeholder: String(status?.episode ?? 10) },
            { key: "embedUrl", label: "YouTube/Zoom Embed URL", placeholder: "https://www.youtube.com/embed/..." },
            { key: "streamUrl", label: "Direct Stream URL", placeholder: "https://..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
              <input
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Schedule Next Session</label>
            <input type="datetime-local" value={form.scheduledAt}
              onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 transition-colors" />
          </div>
        </div>
        <button onClick={handleSaveStatus} disabled={saving}
          className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      {/* Add session */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Past Session</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "title", label: "Title", placeholder: "e.g. Women Who Thunder" },
            { key: "theme", label: "Theme", placeholder: "e.g. Womanhood & Power" },
            { key: "season", label: "Season", placeholder: "e.g. Season 14" },
            { key: "episode", label: "Episode #", placeholder: "7" },
            { key: "description", label: "Description", placeholder: "Brief description" },
            { key: "recordingUrl", label: "Recording URL", placeholder: "https://youtube.com/..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
              <input value={(addSessionForm as Record<string, string>)[key]}
                onChange={e => setAddSessionForm({ ...addSessionForm, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Session Date</label>
            <input type="date" value={addSessionForm.date} onChange={e => setAddSessionForm({ ...addSessionForm, date: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40" />
          </div>
        </div>
        <button onClick={handleAddSession}
          className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-secondary/20 transition-all">
          <Plus className="h-4 w-4" /> Add Session
        </button>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Session Archive ({sessions?.length ?? 0})</h3>
        {sessions?.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <Play className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{s.title}</p>
              <p className="text-xs text-gray-500">{s.season} · {new Date(s.date).toLocaleDateString("en-GB")} · {s.theme}</p>
            </div>
            {s.recordingUrl && <a href={s.recordingUrl} target="_blank" rel="noreferrer" className="text-secondary text-xs hover:underline shrink-0">View</a>}
            <button onClick={() => handleDeleteSession(s.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────── Books ──────────────────────────── */
function BooksManager({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: books, loading } = useBooks();
  const emptyForm = { title: "", subtitle: "", description: "", price: "", amazonUrl: "", imageUrl: "", accentColor: "lime", coverTagline: "" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<FireBook | null>(null);

  const handleCreate = async () => {
    if (!form.title || !form.amazonUrl) { show("Title and Amazon URL are required.", "error"); return; }
    try { await createBook(form); setForm(emptyForm); show("Book added!"); }
    catch { show("Failed to add book.", "error"); }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try { await updateBook(editing.id, editing); setEditing(null); show("Book updated."); }
    catch { show("Update failed.", "error"); }
  };

  const handleDelete = async (b: FireBook) => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    try { await deleteBook(b.id); show("Book deleted."); }
    catch { show("Delete failed.", "error"); }
  };

  const bookFields: { key: keyof typeof emptyForm; label: string; placeholder: string; hint?: string }[] = [
    { key: "title", label: "Title", placeholder: "e.g. FIRST GONG" },
    { key: "subtitle", label: "Subtitle / Volume", placeholder: "e.g. Anthology Vol. I" },
    { key: "price", label: "Price (₦)", placeholder: "e.g. ₦5,000", hint: "Use the ₦ symbol, e.g. ₦5,000" },
    { key: "amazonUrl", label: "Amazon Link", placeholder: "https://amazon.com/dp/...", hint: "Full Amazon product URL" },
    { key: "imageUrl", label: "Cover Image URL", placeholder: "https://...", hint: "Paste a direct link to the book cover image" },
    { key: "description", label: "Description", placeholder: "Brief description of the anthology" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Books & Anthologies</h2>
        <p className="text-gray-500 text-sm">Add your cover image URL, price in ₦, description and Amazon link. Each card on the site links directly to Amazon.</p>
      </div>

      {/* Current books */}
      {!loading && books && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {books.map((b) => (
            <div key={b.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex gap-4">
              {b.imageUrl ? (
                <img src={b.imageUrl} alt={b.title} className="w-16 h-20 object-cover rounded-lg shrink-0 border border-white/10" />
              ) : (
                <div className={`w-16 h-20 rounded-lg shrink-0 flex items-center justify-center ${b.accentColor === "lime" ? "bg-primary/10" : "bg-secondary/10"}`}>
                  <Library className="h-5 w-5 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-display font-bold text-sm text-white truncate">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.price || "No price set"}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => setEditing(b)} className="p-1.5 text-gray-500 hover:text-primary transition-colors"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(b)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{b.description}</p>
                <a href={b.amazonUrl} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 hover:underline font-semibold uppercase tracking-wider"><Link2 className="h-3 w-3" /> Amazon</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add book */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Book</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookFields.map(({ key, label, placeholder, hint }) => (
            <div key={key} className={key === "description" ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</label>
              {hint && <p className="text-[10px] text-gray-600 mb-1.5">{hint}</p>}
              {key === "description" ? (
                <textarea value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} rows={2}
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 resize-none" />
              ) : (
                <input value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
              )}
            </div>
          ))}
          {form.imageUrl && (
            <div className="sm:col-span-2">
              <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Image Preview</p>
              <img src={form.imageUrl} alt="preview" className="h-24 object-contain rounded-lg border border-white/10" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
          )}
        </div>
        <button onClick={handleCreate}
          className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Add Book
        </button>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#0d100a] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-lg font-bold text-white">Edit Book</h3>
              {bookFields.map(({ key, label, placeholder, hint }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
                  {hint && <p className="text-[10px] text-gray-600 mb-1.5">{hint}</p>}
                  {key === "description" ? (
                    <textarea value={((editing as unknown as Record<string, unknown>)[key] as string) ?? ""}
                      onChange={e => setEditing({ ...editing, [key]: e.target.value } as FireBook)}
                      placeholder={placeholder} rows={2}
                      className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 resize-none" />
                  ) : (
                    <input value={((editing as unknown as Record<string, unknown>)[key] as string) ?? ""}
                      onChange={e => setEditing({ ...editing, [key]: e.target.value } as FireBook)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40" />
                  )}
                  {key === "imageUrl" && editing.imageUrl && (
                    <img src={editing.imageUrl} alt="preview" className="mt-2 h-20 object-contain rounded-lg border border-white/10" onError={e => (e.currentTarget.style.display = "none")} />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm flex items-center justify-center gap-2"><Save className="h-4 w-4" /> Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────── Poet Poems Modal ──────────────────────────── */
function PoetPoemsModal({ poet, show, onClose }: { poet: FirePoet; show: (m: string, t?: "success" | "error") => void; onClose: () => void }) {
  const { data: poems, loading } = usePoetPoems(poet.name);
  const [form, setForm] = useState({ title: "", content: "", country: "", season: "", theme: "" });
  const [saving, setSaving] = useState(false);
  const [editingPoem, setEditingPoem] = useState<FirePoem | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.content.trim()) { show("Title and content are required.", "error"); return; }
    setSaving(true);
    try {
      await createPoetPoem(poet.id, poet.name, form);
      setForm({ title: "", content: "", country: "", season: "", theme: "" });
      show(`Poem added for ${poet.name}!`);
    } catch { show("Failed to add poem.", "error"); }
    finally { setSaving(false); }
  };

  const handleEditSave = async () => {
    if (!editingPoem) return;
    setEditSaving(true);
    try {
      await updatePoem(editingPoem.id, {
        title: editingPoem.title,
        content: editingPoem.content,
        country: editingPoem.country,
        season: editingPoem.season,
        theme: editingPoem.theme,
      });
      setEditingPoem(null);
      show("Poem updated.");
    } catch { show("Update failed.", "error"); }
    finally { setEditSaving(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-[#0d100a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            {poet.imageUrl ? (
              <img src={poet.imageUrl} alt={poet.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Feather className="h-4 w-4 text-primary/60" />
              </div>
            )}
            <div>
              <h3 className="font-display text-base font-bold text-white">{poet.name}</h3>
              <p className="text-xs text-gray-500">Poems</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 space-y-6">
          {/* Existing poems */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Published ({loading ? "…" : poems.length})
            </p>
            {loading && <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />)}</div>}
            {!loading && poems.length === 0 && (
              <p className="text-sm text-gray-600 py-4 text-center">No poems yet — add one below.</p>
            )}
            {!loading && poems.length > 0 && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {poems.map((poem) => (
                  <div key={poem.id}>
                    {editingPoem?.id === poem.id ? (
                      /* ── Inline edit form ── */
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                        <input
                          value={editingPoem.title}
                          onChange={e => setEditingPoem({ ...editingPoem, title: e.target.value })}
                          placeholder="Title"
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40"
                        />
                        <textarea
                          value={editingPoem.content}
                          onChange={e => setEditingPoem({ ...editingPoem, content: e.target.value })}
                          rows={6}
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 resize-none font-serif leading-relaxed"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            value={editingPoem.country ?? ""}
                            onChange={e => setEditingPoem({ ...editingPoem, country: e.target.value })}
                            placeholder="Country"
                            className="px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40"
                          />
                          <input
                            value={editingPoem.season ?? ""}
                            onChange={e => setEditingPoem({ ...editingPoem, season: e.target.value })}
                            placeholder="Season"
                            className="px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40"
                          />
                          <input
                            value={editingPoem.theme ?? ""}
                            onChange={e => setEditingPoem({ ...editingPoem, theme: e.target.value })}
                            placeholder="Theme"
                            className="px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingPoem(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-xs hover:bg-white/5 transition-colors">Cancel</button>
                          <button onClick={handleEditSave} disabled={editSaving} className="flex-1 py-2 rounded-lg bg-primary text-black font-bold text-xs hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-1">
                            <Save className="h-3 w-3" />{editSaving ? "Saving…" : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Read view ── */
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <BookOpen className="h-3.5 w-3.5 text-primary/50 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{poem.title}</p>
                          <div className="flex gap-2 flex-wrap mt-0.5">
                            {poem.country && <span className="text-[10px] text-gray-600">{poem.country}</span>}
                            {poem.season && <span className="text-[10px] text-gray-600">{poem.season}</span>}
                            {poem.theme && <span className="text-[10px] text-gray-600">{poem.theme}</span>}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed font-serif">
                            {poem.content.split("\n").slice(0, 2).join(" · ")}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setEditingPoem(poem)} className="p-1 text-gray-600 hover:text-primary transition-colors"><Edit3 className="h-3 w-3" /></button>
                          <button onClick={async () => { if (!confirm(`Delete "${poem.title}"?`)) return; try { await deletePoem(poem.id); show("Poem deleted."); } catch { show("Delete failed.", "error"); } }} className="p-1 text-gray-600 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add new poem */}
          <div className="border-t border-white/5 pt-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Post New Poem</p>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Poem title"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
            />
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder={"Paste or type the poem here…\nUse line breaks to separate stanzas."}
              rows={8}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors resize-none font-serif leading-relaxed"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.season}
                onChange={e => setForm({ ...form, season: e.target.value })}
                placeholder="Season (e.g. Season 14)"
                className="px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
              />
              <input
                value={form.theme}
                onChange={e => setForm({ ...form, theme: e.target.value })}
                placeholder="Theme (optional)"
                className="px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Plus className="h-4 w-4" /> {saving ? "Posting…" : "Post Poem"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────── Poets ──────────────────────────── */
function PoetsManager({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: poets, loading } = usePoets();
  const emptyForm: Omit<FirePoet, "id"> = { name: "", bio: "", country: "", imageUrl: "", social: "" };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<FirePoet | null>(null);
  const [poetPoemsTarget, setPoetPoemsTarget] = useState<FirePoet | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.name.trim()) { show("Name is required.", "error"); return; }
    setSaving(true);
    try { await createPoet(form); setForm(emptyForm); show("Poet added!"); }
    catch { show("Failed to add poet.", "error"); }
    finally { setSaving(false); }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try { await updatePoet(editing.id, editing); setEditing(null); show("Poet updated."); }
    catch { show("Update failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (p: FirePoet) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try { await deletePoet(p.id); show("Poet removed."); }
    catch { show("Delete failed.", "error"); }
  };

  const fields: { key: keyof Omit<FirePoet, "id">; label: string; placeholder: string; hint?: string }[] = [
    { key: "name", label: "Full Name", placeholder: "e.g. Soonest Nathaniel" },
    { key: "country", label: "Country", placeholder: "e.g. Nigeria" },
    { key: "imageUrl", label: "Photo URL", placeholder: "https://…", hint: "Direct link to a portrait photo" },
    { key: "social", label: "Profile / Social Link", placeholder: "https://instagram.com/…", hint: "Optional link to their social or blog" },
    { key: "bio", label: "Short Bio", placeholder: "A few words about this poet…", hint: "1–2 sentences max" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Poets</h2>
        <p className="text-gray-500 text-sm">Add a photo URL, bio and country for each poet to show rich profile cards on the Poets page.</p>
      </div>

      {/* Existing poets */}
      {!loading && poets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {poets.map((p) => (
            <div key={p.id} className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex gap-3 items-center">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-full shrink-0 border border-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-full shrink-0 bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Feather className="h-5 w-5 text-primary/60" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                {p.country && <p className="text-xs text-gray-500">{p.country}</p>}
                {p.bio && <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{p.bio}</p>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => setPoetPoemsTarget(p)} title="Manage poems" className="p-1.5 text-gray-500 hover:text-primary transition-colors"><BookOpen className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditing(p)} title="Edit poet" className="p-1.5 text-gray-500 hover:text-primary transition-colors"><Edit3 className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDelete(p)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />)}
        </div>
      )}

      {/* Edit modal overlay */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0d100a] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">Edit Poet</h3>
                <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ key, label, placeholder, hint }) => (
                  <div key={key} className={key === "bio" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
                    {key === "bio" ? (
                      <textarea
                        value={editing[key] ?? ""}
                        onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors resize-none"
                      />
                    ) : (
                      <input
                        value={editing[key] ?? ""}
                        onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
                      />
                    )}
                    {hint && <p className="text-[10px] text-gray-600 mt-0.5">{hint}</p>}
                    {key === "imageUrl" && editing.imageUrl && (
                      <img src={editing.imageUrl} alt="preview" className="mt-2 w-16 h-16 object-cover rounded-full border border-white/10" onError={e => (e.currentTarget.style.display = "none")} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poet poems modal */}
      <AnimatePresence>
        {poetPoemsTarget && (
          <PoetPoemsModal poet={poetPoemsTarget} show={show} onClose={() => setPoetPoemsTarget(null)} />
        )}
      </AnimatePresence>

      {/* Bulk import */}
      {poets.length === 0 && !loading && (
        <ImportStaticPoets show={show} />
      )}
      {poets.length > 0 && (
        <ImportStaticPoets show={show} compact />
      )}

      {/* Add new */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Poet</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, placeholder, hint }) => (
            <div key={key} className={key === "bio" ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
              {key === "bio" ? (
                <textarea
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 transition-colors resize-none"
                />
              ) : (
                <input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 transition-colors"
                />
              )}
              {hint && <p className="text-[10px] text-gray-600 mt-0.5">{hint}</p>}
            </div>
          ))}
        </div>
        <button onClick={handleCreate} disabled={saving} className="flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/30 transition-all disabled:opacity-60">
          <Plus className="h-4 w-4" /> {saving ? "Adding…" : "Add Poet"}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────── Import Static Poets ──────────────────────────── */
function ImportStaticPoets({ show, compact }: { show: (m: string, t?: "success" | "error") => void; compact?: boolean }) {
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!confirm("This will add the 35 community poets from the website into Firestore so you can edit their profiles. Duplicates are skipped. Continue?")) return;
    setImporting(true);
    try {
      const added = await seedStaticPoets();
      show(added > 0 ? `${added} poets imported! You can now edit each one.` : "All poets are already in the database.");
    } catch { show("Import failed. Please try again.", "error"); }
    finally { setImporting(false); }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4 p-4 bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
        <div>
          <p className="text-xs font-semibold text-gray-300">Import community poets from website</p>
          <p className="text-[10px] text-gray-600 mt-0.5">Adds any missing names from the static list — skips duplicates</p>
        </div>
        <button onClick={handleImport} disabled={importing}
          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-xs font-semibold transition-all disabled:opacity-50">
          <RefreshCw className={`h-3.5 w-3.5 ${importing ? "animate-spin" : ""}`} />
          {importing ? "Importing…" : "Sync Static List"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-6 text-center space-y-4">
      <Users className="h-10 w-10 text-amber-400 mx-auto" />
      <div>
        <p className="font-semibold text-white text-sm">No poets in Firestore yet</p>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Import the 35 community poets already listed on the website. Once imported, you can add photos, bios, countries and social links to each one.</p>
      </div>
      <button onClick={handleImport} disabled={importing}
        className="flex items-center gap-2 mx-auto bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold px-6 py-3 rounded-xl text-sm hover:bg-amber-500/30 transition-all disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${importing ? "animate-spin" : ""}`} />
        {importing ? "Importing…" : "Import 35 Community Poets"}
      </button>
    </div>
  );
}

/* ──────────────────────────── Events ──────────────────────────── */
function EventsManager({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: events, loading: eventsLoading } = useEvents();
  const { data: sessions, loading: sessionsLoading } = useLivestreamSessions();
  const loading = eventsLoading || sessionsLoading;

  /* editing discriminated union: event or session */
  const [editingEvent, setEditingEvent] = useState<FireEvent | null>(null);
  const [editingSession, setEditingSession] = useState<FireLivestreamSession | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  const emptyForm: Omit<FireEvent, "id"> = {
    title: "", description: "", date: "", season: "", episode: undefined,
    theme: "", venue: "", youtubeUrl: "", blogUrl: "", imageUrl: "",
  };
  const [form, setForm] = useState(emptyForm);

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) > now);
  const pastEvents = events.filter((e) => new Date(e.date) <= now);

  /* All sessions from livestream_sessions are past events */
  const pastAll = [
    ...pastEvents.map((e) => ({ kind: "event" as const, id: e.id, title: e.title, date: e.date, season: e.season, theme: e.theme, description: e.description, recordingUrl: e.youtubeUrl, blogUrl: e.blogUrl, raw: e })),
    ...sessions.map((s) => ({ kind: "session" as const, id: s.id, title: s.title, date: s.date, season: s.season, theme: s.theme, description: s.description, recordingUrl: s.recordingUrl, blogUrl: s.blogUrl, raw: s })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCreate = async () => {
    if (!form.title.trim()) { show("Title is required.", "error"); return; }
    if (!form.date) { show("Date is required.", "error"); return; }
    setSaving(true);
    try {
      await createEvent({ ...form, episode: form.episode ? Number(form.episode) : undefined });
      setForm(emptyForm);
      show("Event added!");
    } catch { show("Failed to add event.", "error"); }
    finally { setSaving(false); }
  };

  const handleSaveEvent = async () => {
    if (!editingEvent) return;
    setSaving(true);
    try {
      await updateEvent(editingEvent.id, editingEvent);
      setEditingEvent(null);
      show("Event updated.");
    } catch { show("Update failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleSaveSession = async () => {
    if (!editingSession) return;
    setSaving(true);
    try {
      await updateLivestreamSession(editingSession.id, editingSession);
      setEditingSession(null);
      show("Session updated.");
    } catch { show("Update failed.", "error"); }
    finally { setSaving(false); }
  };

  const eventFields: { key: keyof Omit<FireEvent, "id">; label: string; placeholder: string; hint?: string; type?: string; span?: boolean }[] = [
    { key: "title", label: "Event Title", placeholder: "e.g. Brothers — Spotlights on Kinship" },
    { key: "date", label: "Date & Time", placeholder: "", type: "datetime-local" },
    { key: "season", label: "Season", placeholder: "e.g. Season 14" },
    { key: "episode", label: "Episode #", placeholder: "e.g. 9", type: "number" },
    { key: "theme", label: "Theme", placeholder: "e.g. Kinship & Brotherhood" },
    { key: "venue", label: "Venue / Platform", placeholder: "e.g. Zoom / The Hub Lagos" },
    { key: "youtubeUrl", label: "YouTube / Recording URL", placeholder: "https://youtube.com/..." },
    { key: "blogUrl", label: "Blog Post URL", placeholder: "https://loudthotzpoetry.blogspot.com/..." },
    { key: "imageUrl", label: "Cover Image URL", placeholder: "https://..." },
    { key: "description", label: "Description", placeholder: "Brief description of this event", span: true },
  ];

  const sessionFields: { key: keyof Omit<FireLivestreamSession, "id">; label: string; placeholder: string; type?: string; span?: boolean }[] = [
    { key: "title", label: "Session Title", placeholder: "e.g. Brothers — Spotlights on Kinship" },
    { key: "date", label: "Date", placeholder: "", type: "datetime-local" },
    { key: "season", label: "Season", placeholder: "e.g. Season 14" },
    { key: "episode", label: "Episode #", placeholder: "e.g. 9", type: "number" },
    { key: "theme", label: "Theme", placeholder: "e.g. Kinship & Brotherhood" },
    { key: "recordingUrl", label: "Recording / YouTube URL", placeholder: "https://youtube.com/..." },
    { key: "blogUrl", label: "Blog Post URL", placeholder: "https://loudthotzpoetry.blogspot.com/..." },
    { key: "imageUrl", label: "Cover Image URL", placeholder: "https://example.com/image.jpg", span: true },
    { key: "description", label: "Description", placeholder: "Brief description", span: true },
  ];

  const UpcomingCard = ({ ev }: { ev: FireEvent }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 transition-all">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Calendar className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">Upcoming</span>
        </div>
        <p className="text-xs text-gray-500">
          {new Date(ev.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          {ev.season && ` · ${ev.season}`}
          {ev.theme && ` · ${ev.theme}`}
        </p>
        {ev.venue && <p className="text-[10px] text-gray-600 mt-0.5">{ev.venue}</p>}
        {ev.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ev.description}</p>}
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button onClick={() => setEditingEvent(ev)} className="p-1.5 text-gray-500 hover:text-primary transition-colors"><Edit3 className="h-3.5 w-3.5" /></button>
        <button onClick={async () => { if (!confirm(`Delete "${ev.title}"?`)) return; try { await deleteEvent(ev.id); show("Deleted."); } catch { show("Delete failed.", "error"); } }} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );

  const PastCard = ({ item }: { item: typeof pastAll[number] }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] transition-all">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
        <Calendar className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-sm font-semibold text-white truncate">{item.title}</p>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-gray-500/10 text-gray-500 border-gray-500/20">Past</span>
          {item.kind === "session" && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-blue-500/10 text-blue-400 border-blue-500/20">Session</span>}
        </div>
        <p className="text-xs text-gray-500">
          {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          {item.season && ` · ${item.season}`}
          {item.theme && ` · ${item.theme}`}
        </p>
        {item.description && <p className="text-xs text-gray-600 mt-1 line-clamp-1">{item.description}</p>}
        {(item.recordingUrl || item.blogUrl) && (
          <div className="flex gap-3 mt-1.5">
            {item.recordingUrl && <a href={item.recordingUrl} target="_blank" rel="noreferrer" className="text-[10px] text-secondary hover:underline font-semibold">▶ Recording</a>}
            {item.blogUrl && <a href={item.blogUrl} target="_blank" rel="noreferrer" className="text-[10px] text-secondary hover:underline font-semibold">Blog Post</a>}
          </div>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => item.kind === "event" ? setEditingEvent(item.raw as FireEvent) : setEditingSession(item.raw as FireLivestreamSession)}
          className="p-1.5 text-gray-500 hover:text-primary transition-colors"
        ><Edit3 className="h-3.5 w-3.5" /></button>
        <button
          onClick={async () => {
            if (!confirm(`Delete "${item.title}"?`)) return;
            try {
              if (item.kind === "event") await deleteEvent(item.id);
              else await deleteLivestreamSession(item.id);
              show("Deleted.");
            } catch { show("Delete failed.", "error"); }
          }}
          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
        ><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Events</h2>
        <p className="text-gray-500 text-sm">Manage upcoming events and edit past sessions. Once a date passes, events move to the Past section and appear on the Archive page automatically.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Upcoming events */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse inline-block" />
              Upcoming Events ({upcoming.length})
            </h3>
            {upcoming.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                <Calendar className="h-7 w-7 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-xs">No upcoming events. Add one below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((ev) => <UpcomingCard key={ev.id} ev={ev} />)}
              </div>
            )}
          </div>

          {/* Past events + sessions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Past Events &amp; Sessions ({pastAll.length})
            </h3>
            {pastAll.length === 0 ? (
              <p className="text-sm text-gray-600 py-4 text-center">No past events yet.</p>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {pastAll.map((item) => <PastCard key={`${item.kind}-${item.id}`} item={item} />)}
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit event modal */}
      <AnimatePresence>
        {editingEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0d100a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div>
                  <h3 className="font-display text-base font-bold text-white">Edit Event</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{editingEvent.title}</p>
                </div>
                <button onClick={() => setEditingEvent(null)} className="text-gray-500 hover:text-white transition-colors shrink-0 ml-4"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eventFields.map(({ key, label, placeholder, hint, type, span }) => (
                    <div key={key} className={span ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
                      {span ? (
                        <textarea value={(editingEvent[key] as string) ?? ""} onChange={e => setEditingEvent({ ...editingEvent, [key]: e.target.value })} placeholder={placeholder} rows={2} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 resize-none" />
                      ) : (
                        <input type={type ?? "text"} value={type === "datetime-local" && editingEvent[key] ? (editingEvent[key] as string).slice(0, 16) : ((editingEvent[key] as string | number) ?? "")} onChange={e => setEditingEvent({ ...editingEvent, [key]: type === "number" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value })} placeholder={placeholder} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
                      )}
                      {hint && <p className="text-[10px] text-gray-600 mt-0.5">{hint}</p>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setEditingEvent(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleSaveEvent} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit session modal */}
      <AnimatePresence>
        {editingSession && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingSession(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0d100a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div>
                  <h3 className="font-display text-base font-bold text-white">Edit Past Session</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{editingSession.title}</p>
                </div>
                <button onClick={() => setEditingSession(null)} className="text-gray-500 hover:text-white transition-colors shrink-0 ml-4"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sessionFields.map(({ key, label, placeholder, type, span }) => (
                    <div key={key} className={span ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
                      {span ? (
                        <textarea value={(editingSession[key] as string) ?? ""} onChange={e => setEditingSession({ ...editingSession, [key]: e.target.value })} placeholder={placeholder} rows={2} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 resize-none" />
                      ) : (
                        <input type={type ?? "text"} value={type === "datetime-local" && editingSession[key] ? (editingSession[key] as string).slice(0, 16) : ((editingSession[key] as string | number) ?? "")} onChange={e => setEditingSession({ ...editingSession, [key]: type === "number" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value })} placeholder={placeholder} className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setEditingSession(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleSaveSession} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import historical sessions */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
        <div>
          <p className="text-sm font-semibold text-white">Import Historical Sessions</p>
          <p className="text-xs text-gray-500 mt-0.5">Add all 30 historical sessions (Season 12–14, 2021–2023) into Firestore so you can edit and add recording links.</p>
        </div>
        <button
          onClick={async () => {
            setImporting(true);
            try {
              const n = await importStaticSessions();
              show(n > 0 ? `Imported ${n} historical session${n === 1 ? "" : "s"}.` : "All historical sessions are already imported.");
            } catch { show("Import failed.", "error"); }
            finally { setImporting(false); }
          }}
          disabled={importing}
          className="ml-4 shrink-0 flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-semibold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-60"
        >
          <Archive className="h-3.5 w-3.5" />
          {importing ? "Importing…" : "Import"}
        </button>
      </div>

      {/* Add new event */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Event</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {eventFields.map(({ key, label, placeholder, hint, type, span }) => (
            <div key={key} className={span ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
              {span ? (
                <textarea
                  value={(form[key] as string) ?? ""}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} rows={2}
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 resize-none" />
              ) : (
                <input
                  type={type ?? "text"}
                  value={(form[key] as string | number) ?? ""}
                  onChange={e => setForm({ ...form, [key]: type === "number" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
              )}
              {hint && <p className="text-[10px] text-gray-600 mt-0.5">{hint}</p>}
            </div>
          ))}
        </div>
        <button onClick={handleCreate} disabled={saving}
          className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
          <Plus className="h-4 w-4" /> {saving ? "Adding…" : "Add Event"}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────── Hero Images ──────────────────────────── */
function HeroImagesManager({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: images, loading } = useAllHeroImages();
  const [form, setForm] = useState({ caption: "", credit: "", order: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [addMode, setAddMode] = useState<"upload" | "url">("url");
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { show("Please select an image file (JPG, PNG, WebP).", "error"); return; }
    if (f.size > 10 * 1024 * 1024) { show("Image must be under 10 MB.", "error"); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`${label} timed out. Check your internet connection and try again.`)), ms)
      ),
    ]);

  const handleAdd = async () => {
    setSaving(true);
    try {
      let url: string;
      if (addMode === "url") {
        if (!urlInput.trim()) { show("Please enter an image URL.", "error"); setSaving(false); return; }
        url = urlInput.trim();
      } else {
        if (!file) { show("Please choose an image to upload.", "error"); setSaving(false); return; }
        url = await withTimeout(uploadHeroImage(file), 30000, "Upload");
      }
      await withTimeout(
        addHeroImage({
          url,
          caption: form.caption.trim(),
          credit: form.credit.trim() || "",
          order: form.order ? parseInt(form.order) : images.length,
          active: true,
        }),
        15000,
        "Saving to Firestore"
      );
      setFile(null);
      setPreview(null);
      setUrlInput("");
      setForm({ caption: "", credit: "", order: "" });
      show("Image added to carousel!");
    } catch (e: unknown) { show("Failed: " + (e as Error).message, "error"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (img: FireHeroImage) => {
    try {
      await updateHeroImage(img.id, { active: !img.active });
      show(img.active ? "Image hidden from carousel." : "Image shown in carousel.");
    } catch { show("Update failed.", "error"); }
  };

  const handleDelete = async (img: FireHeroImage) => {
    if (!confirm("Remove this image from the carousel?")) return;
    try { await deleteHeroImage(img.id); show("Image removed."); }
    catch { show("Delete failed.", "error"); }
  };

  const handleOrderChange = async (img: FireHeroImage, newOrder: number) => {
    try { await updateHeroImage(img.id, { order: newOrder }); }
    catch { show("Order update failed.", "error"); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Hero Carousel</h2>
        <p className="text-gray-500 text-sm">Add images that auto-rotate in the homepage hero section. Paste any public image URL.</p>
      </div>

      {/* Current images */}
      {!loading && images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Current Images ({images.length})</h3>
          {images.map((img) => (
            <div key={img.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${img.active ? "border-white/10 bg-white/[0.02]" : "border-white/5 bg-white/[0.01] opacity-60"}`}>
              {/* Thumb */}
              <div
                className="h-14 w-20 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 cursor-pointer"
                onClick={() => setPreviewing(previewing === img.id ? null : img.id)}
              >
                <img src={img.url} alt={img.caption} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{img.caption || <span className="text-gray-500 italic">No caption</span>}</p>
                {img.credit && <p className="text-xs text-gray-500 truncate">📷 {img.credit}</p>}
                <p className="text-[10px] text-gray-600 truncate mt-0.5">{img.url}</p>
              </div>

              {/* Order input */}
              <div className="shrink-0 flex items-center gap-1">
                <GripVertical className="h-3.5 w-3.5 text-gray-600" />
                <input
                  type="number"
                  value={img.order}
                  onChange={e => handleOrderChange(img, parseInt(e.target.value) || 0)}
                  className="w-12 px-2 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white text-center focus:outline-none focus:border-primary/40"
                  title="Display order"
                />
              </div>

              {/* Toggle */}
              <button
                onClick={() => handleToggle(img)}
                className={`shrink-0 transition-colors ${img.active ? "text-primary" : "text-gray-600"}`}
                title={img.active ? "Hide from carousel" : "Show in carousel"}
              >
                {img.active ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
              </button>

              {/* Delete */}
              <button onClick={() => handleDelete(img)} className="shrink-0 p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <Image className="h-8 w-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No images uploaded yet. Add one below.</p>
          <p className="text-gray-600 text-xs mt-1">A demo image shows on the homepage until you add your own.</p>
        </div>
      )}

      {/* Upload form */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Image</h3>
          {/* Mode toggle */}
          <div className="flex gap-1 bg-white/[0.03] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setAddMode("url")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${addMode === "url" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              Paste URL
            </button>
            <button
              onClick={() => setAddMode("upload")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${addMode === "upload" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              Upload File
            </button>
          </div>
        </div>

        {/* URL input mode */}
        {addMode === "url" && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Image URL <span className="text-red-400">*</span>
            </label>
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
            />
            {urlInput && (
              <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-40">
                <img src={urlInput} alt="URL preview" className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        )}

        {/* File upload mode */}
        {addMode === "upload" && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Image File <span className="text-red-400">*</span>
            </label>
            <label className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed cursor-pointer transition-all ${preview ? "border-primary/30 bg-primary/5" : "border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
              {preview ? (
                <div className="relative w-full">
                  <img src={preview} alt="Preview" className="w-full max-h-52 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center px-4">
                  <Image className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-medium">Click to choose a photo</p>
                  <p className="text-xs text-gray-600 mt-1">JPG, PNG or WebP · max 10 MB</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {file && (
              <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-primary" />
                {file.name} · {(file.size / 1024).toFixed(0)} KB
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Caption</label>
            <input
              value={form.caption}
              onChange={e => setForm({ ...form, caption: e.target.value })}
              placeholder="e.g. Loudthotz Season 14 — Brothers"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Photo Credit</label>
            <input
              value={form.credit}
              onChange={e => setForm({ ...form, credit: e.target.value })}
              placeholder="e.g. Emeka Obi Photography"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={e => setForm({ ...form, order: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={saving || (addMode === "upload" && !file) || (addMode === "url" && !urlInput.trim())}
          className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {saving ? (
            <><RefreshCw className="h-4 w-4 animate-spin" /> {addMode === "upload" ? "Uploading…" : "Adding…"}</>
          ) : (
            <><Plus className="h-4 w-4" /> Add to Carousel</>
          )}
        </button>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="text-gray-300 font-semibold">Tips:</span> Images auto-advance every 5 seconds. Hovering pauses the carousel. The order field controls which image appears first (lower number = earlier). Toggle the switch to show/hide individual images without deleting them.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────── Site Settings ──────────────────────────── */
const DEFAULT_PRIZE_RULES = [
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

type SettingsSection = "home" | "membership" | "prize" | "donate" | "footer" | "poets" | "privacy";

function SettingsField({
  label, hint, value, onChange, multiline, placeholder, rows,
}: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
      {hint && <p className="text-[10px] text-gray-600 mb-1.5">{hint}</p>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows ?? 3}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors resize-none" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
      )}
    </div>
  );
}

function SiteSettingsPanel({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: settings } = useSiteSettings();
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>("home");

  const ph = (v: string | number | undefined, fallback: string) => (v ? String(v) : fallback);

  const [home, setHome] = useState({ heroHeadline: "", heroSubtext: "", upcomingEventTitle: "", upcomingEventDate: "", aboutText: "", totalCommunityVoices: "", featuredVideoUrl: "", homeHeadline: "", homeSubtext: "", potmReadingTitle: "", potmReadingSubtext: "", potmReadingCtaLabel: "", statsPoems: "", statsPoets: "", statsSessions: "", statsCountries: "" });
  const [membership, setMembership] = useState({ membershipFreeLink: "", membershipFreeDescription: "", membershipFreeBenefits: "", membershipBasicPrice: "", membershipBasicLink: "", membershipBasicDescription: "", membershipBasicBenefits: "", membershipFullPrice: "", membershipFullLink: "", membershipFullDescription: "", membershipFullBenefits: "", membershipGoldenPrice: "", membershipGoldenLink: "", membershipGoldenDescription: "", membershipGoldenBenefits: "" });
  const [prize, setPrize] = useState({ prizeCashAmount: "", prizeEntryFee: "", prizePaystackLink: "", prizeEmail: "", prizeDeadline: "" });
  const [donate, setDonate] = useState({ donationHeadline: "", donationMessage: "", donationPaystackLink: "" });
  const [footer, setFooter] = useState({ socialX: "", socialYoutube: "", socialFacebook: "", socialSpotify: "", socialInstagram: "", socialTiktok: "", contactWhatsapp: "" });
  const [poets, setPoets] = useState({ poetPageDescription: "", poetPageBlogUrl: "" });
  const [privacy, setPrivacy] = useState({ privacyPolicyText: "", privacyPolicyUpdatedAt: "" });
  const [prizeRulesList, setPrizeRulesList] = useState<string[]>([...DEFAULT_PRIZE_RULES]);
  const [newRule, setNewRule] = useState("");

  useEffect(() => {
    if (settings?.prizeRules) {
      setPrizeRulesList(settings.prizeRules.split("\n").filter(Boolean));
    }
  }, [settings?.prizeRules]);

  const handleSave = async () => {
    setSaving(true);
    const upd: Record<string, unknown> = {};
    const add = (obj: Record<string, string>, key: string) => { if (obj[key]) upd[key] = obj[key]; };

    if (activeSection === "home") {
      add(home, "heroHeadline"); add(home, "heroSubtext"); add(home, "upcomingEventTitle"); add(home, "upcomingEventDate"); add(home, "aboutText"); add(home, "featuredVideoUrl");
      add(home, "homeHeadline"); add(home, "homeSubtext"); add(home, "potmReadingTitle"); add(home, "potmReadingSubtext"); add(home, "potmReadingCtaLabel");
      add(home, "statsPoems"); add(home, "statsPoets"); add(home, "statsSessions"); add(home, "statsCountries");
      if (home.totalCommunityVoices) upd.totalCommunityVoices = parseInt(home.totalCommunityVoices);
    }
    if (activeSection === "membership") {
      Object.keys(membership).forEach(k => add(membership as Record<string, string>, k));
    }
    if (activeSection === "prize") {
      Object.keys(prize).forEach(k => add(prize as Record<string, string>, k));
      upd.prizeRules = prizeRulesList.join("\n");
    }
    if (activeSection === "donate") {
      Object.keys(donate).forEach(k => add(donate as Record<string, string>, k));
    }
    if (activeSection === "footer") {
      Object.keys(footer).forEach(k => add(footer as Record<string, string>, k));
    }
    if (activeSection === "poets") {
      Object.keys(poets).forEach(k => add(poets as Record<string, string>, k));
    }
    if (activeSection === "privacy") {
      if (privacy.privacyPolicyText) upd.privacyPolicyText = privacy.privacyPolicyText;
      if (privacy.privacyPolicyUpdatedAt) upd.privacyPolicyUpdatedAt = privacy.privacyPolicyUpdatedAt;
    }

    try { await updateSiteSettings(upd as never); show("Settings saved!"); }
    catch { show("Failed to save settings.", "error"); }
    finally { setSaving(false); }
  };

  const handleSeed = async () => {
    if (!confirm("This will seed the Firestore database with default poems, books, and sessions. Continue?")) return;
    setSeeding(true);
    try { await seedDatabase(); show("Database seeded successfully!"); }
    catch (e: unknown) { show("Seed failed: " + (e as Error).message, "error"); }
    finally { setSeeding(false); }
  };

  const sections: { id: SettingsSection; label: string }[] = [
    { id: "home", label: "Home Page" },
    { id: "membership", label: "Membership" },
    { id: "prize", label: "Poetry Prize" },
    { id: "donate", label: "Donate Page" },
    { id: "footer", label: "Footer & Contact" },
    { id: "poets", label: "Poets Page" },
    { id: "privacy", label: "Privacy Policy" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Site Settings</h2>
        <p className="text-gray-500 text-sm">Edit content for every page — no code needed. Select a page section, update the fields, then click Save.</p>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? "bg-primary text-black font-semibold" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Home Page */}
      {activeSection === "home" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SettingsField label="Hero Headline" placeholder={ph(settings?.heroHeadline, "Where Words Ignite Loud Thoughts")} value={home.heroHeadline} onChange={v => setHome({ ...home, heroHeadline: v })} />
            <SettingsField label="Upcoming Event Title" placeholder={ph(settings?.upcomingEventTitle, "Season 15 Episode 01")} value={home.upcomingEventTitle} onChange={v => setHome({ ...home, upcomingEventTitle: v })} />
            <SettingsField label="Community Voices Count" placeholder={ph(settings?.totalCommunityVoices, "5000")} hint="Number shown in the stats badge" value={home.totalCommunityVoices} onChange={v => setHome({ ...home, totalCommunityVoices: v })} />
          </div>

          <div className="border-t border-white/5 pt-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Site-wide Stats Bar</p>
            <p className="text-[10px] text-gray-600">These numbers appear on the Home and Donate pages. Use any format e.g. <strong>3000+</strong>, <strong>85+</strong>, <strong>204</strong>.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingsField label="Poems Published" placeholder={ph(settings?.statsPoems, "3000+")} value={home.statsPoems} onChange={v => setHome({ ...home, statsPoems: v })} />
              <SettingsField label="Featured Poets" placeholder={ph(settings?.statsPoets, "85+")} value={home.statsPoets} onChange={v => setHome({ ...home, statsPoets: v })} />
              <SettingsField label="Live Sessions" placeholder={ph(settings?.statsSessions, "204")} value={home.statsSessions} onChange={v => setHome({ ...home, statsSessions: v })} />
              <SettingsField label="Countries" placeholder={ph(settings?.statsCountries, "5+")} value={home.statsCountries} onChange={v => setHome({ ...home, statsCountries: v })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Upcoming Event Date &amp; Time</label>
            <input type="datetime-local" value={home.upcomingEventDate} onChange={e => setHome({ ...home, upcomingEventDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 transition-colors" />
          </div>
          <SettingsField label="Hero Subtext" hint="Paragraph below the hero headline" placeholder={ph(settings?.heroSubtext, "Formerly managed under…")} value={home.heroSubtext} onChange={v => setHome({ ...home, heroSubtext: v })} multiline rows={3} />
          <SettingsField label="About Text" hint="Shown on the Home page About/Mission section" placeholder={ph(settings?.aboutText, "A living literary space…")} value={home.aboutText} onChange={v => setHome({ ...home, aboutText: v })} multiline rows={4} />
          <div className="border-t border-white/5 pt-5">
            <SettingsField
              label="Featured Video URL"
              hint="YouTube link shown in Card 4 on the homepage — paste a youtu.be/… or youtube.com/watch?v=… URL"
              placeholder={ph(settings?.featuredVideoUrl, "https://youtu.be/-UTQE47uNIY")}
              value={home.featuredVideoUrl ?? ""}
              onChange={v => setHome({ ...home, featuredVideoUrl: v } as typeof home)}
            />
          </div>

          <div className="border-t border-white/5 pt-5 space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Homepage Headline &amp; Cards</p>
            <SettingsField
              label="Big Homepage Headline"
              hint="Large bold headline displayed below the carousel. Shown in uppercase."
              placeholder={ph(settings?.homeHeadline, "THE HOME OF THE MOST INTERESTING POETS IN AFRICA")}
              value={home.homeHeadline}
              onChange={v => setHome({ ...home, homeHeadline: v })}
            />
            <SettingsField
              label="Homepage Subtext"
              hint="Paragraph shown below the big headline."
              placeholder={ph(settings?.homeSubtext, "Loudthotz Poetry is proudly hosted under the Naija Art Initiative…")}
              value={home.homeSubtext}
              onChange={v => setHome({ ...home, homeSubtext: v })}
              multiline rows={3}
            />
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Card 1 — Open Reading Call</p>
              <SettingsField
                label="Card 1 Title"
                placeholder={ph(settings?.potmReadingTitle, "Open Reading")}
                value={home.potmReadingTitle}
                onChange={v => setHome({ ...home, potmReadingTitle: v })}
              />
              <SettingsField
                label="Card 1 Subtext"
                placeholder={ph(settings?.potmReadingSubtext, "Submit your poem for the next Loudthotz Poetry Open Reading session…")}
                value={home.potmReadingSubtext}
                onChange={v => setHome({ ...home, potmReadingSubtext: v })}
                multiline rows={2}
              />
              <SettingsField
                label="Card 1 CTA Button Label"
                placeholder={ph(settings?.potmReadingCtaLabel, "Submit Your Poem")}
                value={home.potmReadingCtaLabel}
                onChange={v => setHome({ ...home, potmReadingCtaLabel: v })}
              />
            </div>
            <p className="text-[10px] text-gray-600">Card 2 (LPP Prize) uses the deadline & prize amount from the <strong>Poetry Prize</strong> settings section. Card 3 (Poem of the Month) uses the poem marked as POTM in <strong>Poems</strong>. Card 4 uses the Featured Video URL above.</p>
          </div>
        </div>
      )}

      {/* Membership Page */}
      {activeSection === "membership" && (
        <div className="space-y-6">
          <p className="text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-xl p-4">
            Edit prices, payment links, descriptions, and benefits for each membership tier. For benefits, put each item on its own line.
          </p>
          <div className="space-y-5">
            {/* Free tier */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Free Tier</p>
              <SettingsField label="WhatsApp Link" hint="The link visitors click to join the free community" placeholder={ph(settings?.membershipFreeLink, "https://chat.whatsapp.com/...")} value={membership.membershipFreeLink} onChange={v => setMembership({ ...membership, membershipFreeLink: v })} />
              <SettingsField label="Description" hint="Short tagline shown under the tier name" placeholder={ph(settings?.membershipFreeDescription, "Get started with the Loudthotz community at no cost.")} value={membership.membershipFreeDescription} onChange={v => setMembership({ ...membership, membershipFreeDescription: v })} />
              <SettingsField label="Benefits" hint="One benefit per line" multiline rows={3} placeholder={ph(settings?.membershipFreeBenefits, "Added to our WhatsApp community\nAccess to community discussions\nMonthly newsletter updates")} value={membership.membershipFreeBenefits} onChange={v => setMembership({ ...membership, membershipFreeBenefits: v })} />
            </div>

            {/* Basic / Full / Golden */}
            {(["Basic", "Full", "Golden"] as const).map((tier) => {
              const priceKey = `membership${tier}Price` as keyof typeof membership;
              const linkKey = `membership${tier}Link` as keyof typeof membership;
              const descKey = `membership${tier}Description` as keyof typeof membership;
              const beneKey = `membership${tier}Benefits` as keyof typeof membership;
              const defaultPrices: Record<string, string> = { Basic: "₦24,000", Full: "₦48,000", Golden: "₦60,000" };
              const defaultDescs: Record<string, string> = {
                Basic: "Support the initiative and receive our annual anthology.",
                Full: "The complete Loudthotz experience — merch included.",
                Golden: "Our most exclusive tier — your poems live in the anthology.",
              };
              const defaultBenefits: Record<string, string> = {
                Basic: "A copy of First Gong anthology at end of year\nAccess to our Telegram community\nRecognition as a Basic Member",
                Full: "A copy of the First Gong anthology at end of year\nExclusive Loudthotz T-shirt\nAccess to our Telegram community\nPriority event invitations",
                Golden: "A copy of the First Gong anthology at end of year\nExclusive Loudthotz T-shirt\nFree outings with Loudthotz team\nA dedicated section of First Gong anthology for 10 of your poems\nPriority recognition across all platforms",
              };
              return (
                <div key={tier} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{tier} Tier</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SettingsField label="Price" hint="e.g. ₦24,000" placeholder={ph(settings?.[priceKey as keyof typeof settings] as string, defaultPrices[tier])} value={membership[priceKey]} onChange={v => setMembership({ ...membership, [priceKey]: v })} />
                    <SettingsField label="Paystack Link" hint="Full https://paystack.com/pay/... URL" placeholder={ph(settings?.[linkKey as keyof typeof settings] as string, "https://paystack.com/pay/...")} value={membership[linkKey]} onChange={v => setMembership({ ...membership, [linkKey]: v })} />
                  </div>
                  <SettingsField label="Description" hint="Short tagline shown under the tier name" placeholder={ph(settings?.[descKey as keyof typeof settings] as string, defaultDescs[tier])} value={membership[descKey]} onChange={v => setMembership({ ...membership, [descKey]: v })} />
                  <SettingsField label="Benefits" hint="One benefit per line" multiline rows={tier === "Golden" ? 5 : 4} placeholder={ph(settings?.[beneKey as keyof typeof settings] as string, defaultBenefits[tier])} value={membership[beneKey]} onChange={v => setMembership({ ...membership, [beneKey]: v })} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prize Page */}
      {activeSection === "prize" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SettingsField label="Monthly Cash Prize" hint="e.g. ₦20,000" placeholder={ph(settings?.prizeCashAmount, "₦20,000")} value={prize.prizeCashAmount} onChange={v => setPrize({ ...prize, prizeCashAmount: v })} />
            <SettingsField label="Entry Fee" hint="e.g. ₦1,000" placeholder={ph(settings?.prizeEntryFee, "₦1,000")} value={prize.prizeEntryFee} onChange={v => setPrize({ ...prize, prizeEntryFee: v })} />
            <SettingsField label="Paystack Payment Link" hint="Link for the ₦1,000 entry fee" placeholder={ph(settings?.prizePaystackLink, "https://paystack.com/pay/lpp")} value={prize.prizePaystackLink} onChange={v => setPrize({ ...prize, prizePaystackLink: v })} />
            <SettingsField label="Submission Email" hint="Email address for poem submissions" placeholder={ph(settings?.prizeEmail, "loudthotz@gmail.com")} value={prize.prizeEmail} onChange={v => setPrize({ ...prize, prizeEmail: v })} />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Submission Deadline</label>
              <p className="text-[10px] text-gray-600 mb-2">Sets the countdown timer shown at the top of the LPP Prize page.</p>
              <input
                type="datetime-local"
                value={prize.prizeDeadline || (settings?.prizeDeadline ? settings.prizeDeadline.slice(0, 16) : "")}
                onChange={e => setPrize({ ...prize, prizeDeadline: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </div>
          {/* Prize rules list */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Competition Rules</label>
            <p className="text-[10px] text-gray-600 mb-3">Add, edit, or delete individual rules. Saved automatically when you click Save.</p>
            <div className="space-y-2 mb-3">
              {prizeRulesList.length === 0 && (
                <p className="text-xs text-gray-600 italic py-3 text-center border border-white/5 rounded-xl">No custom rules — default rules will be shown. Add a rule below to override them.</p>
              )}
              {prizeRulesList.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 mt-2.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary text-[10px] font-bold">{idx + 1}</span>
                  </div>
                  <input
                    value={rule}
                    onChange={e => {
                      const next = [...prizeRulesList];
                      next[idx] = e.target.value;
                      setPrizeRulesList(next);
                    }}
                    className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                  <button
                    onClick={() => setPrizeRulesList(prizeRulesList.filter((_, i) => i !== idx))}
                    className="flex-shrink-0 mt-2 p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                    title="Delete rule"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newRule}
                onChange={e => setNewRule(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && newRule.trim()) {
                    setPrizeRulesList([...prizeRulesList, newRule.trim()]);
                    setNewRule("");
                  }
                }}
                placeholder="Type a new rule and press Enter or click Add…"
                className="flex-1 px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
              />
              <button
                onClick={() => { if (newRule.trim()) { setPrizeRulesList([...prizeRulesList, newRule.trim()]); setNewRule(""); } }}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donate Page */}
      {activeSection === "donate" && (
        <div className="space-y-5">
          <SettingsField label="Page Headline" hint='Large heading on the donate page, e.g. "Keep the Mic On."' placeholder={ph(settings?.donationHeadline, "Keep the Mic On.")} value={donate.donationHeadline} onChange={v => setDonate({ ...donate, donationHeadline: v })} />
          <SettingsField label="Paystack Donation Link" hint="Link for the Donate button — your Paystack payment page" placeholder={ph(settings?.donationPaystackLink, "https://paystack.com/pay/loudthotzdonation")} value={donate.donationPaystackLink} onChange={v => setDonate({ ...donate, donationPaystackLink: v })} />
          <SettingsField label="Body Text / Message" hint="Supporting paragraph below the headline" placeholder={ph(settings?.donationMessage, "Loudthotz Poetry is powered by the Naija Art Initiative…")} value={donate.donationMessage} onChange={v => setDonate({ ...donate, donationMessage: v })} multiline rows={4} />
        </div>
      )}

      {/* Poets Page */}
      {activeSection === "poets" && (
        <div className="space-y-5">
          <p className="text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-xl p-4">
            Customise the text and blog link shown on the Poets page hero section.
          </p>
          <SettingsField
            label="Page Description"
            hint="Text shown below the heading on the Poets page"
            placeholder={ph(settings?.poetPageDescription, "Voices that have graced the Loudthotz stage…")}
            value={poets.poetPageDescription}
            onChange={v => setPoets({ ...poets, poetPageDescription: v })}
            multiline
            rows={3}
          />
          <SettingsField
            label="Blog URL"
            hint='Link for the "View on Blog" button (defaults to the Loudthotz blogspot poets page)'
            placeholder={ph(settings?.poetPageBlogUrl, "https://loudthotzpoetry.blogspot.com/p/poets.html?m=0")}
            value={poets.poetPageBlogUrl}
            onChange={v => setPoets({ ...poets, poetPageBlogUrl: v })}
          />
        </div>
      )}

      {/* Privacy Policy */}
      {activeSection === "privacy" && (
        <div className="space-y-5">
          <p className="text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-xl p-4">
            Edit the full Privacy Policy text. Use <code className="text-primary text-xs">## Heading</code> for section titles and <code className="text-primary text-xs">### Sub-heading</code> for sub-sections. Separate paragraphs with a blank line. Leave blank to use the built-in default policy.
          </p>
          <SettingsField
            label="Last Updated Date"
            hint='Shown at the top and bottom of the Privacy Policy page, e.g. "January 1, 2025"'
            placeholder={ph(settings?.privacyPolicyUpdatedAt, "August 18, 2015")}
            value={privacy.privacyPolicyUpdatedAt}
            onChange={v => setPrivacy({ ...privacy, privacyPolicyUpdatedAt: v })}
          />
          <SettingsField
            label="Policy Text"
            hint="Full policy content. Use ## for section headings, ### for sub-headings. Blank line = new paragraph."
            placeholder={ph(settings?.privacyPolicyText, "## Personal Identification Information\nWe may collect…\n\n## Non-Personal Identification Information\n…")}
            value={privacy.privacyPolicyText}
            onChange={v => setPrivacy({ ...privacy, privacyPolicyText: v })}
            multiline
            rows={22}
          />
        </div>
      )}

      {/* Footer / Socials */}
      {activeSection === "footer" && (
        <div className="space-y-5">
          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact</h3>
            <SettingsField
              label="WhatsApp Number"
              hint="International format without + or spaces, e.g. 2347064384235. Used for the 'Chat on WhatsApp' button in the footer."
              placeholder={ph(settings?.contactWhatsapp, "2347064384235")}
              value={footer.contactWhatsapp}
              onChange={v => setFooter({ ...footer, contactWhatsapp: v })}
            />
          </div>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Social Links</h3>
            <p className="text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-xl p-4">
              Paste the full URL for each social account. Leave a field blank to keep the current link.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SettingsField
              label="X (Twitter)"
              hint="Your X profile or follow-intent URL"
              placeholder={ph(settings?.socialX, "https://x.com/Loudthotz")}
              value={footer.socialX}
              onChange={v => setFooter({ ...footer, socialX: v })}
            />
            <SettingsField
              label="YouTube"
              hint="Your YouTube channel URL"
              placeholder={ph(settings?.socialYoutube, "https://youtube.com/@IpcLoudthotz")}
              value={footer.socialYoutube}
              onChange={v => setFooter({ ...footer, socialYoutube: v })}
            />
            <SettingsField
              label="Facebook"
              hint="Your Facebook page URL"
              placeholder={ph(settings?.socialFacebook, "https://facebook.com/loudthotz.poetry")}
              value={footer.socialFacebook}
              onChange={v => setFooter({ ...footer, socialFacebook: v })}
            />
            <SettingsField
              label="Spotify"
              hint="Link to your Spotify podcast or episode"
              placeholder={ph(settings?.socialSpotify, "https://creators.spotify.com/pod/profile/loudthotzpoetry/…")}
              value={footer.socialSpotify}
              onChange={v => setFooter({ ...footer, socialSpotify: v })}
            />
            <SettingsField
              label="Instagram"
              hint="Your Instagram profile URL"
              placeholder={ph(settings?.socialInstagram, "https://instagram.com/loudthotz")}
              value={footer.socialInstagram}
              onChange={v => setFooter({ ...footer, socialInstagram: v })}
            />
            <SettingsField
              label="TikTok"
              hint="Your TikTok profile URL"
              placeholder={ph(settings?.socialTiktok, "https://tiktok.com/@loudthotz")}
              value={footer.socialTiktok}
              onChange={v => setFooter({ ...footer, socialTiktok: v })}
            />
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
        <Save className="h-4 w-4" /> {saving ? "Saving…" : `Save ${sections.find(s => s.id === activeSection)?.label} Settings`}
      </button>

      {/* Database Management */}
      <div className="border-t border-white/5 pt-8 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Database Management</h3>
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
          <p className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1.5"><Database className="h-3.5 w-3.5" /> Initialize Firestore Database</p>
          <p className="text-xs text-gray-500 mb-4">If the site shows no data, click this to seed poems, books, sessions and settings into Firestore. Only run once.</p>
          <button onClick={handleSeed} disabled={seeding}
            className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-amber-500/30 transition-all disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${seeding ? "animate-spin" : ""}`} />
            {seeding ? "Seeding…" : "Initialize Database"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── Feedback Manager ──────────────────────────── */
function FeedbackManager({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: items, loading } = useFeedback();
  const unread = items.filter(f => !f.read).length;

  async function handleToggleRead(item: FireFeedback) {
    await markFeedbackRead(item.id, !item.read);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this feedback?")) return;
    try {
      await deleteFeedback(id);
      show("Feedback deleted");
    } catch {
      show("Failed to delete", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Feedback</h2>
          <p className="text-sm text-gray-500 mt-1">Messages submitted via the site footer</p>
        </div>
        {unread > 0 && (
          <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {unread} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No feedback yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`rounded-xl border p-5 transition-all ${item.read ? "bg-white/[0.02] border-white/5" : "bg-primary/5 border-primary/15"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!item.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <span className="font-semibold text-sm text-white">{item.name}</span>
                    <span className="text-xs text-gray-600">
                      {new Date(item.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{item.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleRead(item)}
                    title={item.read ? "Mark as unread" : "Mark as read"}
                    className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <MailOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── Main Admin ──────────────────────────── */
export default function AdminPanel() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { toast, show } = useToast();

  if (loading) return (
    <div className="min-h-screen bg-[#060805] flex items-center justify-center">
      <div className="text-primary animate-pulse font-display">Loading…</div>
    </div>
  );

  if (!user) {
    navigate("/admin/login");
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "submissions", label: "Submissions", icon: FileText },
    { id: "poems", label: "Poems", icon: BookOpen },
    { id: "livestream", label: "Livestream", icon: Radio },
    { id: "books", label: "Books", icon: Library },
    { id: "poets", label: "Poets", icon: Feather },
    { id: "events", label: "Events", icon: Calendar },
    { id: "hero", label: "Hero Carousel", icon: Image },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#060805] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-white/5 bg-[#080a06] shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-16 overflow-hidden rounded-lg border border-white/10">
              <img src={loudthotzIcon} alt="Loudthotz" className="h-full w-full object-contain p-0.5" />
            </div>
            <div>
              <p className="font-display text-xs font-bold text-primary tracking-widest">LOUDTHOTZ</p>
              <p className="text-[10px] text-gray-500 flex items-center gap-1"><Shield className="h-2.5 w-2.5 text-amber-400" /> Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === id ? "bg-primary/10 text-primary" : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <p className="text-[10px] text-gray-600 truncate px-1">{user.email}</p>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080a06] border-t border-white/5 flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === id ? "text-primary" : "text-gray-600 hover:text-gray-400"}`}>
            <Icon className="h-5 w-5" />
          </button>
        ))}
        <button onClick={logout} className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-600 hover:text-red-400 transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "submissions" && <Submissions show={show} />}
              {activeTab === "poems" && <PoemsManager show={show} />}
              {activeTab === "livestream" && <LivestreamControl show={show} />}
              {activeTab === "books" && <BooksManager show={show} />}
              {activeTab === "poets" && <PoetsManager show={show} />}
              {activeTab === "events" && <EventsManager show={show} />}
              {activeTab === "hero" && <HeroImagesManager show={show} />}
              {activeTab === "settings" && <SiteSettingsPanel show={show} />}
              {activeTab === "feedback" && <FeedbackManager show={show} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
      </AnimatePresence>
    </div>
  );
}
