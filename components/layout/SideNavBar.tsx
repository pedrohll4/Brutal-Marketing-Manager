'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import {
  LayoutDashboard,
  Users,
  Film,
  Megaphone,
  Calendar,
  MousePointerClick,
  CreditCard,
  BarChart3,
  BadgeCheck,
  Settings,
  Plus,
  Sparkles,
} from 'lucide-react';
import { AICampaignGeneratorModal } from '../campaigns/AICampaignGeneratorModal';

interface SideNavBarProps {
  className?: string;
  onItemClick?: () => void;
}

export function SideNavBar({ className = '', onItemClick }: SideNavBarProps) {
  const pathname = usePathname();
  const { isClient, isEmployee } = useAuth();
  const { serviceRequests } = useSystemStore();
  const [isAICampaignModalOpen, setIsAICampaignModalOpen] = useState(false);

  const pendingRequestsCount = serviceRequests.filter((r) => r.status === 'PENDING').length;

  // Nav Items definition
  const adminNavItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Clientes', href: '/clientes', icon: Users },
    { label: 'Produção', href: '/producao', icon: Film },
    { label: 'Campanhas', href: '/campanhas', icon: Megaphone },
    { label: 'Calendário', href: '/calendario', icon: Calendar },
    { label: 'Solicitações', href: '/solicitacoes', icon: MousePointerClick },
    { label: 'Financeiro', href: '/financeiro', icon: CreditCard },
    { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { label: 'Funcionários', href: '/funcionarios', icon: BadgeCheck },
    { label: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  const clientNavItems = [
    { label: 'Meu Dashboard', href: '/portal-cliente', icon: LayoutDashboard },
    { label: 'Solicitar Serviço', href: '/portal-cliente/solicitacoes', icon: Plus },
    { label: 'Entregas & Vídeos', href: '/portal-cliente/entregas', icon: Film },
    { label: 'Faturas & PIX', href: '/portal-cliente/pagamentos', icon: CreditCard },
  ];

  const navItems = isClient ? clientNavItems : adminNavItems;

  return (
    <>
      <aside
        className={`bg-[#131313] text-on-surface h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r border-[#262626] flex flex-col py-6 z-40 ${className}`}
      >
        {/* Brand Logo Header */}
        <div className="px-6 mb-7">
          <Link href={isClient ? '/portal-cliente' : '/'} className="group block">
            <div className="py-2 flex items-center justify-center">
              <img
                src="/images/brutal-logo-white-transparent.png"
                alt="Brutal Marketing"
                className="w-full h-auto object-contain max-h-11 drop-shadow-[0_2px_12px_rgba(255,85,0,0.3)] group-hover:scale-[1.03] transition-all duration-200"
              />
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#222] font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">
              <span>CONTROLE DE PRODUÇÃO</span>
              {isClient ? (
                <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded border border-primary/30">CLIENTE</span>
              ) : (
                <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">PRO</span>
              )}
            </div>
          </Link>
        </div>

        {/* CTA Button */}
        {!isClient && (
          <div className="px-4 mb-6">
            <button
              onClick={() => setIsAICampaignModalOpen(true)}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold text-sm py-3 px-4 rounded flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nova Campanha (IA)</span>
            </button>
          </div>
        )}

        {isClient && (
          <div className="px-4 mb-6">
            <Link
              href="/portal-cliente/solicitacoes"
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold text-sm py-3 px-4 rounded flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Solicitar Extra</span>
            </Link>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/portal-cliente' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center justify-between px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                  isActive
                    ? 'text-primary bg-primary/10 border-r-2 border-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span>{item.label}</span>
                </div>

                {!isClient && item.href === '/solicitacoes' && pendingRequestsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-mono font-black animate-pulse shadow-sm">
                    {pendingRequestsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info matching Stitch */}
        <div className="px-6 pt-4 border-t border-[#262626] text-[10px] font-mono text-on-surface-variant flex justify-between items-center">
          <span>v1.2.0-PRO</span>
          <span className="text-primary font-bold">BRUTAL IA ACTIVE</span>
        </div>
      </aside>

      {/* AI Campaign & Script Generator Modal */}
      <AICampaignGeneratorModal
        isOpen={isAICampaignModalOpen}
        onClose={() => setIsAICampaignModalOpen(false)}
      />
    </>
  );
}
