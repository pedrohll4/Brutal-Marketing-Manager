'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import {
  MessageCircle,
  Mail,
  Send,
  Check,
  Sparkles,
  Zap,
  Shield,
  Smartphone,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { buildWhatsAppMessage, createWhatsAppWebLink } from '@/lib/services/whatsappService';

export function AutomationSettingsTab() {
  const { clients, addToast } = useSystemStore();

  const [activeTrigger, setActiveTrigger] = useState<
    'MEDIA_READY' | 'EXTRA_REQUEST' | 'INVOICE_PIX' | 'ADJUSTMENTS'
  >('MEDIA_READY');

  const [testPhone, setTestPhone] = useState('(11) 98888-7766');
  const [testClientName, setTestClientName] = useState('Nicole Procampo');
  const [testTaskTitle, setTestTaskTitle] = useState('Vídeo 01: Entrevista Produtor Fazenda Santa Fé');

  // Preview message generated dynamically
  const previewMessage = buildWhatsAppMessage(
    activeTrigger === 'MEDIA_READY'
      ? 'MEDIA_READY_FOR_REVIEW'
      : activeTrigger === 'EXTRA_REQUEST'
      ? 'EXTRA_SERVICE_REQUESTED'
      : activeTrigger === 'INVOICE_PIX'
      ? 'INVOICE_BILLING_PIX'
      : 'MEDIA_ADJUSTMENTS_REQUESTED',
    {
      clientName: testClientName,
      taskTitle: testTaskTitle,
      mediaType: 'Vídeo 4K UHD',
      totalAmount: 2450,
      baseAmount: 2000,
      extrasAmount: 450,
      dueDay: 10,
      serviceType: 'Cobertura de Evento com Drone',
      quantity: 1,
      eventLocation: 'Ribeirão Preto / SP',
      requestedChanges: 'Ajustar iluminação no segundo 00:15 e clarear o fundo.',
    }
  );

  const testWebLink = createWhatsAppWebLink(testPhone, previewMessage);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(previewMessage);
    addToast({
      title: 'Mensagem Copiada! 📋',
      description: 'Template copiado para a área de transferência.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-[#181818] border border-[#282828] rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-700/50">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <span>Central de Automações: WhatsApp & E-mail</span>
              <span className="text-[9px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                Ativo
              </span>
            </h3>
            <p className="text-xs font-mono text-on-surface-variant mt-0.5">
              Notificações automáticas para aprovação de vídeos, pedidos de extras e cobranças com PIX
            </p>
          </div>
        </div>

        <a
          href={testWebLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg hover:shadow-emerald-600/30"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Testar no Meu WhatsApp</span>
        </a>
      </div>

      {/* Grid of Automation Flows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Flow Triggers Selector */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-on-surface-variant font-bold">
            Gatilhos de Notificação Configurados
          </h4>

          {/* Trigger 1: Media Ready */}
          <div
            onClick={() => setActiveTrigger('MEDIA_READY')}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              activeTrigger === 'MEDIA_READY'
                ? 'bg-[#1a1713] border-primary ring-1 ring-primary'
                : 'bg-[#141414] border-[#262626] hover:border-[#383838]'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                🎬 Vídeo/Foto Pronto para Aprovação
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-1.5 py-0.2 rounded">
                Para o Cliente
              </span>
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant">
              Disparado quando a equipe move o conteúdo para a coluna &quot;Aguardando Cliente&quot;.
            </p>
          </div>

          {/* Trigger 2: Extra Service Request */}
          <div
            onClick={() => setActiveTrigger('EXTRA_REQUEST')}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              activeTrigger === 'EXTRA_REQUEST'
                ? 'bg-[#1a1713] border-primary ring-1 ring-primary'
                : 'bg-[#141414] border-[#262626] hover:border-[#383838]'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                🔔 Solicitação de Extra / Evento
              </span>
              <span className="text-[9px] font-mono text-primary font-bold bg-primary/20 px-1.5 py-0.2 rounded">
                Para o Dono / Admin
              </span>
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant">
              Disparado no momento em que o cliente solicita um vídeo, foto ou evento extra.
            </p>
          </div>

          {/* Trigger 3: Monthly Invoice & PIX */}
          <div
            onClick={() => setActiveTrigger('INVOICE_PIX')}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              activeTrigger === 'INVOICE_PIX'
                ? 'bg-[#1a1713] border-primary ring-1 ring-primary'
                : 'bg-[#141414] border-[#262626] hover:border-[#383838]'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                📄 Fatura Fechada com PIX Copia e Cola
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-1.5 py-0.2 rounded">
                Para o Cliente
              </span>
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant">
              Disparado no fechamento mensal com o resumo do contrato + extras e chave PIX.
            </p>
          </div>

          {/* Trigger 4: Adjustments Requested */}
          <div
            onClick={() => setActiveTrigger('ADJUSTMENTS')}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              activeTrigger === 'ADJUSTMENTS'
                ? 'bg-[#1a1713] border-primary ring-1 ring-primary'
                : 'bg-[#141414] border-[#262626] hover:border-[#383838]'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                ⚠️ Ajustes Solicitados pelo Cliente
              </span>
              <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-950/50 px-1.5 py-0.2 rounded">
                Para o Editor / Equipe
              </span>
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant">
              Disparado quando o cliente faz anotações por timestamp no vídeo ou marcações na foto.
            </p>
          </div>
        </div>

        {/* Right Column: Live Message Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase text-on-surface-variant font-bold flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pré-visualização da Mensagem no WhatsApp</span>
            </h4>

            <button
              onClick={handleCopyTemplate}
              className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              <Copy className="w-3 h-3" />
              <span>Copiar Texto</span>
            </button>
          </div>

          {/* WhatsApp Chat Balloon Simulator */}
          <div className="p-4 rounded-xl bg-[#0b141a] border border-[#222] shadow-2xl space-y-3 min-h-[300px] flex flex-col justify-between">
            {/* WhatsApp Header bar */}
            <div className="flex items-center gap-2 pb-2 border-b border-[#1f2c34] text-xs">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center font-bold text-white text-[10px]">
                BM
              </div>
              <div>
                <span className="font-bold text-on-surface block leading-tight">Brutal Marketing</span>
                <span className="text-[9px] text-emerald-400 font-mono">Conta Comercial Oficial</span>
              </div>
            </div>

            {/* Message Bubble */}
            <div className="p-3.5 rounded-lg bg-[#005c4b] text-white text-xs font-sans whitespace-pre-line leading-relaxed shadow-md self-start max-w-full">
              {previewMessage}
            </div>

            {/* Simulated Action Button */}
            <div className="pt-2 border-t border-[#1f2c34] flex justify-between items-center text-[10px] font-mono text-zinc-400">
              <span>Status: Pronto para Envio</span>
              <a
                href={testWebLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Disparar Agora</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
