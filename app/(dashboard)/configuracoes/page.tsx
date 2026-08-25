'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Database, Smartphone, Shield, Key, Bell, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { AutomationSettingsTab } from '@/components/automations/AutomationSettingsTab';

export default function ConfiguracoesPage() {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'AUTOMATIONS' | 'SYSTEM'>('AUTOMATIONS');

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">
          Configurações do Sistema
        </h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Automações de WhatsApp e E-mail, conexões de banco de dados e parâmetros gerais
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#262626] pb-2">
        <button
          onClick={() => setActiveTab('AUTOMATIONS')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'AUTOMATIONS'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-[#181818] text-on-surface-variant hover:text-on-surface border border-[#262626]'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Automações WhatsApp & E-mail</span>
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'SYSTEM'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-[#181818] text-on-surface-variant hover:text-on-surface border border-[#262626]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Banco de Dados & Arquitetura</span>
        </button>
      </div>

      {/* Tab 1: WhatsApp & E-mail Automations */}
      {activeTab === 'AUTOMATIONS' && <AutomationSettingsTab />}

      {/* Tab 2: Database & Architecture */}
      {activeTab === 'SYSTEM' && (
        <div className="space-y-6">
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
                  O sistema opera com persistência local reativa e sincronização com o PostgreSQL no Supabase.
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
                  Isolamento total de dados entre clientes e controle de acesso para funcionários.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Preparation Architecture */}
          <div className="brutal-card p-6 rounded-lg space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-primary border-b border-[#262626] pb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Preparação para Aplicativo Mobile (PWA & React Native)
            </h3>

            <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
              A arquitetura do Brutal Marketing Manager foi desenvolvida com desacoplamento estrito entre a interface visual e as regras de negócio em <code>/lib/services/</code>, permitindo consumo direto dos endpoints REST e notificações em tempo real.
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
        </div>
      )}
    </div>
  );
}
