'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Database, Smartphone, Shield, Key, Bell, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConfiguracoesPage() {
  const { user, role } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">
          Configurações do Sistema
        </h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Parâmetros gerais, conexões de banco de dados e integração para aplicativo mobile
        </p>
      </div>

      {/* Database & Architecture Card */}
      <div className="brutal-card p-6 rounded-lg space-y-4">
        <h3 className="text-sm font-bold font-mono uppercase text-primary border-b border-[#262626] pb-2 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Status do Banco de Dados & Supabase
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#181818] border border-[#262626] rounded-lg">
            <span className="text-on-surface-variant uppercase text-[10px] block mb-1">
              Conexão com Supabase
            </span>
            <div className="flex items-center gap-2">
              {isSupabaseConfigured ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">CONECTADO EM PRODUÇÃO</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-primary font-bold">MODO DEMO / LOCAL STORE ATIVO</span>
                </>
              )}
            </div>
            <p className="text-on-surface-variant text-[11px] mt-2 font-sans">
              O sistema opera com persistência local reativa e está 100% pronto para sincronizar com o PostgreSQL no Supabase.
            </p>
          </div>

          <div className="p-4 bg-[#181818] border border-[#262626] rounded-lg">
            <span className="text-on-surface-variant uppercase text-[10px] block mb-1">
              Segurança & RLS (Row Level Security)
            </span>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">POLÍTICAS RLS DEFINIDAS</span>
            </div>
            <p className="text-on-surface-variant text-[11px] mt-2 font-sans">
              Isolamento total de dados entre clientes e controle rigoroso de acesso para funcionários.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Preparation Architecture */}
      <div className="brutal-card p-6 rounded-lg space-y-4">
        <h3 className="text-sm font-bold font-mono uppercase text-primary border-b border-[#262626] pb-2 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Preparação para Futuro Aplicativo Mobile (React Native / Expo)
        </h3>

        <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
          A arquitetura do Brutal Marketing Manager foi desenvolvida com desacoplamento estrito entre a interface visual e as regras de negócio em <code>/lib/services/</code>, permitindo que o aplicativo mobile consuma exatamente os mesmos endpoints REST, Supabase Auth e cálculo de cotas/extras sem reescrever a lógica.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#181818] border border-[#242424] rounded text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <strong className="block text-on-surface">API & Endpoints</strong>
            <span className="text-[10px] text-on-surface-variant">Prontos em /api/</span>
          </div>

          <div className="p-3 bg-[#181818] border border-[#242424] rounded text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <strong className="block text-on-surface">Auth & Tokens</strong>
            <span className="text-[10px] text-on-surface-variant">Supabase JWT</span>
          </div>

          <div className="p-3 bg-[#181818] border border-[#242424] rounded text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <strong className="block text-on-surface">Cálculo de Extras</strong>
            <span className="text-[10px] text-on-surface-variant">Agnóstico à UI</span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="brutal-card p-6 rounded-lg space-y-4">
        <h3 className="text-sm font-bold font-mono uppercase text-primary border-b border-[#262626] pb-2">
          Perfil Conectado
        </h3>

        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User avatar"
            className="w-14 h-14 rounded-full border border-[#2a2a2a] object-cover"
          />
          <div>
            <h4 className="font-bold text-base text-on-surface">{user?.fullName}</h4>
            <p className="text-xs text-on-surface-variant font-mono">{user?.email}</p>
            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase mt-1 inline-block">
              Papel: {role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
