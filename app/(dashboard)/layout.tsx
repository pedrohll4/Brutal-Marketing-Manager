'use client';

import React, { useState } from 'react';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { MobileNav } from '@/components/layout/MobileNav';

import { PendingRequestsAlertBar } from '@/components/notifications/PendingRequestsAlertBar';
import { AdminPendingRequestsModal } from '@/components/notifications/AdminPendingRequestsModal';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={['OWNER', 'ADMIN', 'EMPLOYEE']}>
      <div className="min-h-screen bg-[#131313] text-on-surface flex flex-col antialiased selection:bg-primary selection:text-white">
        {/* SideNavBar Desktop */}
        <SideNavBar className="hidden md:flex" />

        {/* Main Content Container */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          <TopNavBar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1 pt-24 px-4 md:px-8 pb-20 md:pb-12 max-w-container-max w-full mx-auto">
            <PendingRequestsAlertBar />
            {children}
          </main>
        </div>

        {/* Pop-up automático ao logar se houver solicitações pendentes */}
        <AdminPendingRequestsModal />

        {/* Mobile Navigation */}
        <MobileNav
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
