'use client';

import React from 'react';
import { Bookmark, LayoutGrid } from 'lucide-react';

export default function BookmarksPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10">
          <Bookmark className="w-10 h-10 text-muted-foreground" />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">Saved Content</h1>
        <p className="text-muted-foreground">Your bookmarked reels will appear here.</p>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-10 opacity-20 grayscale">
         {[1,2,3,4,5,6].map(i => (
           <div key={i} className="aspect-[9/16] bg-white/5 rounded-xl border border-white/10" />
         ))}
      </div>
    </div>
  );
}
