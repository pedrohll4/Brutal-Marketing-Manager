'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatCurrency } from '@/lib/utils';
import { Check, X, Clock, Sparkles, Filter, Plus, Calendar, Film, Image as ImageIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { WhatsAppShareButton } from '@/components/automations/WhatsAppShareButton';

export default function SolicitacoesPage() {
  const { clients, serviceRequests, approveServiceRequest, rejectServiceRequest, addServiceRequest } =
    useSystemStore();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({
    clientId: clients[0]?.id || '',
    serviceType: 'VIDEO' as any,
    quantity: 2,
    desiredDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  const filteredRequests = serviceRequests.filter((req) => {
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    return true;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === newRequestForm.clientId) || clients[0];
    const unitPrice =
      newRequestForm.serviceType === 'VIDEO'
        ? client.extraVideoPrice
        : newRequestForm.serviceType === 'PHOTO'
        ? client.extraPhotoPrice
        : client.extraEventPrice;

    const totalEstimated = unitPrice * newRequestForm.quantity;

    addServiceRequest({
      clientId: client.id,
      clientName: client.name,
      serviceType: newRequestForm.serviceType,
      quantity: Number(newRequestForm.quantity),
      unitPrice,
      totalEstimated,
      desiredDate: newRequestForm.desiredDate,
      description: newRequestForm.description,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
            Solicitações de Serviços Extras
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Pedidos adicionais dos clientes aguardando aprovação para entrada no fluxo de produção
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white font-semibold text-xs py-2.5 px-4 rounded flex items-center gap-1.5 shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Solicitação</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 font-mono text-xs overflow-x-auto">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded border transition-colors ${
            statusFilter === 'ALL'
              ? 'bg-primary/10 border-primary text-primary font-bold'
              : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Todas ({serviceRequests.length})
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
            statusFilter === 'PENDING'
              ? 'bg-amber-950/40 border-amber-800/40 text-amber-300 font-bold'
              : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Pendentes ({serviceRequests.filter((r) => r.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300 font-bold'
              : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Aprovadas ({serviceRequests.filter((r) => r.status === 'APPROVED').length})
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map((req) => {
          const isPending = req.status === 'PENDING';
          const isApproved = req.status === 'APPROVED';

          return (
            <div
              key={req.id}
              className={`brutal-card p-5 rounded-lg flex flex-col justify-between transition-all ${
                isPending ? 'border-amber-700/50 bg-[#161410]' : 'border-[#262626]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase flex items-center gap-1 w-fit mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      {req.quantity}x {req.serviceType}
                    </span>
                    <h3 className="font-bold text-base text-on-surface">{req.clientName}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isPending
                        ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                        : isApproved
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                        : 'text-red-400 bg-red-950/40 border-red-800/40'
                    }`}
                  >
                    {isPending ? 'Aguardando' : isApproved ? 'Aprovado' : 'Recusado'}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                  {req.description}
                </p>

                {req.eventLocation && (
                  <div className="mb-3 p-2 rounded bg-[#1f1912] border border-primary/30 text-[11px] font-mono text-primary flex flex-col gap-0.5">
                    <span className="font-bold flex items-center gap-1">
                      📍 Local: {req.eventLocation}
                    </span>
                    {(req.eventStartTime || req.eventEndTime) && (
                      <span className="text-on-surface-variant text-[10px]">
                        ⏰ Horário: {req.eventStartTime || '09:00'} às {req.eventEndTime || '18:00'}
                      </span>
                    )}
                    {req.requiresDrone && (
                      <span className="text-emerald-400 text-[10px] font-bold">
                        🚁 [Captação Aérea com Drone Solicitada]
                      </span>
                    )}
                  </div>
                )}

                <div className="p-3 bg-[#181818] border border-[#242424] rounded text-xs font-mono space-y-1.5 mb-4">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Preço Unitário:</span>
                    <span>{formatCurrency(req.unitPrice)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-on-surface pt-1 border-t border-[#222]">
                    <span>Total Estimado:</span>
                    <span className="text-primary font-mono">{formatCurrency(req.totalEstimated)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-on-surface-variant pt-1">
                    <span>Data Desejada:</span>
                    <span className="text-on-surface font-semibold">{req.desiredDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#222] flex items-center justify-between">
                <span className="text-[10px] font-mono text-on-surface-variant">
                  {req.createdAt}
                </span>

                {isPending && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => rejectServiceRequest(req.id)}
                      className="px-2.5 py-1.5 rounded bg-transparent border border-red-800/60 hover:bg-red-950/40 text-red-400 text-xs font-mono font-bold transition-colors"
                    >
                      Recusar
                    </button>
                    <button
                      onClick={() => approveServiceRequest(req.id)}
                      className="px-3 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1 transition-all shadow"
                    >
                      <Check className="w-3.5 h-3.5" /> Aprovar Extra
                    </button>
                  </div>
                )}

                {isApproved && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> No Kanban
                    </span>

                    <WhatsAppShareButton
                      trigger="EXTRA_SERVICE_APPROVED"
                      data={{
                        clientName: req.clientName,
                        serviceType: req.serviceType,
                        quantity: req.quantity,
                      }}
                      label="Avisar Cliente"
                      variant="green"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Solicitação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Solicitação de Serviço Extra"
        subtitle="Calcule o valor automaticamente e envie para aprovação"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Cliente
            </label>
            <select
              value={newRequestForm.clientId}
              onChange={(e) => setNewRequestForm({ ...newRequestForm, clientId: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#181818]">
                  {c.name} ({c.companyName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Tipo de Serviço
              </label>
              <select
                value={newRequestForm.serviceType}
                onChange={(e) =>
                  setNewRequestForm({ ...newRequestForm, serviceType: e.target.value as any })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="VIDEO">Vídeo Extra</option>
                <option value="PHOTO">Foto Extra</option>
                <option value="EVENT">Evento Extra</option>
                <option value="DAILY">Diária de Produção Extra</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                required
                value={newRequestForm.quantity}
                onChange={(e) =>
                  setNewRequestForm({ ...newRequestForm, quantity: Number(e.target.value) })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Data Desejada de Entrega
            </label>
            <input
              type="date"
              required
              value={newRequestForm.desiredDate}
              onChange={(e) =>
                setNewRequestForm({ ...newRequestForm, desiredDate: e.target.value })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Descrição / Briefing do Pedido
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explique a necessidade, referências ou detalhes do evento..."
              value={newRequestForm.description}
              onChange={(e) =>
                setNewRequestForm({ ...newRequestForm, description: e.target.value })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] text-xs font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold shadow"
            >
              Enviar Solicitação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
