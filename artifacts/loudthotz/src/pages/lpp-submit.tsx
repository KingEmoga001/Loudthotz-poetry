import { useState } from "react";
import { Trophy, Upload, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { addLppSubmission } from "@/lib/firestore";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentMonth = `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`;

export default function LppSubmit() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", poemTitle: "", bio: "", month: currentMonth });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please attach your Word document."); return; }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["doc", "docx"].includes(ext ?? "")) { setError("Only .doc and .docx files are accepted."); return; }
    setLoading(true);
    setError("");
    try {
      await addLppSubmission(form, file);
      setSubmitted(true);
    } catch {
      setError("Submission failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-[#060805]">
        <div className="max-w-md w-full bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center">
          <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Submission Received!</h1>
          <p className="text-gray-400 font-serif text-base leading-relaxed">
            Your poem has been submitted for the{" "}
            <span className="text-primary font-semibold">{form.month}</span> Loudthotz Poetry Prize.
            Winners are announced on the last day of every month.
          </p>
        </div>
      </div>
    );
  }

  const fieldCls = "w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors";

  return (
    <div className="min-h-screen bg-[#060805] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">LPP Prize Submission</h1>
          <p className="text-gray-400 font-serif text-lg max-w-lg mx-auto">
            Submit your entry for the Loudthotz Poetry Prize. Attach your poem and bio as a Word document.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Full Name *</label>
                <input required value={form.name} onChange={set("name")} placeholder="Your full name" className={fieldCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className={fieldCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Phone Number *</label>
                <input required value={form.phone} onChange={set("phone")} placeholder="+234..." className={fieldCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Month of Submission</label>
                <input value={form.month} onChange={set("month")} placeholder="e.g. June 2026" className={fieldCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Poem Title *</label>
              <input required value={form.poemTitle} onChange={set("poemTitle")} placeholder="Title of your poem" className={fieldCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">3-Line Bio *</label>
              <textarea required value={form.bio} onChange={set("bio")} rows={3}
                placeholder="Write a short 3-line biography about yourself..."
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Word Document (.doc / .docx) *</label>
              <p className="text-[10px] text-gray-600 mb-3">Your poem and bio must be in a Microsoft Word document. Include your payment receipt proof inside the document.</p>
              <label className={`flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                file ? "border-primary/40 bg-primary/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"
              }`}>
                <input type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${file ? "bg-primary/20" : "bg-white/5"}`}>
                  {file ? <FileText className="h-5 w-5 text-primary" /> : <Upload className="h-5 w-5 text-gray-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file ? file.name : "Click to attach Word document"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{file ? `${(file.size / 1024).toFixed(0)} KB` : ".doc or .docx only"}</p>
                </div>
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-black font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-50">
              {loading ? "Uploading & Submitting…" : "Submit My Entry"}
            </button>

            <p className="text-[11px] text-gray-600 text-center">
              By submitting, you confirm payment of the entry fee and agree to all Loudthotz Poetry Prize rules.
            </p>
          </form>
        </div>

        <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/70 leading-relaxed">
            <strong className="text-amber-400">Important:</strong> This page is for paid entries only.
            Submissions without proof of payment will be disqualified.
            Only Nigerians with a functional NUBAN bank account are eligible.
          </p>
        </div>
      </div>
    </div>
  );
}
