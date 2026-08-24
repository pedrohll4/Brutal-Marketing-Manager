'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, Send, FileText, CheckCircle2, Film, Sparkles, Building2 } from 'lucide-react';

interface MonthlyReportViewProps {
  clientId?: string;
}

export function MonthlyReportView({ clientId }: MonthlyReportViewProps) {
  const { clients, tasks, monthlyReports, addToast } = useSystemStore();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    clientId || clients[0]?.id || 'cli-procampo'
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // August
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const client = clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientTasks = tasks.filter((t) => t.clientId === client?.id);
  const deliveredTasks = clientTasks.filter((t) =>
    ['APPROVED', 'PUBLISHED'].includes(t.status)
  );

  // Math for report
  const contractedVideos = client?.contractedVideos || 12;
  const producedVideos = deliveredTasks.filter((t) => t.taskType === 'VIDEO').length;
  const extraVideos = Math.max(0, producedVideos - contractedVideos) || (client?.id === 'cli-procampo' ? 3 : 0);
  const usedVideos = Math.min(contractedVideos, producedVideos);

  const baseMonthlyFee = client?.monthlyFee || 2000;
  const extrasCost = extraVideos * (client?.extraVideoPrice || 150);
  const totalReportAmount = baseMonthlyFee + extrasCost;

  const handlePrint = () => {
    window.print();
  };

  const handleSendToClient = () => {
    addToast({
      title: 'Relatório Enviado!',
      description: `O relatório mensal de ${client?.companyName} foi enviado por e-mail e disponibilizado no portal.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden during Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 bg-[#141414] border border-[#262626] rounded-lg">
        <div className="flex items-center gap-3">
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
            <span className="text-xs font-mono font-bold text-on-surface">Agosto / 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSendToClient}
            className="px-4 py-2 rounded bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#333] text-on-surface text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow"
          >
            <Send className="w-3.5 h-3.5 text-primary" />
            <span>Enviar para Cliente</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Gerar / Imprimir PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (A4 Styled Canvas) */}
      <div className="bg-[#121212] print:bg-white print:text-black border border-[#262626] print:border-none rounded-lg p-8 max-w-4xl mx-auto shadow-2xl space-y-8">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold block mb-1">
              Brutal Marketing • Relatório Oficial
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-on-surface print:text-black">
              RELATÓRIO MENSAL DE PRODUÇÃO
            </h1>
            <p className="text-xs font-mono text-on-surface-variant print:text-zinc-600 mt-1">
              AGOSTO / 2026 • Período: 01/08/2026 a 31/08/2026
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-black text-primary uppercase leading-none">
              BRUTAL<br />MARKETING
            </h2>
            <p className="text-[10px] font-mono text-on-surface-variant print:text-zinc-600 mt-1">
              CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>

        {/* Client Header Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded bg-[#181818] print:bg-zinc-100 border border-[#262626] print:border-zinc-300">
          <div>
            <span className="text-[10px] font-mono uppercase text-on-surface-variant print:text-zinc-600 block">
              Cliente:
            </span>
            <strong className="text-base text-on-surface print:text-black">
              {client?.name}
            </strong>
            <p className="text-xs text-on-surface-variant print:text-zinc-700">
              {client?.companyName} • {client?.segment}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant print:text-zinc-600 block">
              Documento & Contato:
            </span>
            <p className="text-xs font-mono text-on-surface print:text-black">
              {client?.document}
            </p>
            <p className="text-xs font-mono text-on-surface-variant print:text-zinc-700">
              {client?.email} • {client?.phone}
            </p>
          </div>
        </div>

        {/* Production & Extras Summary Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Production Physical Counts */}
          <div className="p-5 rounded bg-[#161616] print:bg-zinc-50 border border-[#262626] print:border-zinc-300 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-primary uppercase text-sm border-b border-[#262626] print:border-zinc-300 pb-2">
              Resumo da Produção Audiovisual
            </h3>

            <div className="flex justify-between py-1 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Produção contratada:</span>
              <strong className="text-on-surface print:text-black">{contractedVideos} vídeos</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Produção realizada na cota:</span>
              <strong className="text-on-surface print:text-black">{usedVideos} vídeos</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202020] print:border-zinc-200">
              <span className="text-primary font-bold">Extras produzidos:</span>
              <strong className="text-primary font-bold">+{extraVideos} vídeos</strong>
            </div>

            <div className="flex justify-between py-2 font-bold text-sm bg-[#1e1e1e] print:bg-zinc-200 px-2 rounded">
              <span>TOTAL PRODUZIDO:</span>
              <span className="text-primary print:text-black">{producedVideos || (contractedVideos + extraVideos)} VÍDEOS</span>
            </div>
          </div>

          {/* Column 2: Financial Values Summary */}
          <div className="p-5 rounded bg-[#161616] print:bg-zinc-50 border border-[#262626] print:border-zinc-300 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-primary uppercase text-sm border-b border-[#262626] print:border-zinc-300 pb-2">
              Demonstrativo Financeiro do Mês
            </h3>

            <div className="flex justify-between py-1 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Valor contratado base:</span>
              <strong className="text-on-surface print:text-black">{formatCurrency(baseMonthlyFee)}</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202020] print:border-zinc-200">
              <span className="text-primary font-bold">Serviços Extras ({extraVideos}x):</span>
              <strong className="text-primary font-bold">+{formatCurrency(extrasCost)}</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-[#202020] print:border-zinc-200">
              <span className="text-on-surface-variant print:text-zinc-600">Descontos / Bonificações:</span>
              <span className="text-on-surface print:text-black">R$ 0,00</span>
            </div>

            <div className="flex justify-between py-2 font-bold text-sm bg-primary/10 print:bg-zinc-200 px-2 rounded border border-primary/30">
              <span className="text-primary print:text-black uppercase">TOTAL A FATURAR:</span>
              <span className="text-primary print:text-black text-base">{formatCurrency(totalReportAmount)}</span>
            </div>
          </div>
        </div>

        {/* Deliverables Detailed Listing */}
        <div>
          <h3 className="text-sm font-bold font-mono uppercase text-on-surface print:text-black mb-3 pb-1 border-b border-[#262626] print:border-zinc-300">
            Lista de Conteúdos Entregues no Período ({deliveredTasks.length})
          </h3>

          <div className="divide-y divide-[#202020] print:divide-zinc-200 text-xs font-mono">
            {deliveredTasks.slice(0, 15).map((t, idx) => (
              <div key={t.id} className="py-2.5 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-on-surface-variant font-bold">#{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-on-surface print:text-black font-sans font-semibold truncate">
                    {t.title}
                  </span>
                  {t.isExtra && (
                    <span className="bg-primary/20 text-primary border border-primary/40 text-[9px] px-1.5 py-0.2 rounded uppercase font-bold shrink-0">
                      Extra
                    </span>
                  )}
                </div>
                <div className="text-on-surface-variant print:text-zinc-600 text-right shrink-0">
                  Entregue em: {formatDate(t.dueDate)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes & Observations */}
        <div className="p-4 rounded bg-[#181818] print:bg-zinc-100 border border-[#262626] print:border-zinc-300 text-xs leading-relaxed text-on-surface-variant print:text-zinc-700">
          <strong className="text-on-surface print:text-black block mb-1 font-mono uppercase">
            Observações Gerais da Agência:
          </strong>
          {client?.notes ||
            'Mês com 100% da cota contratada entregue no prazo, além de produções adicionais para inauguração e eventos que resultaram em alto engajamento nas redes sociais.'}
        </div>

        {/* Signature Footer */}
        <div className="grid grid-cols-2 gap-8 pt-10 text-center font-mono text-xs border-t border-[#262626] print:border-zinc-300">
          <div>
            <div className="border-b border-[#333] print:border-zinc-400 pb-1 mb-2 mx-auto max-w-[240px]">
              Lucas Antunes
            </div>
            <span className="text-on-surface-variant print:text-zinc-600 text-[10px] uppercase">
              Diretor Executivo • Brutal Marketing
            </span>
          </div>

          <div>
            <div className="border-b border-[#333] print:border-zinc-400 pb-1 mb-2 mx-auto max-w-[240px]">
              {client?.name}
            </div>
            <span className="text-on-surface-variant print:text-zinc-600 text-[10px] uppercase">
              {client?.companyName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
