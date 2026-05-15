'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { isAdmin, setAdmin } = useUIStore();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sync state from localStorage immediately
    const savedAdmin = localStorage.getItem('is_admin') === 'true';
    if (savedAdmin && !isAdmin) {
      setAdmin(true);
    }
    
    // Mark as ready once we've checked storage and Firebase is done loading
    if (!loading) {
      setIsReady(true);
    }
  }, [loading, isAdmin, setAdmin]);

  useEffect(() => {
    if (!isReady) return;

    // Redirect logic
    const savedAdmin = localStorage.getItem('is_admin') === 'true';
    if (!user && !isAdmin && !savedAdmin && pathname !== '/login') {
      router.push('/login');
    }

    const adminPages = ['/dashboard', '/creators', '/settings'];
    if (user && !isAdmin && !savedAdmin && adminPages.includes(pathname)) {
      router.push('/');
    }
  }, [isReady, user, isAdmin, pathname, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
        <p className="text-muted-foreground animate-pulse font-medium text-sm tracking-widest uppercase text-center">
          Initializing<br/>RohitGram Session
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
