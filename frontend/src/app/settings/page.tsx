'use client';

import React from 'react';
import { Settings, Shield, Bell, Database, Globe, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';

export default function SettingsPage() {
  const router = useRouter();
  const { setAdmin } = useUIStore();

  const handleLogout = async () => {
    await signOut(auth);
    setAdmin(false);
    localStorage.removeItem('is_admin');
    router.push('/login');
  };

  const sections = [
    { icon: Shield, label: 'Privacy & Security', desc: 'Manage your access keys' },
    { icon: Bell, label: 'Notifications', desc: 'Sync alerts & bot messages' },
    { icon: Database, label: 'Storage Management', desc: 'Firebase bucket usage' },
    { icon: Globe, label: 'Platform Preferences', desc: 'Language and display' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10 px-6">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-2">Personalize your immersive experience.</p>
      </header>

      <div className="space-y-4">
        {sections.map((item) => (
          <div key={item.label} className="glass p-6 rounded-[2.5rem] flex items-center gap-6 cursor-pointer hover:bg-white/5 transition-all">
            <div className="p-4 bg-white/5 rounded-2xl">
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{item.label}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleLogout}
        className="w-full glass p-6 rounded-[2.5rem] flex items-center gap-6 cursor-pointer hover:bg-red-500/10 text-red-400 border-red-500/20 transition-all group"
      >
        <div className="p-4 bg-red-500/5 rounded-2xl group-hover:bg-red-500/20 transition-all">
          <LogOut className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-bold">Sign Out</h3>
          <p className="text-[10px] text-red-400/50 uppercase tracking-widest mt-1">End your current session</p>
        </div>
      </button>

      <div className="p-8 border border-white/5 bg-white/5 rounded-[3rem] text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-4">RohitGram v2.5 "Ultra"</p>
        <div className="flex justify-center gap-4">
           <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">SECURE CHANNEL</span>
           <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">PREMIUM ACCOUNT</span>
        </div>
      </div>
    </div>
  );
}
