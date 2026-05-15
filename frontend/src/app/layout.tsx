'use client';

import React from 'react';
import { AuthProvider } from '@/features/auth/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
