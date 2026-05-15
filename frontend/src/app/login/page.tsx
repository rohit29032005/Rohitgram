'use client';

import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Globe, Loader2, User, KeyRound } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<'google' | 'admin'>('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Admin form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const { setAdmin } = useUIStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAdmin(false); 
      localStorage.setItem('is_admin', 'false');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Fixed Credentials Check
    if (username === 'rohitgram' && password === '123456rohit') {
      setAdmin(true);
      localStorage.setItem('is_admin', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 rounded-[2.5rem] text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-white/5">
            <Shield className="w-10 h-10 text-black" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-outfit">RohitGram</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Secure Access Gateway</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 rounded-2xl">
          <button 
            onClick={() => setLoginMode('google')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginMode === 'google' ? 'bg-white text-black' : 'text-muted-foreground hover:text-white'}`}
          >
            User Login
          </button>
          <button 
            onClick={() => setLoginMode('admin')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginMode === 'admin' ? 'bg-white text-black' : 'text-muted-foreground hover:text-white'}`}
          >
            Admin Login
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loginMode === 'google' ? (
            <motion.div
              key="google"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Continue with Google
                  </>
                )}
              </button>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Public Content Viewing Only</p>
            </motion.div>
          ) : (
            <motion.form
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleAdminLogin}
              className="space-y-4 text-left"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 mt-2"
              >
                Unlock Management
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
