'use client';

import React from 'react';
import { MoreHorizontal, Heart, MessageCircle, Send, Bookmark, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

interface FeedCardProps {
  content: any;
}

export const FeedCard = ({ content }: FeedCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden mb-6 max-w-[500px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-black p-[2px]">
              <img 
                src={content.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${content.creator_id}`} 
                alt="avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold hover:text-white/70 cursor-pointer">
              {content.creator_handle || 'creator'}
            </h4>
            <p className="text-[10px] text-muted-foreground">{formatDate(content.timestamp)}</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-white">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media */}
      <div className="relative aspect-square bg-black group cursor-pointer">
        <img 
          src={content.media_url} 
          alt="content" 
          className="w-full h-full object-cover"
        />
        {content.type === 'video' || content.type === 'reel' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-6 h-6 hover:text-white/70 cursor-pointer" />
            <Send className="w-6 h-6 hover:text-white/70 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 hover:text-yellow-500 cursor-pointer transition-colors" />
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-semibold mr-2">{content.creator_handle}</span>
            {content.caption}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {content.tags?.map((tag: string) => (
              <span key={tag} className="text-xs text-blue-400 hover:underline cursor-pointer">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
