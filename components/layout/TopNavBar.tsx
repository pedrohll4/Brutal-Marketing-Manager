'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { Search, Bell, LogOut, CheckCheck, ExternalLink, Menu, Command, User, KeyRound, ChevronDown, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface TopNavBarProps {
  onToggleMobileMenu?: () => void;
}

export function TopNavBar({ onToggleMobileMenu }: TopNavBarProps) {
  const { user, logout, role, isClient } = useAuth();
  const { notifications, unreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } = useSystemStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const getRoleBadge = () => {
    if (role === 'OWNER' || role === 'ADMIN') {
      return (
        <span className="text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded-full uppercase">
          👑 Admin Supremo
        </span>
      );
    }
    if (role === 'CLIENT') {
      return (
        <span className="text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded-full uppercase">
          🌾 Portal do Cliente
        </span>
      );
    }
    return (
      <span className="text-[9px] font-mono font-bold bg-blue-950/60 text-blue-400 border border-blue-700/50 px-2 py-0.5 rounded-full uppercase">
        🎬 Equipe / Staff
      </span>
    );
  };

  return (
    <header className="bg-[#131313]/90 backdrop-blur-xl border-b border-[#262626] fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-30 flex justify-between items-center px-4 md:px-8 h-16 transition-all">
      {/* Left: Mobile Toggle & Command Palette Trigger */}
      <div className="flex items-center gap-3 flex-1">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden text-on-surface-variant hover:text-primary p-1.5 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={handleOpenCommandPalette}
          className="relative w-48 sm:w-72 bg-[#1c1b1b] hover:bg-[#222] border border-[#2a2a2a] hover:border-primary/50 rounded px-3 py-1.5 text-xs text-left text-on-surface-variant flex items-center justify-between transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="truncate">Buscar clientes, vídeos, fotos...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#141414] border border-[#333] text-[10px] font-mono text-on-surface-variant/80">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-[#1c1b1b] rounded transition-colors"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-[#131313] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#101010]">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-on-surface">Notificações</h4>
                  {unreadNotificationCount > 0 && (
                    <span className="bg-primary/20 text-primary text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      {unreadNotificationCount} novas
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Ler todas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#1f1f1f]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-on-surface-variant">
                    Nenhuma notificação no momento.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 text-xs transition-colors hover:bg-[#1c1b1b] cursor-pointer ${
                        !notif.isRead ? 'bg-[#181818] border-l-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-on-surface">{notif.title}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          {notif.createdAt}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-[11px] leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => setShowNotifications(false)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
                        >
                          Ver detalhes <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Real User Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#1c1b1b] border border-transparent hover:border-[#2a2a2a] transition-all cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.fullName || 'Avatar'}
              className="w-8 h-8 rounded-full border border-primary/40 object-cover"
            />
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs font-bold text-on-surface leading-tight">
                {user?.fullName || 'Lucas Antunes'}
              </span>
              <span className="text-[10px] font-mono text-on-surface-variant">
                @{user?.username || user?.email.split('@')[0] || 'admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-[#141414] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 p-2 space-y-2">
              <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#242424] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface block truncate">
                    {user?.fullName}
                  </span>
                </div>
                <div>{getRoleBadge()}</div>
                <p className="text-[10px] font-mono text-zinc-400 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <Link
                  href={isClient ? '/portal-cliente' : '/configuracoes'}
                  onClick={() => setShowUserDropdown(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-on-surface hover:bg-[#202020] hover:text-primary transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-primary" />
                  <span>Minha Conta & Alterar Senha</span>
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
