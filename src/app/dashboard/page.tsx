"use client";

import React, { useState, useEffect } from "react";
import { Lock, Shield, Zap, Bell, Clock, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(7);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Generate or retrieve a persistent userId for this browser
    let id = localStorage.getItem("purewill_userid");
    if (!id) {
      id = "user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("purewill_userid", id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function checkStatus() {
      try {
        setError(null);
        const res = await fetch(`/api/status?userId=${userId}`, { cache: 'no-store' });
        const data = await res.json();
        
        if (data.error) {
           setError(`Database Error: ${data.error}`);
           return;
        }

        if (data.isLocked) {
          setIsLocked(true);
          const end = new Date(data.lockUntil).getTime();
          const now = new Date().getTime();
          const remaining = Math.floor((end - now) / 1000);
          setTimeLeft(remaining > 0 ? remaining : 0);
        } else {
          setIsLocked(false);
          setTimeLeft(0);
        }
      } catch (e: any) {
        console.error("Failed to fetch status", e);
        setError("Network Error: Could not reach the server.");
      } finally {
        setIsLoading(false);
      }
    }
    checkStatus();
  }, [userId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, timeLeft]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  const handleLock = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, duration: Number(duration), partnerEmail, email: "user@example.com" }),
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success) {
        setIsLocked(true);
        const end = new Date(data.lockUntil).getTime();
        const now = new Date().getTime();
        setTimeLeft(Math.floor((end - now) / 1000));
        setShowAgreement(false);
      }
    } catch (e) {
      alert("Lock failed. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-purple-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PureWill <span className="text-purple-500 text-sm">AI</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm font-medium">Documentation</button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center cursor-pointer">
            <span className="text-xs font-bold">JD</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Status Card */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Lock className="w-32 h-32" />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">Commitment Dashboard</h1>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  ID: {userId || "Generating..."}
                </div>
              </div>
              <p className="text-zinc-400 mb-8 max-w-md">Your willpower is your superpower. Stay disciplined, stay focused, and reach your peak performance.</p>

              {error && (
                <div className="mb-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 space-y-3">
                  <div className="flex items-center gap-3 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    Database Sync Error
                  </div>
                  <p className="text-xs leading-relaxed opacity-80 font-mono bg-black/20 p-2 rounded-lg">{error}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-[10px] uppercase tracking-widest bg-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-all font-bold border border-red-500/20"
                    >
                      Retry Sync
                    </button>
                    <Link 
                      href="/api/debug" 
                      target="_blank"
                      className="text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all font-bold border border-white/10"
                    >
                      Check Server Config
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-black/30 border border-white/5 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">Current Streak</span>
                    </div>
                    {isLoading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full" />}
                  </div>
                  <div className="text-4xl font-black text-white">
                    {isLoading ? "---" : "12"} <span className="text-sm font-normal text-zinc-500">Days</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">Time Remaining</span>
                  </div>
                  <div className="text-2xl font-mono text-white tabular-nums tracking-tighter">
                    {isLoading ? "Initialising..." : isLocked ? formatTime(timeLeft) : "00d 00h 00m 00s"}
                  </div>
                </div>
              </div>

              {!isLocked ? (
                <div className={`mt-8 space-y-6 ${isLoading ? "opacity-40 pointer-events-none" : ""}`}>
                  <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-500" />
                        Choose Your Lock Duration
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {[7, 30, 90, 365].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            duration === d 
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                            : "bg-white/5 text-zinc-400 hover:bg-white/10"
                          }`}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowAgreement(true)}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/20 disabled:grayscale"
                  >
                    {isLoading ? "Checking Status..." : "Initiate Digital Lockdown"}
                  </button>
                </div>
              ) : (
                <div className="mt-8 p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-green-500">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold uppercase tracking-tight text-sm">Lockdown Active - AI Guardian Engaged</span>
                    </div>
                    {isLoading && <span className="text-[10px] text-zinc-500 animate-pulse uppercase tracking-widest">Updating...</span>}
                  </div>

                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Step 2: Activate Extension
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Chrome prevents websites from opening internal settings automatically for your security. Please follow these 2 quick steps:
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-purple-400 border border-purple-500/20">1</div>
                        <p className="text-zinc-300">Open <code className="bg-zinc-800 px-2 py-0.5 rounded text-white">chrome://extensions/</code> in a new tab.</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-purple-400 border border-purple-500/20">2</div>
                        <p className="text-zinc-300">Ensure <strong>Developer Mode</strong> (top right) is ON and the <strong>PureWill AI</strong> extension is active.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open('chrome://extensions/', '_blank')}
                      className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-sm font-bold flex items-center justify-center gap-2 text-zinc-300"
                    >
                      Attempt Open Extension Page <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-2">
                       Manual open is required if the button is blocked by the browser
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold">Accountability Partner</h3>
                </div>
                <input 
                  type="email" 
                  placeholder="Partner's Email Address"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  disabled={isLocked}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors mb-4"
                />
                <p className="text-xs text-zinc-500 leading-relaxed italic">
                  They will be notified immediately if you attempt to bypass the lock or uninstall the extension.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-green-500" />
                  <h3 className="font-bold">AI Protection Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Browser Extension</span>
                    <span className="text-green-500 font-mono">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Domain Filter</span>
                    <span className="text-green-500 font-mono">ENFORCED</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">NSFW Image Scan</span>
                    <span className="text-green-500 font-mono">ACTIVE</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl overflow-hidden relative"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-400" />
                The Protocol
              </h3>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold">01.</span>
                  <span>Once locked, the platform's AI prevents any access to adult content.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold">02.</span>
                  <span>Withdrawal of the agreement is impossible until the timer hits zero.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold">03.</span>
                  <span>Your partner is the final witness to your integrity.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-purple-900/10 border border-white/5 backdrop-blur-xl"
            >
              <h3 className="font-bold mb-2">Pro Tip</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Use this time to cultivate new habits. Replace digital dopamine with real-world achievements.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Modal / Agreement */}
      <AnimatePresence>
        {showAgreement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAgreement(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-tighter">The Digital Commitment</h2>
              <div className="space-y-4 text-zinc-400 text-sm mb-8 leading-relaxed">
                <p>By proceeding, you are initiating a binding digital contract with yourself. You acknowledge that:</p>
                <div className="pl-4 border-l-2 border-purple-500/30 space-y-2">
                  <p>1. The AI will actively block content for <strong className="text-white">{duration} days</strong>.</p>
                  <p>2. Deactivation buttons will be <strong className="text-white">removed</strong> from your view.</p>
                  <p>3. Any attempt to bypass will notify <strong className="text-white">{partnerEmail || "your accountability partner"}</strong>.</p>
                </div>
                <p className="italic text-zinc-500">"Freedom is found in discipline."</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowAgreement(false)}
                  className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLock}
                  className="flex-[2] py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-lg shadow-purple-600/20"
                >
                  I Agree, Lock Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
