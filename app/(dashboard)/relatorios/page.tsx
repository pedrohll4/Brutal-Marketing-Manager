'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { MonthlyReportView } from '@/components/reports/MonthlyReportView';
import { CompanyGeneralReportView } from '@/components/reports/CompanyGeneralReportView';
import { Building2, Users, BarChart3, ShieldCheck } from 'lucide-react';

export default function RelatoriosPage() {
  const { isEmployee } = useAuth();
  const [reportTab, setReportTab] = useState<'COMPANY' | 'CLIENT'>(
    isEmployee ? 'CLIENT' : 'COMPANY'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-4 print:hidden">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface">
            Central de Relatórios & Balanço
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            {isEmployee
              ? 'Demonstrativo operacional de entregas e cotas dos clientes'
              : 'Balanço mensal da empresa (faturamento, despesas e lucro) e relatórios individuais'}
          </p>
        </div>

        {/* Tab Switcher (Only if Admin / Owner) */}
        {!isEmployee && (
          <div className="flex items-center gap-1.5 bg-[#161616] border border-[#262626] p-1 rounded-xl">
            <button
              onClick={() => setReportTab('COMPANY')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                reportTab === 'COMPANY'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-[#202020]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Balanço Geral da Empresa</span>
            </button>

            <button
              onClick={() => setReportTab('CLIENT')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                reportTab === 'CLIENT'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-[#202020]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Relatório por Cliente</span>
            </button>
          </div>
        )}
      </div>

      {/* Render selected view */}
      {reportTab === 'COMPANY' && !isEmployee ? (
        <CompanyGeneralReportView />
      ) : (
        <MonthlyReportView />
      )}
    </div>
  );
}
