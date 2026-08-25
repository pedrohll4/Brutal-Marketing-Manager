'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Shield, UserCheck, Users, ShieldCheck } from 'lucide-react';

export function RoleSwitcher() {
  const { user, role } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-lg text-xs font-mono text-on-surface-variant">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-[10px] uppercase font-bold text-on-surface">
        {role === 'OWNER' || role === 'ADMIN'
          ? 'Administrador Supremo'
          : role === 'CLIENT'
          ? 'Portal do Cliente'
          : 'Membro da Equipe'}
      </span>
    </div>
  );
}
