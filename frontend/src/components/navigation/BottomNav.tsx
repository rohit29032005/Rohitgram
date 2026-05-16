'use client';

import React from 'react';
import { Home, Bookmark, LayoutDashboard, Compass, Settings, User } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav = () => {
  const { isAdmin } = useUIStore();
  const pathname = usePathname();

  const navItems = [
    { id: 'home', icon: Home, path: '/' },
    { id: 'bookmarks', icon: Bookmark, path: '/bookmarks' },
    ...(isAdmin ? [
      { id: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { id: 'creators', icon: Compass, path: '/creators' },
    ] : []),
    { id: 'settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 z-[100] px-4 flex items-center justify-around pb-safe md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.path}
          className={cn(
            "p-3 rounded-2xl transition-all",
            pathname === item.path ? "text-white" : "text-muted-foreground hover:text-white"
          )}
        >
          <item.icon className={cn(
            "w-6 h-6",
            pathname === item.path && "scale-110"
          )} />
        </Link>
      ))}
    </nav>
  );
};
