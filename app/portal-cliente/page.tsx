'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { calculateClientQuotas } from '@/lib/services/contractService';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PixPaymentModal } from '@/components/financial/PixPaymentModal';
import { Modal } from '@/components/ui/Modal';
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
} from 'lucide-react';
import Link from 'next/link';

export default function ClientPortalDashboard() {
  const { clients, tasks, invoices, serviceRequests, addServiceRequest } = useSystemStore();

  // Active client: Nicole Procampo
  const client = clients.find((c) => c.id === 'cli-procampo') || clients[0];
  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const currentInvoice = clientInvoices[0] || null;

  const approvedRequests = serviceRequests.filter(
    (r) => r.clientId === client.id && r.status === 'APPROVED'
  );

  const quotas = calculateClientQuotas(client, clientTasks, approvedRequests);

  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // New Request Form
  const [requestForm, setRequestForm] = useState({
    serviceType: 'VIDEO' as any,
    quantity: 3,
    desiredDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    description: '',
  });

  const getUnitPrice = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return client.extraVideoPrice || 150;
      case 'PHOTO':
        return client.extraPhotoPrice || 80;
      case 'EVENT':
        return client.extraEventPrice || 500;
      case 'DAILY':
        return client.extraDailyPrice || 300;
      default:
        return 150;
    }
  };

  const calculatedTotal = getUnitPrice(requestForm.serviceType) * requestForm.quantity;

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceRequest({
      clientId: client.id,
      clientName: client.name,
      serviceType: requestForm.serviceType,
      quantity: Number(requestForm.quantity),
      unitPrice: getUnitPrice(requestForm.serviceType),
      totalEstimated: calculatedTotal,
      desiredDate: requestForm.desiredDate,
      description: requestForm.description,
    });
    setIsRequestModalOpen(false);
    setRequestForm({
      serviceType: 'VIDEO',
      quantity: 3,
      desiredDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      description: '',
    });
  };

  // Recent delivered and upcoming tasks
  const deliveredTasks = clientTasks.filter((t) =>
    ['APPROVED', 'PUBLISHED'].includes(t.status)
  );
  const upcomingTasks = clientTasks.filter(
    (t) => !['APPROVED', 'PUBLISHED'].includes(t.status)
  );

  return (
    <div className="space-y-8">
      {/* Client Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-xs font-mono text-primary uppercase font-bold tracking-wider">
            Portal do Cliente • {client.companyName}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface mt-1">
            Olá, {client.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Veja o andamento da sua produção e solicite novos conteúdos com facilidade.
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3 px-5 rounded flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Solicitar novo serviço</span>
        </button>
      </div>

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
              <span>100%</span>
            </div>
            <div className="w-full bg-[#201f1f] h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-full" />
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
                Valor Total de Agosto
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
            className="mt-3 w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all shadow"
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
                Total de {deliveredTasks.length} conteúdos finalizados em Agosto
              </p>
            </div>
            <Link
              href="/portal-cliente/entregas"
              className="text-xs text-primary hover:underline font-mono"
            >
              Ver todos →
            </Link>
          </div>

          <div className="space-y-2.5">
            {deliveredTasks.slice(0, 6).map((t, idx) => (
              <div
                key={t.id}
                className="p-3 bg-[#181818] border border-[#242424] rounded flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-mono shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-on-surface truncate">{t.title}</h4>
                    <span className="text-[10px] font-mono text-on-surface-variant">
                      Entregue em {formatDate(t.dueDate)} • {t.taskType}
                    </span>
                  </div>
                </div>

                {t.isExtra ? (
                  <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded uppercase shrink-0">
                    Extra Solicitado
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded uppercase shrink-0">
                    Cota Mensal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Statement Breakdown */}
        <div className="brutal-card p-6 rounded-lg space-y-4">
          <h3 className="text-base font-bold text-on-surface pb-3 border-b border-[#262626]">
            Resumo do Contrato
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-[#222]">
              <span className="text-on-surface-variant">Plano Mensal (12 vídeos):</span>
              <span className="font-bold text-on-surface">{formatCurrency(quotas.baseMonthlyFee)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#222]">
              <span className="text-primary font-semibold">3 Vídeos Extras (@ R$ 150):</span>
              <span className="font-bold text-primary">+{formatCurrency(quotas.totalExtrasCost)}</span>
            </div>

            <div className="flex justify-between py-2 font-bold text-sm bg-[#1a1a1a] p-2 rounded">
              <span>Total de Agosto:</span>
              <span className="text-primary font-mono">{formatCurrency(quotas.grandTotalCost)}</span>
            </div>

            <div className="pt-2 text-[11px] text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface block mb-1">Regra de Extras:</span>
              Os vídeos solicitados além dos 12 contratados são calculados a R$ 150/unidade e adicionados à sua fatura mensal.
            </div>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#333] text-on-surface text-xs font-mono font-bold py-2.5 rounded transition-all mt-2"
            >
              + Solicitar Mais Vídeos
            </button>
          </div>
        </div>
      </div>

      {/* Modal Solicitação de Serviço Extra */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Solicitar Novo Serviço Extra"
        subtitle={`Cliente: ${client.companyName} • Cálculo de valor automático`}
      >
        <form onSubmit={handleSendRequest} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Tipo de Conteúdo / Serviço
            </label>
            <select
              value={requestForm.serviceType}
              onChange={(e) =>
                setRequestForm({ ...requestForm, serviceType: e.target.value as any })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="VIDEO">Vídeo Extra (R$ {client.extraVideoPrice || 150}/unid)</option>
              <option value="PHOTO">Foto Extra (R$ {client.extraPhotoPrice || 80}/unid)</option>
              <option value="EVENT">Cobertura de Evento (R$ {client.extraEventPrice || 500})</option>
              <option value="DAILY">Diária de Produção (R$ {client.extraDailyPrice || 300})</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                required
                value={requestForm.quantity}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, quantity: Number(e.target.value) })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Data Desejada
              </label>
              <input
                type="date"
                required
                value={requestForm.desiredDate}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, desiredDate: e.target.value })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Automatic Calculation Preview */}
          <div className="p-3 rounded bg-[#181818] border border-primary/30 flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase block">
                Cálculo Estimado:
              </span>
              <span className="text-xs text-on-surface">
                {requestForm.quantity}x de {formatCurrency(getUnitPrice(requestForm.serviceType))}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-primary uppercase block font-bold">
                Valor Total Extra:
              </span>
              <span className="text-lg font-black text-primary">
                {formatCurrency(calculatedTotal)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Descrição / Briefing do Pedido
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explique o tema do vídeo, objetivo e onde será veiculado..."
              value={requestForm.description}
              onChange={(e) =>
                setRequestForm({ ...requestForm, description: e.target.value })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface text-xs font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold shadow"
            >
              Enviar para Aprovação
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal PIX */}
      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        invoice={currentInvoice}
      />
    </div>
  );
}
