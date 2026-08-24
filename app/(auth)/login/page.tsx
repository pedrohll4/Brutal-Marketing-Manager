'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Users } from 'lucide-react';

export default function LoginPage() {
  const { login, switchUserRole } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      if (email.includes('nicole') || email.includes('procampo') || email.includes('cliente')) {
        switchUserRole('CLIENT');
        router.push('/portal-cliente');
      } else if (email.includes('joao') || email.includes('mariana') || email.includes('editor')) {
        switchUserRole('EMPLOYEE');
        router.push('/');
      } else {
        switchUserRole('OWNER');
        router.push('/');
      }
    }
  };

  const handleQuickLogin = (role: 'OWNER' | 'EMPLOYEE' | 'CLIENT') => {
    switchUserRole(role);
    if (role === 'CLIENT') {
      router.push('/portal-cliente');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-on-surface flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tighter leading-none">
          Brutal Manager
        </h1>
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mt-2">
          Marketing Control System
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#161616] border border-[#262626] rounded-xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-bold text-on-surface">Acesse sua Conta</h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Entre com suas credenciais de administrador, equipe ou cliente
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono uppercase text-on-surface-variant">
                Senha
              </label>
              <Link
                href="/recuperar-senha"
                className="text-[11px] font-mono text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3 rounded flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20 mt-2"
          >
            <span>{loading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Access Profiles for Demo / Testing */}
        <div className="pt-6 border-t border-[#262626] space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-on-surface-variant/80 block text-center font-bold">
            Entrada Rápida para Demonstração:
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('OWNER')}
              className="p-2.5 rounded bg-[#1c1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-center transition-colors group"
            >
              <ShieldCheck className="w-4 h-4 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <strong className="block text-[11px] text-on-surface font-mono leading-tight">Admin</strong>
              <span className="text-[9px] text-on-surface-variant font-mono">Lucas</span>
            </button>

            <button
              onClick={() => handleQuickLogin('EMPLOYEE')}
              className="p-2.5 rounded bg-[#1c1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-center transition-colors group"
            >
              <Users className="w-4 h-4 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <strong className="block text-[11px] text-on-surface font-mono leading-tight">Equipe</strong>
              <span className="text-[9px] text-on-surface-variant font-mono">João</span>
            </button>

            <button
              onClick={() => handleQuickLogin('CLIENT')}
              className="p-2.5 rounded bg-[#1c1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-center transition-colors group"
            >
              <UserCheck className="w-4 h-4 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <strong className="block text-[11px] text-on-surface font-mono leading-tight">Cliente</strong>
              <span className="text-[9px] text-on-surface-variant font-mono">Nicole</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
