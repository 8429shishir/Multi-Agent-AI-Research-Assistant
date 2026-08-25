"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, Zap, Brain, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Account created! Please check your email for the confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Could not authenticate with Google");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-[family-name:var(--font-dm-sans)] selection:bg-primary/30">
      
      {/* Left Column: Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        
        {/* Logo */}
        <div className="absolute top-8 left-8 sm:left-16 lg:left-24 xl:left-32 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
             <span className="font-[family-name:var(--font-syne)] text-black font-bold text-lg">N</span>
          </div>
          <span className="font-[family-name:var(--font-syne)] font-bold text-white tracking-tight">Master AI</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-10">
            <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-white mb-3">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-[#888] text-sm">
              {isSignUp 
                ? "Enter your details to build your AI research workspace." 
                : "Enter your credentials to access your research workspace."}
            </p>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-medium py-2.5 px-4 rounded-xl transition-colors mb-6 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#222]"></div></div>
            <div className="relative bg-[#0a0a0a] px-3 text-[11px] text-[#666] uppercase tracking-wider font-medium">Or continue with email</div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-[#555]"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-[#555]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#ffa766] text-black font-semibold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,140,50,0.15)] flex items-center justify-center text-sm mt-2"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#666]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-white hover:text-primary transition-colors font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Column: Visual / Marketing */}
      <div className="hidden lg:flex w-[55%] bg-[#111] relative overflow-hidden flex-col justify-between p-12 border-l border-[#222]">
        
        {/* Background Gradients & Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,140,50,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-medium uppercase tracking-widest mb-8">
              <Zap className="w-3.5 h-3.5" /> Next-Gen Research
            </div>
            
            <h2 className="font-[family-name:var(--font-syne)] text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6">
              Accelerate your knowledge discovery.
            </h2>
            
            <p className="text-[#888] text-lg leading-relaxed mb-12">
              Master AI deploys autonomous agentic swarms to search, read, synthesize, and critique the web—delivering comprehensive intelligence in seconds, not hours.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                <Brain className="text-primary w-6 h-6 mb-3" />
                <h3 className="text-white font-medium mb-1">Multi-Agent Swarm</h3>
                <p className="text-[#666] text-sm">Specialized agents working in parallel to verify facts.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                <Shield className="text-primary w-6 h-6 mb-3" />
                <h3 className="text-white font-medium mb-1">Unbiased Synthesis</h3>
                <p className="text-[#666] text-sm">Built-in critic pipelines ensure high-quality reporting.</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Footer info inside right pane */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#555] font-[family-name:var(--font-dm-mono)] uppercase tracking-wider">
          <span>Master AI Systems</span>
          <span>Version 2.0.0</span>
        </div>
      </div>

    </div>
  );
}
