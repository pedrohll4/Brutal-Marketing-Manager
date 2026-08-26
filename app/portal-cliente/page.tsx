'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { calculateClientQuotas } from '@/lib/services/contractService';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PixPaymentModal } from '@/components/financial/PixPaymentModal';
import { MediaApprovalModal } from '@/components/approvals/MediaApprovalModal';
import {
  Film,
  Sparkles,
  CheckCircle2,
  Calendar,
  CreditCard,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Play,
  Eye,
  AlertCircle,
  Check,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { ClientServiceCatalogSection } from '@/components/requests/ClientServiceCatalogAndModal';
import { isTaskForClient } from '@/lib/utils/clientMatcher';
import { Task } from '@/lib/types';

export default function ClientPortalDashboard() {
  const { clients, tasks, invoices, serviceRequests } = useSystemStore();
  const { user, activeClientId } = useAuth();

  // Dynamically resolve logged-in client
  const client =
    clients.find(
      (c) =>
        c.id === activeClientId ||
        c.id === user?.clientId ||
        c.email.toLowerCase() === (user?.email || '').toLowerCase() ||
        (c.username && c.username.toLowerCase() === (user?.username || '').toLowerCase()) ||
        (c.name.toLowerCase().includes('procampo') && (user?.email || '').includes('procampo'))
    ) || clients[0];

  // Match all tasks for this client (robust matcher)
  const clientTasks = tasks.filter((t) => isTaskForClient(t, client, user));

  // Invoices for client
  const clientInvoices = invoices.filter((i) =>
    i.clientId === client?.id ||
    (client?.name && i.clientName.toLowerCase().includes(client.name.toLowerCase().split(' ')[0])) ||
    (user?.email?.includes('procampo') && i.clientName.toLowerCase().includes('procampo'))
  );
  const currentInvoice = clientInvoices[0] || null;

  // Requests
  const approvedRequests = serviceRequests.filter(
    (r) =>
      r.status === 'APPROVED' &&
      (r.clientId === client.id ||
        (client.name && r.clientName.toLowerCase().includes(client.name.toLowerCase().split(' ')[0])) ||
        (user?.email?.includes('procampo') && r.clientName.toLowerCase().includes('procampo')))
  );

  const quotas = calculateClientQuotas(client, clientTasks, approvedRequests);

  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);

  // Group tasks by operational status
  const pendingReviewTasks = clientTasks.filter((t) =>
    ['CLIENT_REVIEW', 'IN_REVIEW'].includes(t.status)
  );
  const inProductionTasks = clientTasks.filter((t) =>
    ['IN_PRODUCTION', 'PLANNED', 'BACKLOG'].includes(t.status)
  );
  const deliveredTasks = clientTasks.filter((t) =>
    ['APPROVED', 'PUBLISHED'].includes(t.status)
  );

  return (
    <div className="space-y-7">
      {/* Client Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <span className="text-xs font-mono text-primary uppercase font-bold tracking-wider">
            Portal do Cliente • {client.companyName}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface mt-1">
            Olá, {client.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Acompanhe o andamento da sua esteira audiovisual e solicite serviços extras com 1 toque.
          </p>
        </div>
      </div>

      {/* 🚀 1. Giant Mega Hero Button & Pre-Options Catalog */}
      <ClientServiceCatalogSection client={client} />

      {/* 🚨 2. URGENT REVIEW BANNER (If tasks are waiting for client approval) */}
      {pendingReviewTasks.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#1e1710] to-[#161616] border-2 border-amber-500/70 p-5 sm:p-6 shadow-[0_10px_35px_rgba(245,158,11,0.2)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shrink-0 animate-pulse">
                <AlertCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-300 tracking-tight">
                  {pendingReviewTasks.length === 1
                    ? '1 Vídeo Pronto Aguardando Sua Aprovação!'
                    : `${pendingReviewTasks.length} Vídeos Prontos Aguardando Sua Aprovação!`}
                </h3>
                <p className="text-xs text-amber-200/80 font-mono">
                  Assista ao pré-corte com comentários por segundo e aprove com 1 clique para publicação
                </p>
              </div>
            </div>

            <Link
              href="/portal-cliente/entregas"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs rounded-lg uppercase tracking-wider transition-all self-start sm:self-auto shadow"
            >
              Ver Todos ({pendingReviewTasks.length}) →
            </Link>
          </div>

          {/* Cards for Pending Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingReviewTasks.map((t) => (
              <div
                key={t.id}
                className="bg-[#141414]/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-amber-400 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Aguardando Seu Aceite
                    </span>
                    {t.isExtra && (
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/20 border border-primary/40 px-2 py-0.5 rounded-full uppercase">
                        Extra Solicitado
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">
                    {t.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant font-sans line-clamp-2 mt-1">
                    {t.description || 'Vídeo finalizado pela equipe de edição. Pronto para sua revisão!'}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#262626] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-zinc-400">
                    Prazo: {formatDate(t.dueDate)}
                  </span>

                  <button
                    onClick={() => setSelectedTaskForReview(t)}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-500 text-white font-mono font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Revisar & Aprovar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Quotas Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Conteúdos Contratados */}
        <div className="brutal-card p-5 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono text-on-surface-variant uppercase">
              Vídeos Contratados
            </span>
            <Film className="w-4 h-4 text-primary" />
          </div>
          <span className="text-2xl font-black text-on-surface font-mono">
            {quotas.contractedVideos} vídeos
          </span>
          <p className="text-[11px] text-on-surface-variant font-mono mt-1">
            Cota mensal fixa do plano
          </p>
        </div>

        {/* Card 2: Conteúdos Entregues (100% used) */}
        <div className="brutal-card p-5 rounded-lg border-primary/40 bg-primary/5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono text-primary uppercase font-bold">
              Vídeos Entregues
            </span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-2xl font-black text-on-surface font-mono">
            {quotas.usedVideos} vídeos
          </span>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] font-mono text-primary font-bold mb-1">
              <span>{quotas.usedVideos} / {quotas.contractedVideos} utilizados</span>
              <span>{quotas.percentageUsed}%</span>
            </div>
            <div className="w-full bg-[#201f1f] h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${quotas.percentageUsed}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Extras Solicitados (+3 extras) */}
        <div className="brutal-card p-5 rounded-lg bg-[#181818] border-[#333]">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono text-amber-400 uppercase font-bold">
              Extras no Mês
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-on-surface font-mono">
            +{quotas.extraVideos} vídeos
          </span>
          <p className="text-[11px] text-on-surface-variant font-mono mt-1">
            Adicional calculado: <strong className="text-primary font-mono">{formatCurrency(quotas.totalExtrasCost)}</strong>
          </p>
        </div>

        {/* Card 4: Fatura do Mês & Botão Pagar */}
        <div className="brutal-card p-5 rounded-lg bg-[#161616] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-on-surface-variant uppercase">
                Fatura de {new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())}
              </span>
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-2xl font-black text-primary font-mono block">
              {formatCurrency(quotas.grandTotalCost)}
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant block mt-0.5">
              (Plano: {formatCurrency(quotas.baseMonthlyFee)} + Extras: {formatCurrency(quotas.totalExtrasCost)})
            </span>
          </div>

          <button
            onClick={() => setIsPixModalOpen(true)}
            className="mt-3 w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow"
          >
            <span>Pagar agora (PIX)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Production List and Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Entregas Realizadas */}
        <div className="lg:col-span-2 brutal-card p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#262626]">
            <div>
              <h3 className="text-base font-bold text-on-surface">Vídeos e Conteúdos Produzidos</h3>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                Total de {clientTasks.length} conteúdos na sua esteira de produção
              </p>
            </div>
            <Link
              href="/portal-cliente/entregas"
              className="text-xs text-primary hover:underline font-mono"
            >
              Ver todos ({clientTasks.length}) →
            </Link>
          </div>

          <div className="space-y-2.5">
            {clientTasks.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-on-surface-variant">
                Nenhum conteúdo registrado para o cliente no momento.
              </div>
            ) : (
              clientTasks.slice(0, 8).map((t, idx) => {
                const isApproved = ['APPROVED', 'PUBLISHED'].includes(t.status);
                const isReview = ['CLIENT_REVIEW', 'IN_REVIEW'].includes(t.status);

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskForReview(t)}
                    className="p-3 bg-[#181818] hover:bg-[#202020] border border-[#242424] hover:border-primary/50 rounded-lg flex items-center justify-between gap-3 text-xs cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-mono shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-on-surface truncate">{t.title}</h4>
                        <span className="text-[10px] font-mono text-on-surface-variant">
                          {formatDate(t.dueDate)} • {t.taskType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {t.isExtra && (
                        <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded uppercase">
                          Extra
                        </span>
                      )}

                      {isApproved ? (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <Check className="w-3 h-3" /> Aprovado
                        </span>
                      ) : isReview ? (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded uppercase flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3" /> Revisar
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-zinc-400 bg-[#222] border border-[#333] px-2 py-0.5 rounded uppercase">
                          Em Produção
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Statement Breakdown */}
        <div className="brutal-card p-6 rounded-lg space-y-4">
          <h3 className="text-base font-bold text-on-surface pb-3 border-b border-[#262626]">
            Resumo do Contrato
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-[#222]">
              <span className="text-on-surface-variant">Plano Mensal ({client.contractedVideos} vídeos):</span>
              <span className="font-bold text-on-surface">{formatCurrency(quotas.baseMonthlyFee)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#222]">
              <span className="text-primary font-semibold">{quotas.extraVideos} Vídeos Extras (@ R$ {client.extraVideoPrice || 150}):</span>
              <span className="font-bold text-primary">+{formatCurrency(quotas.totalExtrasCost)}</span>
            </div>

            <div className="flex justify-between py-2 font-bold text-sm bg-[#1a1a1a] p-2 rounded">
              <span>Total Estimado:</span>
              <span className="text-primary font-mono">{formatCurrency(quotas.grandTotalCost)}</span>
            </div>

            <div className="pt-2 text-[11px] text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface block mb-1">Regra de Extras:</span>
              Os vídeos solicitados além dos {client.contractedVideos} contratados são calculados a R$ {client.extraVideoPrice || 150}/unidade e adicionados à sua fatura mensal.
            </div>

            <Link
              href="/portal-cliente/solicitacoes"
              className="block text-center w-full bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#333] text-on-surface text-xs font-mono font-bold py-2.5 rounded transition-all mt-2"
            >
              + Solicitar Mais Vídeos
            </Link>
          </div>
        </div>
      </div>

      {/* Media Approval Modal for reviewing videos */}
      <MediaApprovalModal
        isOpen={Boolean(selectedTaskForReview)}
        onClose={() => setSelectedTaskForReview(null)}
        task={selectedTaskForReview}
      />

      {/* Pix Payment Modal */}
      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        invoice={currentInvoice}
      />
    </div>
  );
}
