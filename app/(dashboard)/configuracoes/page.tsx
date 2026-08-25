'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Database, Smartphone, Shield, Key, Bell, CheckCircle2, AlertCircle, MessageCircle, Lock, User, Check, KeyRound } from 'lucide-react';
import { AutomationSettingsTab } from '@/components/automations/AutomationSettingsTab';

export default function ConfiguracoesPage() {
  const { user, role, changePassword } = useAuth();
  const { addToast } = useSystemStore();
  const [activeTab, setActiveTab] = useState<'AUTOMATIONS' | 'SECURITY' | 'SYSTEM'>('AUTOMATIONS');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Senhas Não Coincidem',
        description: 'Verifique se digitou a mesma senha nos dois campos.',
        type: 'error',
      });
      return;
    }

    const success = changePassword(newPassword);
    if (success) {
      addToast({
        title: 'Senha Alterada com Sucesso! 🔒',
        description: 'Sua nova senha já está ativa para os próximos logins.',
        type: 'success',
      });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">
          Configurações do Sistema
        </h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Automações de WhatsApp, segurança de conta (troca de senha) e parâmetros gerais
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#262626] pb-2">
        <button
          onClick={() => setActiveTab('AUTOMATIONS')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'AUTOMATIONS'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-[#181818] text-on-surface-variant hover:text-on-surface border border-[#262626]'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Automações WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            activeTab === 'SECURITY'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-[#181818] text-on-surface-variant hover:text-on-surface border border-[#262626]'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Minha Conta & Senha</span>
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

      {/* Tab 2: Security & Password Change */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6 max-w-xl">
          <div className="brutal-card p-6 rounded-lg space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-primary border-b border-[#262626] pb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Alterar Minha Senha de Acesso
            </h3>

            <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg text-xs font-mono space-y-1">
              <span className="text-on-surface-variant text-[10px] uppercase block">Usuário Atual Logado:</span>
              <p className="font-bold text-on-surface">{user?.fullName} ({role})</p>
              <p className="text-primary">E-mail: {user?.email} • Usuário: @{user?.username || user?.email.split('@')[0]}</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                  Nova Senha:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Digite sua nova senha..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                  Confirmar Nova Senha:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repita sua nova senha..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Nova Senha</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Database & Architecture */}
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
              A arquitetura do Brutal Marketing Manager foi desenvolvida com desacoplamento estrito entre a interface visual e as regras de negócio em <code>/lib/services/</code>, permitindo consumo direto dos endpoints REST e autenticação por e-mail ou username.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#181818] border border-[#242424] rounded text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <strong className="block text-on-surface">API & Endpoints</strong>
                <span className="text-[10px] text-on-surface-variant">Prontos em /api/</span>
              </div>

              <div className="p-3 bg-[#181818] border border-[#242424] rounded text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <strong className="block text-on-surface">Auth por E-mail & User</strong>
                <span className="text-[10px] text-on-surface-variant">Supabase JWT / Local</span>
              </div>

              <div className="p-3 bg-[#181818] border border-[#242424] rounded text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <strong className="block text-on-surface">Cálculo de Cotas/Extras</strong>
                <span className="text-[10px] text-on-surface-variant">Agnóstico à UI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
