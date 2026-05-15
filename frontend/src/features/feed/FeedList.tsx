'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FeedCard } from './FeedCard';
import { Loader2 } from 'lucide-react';

export const FeedList = () => {
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const res = await api.get('/feed');
      return res.data;
    },
    refetchInterval: 60000, // Refetch every minute
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
