'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowRight, X, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function PendingRequestsAlertBar() {
  const { serviceRequests } = useSystemStore();
  const { isClient } = useAuth();
  const pathname = usePathname();
  const [isDismissed, setIsDismissed] = useState(false);

  // If on client portal or already on /solicitacoes, don't show the intrusive banner
  if (isClient || isDismissed) return null;

  const pendingRequests = serviceRequests.filter((r) => r.status === 'PENDING');
  const count = pendingRequests.length;

  if (count === 0) return null;

  const latestRequest = pendingRequests[0];

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-950/80 via-[#23180c] to-amber-950/80 border-2 border-amber-500/60 rounded-xl p-3.5 sm:p-4 shadow-[0_0_25px_rgba(245,158,11,0.2)] animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-black rounded-lg shrink-0 animate-pulse">
            <Bell className="w-5 h-5 font-bold" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider">
                Atenção Admin / Dono:
              </span>
              <span className="bg-amber-400 text-black text-[10px] font-mono font-black px-2 py-0.5 rounded-full">
                {count} {count === 1 ? 'SOLICITAÇÃO PENDENTE' : 'SOLICITAÇÕES PENDENTES'}
              </span>
            </div>

            <p className="text-xs text-on-surface font-mono mt-0.5">
              <strong>{latestRequest.clientName}</strong> solicitou{' '}
              <span className="text-amber-300 font-bold">{latestRequest.quantity}x {latestRequest.serviceType}</span>{' '}
              ({formatCurrency(latestRequest.totalEstimated)}) aguardando aprovação para a esteira de produção.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Link
            href="/solicitacoes"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>Ver & Aprovar Solicitações</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded transition-colors"
            title="Ocultar aviso temporariamente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
