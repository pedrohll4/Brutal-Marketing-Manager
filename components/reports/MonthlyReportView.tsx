'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, Send, FileText, CheckCircle2, Film, Sparkles, Building2, MessageCircle, ExternalLink, Calendar, Camera, TrendingUp } from 'lucide-react';
import { createWhatsAppWebLink } from '@/lib/services/whatsappService';

interface MonthlyReportViewProps {
  clientId?: string;
}

export function MonthlyReportView({ clientId }: MonthlyReportViewProps) {
  const { clients, tasks, addToast } = useSystemStore();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    clientId || clients[0]?.id || 'cli-procampo'
  );
  const [selectedMonth, setSelectedMonth] = useState<string>('Agosto / 2026');

  const client = clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientTasks = tasks.filter((t) => t.clientId === client?.id);

  // Delivered Tasks
  const deliveredTasks = clientTasks.filter((t) =>
    ['APPROVED', 'PUBLISHED', 'CLIENT_REVIEW', 'IN_PRODUCTION'].includes(t.status)
  );

  // Math for report
  const contractedVideos = client?.contractedVideos || 12;
  const contractedPhotos = client?.contractedPhotos || 20;

  const deliveredVideos = deliveredTasks.filter((t) => t.taskType === 'VIDEO' || !t.taskType).length;
  const deliveredPhotos = deliveredTasks.filter((t) => t.taskType === 'PHOTO').length;

  const extraVideos = Math.max(0, deliveredVideos - contractedVideos) || (client?.id === 'cli-procampo' ? 3 : 0);
  const totalVideos = Math.max(contractedVideos + extraVideos, deliveredVideos);

  const baseMonthlyFee = client?.monthlyFee || 2000;
  const extrasCost = extraVideos * (client?.extraVideoPrice || 150);
  const totalReportAmount = baseMonthlyFee + extrasCost;

  // WhatsApp Message for Client
  const clientPhone = client?.phone || '(11) 98888-7766';
  const waReportMessage = `Olá, *${client?.name || client?.companyName}*! 📊

Aqui é da equipe *Brutal Marketing*.

O seu *Relatório Mensal de Produção & Performance* referente a *${selectedMonth}* está pronto!

📈 *RESUMO DAS ENTREGAS:*
• 🎬 *Vídeos Entregues:* ${deliveredVideos} vídeos (Cota: ${contractedVideos} ${extraVideos > 0 ? `+ ${extraVideos} extras` : ''})
• 📸 *Fotos & Ensaios:* ${deliveredPhotos || contractedPhotos} fotos tratadas
• 💰 *Investimento Total:* *${formatCurrency(totalReportAmount)}* (Base: ${formatCurrency(baseMonthlyFee)}${extrasCost > 0 ? ` + Extras: ${formatCurrency(extrasCost)}` : ''})

📲 *Acesse seu portal para ver o relatório completo, baixar as mídias em 4K e pegar as legendas com IA:*
👉 https://brutalmanager.vercel.app/portal-cliente/entregas

Agradecemos pela grande parceria neste mês! 🚀`.trim();

  const waLink = createWhatsAppWebLink(clientPhone, waReportMessage);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    window.open(waLink, '_blank');
    addToast({
      title: 'WhatsApp Aberto! 💬',
      description: `Relatório pronto para envio para ${client?.name} (${clientPhone}).`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden during Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 bg-[#141414] border border-[#262626] rounded-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-1.5 rounded">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase">Cliente:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer font-bold"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#181818]">
                  {c.name} ({c.companyName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-1.5 rounded">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase">Período:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="Agosto / 2026" className="bg-[#181818]">Agosto / 2026 (Atual)</option>
              <option value="Julho / 2026" className="bg-[#181818]">Julho / 2026</option>
              <option value="Junho / 2026" className="bg-[#181818]">Junho / 2026</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSendWhatsApp}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-600/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>💬 Enviar Relatório no WhatsApp ({clientPhone})</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-primary/30"
          >
            <Printer className="w-4 h-4" />
            <span>Gerar / Imprimir PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (A4 Styled Canvas) */}
      <div className="bg-[#121212] print:bg-white print:text-black border border-[#262626] print:border-none rounded-xl p-8 max-w-4xl mx-auto shadow-2xl space-y-8">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold block mb-1">
              Brutal Marketing • Relatório Executivo de Performance
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-on-surface print:text-black">
              RELATÓRIO MENSAL DE PRODUÇÃO
            </h1>
            <p className="text-xs font-mono text-on-surface-variant print:text-zinc-600 mt-1">
              {selectedMonth.toUpperCase()} • Período: 01 a 31
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-black text-primary uppercase leading-none">
              BRUTAL<br />MARKETING
            </h2>
            <p className="text-[10px] font-mono text-on-surface-variant print:text-zinc-600 mt-1">
              Marketing & Audiovisual de Alta Performance
            </p>
          </div>
        </div>

        {/* Client Header Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-lg bg-[#181818] print:bg-zinc-100 border border-[#262626] print:border-zinc-300">
          <div>
            <span className="text-[10px] font-mono uppercase text-on-surface-variant print:text-zinc-600 block">
              Cliente / Empresa:
            </span>
            <strong className="text-base text-on-surface print:text-black">
              {client?.companyName}
            </strong>
            <p className="text-xs text-on-surface-variant print:text-zinc-700">
              Responsável: {client?.name} • Segmento: {client?.segment}
            </p>
          </div>

          <div className="sm:text-right font-mono">
            <span className="text-[10px] uppercase text-on-surface-variant print:text-zinc-600 block">
              Documento & Contato:
            </span>
            <p className="text-xs text-on-surface print:text-black">
              {client?.document}
            </p>
            <p className="text-xs text-on-surface-variant print:text-zinc-700">
              {client?.email} • {client?.phone}
            </p>
          </div>
        </div>

        {/* Production & Extras Summary Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Production Physical Counts */}
          <div className="p-5 rounded-lg bg-[#161616] print:bg-zinc-50 border border-[#262626] print:border-zinc-300 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-primary uppercase text-sm border-b border-[#262626] print:border-zinc-300 pb-2 flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              Resumo da Produção Audiovisual
            </h3>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Cota mensal contratada:</span>
              <strong className="text-on-surface print:text-black">{contractedVideos} vídeos</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Vídeos produzidos na cota:</span>
              <strong className="text-on-surface print:text-black">{Math.min(contractedVideos, totalVideos)} vídeos</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-primary font-bold">Extras produzidos:</span>
              <strong className="text-primary font-bold">+{extraVideos} vídeos</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Fotos / Ensaios entregues:</span>
              <strong className="text-emerald-400 print:text-black">{deliveredPhotos || contractedPhotos} fotos</strong>
            </div>

            <div className="flex justify-between py-2.5 font-bold text-sm bg-[#1e1e1e] print:bg-zinc-200 px-3 rounded-lg">
              <span>TOTAL DE CONTEÚDOS ENTREGUES:</span>
              <span className="text-primary print:text-black font-black">{totalVideos} VÍDEOS</span>
            </div>
          </div>

          {/* Column 2: Financial Values Summary */}
          <div className="p-5 rounded-lg bg-[#161616] print:bg-zinc-50 border border-[#262626] print:border-zinc-300 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-primary uppercase text-sm border-b border-[#262626] print:border-zinc-300 pb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Demonstrativo Financeiro do Mês
            </h3>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Mensalidade base do contrato:</span>
              <strong className="text-on-surface print:text-black">{formatCurrency(baseMonthlyFee)}</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-primary font-bold">Serviços Extras ({extraVideos}x):</span>
              <strong className="text-primary font-bold">+{formatCurrency(extrasCost)}</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Descontos / Bonificações:</span>
              <span className="text-on-surface print:text-black">R$ 0,00</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Vencimento da Fatura:</span>
              <span className="text-on-surface print:text-black">Dia {client?.dueDay || 10}</span>
            </div>

            <div className="flex justify-between py-2.5 font-bold text-sm bg-primary/15 print:bg-zinc-200 px-3 rounded-lg border border-primary/40">
              <span className="text-primary print:text-black uppercase">INVESTIMENTO TOTAL:</span>
              <span className="text-primary print:text-black text-base font-black">{formatCurrency(totalReportAmount)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Deliveries Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-on-surface print:text-black uppercase text-xs font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Detalhamento de Todas as Entregas do Período ({deliveredTasks.length})
          </h3>

          <div className="border border-[#262626] print:border-zinc-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#181818] print:bg-zinc-200 border-b border-[#262626] print:border-zinc-300 text-on-surface-variant print:text-zinc-700 uppercase text-[10px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Título do Conteúdo</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Enquadramento</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020] print:divide-zinc-200">
                {deliveredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-on-surface-variant">
                      Nenhum conteúdo entregue registrado ainda para este cliente.
                    </td>
                  </tr>
                ) : (
                  deliveredTasks.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-[#161616] print:hover:bg-transparent">
                      <td className="py-2.5 px-3 text-on-surface-variant font-bold">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-on-surface print:text-black">
                        {t.title}
                        {t.mediaUrl && (
                          <span className="block text-[10px] text-primary font-normal">
                            📁 Mídia Google Drive vinculada
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#222] print:bg-zinc-200 text-on-surface print:text-black uppercase">
                          {t.taskType === 'PHOTO' ? 'Foto' : 'Vídeo'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-on-surface-variant print:text-zinc-700">
                        {idx >= contractedVideos ? (
                          <span className="text-primary font-bold uppercase text-[10px]">Extra ({formatCurrency(client?.extraVideoPrice || 150)})</span>
                        ) : (
                          <span className="text-emerald-400 uppercase text-[10px]">Cota Regular</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 print:bg-transparent px-2 py-0.5 rounded">
                          ✓ Entregue / Aprovado
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures & Footer */}
        <div className="pt-8 border-t border-[#262626] print:border-zinc-400 grid grid-cols-2 gap-8 text-center font-mono text-xs text-on-surface-variant print:text-zinc-600">
          <div>
            <div className="border-b border-[#444] print:border-black mb-2 pb-8" />
            <p className="font-bold text-on-surface print:text-black">Lucas Antunes</p>
            <p className="text-[10px]">Diretor Geral • Brutal Marketing</p>
          </div>

          <div>
            <div className="border-b border-[#444] print:border-black mb-2 pb-8" />
            <p className="font-bold text-on-surface print:text-black">{client?.name}</p>
            <p className="text-[10px]">{client?.companyName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
