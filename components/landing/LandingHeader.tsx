'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Flame,
  User,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

interface LandingHeaderProps {
  onOpenWaitlist: () => void;
}

export function LandingHeader({ onOpenWaitlist }: LandingHeaderProps) {
  const { user, isClient, isAdmin, isEmployee } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLoggedIn = !!user;
  const userDashboardUrl = isClient ? '/portal-cliente' : '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131313]/85 backdrop-blur-xl border-b border-[#262626]">
      {/* Top Scarcity Bar */}
      <div className="bg-[#18110b] border-b border-primary/20 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-zinc-300">
            Agenda de Novos Clientes: <strong className="text-primary font-bold">Fila de Espera Oficial Aberta</strong>
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brutal-logo-white-transparent.png"
            alt="Brutal Marketing"
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_12px_rgba(255,85,0,0.35)] group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-400">
          <a href="#metodologia" className="hover:text-primary transition-colors">
            Metodologia
          </a>
          <a href="#producoes" className="hover:text-primary transition-colors">
            Produções Virais
          </a>
          <a href="#resultados" className="hover:text-primary transition-colors">
            Resultados
          </a>
          <a href="#sobre" className="hover:text-primary transition-colors">
            Sobre a Brutal
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href={userDashboardUrl}
              className="px-4 py-2 rounded-lg bg-[#202020] hover:bg-[#282828] text-white border border-[#333] hover:border-primary text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
              <span>Painel ({user?.fullName?.split(' ')[0]})</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-lg bg-transparent hover:bg-[#1a1a1a] text-zinc-300 hover:text-white border border-[#2a2a2a] text-xs font-mono transition-all"
            >
              Acessar Plataforma
            </Link>
          )}

          <button
            type="button"
            onClick={onOpenWaitlist}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_2px_15px_rgba(255,87,8,0.35)] transition-all"
          >
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>Fila de Espera</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="sm:hidden p-2 rounded-lg text-zinc-400 hover:text-white bg-[#1a1a1a] border border-[#2a2a2a]"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="sm:hidden bg-[#161616] border-b border-[#262626] px-4 py-4 space-y-3 font-mono text-xs animate-in slide-in-from-top-2 duration-200">
          <a
            href="#metodologia"
            onClick={() => setIsMobileOpen(false)}
            className="block py-2 text-zinc-300 hover:text-primary"
          >
            • Metodologia
          </a>
          <a
            href="#producoes"
            onClick={() => setIsMobileOpen(false)}
            className="block py-2 text-zinc-300 hover:text-primary"
          >
            • Produções Virais
          </a>
          <a
            href="#resultados"
            onClick={() => setIsMobileOpen(false)}
            className="block py-2 text-zinc-300 hover:text-primary"
          >
            • Resultados
          </a>

          <div className="pt-2 border-t border-[#262626] space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileOpen(false);
                onOpenWaitlist();
              }}
              className="w-full py-3 rounded-lg bg-primary text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>Entrar na Fila de Espera</span>
            </button>

            <Link
              href={isLoggedIn ? userDashboardUrl : '/login'}
              onClick={() => setIsMobileOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#202020] text-center text-zinc-300 font-bold block border border-[#333]"
            >
              {isLoggedIn ? `Ir para Painel (${user?.fullName})` : 'Acessar Plataforma'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
