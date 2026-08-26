'use client';

import React from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export function RevenueChart() {
  const { clients, invoices } = useSystemStore();

  const totalBaseFee = clients
    .filter((c) => c.status === 'ACTIVE')
    .reduce((sum, c) => sum + (c.monthlyFee || 0), 0);

  const totalExtrasRevenue = invoices.reduce((sum, inv) => sum + (inv.extrasAmount || 0), 0);

  const financialData = [
    { month: 'Mar', recorrente: 0, extras: 0 },
    { month: 'Abr', recorrente: 0, extras: 0 },
    { month: 'Mai', recorrente: 0, extras: 0 },
    { month: 'Jun', recorrente: 0, extras: 0 },
    { month: 'Jul', recorrente: 0, extras: 0 },
    { month: 'Ago', recorrente: totalBaseFee, extras: totalExtrasRevenue },
  ];

  return (
    <div className="brutal-card p-6 rounded-lg flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Faturamento: Base vs Extras</h3>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Crescimento do faturamento com venda de serviços adicionais
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={financialData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#666"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${v}`)}
            />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), '']}
              contentStyle={{
                backgroundColor: '#181818',
                borderColor: '#2a2a2a',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#e5e2e1',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingBottom: '10px' }}
            />
            <Bar dataKey="recorrente" name="Contratos Fixos" fill="#353534" radius={[4, 4, 0, 0]} />
            <Bar dataKey="extras" name="Receita de Extras" fill="#ff5708" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
