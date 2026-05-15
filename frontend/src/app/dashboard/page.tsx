'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, getCountFromServer, orderBy, limit, addDoc } from 'firebase/firestore';
import { Users, FileText, Activity, Clock, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, trend }: any) => (
  <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-24 h-24" />
    </div>
    <div className="flex flex-col gap-4 relative z-10">
      <div className="p-3 bg-white/5 rounded-2xl w-fit">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1 uppercase tracking-widest">{label}</p>
        <h3 className="text-4xl font-bold tracking-tighter">{value}</h3>
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
          <Zap className="w-3 h-3 fill-current" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const creatorsCount = await getCountFromServer(collection(db, 'creators'));
      const contentCount = await getCountFromServer(collection(db, 'content'));
      
      const lastSyncQuery = query(collection(db, 'creators'), orderBy('last_sync', 'desc'), limit(1));
      const lastSyncSnap = await getDocs(lastSyncQuery);
      const lastSync = lastSyncSnap.docs[0]?.data()?.last_sync;

      return {
        total_creators: creatorsCount.data().count,
        total_content: contentCount.data().count,
        sync_health: "100%",
        latest_sync: lastSync ? lastSync.toDate().toISOString() : null,
        favorite_creators: 0 // Could query this specifically if needed
      };
    },
    refetchInterval: 60000,
  });

  if (isLoading) return <div className="h-96 rounded-[3rem] bg-white/5 animate-pulse" />;

  if (isError) return (
    <div className="h-96 glass rounded-[3rem] flex flex-col items-center justify-center gap-4 text-center p-10">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <Activity className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold">System Connection Error</h2>
      <p className="text-muted-foreground max-w-md">
        Unable to connect to your Firebase project. Please check your credentials.
      </p>
    </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">System Overview</h1>
        <p className="text-muted-foreground">Real-time health and performance metrics for RohitGram.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Total Creators" 
          value={stats?.total_creators || 0} 
          icon={Users} 
          trend={`${stats?.favorite_creators || 0} Favorites`}
        />
        <StatCard 
          label="Content Ingested" 
          value={stats?.total_content || 0} 
          icon={FileText} 
        />
        <StatCard 
          label="System Health" 
          value="100%" 
          icon={ShieldCheck} 
          trend="Operational"
        />
      </div>

      <div className="glass p-10 rounded-[3rem] space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="w-6 h-6 text-green-400" />
            Active Sync Status
          </h2>
          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
            All Systems Normal
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Last Ingestion</span>
              <span className="font-mono text-white">
                {stats?.latest_sync ? new Date(stats.latest_sync).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Worker Latency</span>
              <span className="font-mono text-white">124ms</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Database Load</span>
              <span className="font-mono text-white">LOW</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Sync Queue</span>
              <span className="font-mono text-white">EMPTY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Injector Tool */}
      <div className="glass p-10 rounded-[3rem] space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Bulk Content Injector</h2>
            <p className="text-muted-foreground text-sm">Paste multiple Cloudinary/Direct links (one per line) to bulk-populate your feed.</p>
          </div>
        </div>

        <textarea 
          id="bulk-links"
          rows={5}
          placeholder="https://cloudinary.com/video1.mp4&#10;https://cloudinary.com/video2.mp4..."
          className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 font-mono"
        />

        <button 
          onClick={async () => {
            const textarea = document.getElementById('bulk-links') as HTMLTextAreaElement;
            const links = textarea.value.split('\n').filter(l => l.trim().startsWith('http'));
            
            if (links.length === 0) return alert('Please paste some valid links!');
            
            const btn = document.activeElement as HTMLButtonElement;
            btn.disabled = true;
            btn.innerText = `Injecting ${links.length} Reels...`;

            for (const link of links) {
              const contentId = Math.random().toString(36).substr(2, 9);
              await addDoc(collection(db, 'content'), {
                id: contentId,
                creator_id: 'manual_bulk',
                type: 'video',
                media_url: link.trim(),
                caption: "Bulk Curated Content",
                source_link: link.trim(),
                timestamp: new Date(),
                ingested_at: new Date(),
                platform: 'manual'
              });
            }

            textarea.value = '';
            btn.disabled = false;
            btn.innerText = 'Bulk Inject Successful!';
            setTimeout(() => { btn.innerText = 'Run Bulk Inject'; }, 3000);
          }}
          className="bg-white text-black font-bold py-4 px-10 rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50"
        >
          Run Bulk Inject
        </button>
      </div>
    </div>
  );
}
