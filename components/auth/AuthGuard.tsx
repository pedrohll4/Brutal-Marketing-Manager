'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('OWNER' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT')[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // 1. If not logged in, redirect immediately to /login
    if (!user) {
      router.replace('/login');
      return;
    }

    // 2. If client tries to access admin dashboard routes
    if (role === 'CLIENT' && !pathname.startsWith('/portal-cliente')) {
      router.replace('/portal-cliente');
      return;
    }

    // 3. If specific roles are required and user role is not allowed
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      if (role === 'CLIENT') {
        router.replace('/portal-cliente');
      } else {
        router.replace('/');
      }
    }
  }, [user, role, isLoading, pathname, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-2xl bg-[#181818] border border-primary/30 shadow-2xl animate-pulse">
          <img
            src="/images/brutal-logo-white-transparent.png"
            alt="Brutal Marketing"
            className="h-10 w-auto object-contain"
          />
        </div>
        <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest animate-pulse">
          Verificando Sessão Segura...
        </span>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Prevent rendering admin content if user is client
  if (role === 'CLIENT' && !pathname.startsWith('/portal-cliente')) {
    return null;
  }

  return <>{children}</>;
}
