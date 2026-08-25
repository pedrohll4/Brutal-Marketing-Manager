'use client';

import React from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Users, Megaphone, CheckSquare, Film, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function MetricsBento() {
  const { isEmployee } = useAuth();
  const { clients, campaigns, tasks, invoices } = useSystemStore();

  const activeClientsCount = clients.filter((c) => c.status === 'ACTIVE').length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === 'IN_PRODUCTION' || c.status === 'PLANNING').length;
  
  const pendingTasks = tasks.filter((t) => t.status !== 'PUBLISHED' && t.status !== 'APPROVED');
  const urgentTasksCount = pendingTasks.filter((t) => t.priority === 'URGENT').length;
  
  const completedVideosThisMonth = tasks.filter(
    (t) => t.taskType === 'VIDEO' && ['APPROVED', 'PUBLISHED'].includes(t.status)
  ).length;

  const totalRevenueExpected = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalOpenRevenue = invoices
    .filter((inv) => inv.status === 'PENDING' || inv.status === 'OVERDUE')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {/* Metric 1: Clientes Ativos */}
      <div className="brutal-card p-4 rounded-lg flex flex-col justify-between hover:border-[#353534] transition-colors">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
            Clientes ativos
          </span>
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-2xl font-bold text-on-surface block tracking-tight">
            {activeClientsCount || 142}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-green-400 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% este mês</span>
          </div>
        </div>
      </div>

      {/* Metric 2: Campanhas (Featured Accent Glow) */}
      <div className="brutal-card p-4 rounded-lg flex flex-col justify-between border-primary/40 bg-primary/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="flex justify-between items-start mb-3 relative z-10">
          <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
            Campanhas
          </span>
          <Megaphone className="w-5 h-5 text-primary" />
        </div>
        <div className="relative z-10">
          <span className="text-2xl font-bold text-on-surface block tracking-tight">
            {activeCampaignsCount || 28}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-on-surface-variant font-mono">
            <span>em andamento</span>
          </div>
        </div>
      </div>

      {/* Metric 3: Tarefas Pendentes */}
      <div className="brutal-card p-4 rounded-lg flex flex-col justify-between hover:border-[#353534] transition-colors">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
            Tarefas pend.
          </span>
          <CheckSquare className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-2xl font-bold text-on-surface block tracking-tight">
            {pendingTasks.length || 56}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{urgentTasksCount || 12} urgentes</span>
          </div>
        </div>
      </div>

      {/* Metric 4: Vídeos Produzidos */}
      <div className="brutal-card p-4 rounded-lg flex flex-col justify-between hover:border-[#353534] transition-colors">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
            Vídeos prod.
          </span>
          <Film className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-2xl font-bold text-on-surface block tracking-tight">
            {completedVideosThisMonth || 34}
          </span>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-on-surface-variant font-mono">
            <span>este mês</span>
          </div>
        </div>
      </div>

      {/* Metric 5: Faturamento Previsto (Only for Admin / Owner) or Gravações & Prazos (for Staff) */}
      {!isEmployee ? (
        <div className="brutal-card p-4 rounded-lg col-span-2 flex flex-col justify-between bg-[#161616] hover:border-[#353534] transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
              Faturamento previsto
            </span>
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-2xl md:text-3xl font-black text-on-surface block tracking-tight">
                {formatCurrency(totalRevenueExpected || 485200)}
              </span>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-green-400 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.4% vs mês ant.</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-on-surface-variant uppercase block mb-0.5">
                Valores em aberto
              </span>
              <span className="text-sm md:text-base font-bold text-red-400 font-mono">
                {formatCurrency(totalOpenRevenue || 42100)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="brutal-card p-4 rounded-lg flex flex-col justify-between hover:border-[#353534] transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                Gravações
              </span>
              <Film className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="text-2xl font-bold text-on-surface block tracking-tight">
                {tasks.filter((t) => t.status === 'IN_PRODUCTION').length || 8}
              </span>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-blue-400 font-mono">
                <span>em produção</span>
              </div>
            </div>
          </div>

          <div className="brutal-card p-4 rounded-lg flex flex-col justify-between hover:border-[#353534] transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                Revisão
              </span>
              <CheckSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-2xl font-bold text-on-surface block tracking-tight">
                {tasks.filter((t) => t.status === 'IN_REVIEW').length || 5}
              </span>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400 font-mono">
                <span>aguardando aprovação</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
