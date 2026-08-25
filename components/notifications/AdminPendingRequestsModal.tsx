'use client';

import React, { useState, useEffect } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Bell, ArrowRight, Clock, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AdminPendingRequestsModal() {
  const { serviceRequests } = useSystemStore();
  const { isClient, isAdmin, isOwner } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const pendingRequests = serviceRequests.filter((r) => r.status === 'PENDING');
  const count = pendingRequests.length;

  useEffect(() => {
    // Only show for Admin/Owner and when not on the client portal or already on /solicitacoes
    if (isClient || (!isAdmin && !isOwner) || pathname === '/solicitacoes') {
      return;
    }

    if (count > 0) {
      const lastSeenTime = sessionStorage.getItem('brutal_pending_popup_seen');
      const now = Date.now();

      // Show if not seen in the last 15 minutes of this browser session
      if (!lastSeenTime || now - Number(lastSeenTime) > 15 * 60 * 1000) {
        setIsOpen(true);
      }
    }
  }, [count, isClient, isAdmin, isOwner, pathname]);

  const handleGoToRequests = () => {
    sessionStorage.setItem('brutal_pending_popup_seen', String(Date.now()));
    setIsOpen(false);
    router.push('/solicitacoes');
  };

  const handleDismiss = () => {
    sessionStorage.setItem('brutal_pending_popup_seen', String(Date.now()));
    setIsOpen(false);
  };

  if (!isOpen || count === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDismiss}
      title="Solicitações de Clientes Pendentes"
      subtitle={`Você tem ${count} ${count === 1 ? 'pedido de serviço extra aguardando' : 'pedidos de serviços extras aguardando'} sua aprovação`}
      maxWidth="xl"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Header Alert Pill */}
        <div className="p-3.5 bg-amber-950/60 border border-amber-500/50 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-black rounded-lg shrink-0 animate-pulse">
            <Bell className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h4 className="font-bold text-amber-300 text-xs uppercase">
              Novos Pedidos na Fila de Produção
            </h4>
            <p className="text-on-surface-variant text-[11px] font-sans mt-0.5">
              Revise os detalhes abaixo para autorizar a equipe a iniciar as gravações ou edições.
            </p>
          </div>
        </div>

        {/* Requests List Preview */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="p-3.5 bg-[#161616] border border-[#2a2a2a] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface text-sm">
                    {req.clientName}
                  </span>
                  <span className="text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded">
                    {req.quantity}x {req.serviceType}
                  </span>
                </div>
                <p className="text-on-surface-variant text-[11px] font-sans mt-1 line-clamp-1">
                  {req.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-on-surface-variant/70 mt-1">
                  <span>📅 Desejado para: {formatDate(req.desiredDate)}</span>
                  {req.eventLocation && <span>📍 {req.eventLocation}</span>}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-on-surface-variant uppercase block">
                  Valor Estimado:
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {formatCurrency(req.totalEstimated)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t border-[#262626]">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] text-xs font-mono"
          >
            Analisar Mais Tarde
          </button>

          <button
            type="button"
            onClick={handleGoToRequests}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
          >
            <span>Ir para Central & Aprovar Pedidos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
