'use client';

import React from 'react';
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

const financialData = [
  { month: 'Mar', recorrente: 120000, extras: 15400 },
  { month: 'Abr', recorrente: 135000, extras: 18900 },
  { month: 'Mai', recorrente: 142000, extras: 24500 },
  { month: 'Jun', recorrente: 150000, extras: 31000 },
  { month: 'Jul', recorrente: 165000, extras: 38200 },
  { month: 'Ago', recorrente: 180000, extras: 45600 },
];

export function RevenueChart() {
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
              tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
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
