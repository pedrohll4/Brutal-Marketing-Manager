'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import {
  MessageCircle,
  Check,
  Shield,
  Smartphone,
  Save,
  QrCode,
  DollarSign,
  Info,
} from 'lucide-react';

export function AutomationSettingsTab() {
  const {
    adminWhatsApp,
    updateAdminWhatsApp,
    pixKey,
    updatePixKey,
    pixBeneficiary,
    updatePixBeneficiary,
    addToast,
  } = useSystemStore();

  const [adminPhoneInput, setAdminPhoneInput] = useState(adminWhatsApp || '(16) 99123-4567');
  const [pixKeyInput, setPixKeyInput] = useState(pixKey || 'financeiro@brutalmarketing.com.br');
  const [pixNameInput, setPixNameInput] = useState(pixBeneficiary || 'Brutal Marketing Ltda');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminWhatsApp(adminPhoneInput);
    updatePixKey(pixKeyInput);
    updatePixBeneficiary(pixNameInput);

    addToast({
      title: 'Configurações Salvas com Sucesso',
      description: 'Seu WhatsApp pessoal e dados do PIX foram atualizados.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Information Banner */}
      <div className="p-4 bg-[#181818] border border-[#282828] rounded-xl flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-700/50 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-on-surface">
            Notificações Automáticas de WhatsApp
          </h3>
          <p className="text-xs text-on-surface-variant font-mono mt-1 leading-relaxed">
            O Brutal Marketing Manager gera e envia mensagens profissionais de WhatsApp automaticamente com base no fluxo real de trabalho: ao atualizar o status de vídeos no Kanban, na aprovação de entregas pelos clientes, no envio de relatórios e no recebimento de novas solicitações de extras.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Admin Personal WhatsApp Card */}
        <div className="brutal-card p-6 rounded-xl space-y-4 border border-[#262626]">
          <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-sm font-bold font-mono uppercase text-on-surface">
                WhatsApp Pessoal do Administrador (Dono)
              </h4>
              <p className="text-xs text-on-surface-variant font-mono">
                Número onde você receberá alertas de novas solicitações de extras, eventos e pedidos de clientes
              </p>
            </div>
          </div>

          <div className="max-w-md space-y-2">
            <label className="block text-xs font-mono uppercase text-on-surface-variant font-bold">
              Seu Telefone / WhatsApp com DDD:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="(16) 99123-4567"
                value={adminPhoneInput}
                onChange={(e) => setAdminPhoneInput(e.target.value)}
                className="w-full bg-[#161616] border border-[#333] rounded-lg px-3.5 py-2.5 text-sm font-mono text-on-surface font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant">
              Exemplo: <code>(16) 99123-4567</code> ou <code>(11) 98888-7766</code>.
            </p>
          </div>
        </div>

        {/* PIX & Financial Settings */}
        <div className="brutal-card p-6 rounded-xl space-y-4 border border-[#262626]">
          <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
            <QrCode className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-bold font-mono uppercase text-on-surface">
                Dados Oficiais de Cobrança PIX
              </h4>
              <p className="text-xs text-on-surface-variant font-mono">
                Estes dados são incluídos automaticamente nas mensagens de faturas e pagamentos enviadas aos clientes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl font-mono text-xs">
            <div>
              <label className="block text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                Chave PIX (E-mail, CNPJ ou Telefone):
              </label>
              <input
                type="text"
                required
                placeholder="financeiro@brutalmarketing.com.br"
                value={pixKeyInput}
                onChange={(e) => setPixKeyInput(e.target.value)}
                className="w-full bg-[#161616] border border-[#333] rounded-lg px-3 py-2 text-on-surface font-bold focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                Nome do Titular / Razão Social:
              </label>
              <input
                type="text"
                required
                placeholder="Brutal Marketing Ltda"
                value={pixNameInput}
                onChange={(e) => setPixNameInput(e.target.value)}
                className="w-full bg-[#161616] border border-[#333] rounded-lg px-3 py-2 text-on-surface font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-emerald-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
}
