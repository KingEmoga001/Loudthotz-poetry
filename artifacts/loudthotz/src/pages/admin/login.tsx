import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, Shield, ExternalLink } from "lucide-react";
import loudthotzIcon from "@assets/loudthouz-small-screen-logo_1781609118102.png";
import loudthotzLogo from "@assets/aa4655fb-acd7-4083-90e7-7a0329b9b315_1781511989631.jpeg";

export default function AdminLogin() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Invalid credentials. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060805] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          {/* Full logo shown in its entirety — object-contain keeps full image visible */}
          <div className="w-48 h-28 overflow-hidden rounded-xl border border-white/10 mb-4 bg-black">
            <img src={loudthotzLogo} alt="Loudthotz" className="h-full w-full object-contain" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-8 w-8 rounded-lg bg-black border border-white/10 overflow-hidden">
              <img src={loudthotzIcon} alt="icon" className="h-full w-full object-contain p-0.5" />
            </div>
            <h1 className="font-display text-2xl font-bold text-primary tracking-wider">LOUDTHOTZ</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Admin Control Room</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d100a] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-amber-400" />
            <h2 className="font-semibold text-white text-lg">Sign in to continue</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@loudthotz.com"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
            >
              <Lock className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Help text */}
        <div className="mt-6 bg-[#0d100a] border border-white/5 rounded-xl p-5 text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-400 flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" /> First time? Set up your admin account:
          </p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Go to <span className="text-primary">Firebase Console → Authentication</span></li>
            <li>Enable <span className="text-gray-300">Email/Password</span> sign-in method</li>
            <li>Go to <span className="text-primary">Users → Add user</span></li>
            <li>Enter your admin email and password</li>
            <li>Return here and sign in</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
