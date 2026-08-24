'use client';

import React, { useState, use } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { ClientOverviewTab } from '@/components/clients/ClientOverviewTab';
import { ClientModal } from '@/components/clients/ClientModal';
import { KanbanCard } from '@/components/kanban/KanbanCard';
import { TaskModal } from '@/components/kanban/TaskModal';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { MonthlyReportView } from '@/components/reports/MonthlyReportView';
import { PixPaymentModal } from '@/components/financial/PixPaymentModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Building2,
  Phone,
  Mail,
  FileText,
  Edit,
  Trash2,
  Plus,
  QrCode,
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Task, Campaign, Invoice } from '@/lib/types';

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { clients, tasks, campaigns, calendarEvents, serviceRequests, invoices, updateClient, deleteClient } =
    useSystemStore();

  const client = clients.find((c) => c.id === resolvedParams.id) || clients[0];

  const [activeTab, setActiveTab] = useState<
    'overview' | 'campaigns' | 'production' | 'calendar' | 'requests' | 'contract' | 'financial' | 'reports'
  >('overview');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (!client) {
    return (
      <div className="p-8 text-center text-on-surface-variant font-mono">
        Cliente não encontrado. <Link href="/clientes" className="text-primary underline">Voltar</Link>
      </div>
    );
  }

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const clientCampaigns = campaigns.filter((c) => c.clientId === client.id);
  const clientEvents = calendarEvents.filter((e) => e.clientId === client.id);
  const clientRequests = serviceRequests.filter((r) => r.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'campaigns', label: `Campanhas (${clientCampaigns.length})` },
    { id: 'production', label: `Produção (${clientTasks.length})` },
    { id: 'calendar', label: `Calendário (${clientEvents.length})` },
    { id: 'requests', label: `Solicitações (${clientRequests.length})` },
    { id: 'contract', label: 'Contrato' },
    { id: 'financial', label: `Financeiro (${clientInvoices.length})` },
    { id: 'reports', label: 'Relatórios' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex justify-between items-center pb-2 border-b border-[#262626]">
        <Link
          href="/clientes"
          className="text-xs font-mono text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Todos os Clientes</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1.5 rounded bg-[#1c1b1b] border border-[#2a2a2a] hover:bg-[#252525] text-xs font-mono text-on-surface flex items-center gap-1.5 transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-primary" />
            <span>Editar Cliente</span>
          </button>
        </div>
      </div>

      {/* Client Header Info Box */}
      <div className="brutal-card p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          {client.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.logoUrl}
              alt={client.companyName}
              className="w-16 h-16 rounded-lg border border-[#2a2a2a] object-cover bg-[#1c1b1b]"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg border border-[#2a2a2a] bg-[#1c1b1b] flex items-center justify-center text-primary font-bold text-2xl">
              {client.companyName.charAt(0)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-on-surface">
                {client.companyName}
              </h2>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  client.status === 'ACTIVE'
                    ? 'text-primary bg-primary/10 border-primary/30'
                    : client.status === 'PENDING_PAYMENT'
                    ? 'text-red-400 bg-red-950/40 border-red-800/40'
                    : 'text-on-surface-variant bg-[#222] border-[#333]'
                }`}
              >
                {client.status === 'ACTIVE'
                  ? 'Ativo'
                  : client.status === 'PENDING_PAYMENT'
                  ? 'Pendente'
                  : 'Inativo'}
              </span>
            </div>

            <p className="text-xs text-on-surface-variant font-mono mt-1">
              Contato: <strong className="text-on-surface">{client.name}</strong> • Documento: {client.document}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-on-surface-variant mt-2">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" /> {client.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {client.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end text-right bg-[#181818] border border-[#262626] p-4 rounded-lg w-full md:w-auto">
          <span className="text-[10px] font-mono uppercase text-on-surface-variant">
            Plano & Faturamento
          </span>
          <span className="text-xl font-black text-primary font-mono">
            {formatCurrency(client.monthlyFee)} / mês
          </span>
          <span className="text-xs font-mono text-on-surface-variant mt-0.5">
            Cota: {client.contractedVideos} vídeos • Venc. dia {client.dueDay}
          </span>
        </div>
      </div>

      {/* 8 Tab Navigation Header */}
      <div className="flex overflow-x-auto border-b border-[#262626] gap-1 font-mono text-xs pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-t font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/10'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-[#1a1a1a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {/* 1. Visão Geral */}
        {activeTab === 'overview' && <ClientOverviewTab client={client} />}

        {/* 2. Campanhas */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-on-surface">
              Campanhas do Cliente ({clientCampaigns.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientCampaigns.map((camp) => (
                <CampaignCard key={camp.id} campaign={camp} />
              ))}
            </div>
          </div>
        )}

        {/* 3. Produção */}
        {activeTab === 'production' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-mono uppercase text-on-surface">
                Tarefas e Conteúdos Produzidos ({clientTasks.length})
              </h3>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold px-3 py-1.5 rounded flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Tarefa
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientTasks.map((t) => (
                <KanbanCard
                  key={t.id}
                  task={t}
                  onOpenTask={(task) => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  onMoveStatus={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Calendário */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-on-surface">
              Eventos e Entregas Agendadas
            </h3>
            <div className="space-y-2.5">
              {clientEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 bg-[#181818] border border-[#262626] rounded-lg flex justify-between items-center text-xs font-mono"
                >
                  <div>
                    <h4 className="font-bold text-sm text-on-surface mb-1 font-sans">{evt.title}</h4>
                    <span className="text-on-surface-variant">
                      Data: {evt.date} • {evt.startTime} às {evt.endTime} • {evt.location}
                    </span>
                  </div>
                  <span className="text-primary font-bold">{evt.eventType}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Solicitações */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-on-surface">
              Solicitações de Serviços Extras Realizadas pelo Cliente
            </h3>
            <div className="space-y-3">
              {clientRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-[#181818] border border-[#262626] rounded-lg flex justify-between items-center text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-on-surface text-sm font-sans block mb-1">
                      {req.quantity}x {req.serviceType} ({formatCurrency(req.totalEstimated)})
                    </span>
                    <p className="text-on-surface-variant font-sans text-xs">{req.description}</p>
                  </div>
                  <span className="text-emerald-400 font-bold uppercase">{req.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Contrato */}
        {activeTab === 'contract' && (
          <div className="brutal-card p-6 rounded-lg space-y-6 max-w-3xl">
            <h3 className="text-sm font-bold font-mono uppercase text-primary border-b border-[#262626] pb-2">
              Detalhes Contratuais & Tabela de Preços
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#181818] border border-[#242424] rounded">
                <span className="text-on-surface-variant uppercase block mb-1">Modelo de Contratação</span>
                <span className="font-bold text-on-surface text-sm">
                  {client.contractModel === 'QUANTITY' ? 'Por Quantidade (Vídeos Fixos)' : client.contractModel}
                </span>
              </div>

              <div className="p-3 bg-[#181818] border border-[#242424] rounded">
                <span className="text-on-surface-variant uppercase block mb-1">Valor Mensal Recorrente</span>
                <span className="font-bold text-primary text-sm font-mono">
                  {formatCurrency(client.monthlyFee)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#181818] border border-[#262626] rounded-lg">
              <h4 className="font-bold text-xs font-mono uppercase text-on-surface mb-3">
                Valores Definidos para Itens Extras
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-on-surface-variant block">Vídeo Extra:</span>
                  <strong className="text-on-surface">{formatCurrency(client.extraVideoPrice || 150)}</strong>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Foto Extra:</span>
                  <strong className="text-on-surface">{formatCurrency(client.extraPhotoPrice || 80)}</strong>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Evento Extra:</span>
                  <strong className="text-on-surface">{formatCurrency(client.extraEventPrice || 500)}</strong>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Diária Extra:</span>
                  <strong className="text-on-surface">{formatCurrency(client.extraDailyPrice || 300)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Financeiro */}
        {activeTab === 'financial' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-on-surface">
              Histórico de Faturas do Cliente
            </h3>
            <div className="space-y-3">
              {clientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 bg-[#181818] border border-[#262626] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-mono"
                >
                  <div>
                    <h4 className="font-bold text-on-surface text-sm font-sans">
                      Fatura de 08/2026 • #{inv.id}
                    </h4>
                    <span className="text-on-surface-variant">
                      Base: {formatCurrency(inv.baseAmount)} + Extras: {formatCurrency(inv.extrasAmount)} • Venc: {formatDate(inv.dueDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-primary font-mono">
                      {formatCurrency(inv.totalAmount)}
                    </span>
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 flex items-center gap-1 text-xs transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" /> PIX
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Relatórios */}
        {activeTab === 'reports' && <MonthlyReportView clientId={client.id} />}
      </div>

      {/* Edit Modal */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => updateClient(client.id, data)}
        clientToEdit={client}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={selectedTask}
      />

      {/* PIX Modal */}
      <PixPaymentModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
