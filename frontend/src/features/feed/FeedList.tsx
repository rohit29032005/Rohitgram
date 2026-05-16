'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FeedCard } from './FeedCard';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const FeedList = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const q = query(
        collection(db, 'content'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) setActiveId(data[0].id);
      return data;
    },
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
      { threshold: 0.6 } // Target 60% visibility for "active" state
    );

    const elements = document.querySelectorAll('.reel-container');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-white/20" />
        <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Initializing Immersive Feed</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-red-400 font-medium">Failed to synchronize feed.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black"
    >
      {content && content.length > 0 ? (
        content.map((item: any) => (
          <div 
            key={item.id} 
            className="reel-container h-screen w-full snap-start snap-always"
            data-reel-id={item.id}
          >
            <FeedCard 
              content={item} 
              isActive={activeId === item.id} 
            />
          </div>
        ))
      ) : (
        <div className="h-screen flex items-center justify-center text-center px-10">
          <p className="text-muted-foreground text-lg">Your curated space is empty. Add creators to begin.</p>
        </div>
      )}
    </div>
  );
};
