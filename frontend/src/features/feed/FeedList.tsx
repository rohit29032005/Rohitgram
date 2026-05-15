'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FeedCard } from './FeedCard';
import { Loader2 } from 'lucide-react';

import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const FeedList = () => {
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const q = query(
        collection(db, 'content'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground animate-pulse">Assembling your premium feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Failed to load feed. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {content?.length > 0 ? (
        content.map((item: any) => (
          <FeedCard key={item.id} content={item} />
        ))
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <p className="text-muted-foreground">No content found. Add some creators to get started!</p>
        </div>
      )}
    </div>
  );
};
