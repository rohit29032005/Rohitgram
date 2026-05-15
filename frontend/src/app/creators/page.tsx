'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Search, RefreshCw, Trash2, Star, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CreatorsPage() {
  const queryClient = useQueryClient();
  const [newHandle, setNewHandle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { data: creators, isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'creators'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const addCreatorMutation = useMutation({
    mutationFn: async (handle: string) => {
      return addDoc(collection(db, 'creators'), {
        handle,
        name: handle,
        platform: 'instagram',
        status: 'active',
        created_at: serverTimestamp(),
        last_sync: null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      setNewHandle('');
      setIsAdding(false);
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (id: string) => {
      // In RohitGram 2.0, "Manual Sync" triggers the GitHub Action
      // For now, we update the status to show we're requesting it
      const creatorRef = doc(db, 'creators', id);
      return updateDoc(creatorRef, { status: 'syncing' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteDoc(doc(db, 'creators', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHandle) addCreatorMutation.mutate(newHandle);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Creators</h1>
          <p className="text-muted-foreground">Manage the accounts in your private feed.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Creator
        </button>
      </header>

      {/* Add Creator Modal/Inline */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-3xl mb-10"
          >
            <form onSubmit={handleAdd} className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <input 
                  autoFocus
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  placeholder="instagram_handle"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <button 
                type="submit"
                disabled={addCreatorMutation.isPending}
                className="bg-white text-black px-8 rounded-xl font-bold disabled:opacity-50"
              >
                {addCreatorMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add'}
              </button>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 text-muted-foreground hover:text-white"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creators List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse" />)
        ) : (
          creators?.map((creator: any) => (
            <motion.div 
              layout
              key={creator.id}
              className="glass p-5 rounded-3xl group relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10">
                  <img src={creator.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.handle}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">@{creator.handle}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      creator.status === 'active' ? "bg-green-500" : "bg-gray-500"
                    )} />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{creator.status}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => syncMutation.mutate(creator.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
                  >
                    <RefreshCw className={cn("w-4 h-4", syncMutation.isPending && "animate-spin")} />
                  </button>
                  <button 
                    onClick={() => deleteMutation.mutate(creator.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                <span>Last Sync: {creator.last_sync ? new Date(creator.last_sync).toLocaleString() : 'Never'}</span>
                <a href={`https://instagram.com/${creator.handle}`} target="_blank" className="hover:text-white flex items-center gap-1">
                  Profile <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
