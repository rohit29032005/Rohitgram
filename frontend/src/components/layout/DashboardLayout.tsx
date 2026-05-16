'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from '../navigation/BottomNav';
import { useUIStore } from '@/store/useUIStore';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();
  const pathname = usePathname();
  
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav />

        <main className={cn(
          "transition-all duration-300 min-h-screen pb-20 md:pb-0",
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        )}>
          <div className={cn(
            "max-w-7xl mx-auto",
            pathname === '/' ? "p-0" : "p-8 lg:p-12"
          )}>
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
