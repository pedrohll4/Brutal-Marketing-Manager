'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Film,
  Camera,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  Video,
  Plane,
  Check,
  Zap,
  TrendingUp,
  Receipt,
  ArrowUpRight,
} from 'lucide-react';
import {
  ClientServiceCatalogSection,
  ClientServiceRequestModal,
  PRESET_SERVICES,
} from '@/components/requests/ClientServiceCatalogAndModal';
import { ServiceType } from '@/lib/types';
import Link from 'next/link';

export default function ClientSolicitacoesPage() {
  const { clients, serviceRequests, addServiceRequest } = useSystemStore();
  const { user, activeClientId } = useAuth();

  // Dynamically resolve logged-in client
  const client =
    clients.find(
      (c) =>
        c.id === activeClientId ||
        c.id === user?.clientId ||
        c.email.toLowerCase() === user?.email.toLowerCase() ||
        (c.username && c.username.toLowerCase() === user?.username?.toLowerCase())
    ) || clients[0];

  const clientRequests = serviceRequests.filter((r) => r.clientId === client.id);

  // Tab State: 'CATALOG' | 'HISTORY' | 'STATS'
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'HISTORY' | 'STATS'>('CATALOG');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceType>('VIDEO');

  // Stats
  const approvedRequests = clientRequests.filter((r) => r.status === 'APPROVED');
  const pendingRequests = clientRequests.filter((r) => r.status === 'PENDING');
  const totalSpentExtras = approvedRequests.reduce((acc, r) => acc + (r.totalEstimated || 0), 0);

  const handleOpenModal = (type: ServiceType = 'VIDEO') => {
    setSelectedServiceForModal(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Header with Title and Quick Nav Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-5">
        <div>
          <span className="text-xs font-mono text-primary uppercase font-bold tracking-wider">
            Serviços Adicionais • {client.companyName}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-on-surface mt-1">
            Central de Solicitações & Extras
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Peça novas diárias, vídeos em 4K, ensaios fotográficos e cobertura de eventos com valores fixados
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#181818] border border-[#2c2c2c] rounded-xl font-mono text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CATALOG'
                ? 'bg-primary text-white shadow'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fazer Pedido</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'bg-primary text-white shadow'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Histórico ({clientRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STATS')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'STATS'
                ? 'bg-primary text-white shadow'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Extrato</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TAB 1: CATALOG & HERO ACTION (DEFAULT) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-6">
          {/* Giant Hero Banner */}
          <ClientServiceCatalogSection client={client} />

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="brutal-card p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-on-surface-variant block">
                  Em Análise
                </span>
                <strong className="text-xl font-bold font-mono text-on-surface">
                  {pendingRequests.length} solicitações
                </strong>
              </div>
            </div>

            <div className="brutal-card p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-on-surface-variant block">
                  Aprovados & Na Esteira
                </span>
                <strong className="text-xl font-bold font-mono text-on-surface">
                  {approvedRequests.length} entregas extras
                </strong>
              </div>
            </div>

            <div className="brutal-card p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30 shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-on-surface-variant block">
                  Total em Extras Aprovados
                </span>
                <strong className="text-xl font-bold font-mono text-primary">
                  {formatCurrency(totalSpentExtras)}
                </strong>
              </div>
            </div>
          </div>

          {/* Recent 3 Requests Snippet */}
          {clientRequests.length > 0 && (
            <div className="brutal-card p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-[#262626] pb-2">
                <h3 className="text-xs font-bold font-mono uppercase text-on-surface">
                  Últimos Pedidos Solicitados
                </h3>
                <button
                  onClick={() => setActiveTab('HISTORY')}
                  className="text-xs text-primary hover:underline font-mono"
                >
                  Ver todos os {clientRequests.length} →
                </button>
              </div>

              <div className="space-y-2">
                {clientRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-[#181818] border border-[#282828] rounded-lg flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div>
                      <strong className="text-on-surface">
                        {req.quantity}x {req.serviceType}
                      </strong>
                      <span className="text-on-surface-variant text-[11px] block mt-0.5 font-sans line-clamp-1">
                        {req.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-primary font-bold">
                        {formatCurrency(req.totalEstimated)}
                      </span>
                      {req.status === 'APPROVED' ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
                          Aprovado
                        </span>
                      ) : req.status === 'PENDING' ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded">
                          Pendente
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-400 bg-red-950/50 border border-red-800/40 px-2 py-0.5 rounded">
                          Recusado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TAB 2: FULL HISTORY */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-on-surface font-mono uppercase">
              Histórico de Solicitações ({clientRequests.length})
            </h3>
            <button
              onClick={() => handleOpenModal('VIDEO')}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Pedido</span>
            </button>
          </div>

          <div className="space-y-3">
            {clientRequests.length === 0 ? (
              <div className="p-12 bg-[#161616] border border-[#262626] rounded-xl text-center space-y-3 font-mono">
                <Sparkles className="w-8 h-8 text-primary mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-on-surface">Nenhuma solicitação registrada</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  Você ainda não solicitou serviços extras este mês. Clique abaixo para fazer seu primeiro pedido!
                </p>
                <button
                  onClick={() => handleOpenModal('VIDEO')}
                  className="mt-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                >
                  + Fazer Solicitação
                </button>
              </div>
            ) : (
              clientRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-[#161616] border border-[#282828] hover:border-[#3a3a3a] rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-mono transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-on-surface text-base">
                        {req.quantity}x {req.serviceType}
                      </span>
                      <span className="text-primary font-bold text-sm">
                        • {formatCurrency(req.totalEstimated)}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-xs font-sans leading-relaxed">
                      {req.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-on-surface-variant/70 pt-1">
                      <span>📅 Data solicitada: {formatDate(req.desiredDate)}</span>
                      <span>• Enviado em {req.createdAt}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {req.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Aprovado & Na Agenda
                      </span>
                    ) : req.status === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-700/60 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4" /> Em Análise pela Equipe
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/60 border border-red-700/60 px-3 py-1.5 rounded-lg">
                        <XCircle className="w-4 h-4" /> Recusado
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TAB 3: STATS & FINANCIAL SUMMARY OF EXTRAS */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'STATS' && (
        <div className="space-y-6">
          <div className="brutal-card p-6 rounded-xl space-y-6 border border-[#2a2a2a]">
            <div>
              <span className="text-xs font-mono text-primary uppercase font-bold">Extrato Consolidado</span>
              <h3 className="text-xl font-bold text-on-surface mt-0.5">
                Demonstrativo de Serviços Adicionais
              </h3>
              <p className="text-xs text-on-surface-variant font-mono mt-1">
                Acompanhe o impacto dos serviços extras contratados na sua fatura mensal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#181818] rounded-xl border border-[#282828]">
                <span className="text-[10px] text-on-surface-variant font-mono uppercase block">
                  Plano Base Mensal Fixo
                </span>
                <strong className="text-2xl font-black text-on-surface font-mono block mt-1">
                  {formatCurrency(client.monthlyFee)}
                </strong>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Inclui {client.contractedVideos} vídeos + {client.contractedPhotos} fotos
                </span>
              </div>

              <div className="p-4 bg-[#181818] rounded-xl border border-primary/40">
                <span className="text-[10px] text-primary font-mono uppercase font-bold block">
                  Total de Extras Aprovados no Mês
                </span>
                <strong className="text-2xl font-black text-primary font-mono block mt-1">
                  +{formatCurrency(totalSpentExtras)}
                </strong>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {approvedRequests.length} solicitações integradas à esteira
                </span>
              </div>
            </div>

            {/* Total Estimated Invoice */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-primary/20 via-[#181818] to-[#141414] border-2 border-primary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-primary block">
                  Fatura Total Estimada (Plano + Extras):
                </span>
                <span className="text-3xl font-black text-on-surface font-mono block mt-1">
                  {formatCurrency(client.monthlyFee + totalSpentExtras)}
                </span>
              </div>

              <Link
                href="/portal-cliente/pagamentos"
                className="px-5 py-3 bg-primary hover:bg-primary-hover text-white font-mono font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <span>Ver Faturas & PIX</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Request Modal */}
      <ClientServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={client}
        initialServiceType={selectedServiceForModal}
      />
    </div>
  );
}
