'use client';

import React from 'react';
import { Settings, Shield, Bell, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { icon: Shield, label: 'Privacy & Security', desc: 'Manage your access keys' },
    { icon: Bell, label: 'Notifications', desc: 'Sync alerts & bot messages' },
    { icon: Database, label: 'Storage Management', desc: 'Firebase bucket usage' },
    { icon: Globe, label: 'Platform Preferences', desc: 'Language and display' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your RohitGram experience.</p>
      </header>

      <div className="space-y-4">
        {sections.map((item) => (
          <div key={item.label} className="glass p-6 rounded-[2rem] flex items-center gap-6 cursor-pointer hover:bg-white/5 transition-all">
            <div className="p-4 bg-white/5 rounded-2xl">
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{item.label}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 border border-white/5 bg-white/5 rounded-[2.5rem] text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">RohitGram v2.0 "Ghost"</p>
        <div className="flex justify-center gap-4">
           <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">SYSTEM ACTIVE</span>
           <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">FREE TIER</span>
        </div>
      </div>
    </div>
  );
}
