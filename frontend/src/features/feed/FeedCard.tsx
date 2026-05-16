'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Heart, Send, Bookmark, MoreHorizontal, User, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { cn } from '@/lib/utils';

interface FeedCardProps {
  content: any;
  isActive: boolean;
}

export const FeedCard = ({ content, isActive }: FeedCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 1. Monitor Auth State to ensure Bookmark checks actually run
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sync Video Playback with strict error handling
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay might be blocked by browser until interaction
            console.log("Playback interaction required");
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  // 3. Robust Bookmark Status Check
  useEffect(() => {
    const checkBookmark = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid, 'bookmarks', content.id);
        const docSnap = await getDoc(docRef);
        setIsBookmarked(docSnap.exists());
      } catch (err) {
        console.error("Bookmark fetch error:", err);
      }
    };
    checkBookmark();
  }, [content.id, user]);

  const toggleBookmark = async () => {
    if (!user) return alert("Please sign in to save reels");
    
    // Optimistic Update
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      const docRef = doc(db, 'users', user.uid, 'bookmarks', content.id);
      if (previousState) {
        await deleteDoc(docRef);
      } else {
        // Clean the content object for Firestore
        const { ...saveData } = content;
        await setDoc(docRef, {
          ...saveData,
          bookmarked_at: new Date()
        });
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      setIsBookmarked(previousState); // Revert on failure
    }
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* 
         CORE FIX: The 9:16 Container 
         On Desktop: Max height ensures the reel is always visible without scrolling the reel itself.
         On Mobile: w-full and aspect-ratio ensure edge-to-edge verticality.
      */}
      <div className="relative h-full w-full max-w-[calc(100vh*9/16)] aspect-[9/16] bg-black shadow-2xl">
        {/* Video Layer */}
        <video
          ref={videoRef}
          src={content.media_url}
          loop
          muted={!isActive}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Interaction Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Right Action Sidebar (Floating inside the 9:16 frame) */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col gap-5 items-center">
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all active:scale-90"
            >
              <Heart className={cn("w-7 h-7 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
            </button>
            <span className="text-[10px] font-bold text-white drop-shadow-md uppercase tracking-tighter">Like</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={toggleBookmark}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all active:scale-90"
            >
              <Bookmark className={cn("w-7 h-7 transition-colors", isBookmarked ? "fill-white text-white" : "text-white")} />
            </button>
            <span className="text-[10px] font-bold text-white drop-shadow-md uppercase tracking-tighter">Save</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
              <Send className="w-7 h-7 text-white" />
            </button>
            <span className="text-[10px] font-bold text-white drop-shadow-md uppercase tracking-tighter">Share</span>
          </div>

          <button className="p-2 text-white/60 hover:text-white transition-colors">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Content Info (Floating inside the 9:16 frame) */}
        <div className="absolute left-0 right-0 bottom-0 p-5 z-20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-white/30 p-0.5">
              <img 
                src={content.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${content.creator_handle}`} 
                className="w-full h-full rounded-full object-cover"
                alt="avatar"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate drop-shadow-md">@{content.creator_handle || 'curated_content'}</h4>
              <div className="flex items-center gap-2 text-[10px] text-white/70 font-medium">
                 <span>{formatDate(content.timestamp)}</span>
                 <span>•</span>
                 <span className="flex items-center gap-1 uppercase tracking-widest"><Music2 className="w-3 h-3" /> Original Audio</span>
              </div>
            </div>
            <button className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-all">
              Follow
            </button>
          </div>

          <p className="text-sm text-white/90 line-clamp-2 max-w-[85%] leading-relaxed drop-shadow-md">
            {content.caption || 'No description provided.'}
          </p>

          <div className="flex flex-wrap gap-2">
            {content.tags?.map((tag: string) => (
              <span key={tag} className="text-[10px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer bg-white/5 px-2 py-1 rounded-md">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
