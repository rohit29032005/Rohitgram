'use client';

import React from 'react';
import { Home, Compass, PlusSquare, Heart, User, Settings, Bookmark, LayoutDashboard } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const baseMenuItems = [
  { id: 'home', icon: Home, label: 'Feed', path: '/' },
  { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
];

const adminMenuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { id: 'creators', icon: Compass, label: 'Creators', path: '/creators' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const { sidebarOpen, activeTab, setActiveTab, isAdmin } = useUIStore();

  const menuItems = isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen border-r border-white/10 transition-all duration-300 bg-black z-50",
      sidebarOpen ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-full py-8">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold">R</span>
          </div>
          {sidebarOpen && <h1 className="text-xl font-bold tracking-tight font-outfit">RohitGram</h1>}
        </div>

        <nav className="flex-1 space-y-2 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                activeTab === item.id 
                  ? "bg-white/10 text-white" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-6 h-6",
                activeTab === item.id ? "text-white" : "group-hover:scale-110 transition-transform"
              )} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-3 mt-auto">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
            <User className="w-6 h-6" />
            {sidebarOpen && (
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{isAdmin ? 'Admin' : 'Guest'}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{isAdmin ? 'Full Access' : 'View Only'}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
