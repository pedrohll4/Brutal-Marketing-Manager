'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Send real password reset email via Supabase Auth
        const { error: sbError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (sbError) {
          // If Supabase auth email fails, still show success to avoid email enumeration
          console.warn('Supabase password reset:', sbError.message);
        }
      }

      // Always show success (security best practice — avoid email enumeration)
      setSent(true);
    } catch {
      setSent(true); // Still show success
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-on-surface flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brutal-logo-white-transparent.png"
            alt="Brutal Marketing"
            className="h-8 w-auto"
          />
        </div>
        <p className="text-xs text-on-surface-variant font-mono">Sistema de Gestão Profissional</p>
      </div>

      <div className="w-full max-w-md bg-[#161616] border border-[#262626] rounded-xl p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Recuperação de Senha</h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Digite seu e-mail para receber as instruções de redefinição
          </p>
        </div>

        {sent ? (
          <div className="p-5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-300">E-mail Enviado com Sucesso!</h3>
            <p className="text-xs text-on-surface-variant font-mono leading-relaxed">
              Se esse e-mail estiver cadastrado no sistema, você receberá as instruções em instantes.
              <br />
              <span className="text-emerald-400">Verifique também sua pasta de spam.</span>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-800/30 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-3 py-2.5 text-on-surface focus:border-primary focus:outline-none disabled:opacity-60 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-bold text-xs py-3 rounded transition-all shadow flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>

            <div className="text-center pt-1">
              <Link
                href="/login"
                className="text-xs text-on-surface-variant hover:text-primary font-mono inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
