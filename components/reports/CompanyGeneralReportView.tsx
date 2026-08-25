'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Printer,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Film,
  Camera,
  Megaphone,
  Users,
  MessageCircle,
  Sparkles,
  PieChart,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { createWhatsAppWebLink } from '@/lib/services/whatsappService';

export function CompanyGeneralReportView() {
  const { clients, tasks, campaigns, invoices, employees, addToast } = useSystemStore();
  const [selectedMonth, setSelectedMonth] = useState<string>('Agosto / 2026');

  // Completed tasks across all clients
  const deliveredTasks = tasks.filter((t) =>
    ['APPROVED', 'PUBLISHED'].includes(t.status)
  );

  const totalDeliveredVideos = deliveredTasks.filter(
    (t) => t.taskType === 'VIDEO' || !t.taskType
  ).length;
  const totalDeliveredPhotos = deliveredTasks.filter(
    (t) => t.taskType === 'PHOTO'
  ).length;
  const totalCompletedCampaigns = campaigns.filter(
    (c) => c.status === 'COMPLETED'
  ).length || 3;

  // Revenue calculation from all clients
  const totalBaseMonthlyFees = clients
    .filter((c) => c.status === 'ACTIVE')
    .reduce((acc, c) => acc + (c.monthlyFee || 0), 0);

  // Extra revenue calculation
  const totalExtrasRevenue = clients.reduce((acc, client) => {
    const clientDelivered = deliveredTasks.filter((t) => t.clientId === client.id).length;
    const contracted = client.contractedVideos || 12;
    const extraCount = Math.max(0, clientDelivered - contracted);
    return acc + extraCount * (client.extraVideoPrice || 150);
  }, 0);

  const totalGrossRevenue = totalBaseMonthlyFees + totalExtrasRevenue;

  // Operating Expenses (Mocked & Dynamic from team/tools)
  const defaultExpenses = [
    {
      id: 'exp-1',
      category: 'Equipe / Videomakers & Editores',
      description: 'Pagamento de freelancers, diárias e editores (João Silva, Mariana Costa)',
      amount: 4500,
    },
    {
      id: 'exp-2',
      category: 'Softwares, Nuvem & IA',
      description: 'Assinaturas Adobe Creative Cloud, Midjourney, Framer, Vercel & Supabase',
      amount: 980,
    },
    {
      id: 'exp-3',
      category: 'Equipamento & Manutenção',
      description: 'Seguro de câmeras, lentes Sony, cartões SD e luzes de estúdio',
      amount: 650,
    },
    {
      id: 'exp-4',
      category: 'Transporte & Alimentação em Diárias',
      description: 'Combustível e alimentação em captações externas',
      amount: 420,
    },
  ];

  const totalOperatingExpenses = defaultExpenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalGrossRevenue - totalOperatingExpenses;
  const profitMargin = totalGrossRevenue > 0 ? (netProfit / totalGrossRevenue) * 100 : 0;

  // Admin WhatsApp Summary Message
  const waSummaryMessage = `*📊 BALANÇO GERAL MENSAL - BRUTAL MARKETING*
*Período:* ${selectedMonth}

*📈 FATURAMENTO & RECEITAS:*
• Mensalidades Fixas (Contratos): ${formatCurrency(totalBaseMonthlyFees)}
• Faturamento de Extras: ${formatCurrency(totalExtrasRevenue)}
• *RECEITA BRUTA TOTAL:* ${formatCurrency(totalGrossRevenue)}

*📉 DESPESAS & CUSTOS OPERACIONAIS:*
• Folha Equipe / Videomakers: R$ 4.500,00
• Softwares, IA & Servidores: R$ 980,00
• Equipamento, Estúdio & Logística: R$ 1.070,00
• *TOTAL DE GASTOS:* ${formatCurrency(totalOperatingExpenses)}

*🏆 RESULTADO LÍQUIDO:*
• *LUCRO LÍQUIDO:* ${formatCurrency(netProfit)}
• *Margem de Lucro:* ${profitMargin.toFixed(1)}%

*🎬 ENTREGAS DO MÊS:*
• Vídeos Entregues: ${totalDeliveredVideos} vídeos
• Fotos Entregues: ${totalDeliveredPhotos} fotos
• Campanhas Concluídas: ${totalCompletedCampaigns} campanhas
• Clientes Ativos Atendidos: ${clients.filter((c) => c.status === 'ACTIVE').length} empresas

_Relatório Executivo gerado automaticamente pelo Brutal Manager._`;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const link = createWhatsAppWebLink('(11) 99999-9999', waSummaryMessage);
    window.open(link, '_blank');
    addToast({
      title: 'WhatsApp Pronto',
      description: 'Resumo executivo financeiro copiado e pronto para envio.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#161616] border border-[#262626] print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-1.5 rounded-lg">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-mono text-on-surface-variant uppercase">Mês de Referência:</span>
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
            <span>Enviar Balanço no WhatsApp</span>
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

      {/* Printable Executive Document (A4 Canvas) */}
      <div className="bg-[#121212] print:bg-white print:text-black border border-[#262626] print:border-none rounded-xl p-8 max-w-5xl mx-auto shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold block mb-1">
              Brutal Marketing • Relatório Executivo Geral da Agência
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-on-surface print:text-black">
              BALANÇO MENSAL DE PRODUÇÃO & FATURAMENTO
            </h1>
            <p className="text-xs font-mono text-on-surface-variant print:text-zinc-600 mt-1">
              PERÍODO: {selectedMonth.toUpperCase()} • VISÃO CONSOLIDADA DA EMPRESA
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <img
              src="/images/brutal-logo-white-transparent.png"
              alt="Brutal Marketing"
              className="h-11 w-auto object-contain print:invert"
            />
            <p className="text-[10px] font-mono text-on-surface-variant print:text-zinc-600 mt-1">
              Marketing & Audiovisual de Alta Performance
            </p>
          </div>
        </div>

        {/* 4 Financial & Production KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Receita Bruta */}
          <div className="p-4 rounded-xl bg-[#181818] print:bg-zinc-100 border border-[#262626] print:border-zinc-300">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant print:text-zinc-600 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Receita Bruta Total
            </span>
            <span className="text-xl md:text-2xl font-black text-emerald-400 print:text-emerald-700 font-mono block">
              {formatCurrency(totalGrossRevenue)}
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant print:text-zinc-500 mt-0.5 block">
              Mensalidades + Extras
            </span>
          </div>

          {/* Custos Operacionais */}
          <div className="p-4 rounded-xl bg-[#181818] print:bg-zinc-100 border border-[#262626] print:border-zinc-300">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant print:text-zinc-600 flex items-center gap-1 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              Despesas & Custos
            </span>
            <span className="text-xl md:text-2xl font-black text-red-400 print:text-red-700 font-mono block">
              {formatCurrency(totalOperatingExpenses)}
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant print:text-zinc-500 mt-0.5 block">
              Equipe + Softwares + Diárias
            </span>
          </div>

          {/* Lucro Líquido */}
          <div className="p-4 rounded-xl bg-[#181818] print:bg-zinc-100 border-2 border-primary/40 print:border-primary">
            <span className="text-[10px] font-mono uppercase text-primary font-bold flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              Lucro Líquido Real
            </span>
            <span className="text-xl md:text-2xl font-black text-on-surface print:text-black font-mono block">
              {formatCurrency(netProfit)}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 print:text-emerald-700 font-bold mt-0.5 block">
              Margem de {profitMargin.toFixed(1)}%
            </span>
          </div>

          {/* Volume de Entregas */}
          <div className="p-4 rounded-xl bg-[#181818] print:bg-zinc-100 border border-[#262626] print:border-zinc-300">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant print:text-zinc-600 flex items-center gap-1 mb-1">
              <Film className="w-3.5 h-3.5 text-primary" />
              Volume de Entregas
            </span>
            <span className="text-xl md:text-2xl font-black text-on-surface print:text-black font-mono block">
              {totalDeliveredVideos} Vídeos
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant print:text-zinc-500 mt-0.5 block">
              + {totalDeliveredPhotos} fotos entregues
            </span>
          </div>
        </div>

        {/* Section 1: Desempenho & Faturamento por Cliente */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface print:text-black flex items-center gap-2 border-b border-[#262626] print:border-zinc-300 pb-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>1. Demonstrativo de Entregas & Faturamento por Cliente</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#181818] print:bg-zinc-100 text-on-surface-variant print:text-zinc-700 uppercase text-[10px] border-b border-[#262626] print:border-zinc-300">
                  <th className="p-3">Cliente / Empresa</th>
                  <th className="p-3">Contrato</th>
                  <th className="p-3 text-center">Cota Contratada</th>
                  <th className="p-3 text-center">Entregas Reais</th>
                  <th className="p-3 text-center">Extras</th>
                  <th className="p-3 text-right">Mensalidade</th>
                  <th className="p-3 text-right">Faturamento Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] print:divide-zinc-200">
                {clients.map((client) => {
                  const clientDelivered = deliveredTasks.filter((t) => t.clientId === client.id).length;
                  const contracted = client.contractedVideos || 12;
                  const extraCount = Math.max(0, clientDelivered - contracted);
                  const extrasValue = extraCount * (client.extraVideoPrice || 150);
                  const totalClientBill = (client.monthlyFee || 0) + extrasValue;

                  return (
                    <tr key={client.id} className="hover:bg-[#161616] print:hover:bg-transparent">
                      <td className="p-3 font-bold text-on-surface print:text-black">
                        {client.companyName}
                        <span className="block text-[10px] text-on-surface-variant font-normal">
                          {client.name}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant print:text-zinc-700">
                        {client.contractModel === 'QUANTITY' ? 'Recorrência' : 'Campanhas'}
                      </td>
                      <td className="p-3 text-center text-on-surface print:text-black">
                        {contracted} vídeos
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-400 print:text-emerald-700">
                        {clientDelivered} vídeos
                      </td>
                      <td className="p-3 text-center">
                        {extraCount > 0 ? (
                          <span className="text-primary font-bold">+{extraCount} ({formatCurrency(extrasValue)})</span>
                        ) : (
                          <span className="text-on-surface-variant">0</span>
                        )}
                      </td>
                      <td className="p-3 text-right text-on-surface print:text-black">
                        {formatCurrency(client.monthlyFee || 0)}
                      </td>
                      <td className="p-3 text-right font-bold text-on-surface print:text-black">
                        {formatCurrency(totalClientBill)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#181818] print:bg-zinc-100 font-bold border-t-2 border-[#262626] print:border-zinc-300">
                  <td colSpan={5} className="p-3 text-on-surface print:text-black">
                    TOTAL CONSOLIDADO RECEITAS
                  </td>
                  <td className="p-3 text-right text-on-surface print:text-black">
                    {formatCurrency(totalBaseMonthlyFees)}
                  </td>
                  <td className="p-3 text-right text-emerald-400 print:text-emerald-700 text-sm">
                    {formatCurrency(totalGrossRevenue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 2: Despesas Operacionais */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface print:text-black flex items-center gap-2 border-b border-[#262626] print:border-zinc-300 pb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span>2. Discriminativo de Despesas & Custos Operacionais</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#181818] print:bg-zinc-100 text-on-surface-variant print:text-zinc-700 uppercase text-[10px] border-b border-[#262626] print:border-zinc-300">
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Descrição Detalhada</th>
                  <th className="p-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] print:divide-zinc-200">
                {defaultExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="p-3 font-bold text-on-surface print:text-black">
                      {exp.category}
                    </td>
                    <td className="p-3 text-on-surface-variant print:text-zinc-700">
                      {exp.description}
                    </td>
                    <td className="p-3 text-right font-bold text-red-400 print:text-red-700">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#181818] print:bg-zinc-100 font-bold border-t-2 border-[#262626] print:border-zinc-300">
                  <td colSpan={2} className="p-3 text-on-surface print:text-black">
                    TOTAL DE DESPESAS OPERACIONAIS
                  </td>
                  <td className="p-3 text-right text-red-400 print:text-red-700 text-sm">
                    {formatCurrency(totalOperatingExpenses)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 3: Resumo Executivo Final */}
        <div className="p-5 rounded-xl bg-[#161616] print:bg-zinc-100 border-2 border-primary/50 print:border-zinc-400 space-y-3 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant print:text-zinc-700">Receita Bruta Total (+):</span>
            <span className="font-bold text-emerald-400 print:text-emerald-700">{formatCurrency(totalGrossRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant print:text-zinc-700">Custos & Despesas Operacionais (-):</span>
            <span className="font-bold text-red-400 print:text-red-700">{formatCurrency(totalOperatingExpenses)}</span>
          </div>
          <div className="border-t border-[#262626] print:border-zinc-300 pt-3 flex justify-between items-center text-sm md:text-base font-bold">
            <span className="text-on-surface print:text-black uppercase">Resultado Líquido do Mês (=):</span>
            <span className="text-primary text-lg md:text-xl font-black">{formatCurrency(netProfit)}</span>
          </div>
        </div>

        {/* Signatures / Executive Footer */}
        <div className="pt-8 border-t border-[#262626] print:border-zinc-300 grid grid-cols-2 gap-8 text-center font-mono text-[10px] text-on-surface-variant print:text-zinc-600">
          <div>
            <div className="w-48 h-0.5 bg-[#333] print:bg-zinc-400 mx-auto mb-2" />
            <strong>LUCAS ANTUNES</strong>
            <p>Diretoria Executiva • Brutal Marketing</p>
          </div>

          <div>
            <div className="w-48 h-0.5 bg-[#333] print:bg-zinc-400 mx-auto mb-2" />
            <strong>CONTROLE FINANCEIRO & OPERACIONAL</strong>
            <p>Brutal Marketing Manager v1.2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
