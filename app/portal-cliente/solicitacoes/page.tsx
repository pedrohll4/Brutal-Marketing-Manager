'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function ClientSolicitacoesPage() {
  const { clients, serviceRequests, addServiceRequest } = useSystemStore();
  const client = clients.find((c) => c.id === 'cli-procampo') || clients[0];

  const clientRequests = serviceRequests.filter((r) => r.clientId === client.id);

  const [form, setForm] = useState({
    serviceType: 'VIDEO' as any,
    quantity: 1,
    desiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
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

  const calculatedTotal = getUnitPrice(form.serviceType) * form.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceRequest({
      clientId: client.id,
      clientName: client.name,
      serviceType: form.serviceType,
      quantity: Number(form.quantity),
      unitPrice: getUnitPrice(form.serviceType),
      totalEstimated: calculatedTotal,
      desiredDate: form.desiredDate,
      description: form.description,
    });
    setForm({
      serviceType: 'VIDEO',
      quantity: 1,
      desiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      description: '',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Solicitações de Serviços Extras</h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Solicite vídeos, fotos ou coberturas adicionais fora da cota contratada
        </p>
      </div>

      {/* Form Card */}
      <div className="brutal-card p-6 rounded-lg">
        <h3 className="text-sm font-bold font-mono uppercase text-primary mb-4 pb-2 border-b border-[#262626] flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Nova Solicitação de Extra
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Tipo de Serviço
              </label>
              <select
                value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value as any })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="VIDEO">Vídeo Extra (R$ {client.extraVideoPrice || 150})</option>
                <option value="PHOTO">Foto Extra (R$ {client.extraPhotoPrice || 80})</option>
                <option value="EVENT">Cobertura de Evento (R$ {client.extraEventPrice || 500})</option>
                <option value="DAILY">Diária de Produção (R$ {client.extraDailyPrice || 300})</option>
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
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
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
              value={form.desiredDate}
              onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          {/* Pricing preview */}
          <div className="p-3 bg-[#181818] border border-primary/30 rounded flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase block">
                Valor por unidade:
              </span>
              <span className="text-xs text-on-surface">
                {formatCurrency(getUnitPrice(form.serviceType))}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-primary uppercase block font-bold">
                Total Estimado do Extra:
              </span>
              <span className="text-xl font-black text-primary">
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
              placeholder="Explique os objetivos, tom de voz, referências visuais ou formato desejado..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3 rounded transition-all shadow"
          >
            Enviar Pedido para Aprovação
          </button>
        </form>
      </div>

      {/* History */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-on-surface font-mono uppercase">
          Histórico de Solicitações ({clientRequests.length})
        </h3>

        <div className="space-y-3">
          {clientRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 bg-[#181818] border border-[#262626] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-on-surface font-mono">
                    {req.quantity}x {req.serviceType}
                  </span>
                  <span className="text-primary font-mono font-bold">
                    ({formatCurrency(req.totalEstimated)})
                  </span>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  {req.description}
                </p>
                <span className="text-[10px] font-mono text-on-surface-variant/60 block mt-1">
                  Solicitado em {req.createdAt} • Previsão: {req.desiredDate}
                </span>
              </div>

              <div className="shrink-0">
                {req.status === 'APPROVED' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado & Em Produção
                  </span>
                ) : req.status === 'PENDING' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded">
                    <Clock className="w-3.5 h-3.5" /> Aguardando Aprovação
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-2.5 py-1 rounded">
                    <XCircle className="w-3.5 h-3.5" /> Recusado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
