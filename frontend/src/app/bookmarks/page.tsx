'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, Loader2, ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FeedCard } from '@/features/feed/FeedCard';
import Link from 'next/link';

export default function BookmarksPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks', auth.currentUser?.uid],
    queryFn: async () => {
      if (!auth.currentUser) return [];
      const q = query(
        collection(db, 'users', auth.currentUser.uid, 'bookmarks'),
        orderBy('bookmarked_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) setActiveId(data[0].id);
      return data;
    },
    enabled: !!auth.currentUser,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-reel-id'));
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll('.bookmark-reel');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [bookmarks]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-white/20" />
        <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Syncing Saved Content</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black">
      {/* Back Button (Floating) */}
      <Link href="/" className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all">
        <ChevronLeft className="w-6 h-6" />
      </Link>

      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] flex items-center gap-2">
           <Bookmark className="w-3 h-3" /> Saved Library
        </span>
      </div>

      {bookmarks && bookmarks.length > 0 ? (
        bookmarks.map((item: any) => (
          <div 
            key={item.id} 
            className="bookmark-reel h-screen w-full snap-start snap-always"
            data-reel-id={item.id}
          >
            <FeedCard 
              content={item} 
              isActive={activeId === item.id} 
            />
          </div>
        ))
      ) : (
        <div className="h-screen flex flex-col items-center justify-center text-center px-10 gap-6">
          <div className="p-8 rounded-[3rem] bg-white/5 border border-white/5">
            <Bookmark className="w-12 h-12 text-white/20" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Your Saved Collection is Empty</h3>
            <p className="text-muted-foreground text-sm max-w-xs">Double tap the bookmark icon on any reel to save it for later.</p>
          </div>
          <Link href="/" className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-all">
             Discover Reels
          </Link>
        </div>
      )}
    </div>
  );
}
