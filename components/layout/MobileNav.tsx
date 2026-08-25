'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Film,
  Calendar,
  CreditCard,
  X,
} from 'lucide-react';
import { SideNavBar } from './SideNavBar';
import { RoleSwitcher } from './RoleSwitcher';

interface MobileNavProps {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export function MobileNav({ isMobileMenuOpen, onCloseMobileMenu }: MobileNavProps) {
  const pathname = usePathname();
  const { isClient } = useAuth();

  const mobileNavTabs = isClient
    ? [
        { label: 'Início', href: '/portal-cliente', icon: LayoutDashboard },
        { label: 'Entregas', href: '/portal-cliente/entregas', icon: Film },
        { label: 'Faturas', href: '/portal-cliente/pagamentos', icon: CreditCard },
      ]
    : [
        { label: 'Início', href: '/', icon: LayoutDashboard },
        { label: 'Clientes', href: '/clientes', icon: Users },
        { label: 'Produção', href: '/producao', icon: Film },
        { label: 'Agenda', href: '/calendario', icon: Calendar },
        { label: 'Financeiro', href: '/financeiro', icon: CreditCard },
      ];

  return (
    <>
      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobileMenu}
          />
          <div className="relative w-72 h-full bg-[#131313] border-r border-[#262626] p-4 flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#262626]">
              <img
                src="/images/brutal-logo-white-transparent.png"
                alt="Brutal Marketing"
                className="h-8 w-auto object-contain drop-shadow"
              />
              <button
                onClick={onCloseMobileMenu}
                className="p-1 rounded text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <RoleSwitcher />
            </div>
            <div className="flex-1 overflow-y-auto">
              <SideNavBar className="relative w-full h-auto border-none p-0" onItemClick={onCloseMobileMenu} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#141414] border-t border-[#262626] flex justify-around items-center h-14 z-30 px-2 pb-safe">
        {mobileNavTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-mono transition-colors ${
                isActive ? 'text-primary font-bold border-t-2 border-primary -mt-[2px]' : 'text-on-surface-variant'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
