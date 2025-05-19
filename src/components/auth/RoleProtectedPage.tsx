'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Middleware component to check authentication and proper role access
export default function RoleProtectedPage({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
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

  // Check if user is logged in
  if (!user) {
    // Redirect to login page
    router.push('/auth/login');
    return null;
  }

  // Check if user has proper role
  if (!allowedRoles.includes(user.role)) {
    return (
      <DashboardLayout>
        <div className="min-h-screen-content flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-500">You don&apos;t have permission to access this page.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // User is authenticated and has the proper role
  return <>{children}</>;
}