"use client";

import React, { useState, useEffect } from "react";
import { Lock, Shield, Zap, Bell, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(7);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsLocked(false);
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

  const handleLock = () => {
    setIsLocked(true);
    setTimeLeft(duration * 24 * 3600);
    setShowAgreement(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-purple-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PureWill <span className="text-purple-500 text-sm">AI</span></span>
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
              
              <h1 className="text-3xl font-bold mb-2">Commitment Dashboard</h1>
              <p className="text-zinc-400 mb-8 max-w-md">Your willpower is your superpower. Stay disciplined, stay focused, and reach your peak performance.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">Current Streak</span>
                  </div>
                  <div className="text-4xl font-black text-white">12 <span className="text-sm font-normal text-zinc-500">Days</span></div>
                </div>
                <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">Time Remaining</span>
                  </div>
                  <div className="text-2xl font-mono text-white tabular-nums tracking-tighter">
                    {isLocked ? formatTime(timeLeft) : "00d 00h 00m 00s"}
                  </div>
                </div>
              </div>

              {!isLocked ? (
                <div className="mt-8 space-y-6">
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
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/20"
                  >
                    Initiate Digital Lockdown
                  </button>
                </div>
              ) : (
                <div className="mt-8 p-6 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-green-500">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-semibold">Lockdown Active - AI Guardian Engaged</span>
                  </div>
                  <div className="text-zinc-500 text-sm italic">Deactivation buttons hidden</div>
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
