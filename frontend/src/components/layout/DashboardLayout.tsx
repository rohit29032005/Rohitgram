'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/store/useUIStore';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();
  const pathname = usePathname();
  
  // Don't show sidebar/layout on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
        <Sidebar />
        <main className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "pl-64" : "pl-20"
        )}>
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
