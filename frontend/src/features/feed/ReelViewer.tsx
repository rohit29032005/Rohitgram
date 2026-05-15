'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Send, Music, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReelProps {
  reels: any[];
  initialIndex?: number;
  onClose: () => void;
}

export const ReelViewer = ({ reels, initialIndex = 0, onClose }: ReelProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [muted, setMuted] = useState(true);

  const nextReel = () => {
    if (currentIndex < reels.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const prevReel = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative h-[90vh] aspect-[9/16] bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="relative w-full h-full"
          >
            {/* Video Placeholder */}
            <div className="w-full h-full bg-black flex items-center justify-center">
               <img 
                 src={reels[currentIndex].media_url} 
                 className="w-full h-full object-cover"
                 alt="reel"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            </div>

            {/* Interaction Buttons */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-1 group">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all cursor-pointer">
                  <Heart className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium">1.2k</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all cursor-pointer">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium">84</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all cursor-pointer">
                  <Bookmark className="w-7 h-7" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all cursor-pointer">
                  <Send className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Content Info */}
            <div className="absolute bottom-8 left-6 right-16">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reels[currentIndex].creator_id}`} 
                  className="w-10 h-10 rounded-full border-2 border-white"
                  alt="avatar"
                />
                <span className="font-bold">{reels[currentIndex].creator_handle}</span>
                <button className="px-4 py-1.5 rounded-lg border border-white text-xs font-bold hover:bg-white hover:text-black transition-all">
                  Follow
                </button>
              </div>
              <p className="text-sm line-clamp-2 mb-4">{reels[currentIndex].caption}</p>
              <div className="flex items-center gap-2 text-xs">
                <Music className="w-4 h-4 animate-spin-slow" />
                <span className="animate-marquee whitespace-nowrap">Original Audio - {reels[currentIndex].creator_handle}</span>
              </div>
            </div>

            {/* Controls */}
            <button 
              onClick={() => setMuted(!muted)}
              className="absolute top-6 left-6 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/4 cursor-pointer" onClick={prevReel} />
        <div className="absolute inset-y-0 right-0 w-1/4 cursor-pointer" onClick={nextReel} />
      </div>
    </div>
  );
};
