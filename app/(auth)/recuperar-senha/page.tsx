'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-on-surface flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-primary uppercase tracking-tighter leading-none">
          Brutal Manager
        </h1>
      </div>

      <div className="w-full max-w-md bg-[#161616] border border-[#262626] rounded-xl p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Recuperação de Senha</h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Digite seu e-mail para receber as instruções de redefinição
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-300">E-mail Enviado com Sucesso!</h3>
            <p className="text-xs text-on-surface-variant font-mono">
              Verifique sua caixa de entrada para redefinir sua senha.
            </p>
            <Link
              href="/login"
              className="inline-block mt-3 text-xs text-primary hover:underline font-mono"
            >
              ← Voltar para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
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
                  className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3 rounded transition-all shadow"
            >
              Enviar Link de Recuperação
            </button>

            <div className="text-center pt-2">
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
