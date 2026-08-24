'use client';

import React from 'react';
import { MonthlyReportView } from '@/components/reports/MonthlyReportView';

export default function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">
          Relatórios Mensais de Performance & Produção
        </h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Gere relatórios transparentes com entregas, cotas e valores para seus clientes
        </p>
      </div>

      <MonthlyReportView />
    </div>
  );
}
