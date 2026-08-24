'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Shield, UserCheck, Users } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function RoleSwitcher() {
  const { role, switchUserRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectRole = (newRole: 'OWNER' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT') => {
    switchUserRole(newRole);
    if (newRole === 'CLIENT') {
      if (!pathname.startsWith('/portal-cliente')) {
        router.push('/portal-cliente');
      }
    } else {
      if (pathname.startsWith('/portal-cliente')) {
        router.push('/');
      }
    }
  };

  return (
    <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] p-1 rounded-md text-xs font-mono">
      <span className="text-[10px] text-on-surface-variant px-2 uppercase font-semibold hidden lg:inline">
        Simular Perfil:
      </span>
      <button
        onClick={() => handleSelectRole('OWNER')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
          role === 'OWNER' || role === 'ADMIN'
            ? 'bg-primary text-white font-bold shadow'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262626]'
        }`}
        title="Acesso total como Administrador / Dono da Agência"
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Admin (Lucas)</span>
      </button>

      <button
        onClick={() => handleSelectRole('EMPLOYEE')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
          role === 'EMPLOYEE'
            ? 'bg-primary text-white font-bold shadow'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262626]'
        }`}
        title="Acesso da equipe de produção aos projetos designados"
      >
        <Users className="w-3.5 h-3.5" />
        <span>Funcionário (João)</span>
      </button>

      <button
        onClick={() => handleSelectRole('CLIENT')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
          role === 'CLIENT'
            ? 'bg-primary text-white font-bold shadow'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262626]'
        }`}
        title="Portal exclusivo do cliente com isolamento de dados"
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>Cliente (Nicole)</span>
      </button>
    </div>
  );
}
