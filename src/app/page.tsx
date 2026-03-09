import Link from "next/link";
import { Shield, Lock, Zap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[130px] rounded-full" />
      </div>

      <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PureWill <span className="text-purple-500 text-sm">AI</span></span>
        </div>
        <Link href="/dashboard" className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-sm font-medium">
          Dashboard
        </Link>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-40 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-8">
          <Zap className="w-3 h-3" /> Powered by AI Willpower
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          RECLAIM YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">DIGITAL FREEDOM</span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          The world's first AI-powered commitment contract platform for students. 
          Lock your focus, block adult content, and reach your true potential.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <Link href="/dashboard" className="flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-purple-600/20 flex items-center justify-center gap-2">
            Start Your Journey <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#extension" className="flex-1 py-4 px-8 rounded-2xl bg-white/5 hover:bg-white/10 font-bold text-lg transition-all border border-white/10 flex items-center justify-center">
            Chrome Extension
          </a>
        </div>

        <div id="extension" className="mt-40 w-full pt-20 border-t border-white/5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            Shield Protocol
          </div>
          <h2 className="text-4xl font-bold mb-6">Install the AI Guardian</h2>
          <p className="text-zinc-400 mb-10 max-w-xl text-lg leading-relaxed">
            The PureWill extension is the "watchman" of your digital life. It works alongside the dashboard to enforce your commitment contracts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Step 1: Download
              </h3>
              <p className="text-zinc-400 text-sm mb-6">Download the extension source code to your computer.</p>
              <a 
                href="https://github.com/23cssahil/stop-porn-ai/archive/refs/heads/main.zip" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition-all"
              >
                Download ZIP <Zap className="w-4 h-4 text-yellow-500" />
              </a>
            </div>
            
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                Step 2: Activate
              </h3>
              <p className="text-zinc-400 text-sm">
                Unzip the file, go to <code className="text-white">chrome://extensions</code>, turn on **Developer Mode**, and click **Load Unpacked**. Select the "extension" folder.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        &copy; 2026 PureWill AI. Built for Discipline.
      </footer>
    </div>
  );
}
