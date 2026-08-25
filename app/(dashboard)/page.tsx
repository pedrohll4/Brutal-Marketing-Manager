'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { MetricsBento } from '@/components/dashboard/MetricsBento';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Download, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHomePage() {
  const { user, isEmployee } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#262626]">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
            Bom dia, {user?.fullName?.split(' ')[0] || 'Lucas'} 👋
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 font-mono">
            {isEmployee
              ? 'Painel Operacional de Produção Audiovisual & Prazos da Equipe.'
              : 'Resumo executivo operacional e financeiro da Brutal Marketing.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEmployee && (
            <Link
              href="/relatorios"
              className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] hover:bg-[#1a1a1a] text-on-surface text-xs font-mono font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-on-surface-variant" />
              <span>Balanço da Empresa</span>
            </Link>
          )}

          <Link
            href="/producao"
            className="px-4 py-2 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Quadro Kanban</span>
          </Link>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <MetricsBento />

      {/* Analytics Charts Grid */}
      <div className={`grid grid-cols-1 ${!isEmployee ? 'lg:grid-cols-2' : ''} gap-6`}>
        <ProductionChart />
        {!isEmployee && <RevenueChart />}
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
