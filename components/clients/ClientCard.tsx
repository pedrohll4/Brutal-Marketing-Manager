'use client';

import React from 'react';
import { Client } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import { calculateClientQuotas } from '@/lib/services/contractService';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Building2, ChevronRight } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
}

export function ClientCard({ client }: ClientCardProps) {
  const { isEmployee } = useAuth();
  const { tasks, serviceRequests } = useSystemStore();

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const approvedRequests = serviceRequests.filter(
    (r) => r.clientId === client.id && r.status === 'APPROVED'
  );

  const quotas = calculateClientQuotas(client, clientTasks, approvedRequests);

  const statusConfig = {
    ACTIVE: {
      label: 'Ativo',
      badgeClass: 'text-primary bg-primary/10 border-primary/30',
      borderHover: 'hover:border-primary',
    },
    PENDING_PAYMENT: {
      label: 'Pendente',
      badgeClass: 'text-red-400 bg-red-950/40 border-red-800/40',
      borderHover: 'hover:border-red-500',
    },
    INACTIVE: {
      label: 'Inativo',
      badgeClass: 'text-on-surface-variant bg-[#262626] border-[#333]',
      borderHover: 'hover:border-[#353534]',
    },
  }[client.status];

  return (
    <Link
      href={`/clientes/${client.id}`}
      className={`bg-[#121212] border border-[#262626] rounded-lg p-5 flex flex-col justify-between transition-all group relative cursor-pointer ${
        statusConfig.borderHover
      } ${client.status === 'INACTIVE' ? 'opacity-70 grayscale hover:grayscale-0' : ''}`}
    >
      {/* Header */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {client.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logoUrl}
                alt={client.name}
                className="w-12 h-12 rounded-lg border border-[#2a2a2a] object-cover bg-[#1c1b1b]"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg border border-[#2a2a2a] bg-[#1c1b1b] flex items-center justify-center text-primary font-bold text-lg">
                {client.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                {client.companyName}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-primary" />
              </h3>
              <p className="text-xs text-on-surface-variant font-mono flex items-center gap-1">
                <Building2 className="w-3 h-3 text-on-surface-variant" />
                {client.segment || 'Marketing & Conteúdo'}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono font-bold px-2 py-1 border uppercase tracking-wider rounded-sm ${statusConfig.badgeClass}`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Bento stats row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#181818] border border-[#262626] p-2.5 rounded">
            <p className="text-[10px] font-mono text-on-surface-variant uppercase mb-0.5">
              Modelo Contrato
            </p>
            <p className="text-xs font-bold text-on-surface truncate">
              {client.contractModel === 'QUANTITY'
                ? 'Por Quantidade'
                : client.contractModel === 'CAMPAIGN'
                ? 'Por Campanha'
                : 'Personalizado'}
            </p>
          </div>

          <div
            className={`bg-[#181818] border p-2.5 rounded ${
              client.status === 'PENDING_PAYMENT' && !isEmployee ? 'border-red-900/60 bg-red-950/20' : 'border-[#262626]'
            }`}
          >
            <p
              className={`text-[10px] font-mono uppercase mb-0.5 ${
                client.status === 'PENDING_PAYMENT' && !isEmployee ? 'text-red-400' : 'text-on-surface-variant'
              }`}
            >
              {isEmployee ? 'Cota Contratada' : 'Valor Mensal'}
            </p>
            <p className="text-xs font-bold text-on-surface font-mono">
              {isEmployee
                ? `${client.contractedVideos || 12} vídeos/mês`
                : client.monthlyFee > 0
                ? formatCurrency(client.monthlyFee)
                : '--'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Progress Bar */}
      <div className="border-t border-[#262626] pt-3 mt-auto space-y-2.5">
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1">
            <span className="text-on-surface-variant">Produção (Vídeos)</span>
            <span className="text-on-surface font-semibold">
              {quotas.usedVideos}/{quotas.contractedVideos}
              {quotas.extraVideos > 0 && (
                <span className="text-primary ml-1 font-bold">
                  (+{quotas.extraVideos} extra)
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-[#201f1f] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                quotas.extraVideos > 0 ? 'bg-primary' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, (quotas.usedVideos / (quotas.contractedVideos || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div
          className={`flex justify-between items-center text-xs font-mono p-2 rounded border ${
            client.status === 'PENDING_PAYMENT'
              ? 'bg-red-950/20 border-red-900/40 text-red-300'
              : 'bg-[#161616] border-[#262626] text-on-surface-variant'
          }`}
        >
          <span>Vencimento</span>
          <span className="font-bold text-on-surface">Dia {client.dueDay}</span>
        </div>
      </div>
    </Link>
  );
}
