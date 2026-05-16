'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Heart, Send, Bookmark, MoreHorizontal, User, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

interface FeedCardProps {
  content: any;
  isActive: boolean;
}

export const FeedCard = ({ content, isActive }: FeedCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Sync Video Playback
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  // Check Bookmark Status
  useEffect(() => {
    const checkBookmark = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid, 'bookmarks', content.id);
      const docSnap = await getDoc(docRef);
      setIsBookmarked(docSnap.exists());
    };
    checkBookmark();
  }, [content.id]);

  const toggleBookmark = async () => {
    if (!auth.currentUser) return;
    const docRef = doc(db, 'users', auth.currentUser.uid, 'bookmarks', content.id);
    
    if (isBookmarked) {
      await deleteDoc(docRef);
      setIsBookmarked(false);
    } else {
      await setDoc(docRef, {
        ...content,
        bookmarked_at: new Date()
      });
      setIsBookmarked(true);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Immersive Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={content.media_url}
          loop
          muted={!isActive}
          playsInline
          className="w-full h-full object-contain md:object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Right Action Sidebar (Instagram Style) */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-1 group">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
          >
            <Heart className={cn("w-7 h-7 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm uppercase tracking-tighter">Like</span>
        </div>

        <div className="flex flex-col items-center gap-1 group">
          <button 
            onClick={toggleBookmark}
            className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
          >
            <Bookmark className={cn("w-7 h-7 transition-colors", isBookmarked ? "fill-white text-white" : "text-white")} />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm uppercase tracking-tighter">Save</span>
        </div>

        <div className="flex flex-col items-center gap-1 group">
          <button className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
            <Send className="w-7 h-7 text-white" />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm uppercase tracking-tighter">Share</span>
        </div>

        <button className="p-2 text-white/40 hover:text-white transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Content Info */}
      <div className="absolute left-0 right-0 bottom-0 p-6 z-20 flex flex-col gap-4">
        {/* Creator Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 p-0.5">
            <img 
              src={content.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${content.creator_handle}`} 
              className="w-full h-full rounded-full object-cover"
              alt="avatar"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white drop-shadow-md">@{content.creator_handle || 'curated_content'}</h4>
            <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium">
               <span>{formatDate(content.timestamp)}</span>
               <span>•</span>
               <span className="flex items-center gap-1 uppercase tracking-widest"><Music2 className="w-3 h-3" /> Original Audio</span>
            </div>
          </div>
          <button className="ml-2 px-4 py-1.5 rounded-full border border-white/30 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
            Follow
          </button>
        </div>

        {/* Caption */}
        <p className="text-sm text-white/90 line-clamp-2 max-w-[80%] leading-relaxed drop-shadow-sm">
          {content.caption || 'No description provided.'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {content.tags?.map((tag: string) => (
            <span key={tag} className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
