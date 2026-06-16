import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LayoutDashboard, FileText, BookOpen, Radio, Library,
  Settings, LogOut, CheckCircle, XCircle, Clock, Star, Trash2,
  Edit3, Plus, Save, Eye, EyeOff, Mic2, Calendar, Link2,
  Users, Globe2, BarChart3, RefreshCw, ChevronDown, ChevronUp,
  AlertCircle, BookMarked, Play, X, Database, Image, GripVertical,
  ToggleLeft, ToggleRight,
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
  type FireSubmission, type FirePoem, type FireBook, type FireLivestreamSession,
  type FireHeroImage,
} from "@/lib/firestore";
import loudthotzIcon from "@assets/loudthouz-small-screen-logo_1781609118102.png";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781511989631.jpeg";

/* ──────────────────────────── types ──────────────────────────── */
type Tab = "dashboard" | "submissions" | "poems" | "livestream" | "books" | "hero" | "settings";

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

/* ──────────────────────────── Submissions ──────────────────────────── */
function Submissions({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: submissions, loading } = useSubmissions();
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">Submissions</h2>
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

  const handleDelete = async (p: FirePoem) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try { await deletePoem(p.id); show("Poem deleted."); }
    catch { show("Delete failed.", "error"); }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try { await updatePoem(editing.id, { title: editing.title, author: editing.author, season: editing.season, theme: editing.theme, isFeatured: editing.isFeatured }); setEditing(null); show("Poem updated."); }
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
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", price: "", amazonUrl: "", accentColor: "lime", coverTagline: "" });
  const [editing, setEditing] = useState<FireBook | null>(null);

  const handleCreate = async () => {
    if (!form.title || !form.amazonUrl) { show("Title and Amazon URL are required.", "error"); return; }
    try { await createBook(form); setForm({ title: "", subtitle: "", description: "", price: "", amazonUrl: "", accentColor: "lime", coverTagline: "" }); show("Book added!"); }
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

  const bookFields = [
    { key: "title", label: "Title", placeholder: "e.g. FIRST GONG" },
    { key: "subtitle", label: "Subtitle", placeholder: "e.g. Anthology Vol. I" },
    { key: "price", label: "Price", placeholder: "$12.99" },
    { key: "amazonUrl", label: "Amazon URL", placeholder: "https://amazon.com/dp/..." },
    { key: "description", label: "Description", placeholder: "Brief description of the book" },
    { key: "coverTagline", label: "Cover Tagline", placeholder: "Short tagline shown on book cover" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Books & Anthologies</h2>
        <p className="text-gray-500 text-sm">Manage published books and Amazon links</p>
      </div>

      {/* Current books */}
      {!loading && books && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {books.map((b) => (
            <div key={b.id} className={`p-5 rounded-xl border ${b.accentColor === "lime" ? "border-primary/20 bg-primary/5" : "border-secondary/20 bg-secondary/5"}`}>
              <div className="flex justify-between items-start gap-3 mb-2">
                <div>
                  <p className={`font-display font-bold text-base ${b.accentColor === "lime" ? "text-primary" : "text-secondary"}`}>{b.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{b.subtitle} · {b.price}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(b)} className="p-1.5 text-gray-500 hover:text-primary transition-colors"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(b)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{b.description}</p>
              <a href={b.amazonUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-400 hover:underline font-semibold uppercase tracking-wider"><Link2 className="h-3 w-3" /> Amazon</a>
            </div>
          ))}
        </div>
      )}

      {/* Add book */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Book</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
              <input value={(form as Record<string, string>)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Accent Color</label>
            <select value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white focus:outline-none">
              <option value="lime">Lime (primary)</option>
              <option value="blue">Blue (secondary)</option>
            </select>
          </div>
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
              className="bg-[#0d100a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-lg font-bold text-white">Edit Book</h3>
              {[...bookFields, { key: "accentColor", label: "Accent", placeholder: "" }].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 capitalize">{label}</label>
                  {key === "accentColor" ? (
                    <select value={(editing as unknown as Record<string, string>)[key]} onChange={e => setEditing({ ...editing, [key]: e.target.value } as FireBook)}
                      className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white focus:outline-none">
                      <option value="lime">Lime</option>
                      <option value="blue">Blue</option>
                    </select>
                  ) : (
                    <input value={((editing as unknown as Record<string, unknown>)[key] as string) ?? ""}
                      onChange={e => setEditing({ ...editing, [key]: e.target.value } as FireBook)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40" />
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
          credit: form.credit.trim() || undefined,
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
function SiteSettingsPanel({ show }: { show: (m: string, t?: "success" | "error") => void }) {
  const { data: settings } = useSiteSettings();
  const [seeding, setSeeding] = useState(false);
  const [form, setForm] = useState({
    heroHeadline: "", heroSubtext: "", upcomingEventTitle: "", upcomingEventDate: "",
    aboutText: "", donationMessage: "", totalCommunityVoices: "",
  });

  const handleSave = async () => {
    const upd: Record<string, unknown> = {};
    if (form.heroHeadline) upd.heroHeadline = form.heroHeadline;
    if (form.heroSubtext) upd.heroSubtext = form.heroSubtext;
    if (form.upcomingEventTitle) upd.upcomingEventTitle = form.upcomingEventTitle;
    if (form.upcomingEventDate) upd.upcomingEventDate = form.upcomingEventDate;
    if (form.aboutText) upd.aboutText = form.aboutText;
    if (form.donationMessage) upd.donationMessage = form.donationMessage;
    if (form.totalCommunityVoices) upd.totalCommunityVoices = parseInt(form.totalCommunityVoices);
    try { await updateSiteSettings(upd as never); show("Site settings saved!"); setForm({ heroHeadline: "", heroSubtext: "", upcomingEventTitle: "", upcomingEventDate: "", aboutText: "", donationMessage: "", totalCommunityVoices: "" }); }
    catch { show("Failed to save settings.", "error"); }
  };

  const handleSeed = async () => {
    if (!confirm("This will seed the Firestore database with default poems, books, and sessions. Continue?")) return;
    setSeeding(true);
    try { await seedDatabase(); show("Database seeded successfully!"); }
    catch (e: unknown) { show("Seed failed: " + (e as Error).message, "error"); }
    finally { setSeeding(false); }
  };

  const fields = [
    { key: "heroHeadline", label: "Hero Headline", placeholder: settings?.heroHeadline ?? "Where Words Ignite Loud Thoughts", multiline: false },
    { key: "upcomingEventTitle", label: "Upcoming Event Title", placeholder: settings?.upcomingEventTitle ?? "Brothers — Spotlights on Kinship", multiline: false },
    { key: "totalCommunityVoices", label: "Community Voices Count", placeholder: String(settings?.totalCommunityVoices ?? 5000), multiline: false },
    { key: "heroSubtext", label: "Hero Description", placeholder: settings?.heroSubtext ?? "Formerly managed under…", multiline: true },
    { key: "aboutText", label: "About Text", placeholder: settings?.aboutText ?? "A living literary space…", multiline: true },
    { key: "donationMessage", label: "Donation Message", placeholder: settings?.donationMessage ?? "", multiline: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1">Site Settings</h2>
        <p className="text-gray-500 text-sm">Control the content displayed across the website</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {fields.map(({ key, label, placeholder, multiline }) => (
          <div key={key}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{label}</label>
            {multiline ? (
              <textarea value={(form as Record<string, string>)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder} rows={3}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors resize-none" />
            ) : (
              <input value={(form as Record<string, string>)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors" />
            )}
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Upcoming Event Date</label>
          <input type="datetime-local" value={form.upcomingEventDate}
            onChange={e => setForm({ ...form, upcomingEventDate: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 transition-colors" />
        </div>
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all">
        <Save className="h-4 w-4" /> Save Settings
      </button>

      {/* Initialize Database */}
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
    { id: "hero", label: "Hero Carousel", icon: Image },
    { id: "settings", label: "Settings", icon: Settings },
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
              {activeTab === "hero" && <HeroImagesManager show={show} />}
              {activeTab === "settings" && <SiteSettingsPanel show={show} />}
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
