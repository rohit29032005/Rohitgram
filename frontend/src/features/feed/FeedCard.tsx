'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
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

  // Cloudinary Optimization Strategy
  const optimizedUrl = useMemo(() => {
    if (!content.media_url.includes('cloudinary.com')) return content.media_url;
    // Injecting: f_auto (format), q_auto (quality), c_fill (crop), w_720, h_1280 (HD Vertical)
    return content.media_url.replace('/upload/', '/upload/f_auto,q_auto,c_fill,w_720,h_1280/');
  }, [content.media_url]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

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
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);
    try {
      const docRef = doc(db, 'users', user.uid, 'bookmarks', content.id);
      if (previousState) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { ...content, bookmarked_at: new Date() });
      }
    } catch (err) {
      setIsBookmarked(previousState);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* 
         THE 9:16 FRAME: 
         - Uses container-query-like logic via CSS calculation.
         - Ensures the 720x1280 source composition is never distorted.
      */}
      <div className="relative h-full w-full max-w-[calc(100vh*9/16)] aspect-[9/16] bg-black shadow-2xl flex items-center justify-center">
        <video
          ref={videoRef}
          src={optimizedUrl}
          loop
          muted={!isActive}
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Right Actions */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-6 items-center">
          <button onClick={() => setIsLiked(!isLiked)} className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 active:scale-90 transition-all">
            <Heart className={cn("w-7 h-7 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
          </button>
          <button onClick={toggleBookmark} className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 active:scale-90 transition-all">
            <Bookmark className={cn("w-7 h-7 transition-colors", isBookmarked ? "fill-white text-white" : "text-white")} />
          </button>
          <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <Send className="w-7 h-7 text-white" />
          </button>
          <button className="p-2 text-white/40 hover:text-white">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute left-0 right-0 bottom-0 p-6 z-20 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/30 p-0.5">
              <img src={content.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${content.creator_handle}`} className="w-full h-full rounded-full object-cover" alt="" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white drop-shadow-md">@{content.creator_handle || 'curated'}</h4>
              <div className="flex items-center gap-2 text-[10px] text-white/70 font-medium">
                 <span>{formatDate(content.timestamp)}</span>
                 <span>•</span>
                 <span className="flex items-center gap-1"><Music2 className="w-3 h-3" /> Original Audio</span>
              </div>
            </div>
            <button className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-[10px] font-bold text-white">Follow</button>
          </div>
          <p className="text-sm text-white/90 line-clamp-2 max-w-[85%] leading-relaxed drop-shadow-md">{content.caption}</p>
        </div>
      </div>
    </div>
  );
};
