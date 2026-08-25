'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'CLIENT') {
        router.replace('/portal-cliente');
      } else {
        router.replace('/');
      }
    }
  }, [user, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      if (result.role === 'CLIENT') {
        router.replace('/portal-cliente');
      } else {
        router.replace('/');
      }
    } else {
      setErrorMsg(result.error || 'Credenciais inválidas. Verifique seu login e senha.');
    }
  };

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
      </div>
    );
  }

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
      <div className="w-full max-w-md bg-[#161616] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-bold text-on-surface font-mono">Área Restrita & Autenticação</h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Entre com suas credenciais autorizadas pela Brutal Marketing
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-red-300 text-xs font-mono text-center animate-in fade-in duration-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-sm font-mono">
          <div>
            <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
              E-mail ou Nome de Usuário
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="Seu usuário ou e-mail..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2.5 text-xs text-on-surface font-mono focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs uppercase text-on-surface-variant font-bold">
                Senha de Acesso
              </label>
              <Link
                href="/recuperar-senha"
                className="text-[10px] text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded-lg pl-9 pr-10 py-2.5 text-xs text-on-surface font-mono focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            <span>{loading ? 'Autenticando Sessão...' : 'Entrar no Sistema'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-[#262626] flex items-center justify-center gap-2 text-[10px] font-mono text-on-surface-variant">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Conexão Segura & Criptografada</span>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs font-mono text-on-surface-variant">
        <span>Brutal Marketing Manager • Controle de Acesso Restrito</span>
      </div>
    </div>
  );
}
