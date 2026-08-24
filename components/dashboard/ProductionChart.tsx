'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Mar', contratado: 45, entregue: 45, extras: 6 },
  { month: 'Abr', contratado: 50, entregue: 48, extras: 8 },
  { month: 'Mai', contratado: 55, entregue: 55, extras: 12 },
  { month: 'Jun', contratado: 60, entregue: 58, extras: 14 },
  { month: 'Jul', contratado: 65, entregue: 65, extras: 18 },
  { month: 'Ago', contratado: 72, entregue: 72, extras: 24 },
];

export function ProductionChart() {
  return (
    <div className="brutal-card p-6 rounded-lg flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Produção de Conteúdo Mensal</h3>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Evolução de vídeos e fotos entregues vs serviços extras solicitados
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-on-surface-variant">Entregues</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-on-surface-variant">Extras</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEntregue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5708" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ff5708" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExtras" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} />
            <YAxis stroke="#666" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181818',
                borderColor: '#2a2a2a',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#e5e2e1',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}
            />
            <Area
              type="monotone"
              dataKey="entregue"
              stroke="#ff5708"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEntregue)"
              name="Conteúdos Entregues"
            />
            <Area
              type="monotone"
              dataKey="extras"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExtras)"
              name="Vídeos / Fotos Extras"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
