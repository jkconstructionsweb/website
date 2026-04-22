"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Hard-coded admin credentials (swap with DB auth in production)
const ADMIN_USER = "admin";
const ADMIN_PASS = "jk@2024";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]  = useState(false);
  const [error, setError]        = useState("");
  const [loading, setLoading]    = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(res => setTimeout(res, 800)); // simulate latency
    
    // Dynamic password support
    const storedPass = localStorage.getItem("jk_admin_password") || ADMIN_PASS;

    if (username.trim().toLowerCase() === ADMIN_USER.toLowerCase() && password.trim() === storedPass) {
      localStorage.setItem("jk_admin_auth", "true");
      window.location.href = "/admin"; // Force full reload to remount AdminLayout and trigger useAuth
    } else {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8">
      {/* Premium Dark Architecture Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')", 
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }} 
      >
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-90" />
      </div>

      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] shadow-2xl border border-white/20 overflow-hidden relative z-10 flex flex-col md:flex-row">
        
        {/* Left Side: Brand Identity */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-secondary/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20"
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80')", backgroundSize: "cover", mixBlendMode: "overlay" }} />
               
          <div className="relative z-10 w-full h-24 flex items-center justify-start">
            <img 
              src="/Logo.png" 
              alt="JK Constructions" 
              className="h-32 -ml-8 w-auto object-contain grayscale invert contrast-200 mix-blend-screen opacity-90" 
            />
          </div>

          <div className="relative z-10 mt-16">
            <h1 className="text-4xl font-light text-white leading-tight mb-4">
              Premium <br/><span className="font-black text-primary">Admin Control</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Manage your construction projects, leads, and website content systematically through this secure, high-performance dashboard.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-16">
            <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium">
              ← Return to JK Constructions Homepage
            </Link>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 bg-white relative">
          
          <div className="md:hidden flex justify-center mb-10 h-20 items-center">
             <img src="/Logo.png" alt="JK Constructions" className="h-28 w-auto object-contain mix-blend-multiply" />
          </div>

          <h2 className="text-3xl font-black text-secondary mb-2">Welcome Back</h2>
          <p className="text-secondary/50 font-medium text-sm mb-10">Please enter your credentials to safely access your account.</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"/> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-secondary/40 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full h-14 py-4 pl-12 pr-4 rounded-2xl border-2 border-neutral/20 focus:border-primary focus:bg-white bg-neutral/10 focus:outline-none font-semibold text-secondary transition-all"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2 ml-1 pr-1">
                <label className="block text-[11px] font-black text-secondary/40 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 py-4 pl-12 pr-12 rounded-2xl border-2 border-neutral/20 focus:border-primary focus:bg-white bg-neutral/10 focus:outline-none font-semibold text-secondary transition-all"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors">
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 group bg-secondary hover:bg-primary text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-secondary/20 hover:shadow-primary/30 disabled:opacity-70 flex items-center justify-between px-6 mt-4"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <div className="mt-12 p-5 bg-neutral/10 rounded-2xl border border-neutral/20 flex gap-3">
             <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
               <ShieldCheck size={16} className="text-secondary" />
             </div>
             <div>
               <p className="text-xs font-bold text-secondary mb-1">Demo Access Credentials</p>
               <p className="text-[11px] text-secondary/60">Username: <span className="font-mono bg-white px-1 py-0.5 rounded shadow-sm text-secondary">admin</span> | Password: <span className="font-mono bg-white px-1 py-0.5 rounded shadow-sm text-secondary">jk@2024</span></p>
             </div>
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link href="/" className="text-secondary/40 hover:text-primary text-xs font-medium transition-colors">
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
