'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on user role
        const roleRouteMap = {
          'supervisor': '/dashboard/supervisor',
          'employee': '/dashboard/employee',
          'personal': '/dashboard/personal',
          'superadmin': '/dashboard/superadmin'
        };
        
        router.push(roleRouteMap[user.role as keyof typeof roleRouteMap] || '/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M12 11h4"></path>
            <path d="M12 16h4"></path>
            <path d="M8 11h.01"></path>
            <path d="M8 16h.01"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-cyan-600">ErgoCheck</h1>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}