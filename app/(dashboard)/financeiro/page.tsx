'use client';

import React from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { FinancialTable } from '@/components/financial/FinancialTable';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';

export default function FinanceiroPage() {
  const { invoices } = useSystemStore();

  const totalExpected = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPending = invoices
    .filter((i) => i.status === 'PENDING')
    .reduce((acc, i) => acc + i.totalAmount, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((acc, i) => acc + i.totalAmount, 0);
  const totalExtras = invoices.reduce((acc, i) => acc + i.extrasAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
            Painel Financeiro & Faturas
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Gestão de cobranças, recebimentos, faturas em aberto e faturamento de extras
          </p>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Previsto */}
        <div className="brutal-card p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-on-surface-variant uppercase">
              Previsto Total
            </span>
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold text-on-surface font-mono">
            {formatCurrency(totalExpected)}
          </span>
          <p className="text-[10px] font-mono text-on-surface-variant mt-1">Agosto / 2026</p>
        </div>

        {/* Recebido */}
        <div className="brutal-card p-4 rounded-lg bg-emerald-950/20 border-emerald-800/40">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-emerald-400 uppercase font-bold">
              Recebido (Pago)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-bold text-emerald-400 font-mono">
            {formatCurrency(totalPaid)}
          </span>
          <p className="text-[10px] font-mono text-on-surface-variant mt-1">Quitados via PIX</p>
        </div>

        {/* Pendente */}
        <div className="brutal-card p-4 rounded-lg bg-amber-950/20 border-amber-800/40">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-amber-400 uppercase font-bold">
              Pendente
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xl font-bold text-amber-300 font-mono">
            {formatCurrency(totalPending)}
          </span>
          <p className="text-[10px] font-mono text-on-surface-variant mt-1">A vencer este mês</p>
        </div>

        {/* Atrasado */}
        <div className="brutal-card p-4 rounded-lg bg-red-950/20 border-red-800/40">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-red-400 uppercase font-bold">
              Atrasado
            </span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xl font-bold text-red-400 font-mono">
            {formatCurrency(totalOverdue)}
          </span>
          <p className="text-[10px] font-mono text-on-surface-variant mt-1">Cobrança necessária</p>
        </div>

        {/* Total Extras */}
        <div className="brutal-card p-4 rounded-lg border-primary/40 bg-primary/5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-primary uppercase font-bold">
              Receita Extras
            </span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary font-mono">
            {formatCurrency(totalExtras)}
          </span>
          <p className="text-[10px] font-mono text-on-surface-variant mt-1">Faturados à parte</p>
        </div>
      </div>

      {/* Invoices Table */}
      <FinancialTable />
    </div>
  );
}
