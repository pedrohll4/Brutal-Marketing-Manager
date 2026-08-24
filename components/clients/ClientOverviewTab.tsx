'use client';

import React from 'react';
import { Client } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { calculateClientQuotas } from '@/lib/services/contractService';
import { formatCurrency } from '@/lib/utils';
import { Film, Image as ImageIcon, Sparkles, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface ClientOverviewTabProps {
  client: Client;
}

export function ClientOverviewTab({ client }: ClientOverviewTabProps) {
  const { tasks, serviceRequests } = useSystemStore();

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const approvedRequests = serviceRequests.filter(
    (r) => r.clientId === client.id && r.status === 'APPROVED'
  );

  const quotas = calculateClientQuotas(client, clientTasks, approvedRequests);

  return (
    <div className="space-y-6">
      {/* Top Bento Cards: Summary of Quotas & Financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Valor Base Contratado */}
        <div className="brutal-card p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-on-surface-variant uppercase">
              Valor Contratado
            </span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold text-on-surface font-mono">
            {formatCurrency(quotas.baseMonthlyFee)}
          </span>
          <p className="text-[11px] text-on-surface-variant font-mono mt-1">
            Plano {client.contractModel === 'QUANTITY' ? 'por Quantidade' : client.contractModel}
          </p>
        </div>

        {/* Card 2: Serviços Contratados vs Utilizados */}
        <div className="brutal-card p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-on-surface-variant uppercase">
              Vídeos: Cota vs Uso
            </span>
            <Film className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-on-surface font-mono">
              {quotas.usedVideos} / {quotas.contractedVideos}
            </span>
            <span className="text-xs font-mono text-primary font-bold">
              ({quotas.percentageUsed}%)
            </span>
          </div>
          <div className="w-full bg-[#201f1f] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${quotas.percentageUsed}%` }}
            />
          </div>
        </div>

        {/* Card 3: Extras Solicitados & Produzidos */}
        <div className="brutal-card p-4 rounded-lg border-primary/30 bg-primary/5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-primary uppercase font-bold">
              Extras Realizados
            </span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold text-on-surface font-mono">
            +{quotas.extraVideos} Vídeos
          </span>
          <p className="text-[11px] text-on-surface-variant font-mono mt-1">
            Valor Adicional: <strong className="text-primary font-mono">{formatCurrency(quotas.totalExtrasCost)}</strong>
          </p>
        </div>

        {/* Card 4: Valor Total do Mês */}
        <div className="brutal-card p-4 rounded-lg bg-[#181818] border-[#333]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-on-surface-variant uppercase">
              Total Faturado no Mês
            </span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-xl font-black text-green-400 font-mono">
            {formatCurrency(quotas.grandTotalCost)}
          </span>
          <p className="text-[11px] text-on-surface-variant font-mono mt-1">
            Vencimento: Dia {client.dueDay}
          </p>
        </div>
      </div>

      {/* Breakdown Details Table */}
      <div className="brutal-card p-6 rounded-lg">
        <h3 className="text-base font-bold text-on-surface mb-4 pb-2 border-b border-[#262626] font-mono uppercase text-primary text-xs">
          Detalhamento de Produção e Custos deste Mês
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262626] text-on-surface-variant">
                <th className="pb-3 font-semibold">SERVIÇO</th>
                <th className="pb-3 font-semibold text-center">CONTRATADO</th>
                <th className="pb-3 font-semibold text-center">UTILIZADO</th>
                <th className="pb-3 font-semibold text-center">DISPONÍVEL</th>
                <th className="pb-3 font-semibold text-center">EXTRAS</th>
                <th className="pb-3 font-semibold text-right">VALOR UNIT. EXTRA</th>
                <th className="pb-3 font-semibold text-right">TOTAL ADICIONAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#201f1f]">
              <tr>
                <td className="py-3 font-semibold text-on-surface flex items-center gap-2">
                  <Film className="w-4 h-4 text-primary" />
                  Vídeos Produzidos
                </td>
                <td className="py-3 text-center">{quotas.contractedVideos}</td>
                <td className="py-3 text-center font-bold text-on-surface">{quotas.usedVideos}</td>
                <td className="py-3 text-center text-on-surface-variant">{quotas.remainingVideos}</td>
                <td className="py-3 text-center font-bold text-primary">
                  {quotas.extraVideos > 0 ? `+${quotas.extraVideos}` : '0'}
                </td>
                <td className="py-3 text-right">{formatCurrency(client.extraVideoPrice || 150)}</td>
                <td className="py-3 text-right font-bold text-primary">
                  {formatCurrency(quotas.extraVideosCost)}
                </td>
              </tr>

              <tr>
                <td className="py-3 font-semibold text-on-surface flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-400" />
                  Fotos / Peças Gráficas
                </td>
                <td className="py-3 text-center">{quotas.contractedPhotos}</td>
                <td className="py-3 text-center font-bold text-on-surface">{quotas.usedPhotos}</td>
                <td className="py-3 text-center text-on-surface-variant">{quotas.remainingPhotos}</td>
                <td className="py-3 text-center font-bold text-primary">
                  {quotas.extraPhotos > 0 ? `+${quotas.extraPhotos}` : '0'}
                </td>
                <td className="py-3 text-right">{formatCurrency(client.extraPhotoPrice || 80)}</td>
                <td className="py-3 text-right font-bold text-primary">
                  {formatCurrency(quotas.extraPhotosCost)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-[#262626] font-bold text-sm">
                <td colSpan={5} className="pt-4 text-on-surface-variant">
                  Subtotal Contratado: {formatCurrency(quotas.baseMonthlyFee)} | Extras: {formatCurrency(quotas.totalExtrasCost)}
                </td>
                <td className="pt-4 text-right text-xs uppercase font-mono text-on-surface-variant">
                  TOTAL DO MÊS:
                </td>
                <td className="pt-4 text-right text-base text-primary font-black">
                  {formatCurrency(quotas.grandTotalCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
