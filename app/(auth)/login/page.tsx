'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, ShieldCheck, UserCheck, Users, Eye, EyeOff, KeyRound, Sparkles, Check } from 'lucide-react';

export default function LoginPage() {
  const { login, switchUserRole } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      if (result.role === 'CLIENT') {
        router.push('/portal-cliente');
      } else {
        router.push('/');
      }
    } else {
      setErrorMsg(result.error || 'Credenciais inválidas. Tente novamente.');
    }
  };

  const handleFillDemo = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#131313] text-on-surface flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-sm w-full">
        <div className="py-2 px-4 flex items-center justify-center mb-2">
          <img
            src="/images/brutal-logo-white-transparent.png"
            alt="Brutal Marketing"
            className="w-full h-auto object-contain max-h-16 drop-shadow-[0_4px_25px_rgba(255,85,0,0.35)]"
          />
        </div>
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
          Marketing Control System
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#161616] border border-[#262626] rounded-xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="text-center">
          <h2 className="text-lg font-bold text-on-surface">Acesse sua Conta</h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Entre com seu e-mail ou nome de usuário definido pelo Administrador
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-400 text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
              E-mail ou Nome de Usuário
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="ex: admin, nicole.procampo ou seu@email.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-3 py-2 text-xs font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono uppercase text-on-surface-variant font-bold">
                Senha
              </label>
              <Link
                href="/recuperar-senha"
                className="text-[10px] font-mono text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-10 py-2 text-xs font-mono text-on-surface focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs py-3 rounded flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
          >
            <span>{loading ? 'Validando Acesso...' : 'Entrar no Sistema'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Supreme Admin & Quick Fill Box */}
        <div className="pt-4 border-t border-[#262626] space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-on-surface-variant block text-center font-bold">
            Contas Rápidas de Demonstração / Teste
          </span>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <button
              type="button"
              onClick={() => handleFillDemo('admin', 'admin123')}
              className="p-2 rounded bg-[#1f1a14] border border-primary/40 hover:border-primary text-primary font-bold transition-all"
            >
              👑 Admin Supremo
              <span className="block text-[9px] text-on-surface-variant font-normal">admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('nicole.procampo', 'procampo123')}
              className="p-2 rounded bg-[#141f17] border border-emerald-700/40 hover:border-emerald-500 text-emerald-400 font-bold transition-all"
            >
              🌾 Cliente
              <span className="block text-[9px] text-on-surface-variant font-normal">nicole.procampo</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('joao.silva', 'joao123')}
              className="p-2 rounded bg-[#141922] border border-blue-700/40 hover:border-blue-500 text-blue-400 font-bold transition-all"
            >
              🎬 Funcionário
              <span className="block text-[9px] text-on-surface-variant font-normal">joao.silva</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs font-mono text-on-surface-variant">
        <span>Brutal Marketing Manager v1.2.0 • Sistema Seguro</span>
      </div>
    </div>
  );
}
