'use client';

import React from 'react';
import { Bookmark, LayoutGrid, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function BookmarksPage() {
  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks', auth.currentUser?.uid],
    queryFn: async () => {
      if (!auth.currentUser) return [];
      const q = query(
        collection(db, 'users', auth.currentUser.uid, 'bookmarks'),
        orderBy('bookmarked_at', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!auth.currentUser,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
          <Bookmark className="w-8 h-8" />
          Saved Content
        </h1>
        <p className="text-muted-foreground mt-2">Your private collection of curated reels.</p>
      </header>

      {bookmarks && bookmarks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
          {bookmarks.map((item: any) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id} 
              className="relative aspect-[9/16] bg-white/5 rounded-xl overflow-hidden group cursor-pointer"
            >
              <video src={item.media_url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                 <p className="text-xs font-bold text-white truncate">@{item.creator_handle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
          <p className="text-muted-foreground">You haven't saved any reels yet.</p>
        </div>
      )}
    </div>
  );
}
