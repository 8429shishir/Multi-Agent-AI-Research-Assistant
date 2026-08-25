"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, FileText, CheckCircle2, ChevronRight, LogOut, LayoutDashboard, History, Plus } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        fetchHistory(session.user.id);
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") router.push("/login");
      else if (session) {
        setUser(session.user);
        fetchHistory(session.user.id);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  const fetchHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('research_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) setHistory(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const loadPastReport = (reportData: any) => {
    setTopic(reportData.topic);
    setResults({
      report: reportData.report,
      feedback: reportData.feedback
    });
    setStatus("done");
  };

  const handleRunResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus("running");
    setResults(null);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) throw new Error("Failed to fetch from backend");

      const data = await res.json();
      setResults(data);
      setStatus("done");

      // Save to Supabase DB
      if (user) {
        const { error: dbError } = await supabase
          .from('research_reports')
          .insert([
            {
              user_id: user.id,
              topic: data.topic,
              report: data.report,
              feedback: data.feedback
            }
          ]);
        
        if (!dbError) {
          fetchHistory(user.id); // Refresh sidebar
        } else {
          console.error("Failed to save report to DB", dbError);
        }
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during research.");
      setStatus("idle");
    }
  };

  if (!user) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="flex h-screen bg-neutral-950 font-[family-name:var(--font-dm-sans)] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full flex-shrink-0">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-[family-name:var(--font-syne)] text-black font-bold">N</span>
            </div>
            <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-white tracking-tight">
              Master<span className="text-primary">AI</span>
            </h1>
          </div>
          <div className="text-neutral-500 text-xs ml-11">Enterprise Research</div>
        </div>

        <div className="p-4">
          <button 
            onClick={() => { setStatus("idle"); setResults(null); setTopic(""); }}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 px-4 rounded-xl border border-white/10 transition-colors text-sm font-semibold"
          >
            <Plus size={16} />
            New Research
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-2">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <History size={14} /> History
          </h3>
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-neutral-600 text-sm italic">No past research</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadPastReport(item)}
                  className="w-full text-left p-3 rounded-lg hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-700 group"
                >
                  <div className="text-sm text-neutral-200 truncate group-hover:text-white transition-colors">{item.topic}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400 truncate pr-2">
            {user.email}
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,140,50,0.05),transparent_50%)]">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-neutral-800/50 flex items-center px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <LayoutDashboard size={16} />
            <span>Workspace</span>
            <span className="text-neutral-600">/</span>
            <span className="text-white">{status === 'idle' ? 'New Research' : topic}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Input Form Area */}
            {status !== 'done' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl mb-8"
              >
                <form onSubmit={handleRunResearch}>
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 text-neutral-500 w-5 h-5" />
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Ask Master AI to research a topic..."
                      className="w-full bg-transparent pl-12 pr-32 py-4 text-white text-lg focus:outline-none placeholder:text-neutral-600"
                      disabled={status === 'running'}
                    />
                    <button
                      type="submit"
                      disabled={status === "running" || !topic.trim()}
                      className="absolute right-2 bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      {status === "running" ? (
                        <><Loader2 className="animate-spin w-4 h-4" /> Processing</>
                      ) : (
                        <>Research <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm">
                {error}
              </div>
            )}

            {/* Running States */}
            {status === "running" && (
              <div className="space-y-4">
                {[
                  { id: 1, name: "Intelligent Web Search", desc: "Crawling latest data sources" },
                  { id: 2, name: "Content Extraction", desc: "Scraping and filtering noise" },
                  { id: 3, name: "Synthesis Engine", desc: "Drafting structured report" },
                  { id: 4, name: "Peer Review", desc: "Critiquing and scoring findings" },
                ].map((step, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={step.id} 
                    className="flex items-center gap-4 p-4 rounded-xl border bg-neutral-900 border-neutral-800"
                  >
                    <div className="text-primary font-bold font-[family-name:var(--font-dm-mono)] text-sm">0{step.id}</div>
                    <div>
                      <div className="text-white font-medium text-sm">{step.name}</div>
                      <div className="text-neutral-500 text-xs">{step.desc}</div>
                    </div>
                    <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Results Area */}
            {status === "done" && results && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Generated Report */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-neutral-800/50 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <FileText className="text-primary w-5 h-5" />
                      Executive Summary
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="prose prose-invert prose-orange max-w-none text-neutral-300 text-sm leading-loose whitespace-pre-wrap">
                      {results.report}
                    </div>
                  </div>
                </div>

                {/* Critic Feedback */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-neutral-800/50 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <CheckCircle2 className="w-5 h-5" />
                      System Evaluation
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="text-neutral-300 text-sm leading-loose whitespace-pre-wrap">
                      {results.feedback}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
