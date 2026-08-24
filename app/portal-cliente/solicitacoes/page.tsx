'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
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
} from 'lucide-react';

export default function ClientSolicitacoesPage() {
  const { clients, serviceRequests, addServiceRequest } = useSystemStore();
  const client = clients.find((c) => c.id === 'cli-procampo') || clients[0];

  const clientRequests = serviceRequests.filter((r) => r.clientId === client.id);

  // Selected Service Template
  const [selectedService, setSelectedService] = useState<'VIDEO' | 'PHOTO' | 'EVENT' | 'DAILY' | 'OTHER'>('EVENT');

  // Form Fields
  const [form, setForm] = useState({
    quantity: 1,
    desiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    description: '',
    // Event specific fields
    eventName: 'Feira Agrishow 2026 - Estande Procampo',
    eventLocation: 'Rod. Prefeito Antônio Duarte Nogueira, Km 319 - Ribeirão Preto / SP',
    eventStartTime: '08:30',
    eventEndTime: '18:00',
    requiresDrone: true,
    // Video specific
    videoFormat: 'Reels / TikTok (9:16) + Comercial 4K',
    // Photo specific
    photoType: 'Fotos de Estande, Clientes e Diretoria',
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

  const unitPrice = getUnitPrice(selectedService);
  const calculatedTotal = unitPrice * form.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let fullDescription = form.description;
    if (selectedService === 'EVENT') {
      fullDescription = `[Evento: ${form.eventName}] ${form.description} | Local: ${form.eventLocation} | Horário: ${form.eventStartTime} às ${form.eventEndTime} ${form.requiresDrone ? '| [Requer Drone]' : ''}`;
    } else if (selectedService === 'VIDEO') {
      fullDescription = `[Formato: ${form.videoFormat}] ${form.description}`;
    } else if (selectedService === 'PHOTO') {
      fullDescription = `[Tipo: ${form.photoType}] ${form.description}`;
    }

    addServiceRequest({
      clientId: client.id,
      clientName: client.name,
      serviceType: selectedService,
      quantity: Number(form.quantity),
      unitPrice,
      totalEstimated: calculatedTotal,
      desiredDate: form.desiredDate,
      description: fullDescription,
      eventLocation: selectedService === 'EVENT' ? form.eventLocation : undefined,
      eventStartTime: selectedService === 'EVENT' ? form.eventStartTime : undefined,
      eventEndTime: selectedService === 'EVENT' ? form.eventEndTime : undefined,
      requiresDrone: selectedService === 'EVENT' ? form.requiresDrone : undefined,
      videoFormat: selectedService === 'VIDEO' ? form.videoFormat : undefined,
      photoType: selectedService === 'PHOTO' ? form.photoType : undefined,
    });

    setForm({
      quantity: 1,
      desiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      description: '',
      eventName: '',
      eventLocation: '',
      eventStartTime: '08:30',
      eventEndTime: '18:00',
      requiresDrone: false,
      videoFormat: 'Reels / TikTok (9:16)',
      photoType: 'Fotos de Produto / Retratos',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">
          Solicitar Serviço Extra / Cobertura
        </h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Peça novos vídeos, ensaios fotográficos, coberturas presenciais de eventos ou diárias extras
        </p>
      </div>

      {/* Service Type Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Option 1: Evento */}
        <div
          onClick={() => {
            setSelectedService('EVENT');
            setForm((prev) => ({
              ...prev,
              quantity: 1,
              eventName: 'Inauguração Nova Filial ou Feira',
              eventLocation: 'Ribeirão Preto / SP',
            }));
          }}
          className={`brutal-card p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
            selectedService === 'EVENT'
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
              : 'hover:border-[#353534]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-primary uppercase font-bold">Presencial</span>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface">Cobertura de Evento</h3>
            <p className="text-[11px] font-mono text-on-surface-variant mt-1">
              A partir de <strong className="text-primary">{formatCurrency(client.extraEventPrice || 500)}</strong>
            </p>
          </div>
        </div>

        {/* Option 2: Vídeo */}
        <div
          onClick={() => {
            setSelectedService('VIDEO');
            setForm((prev) => ({ ...prev, quantity: 1 }));
          }}
          className={`brutal-card p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
            selectedService === 'VIDEO'
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
              : 'hover:border-[#353534]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-primary uppercase font-bold">Vídeo</span>
            <Film className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface">Vídeo Extra</h3>
            <p className="text-[11px] font-mono text-on-surface-variant mt-1">
              <strong className="text-primary">{formatCurrency(client.extraVideoPrice || 150)}</strong> / vídeo
            </p>
          </div>
        </div>

        {/* Option 3: Foto */}
        <div
          onClick={() => {
            setSelectedService('PHOTO');
            setForm((prev) => ({ ...prev, quantity: 10 }));
          }}
          className={`brutal-card p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
            selectedService === 'PHOTO'
              ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
              : 'hover:border-[#353534]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Fotos</span>
            <Camera className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface">Ensaio Fotográfico</h3>
            <p className="text-[11px] font-mono text-on-surface-variant mt-1">
              <strong className="text-emerald-400">{formatCurrency(client.extraPhotoPrice || 80)}</strong> / foto
            </p>
          </div>
        </div>

        {/* Option 4: Diária de Produção */}
        <div
          onClick={() => {
            setSelectedService('DAILY');
            setForm((prev) => ({ ...prev, quantity: 1 }));
          }}
          className={`brutal-card p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
            selectedService === 'DAILY'
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
              : 'hover:border-[#353534]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-primary uppercase font-bold">Equipe</span>
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface">Diária de Gravação</h3>
            <p className="text-[11px] font-mono text-on-surface-variant mt-1">
              <strong className="text-primary">{formatCurrency(client.extraDailyPrice || 300)}</strong> / diária
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <div className="brutal-card p-6 rounded-lg space-y-6">
        <div className="border-b border-[#262626] pb-3 flex justify-between items-center">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>
              {selectedService === 'EVENT'
                ? 'Detalhes da Cobertura de Evento Presencial'
                : selectedService === 'VIDEO'
                ? 'Especificações do Vídeo Extra'
                : selectedService === 'PHOTO'
                ? 'Especificações do Ensaio Fotográfico'
                : 'Solicitação de Diária de Equipe'}
            </span>
          </h3>

          <span className="text-xs font-mono text-primary font-bold">
            Tabela Especial: {client.companyName}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* ========================================================================= */}
          {/* EVENT-SPECIFIC FIELDS */}
          {/* ========================================================================= */}
          {selectedService === 'EVENT' && (
            <div className="space-y-4 p-4 rounded-lg bg-[#161410] border border-primary/30 animate-in fade-in">
              <div>
                <label className="block text-xs font-mono uppercase text-primary font-bold mb-1">
                  Nome do Evento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Feira Agrishow 2026 / Dia de Campo Procampo / Inauguração"
                  value={form.eventName}
                  onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Localização / Endereço Completo do Evento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rod. Prefeito Antônio Duarte Nogueira, Km 319 - Ribeirão Preto / SP"
                  value={form.eventLocation}
                  onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                    Horário de Início da Cobertura
                  </label>
                  <input
                    type="time"
                    required
                    value={form.eventStartTime}
                    onChange={(e) => setForm({ ...form, eventStartTime: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                    Horário Previsto de Término
                  </label>
                  <input
                    type="time"
                    required
                    value={form.eventEndTime}
                    onChange={(e) => setForm({ ...form, eventEndTime: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#141414] border border-[#262626] rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="droneCheck"
                    checked={form.requiresDrone}
                    onChange={(e) => setForm({ ...form, requiresDrone: e.target.checked })}
                    className="rounded text-primary focus:ring-primary bg-[#1a1a1a] border-[#333] cursor-pointer w-4 h-4"
                  />
                  <label htmlFor="droneCheck" className="text-xs text-on-surface font-semibold cursor-pointer flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-primary" />
                    Necessita de Captação Aérea com Drone?
                  </label>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant uppercase">Incluído no pacote</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIDEO-SPECIFIC FIELDS */}
          {/* ========================================================================= */}
          {selectedService === 'VIDEO' && (
            <div className="space-y-4 p-4 rounded-lg bg-[#181818] border border-[#262626] animate-in fade-in">
              <div>
                <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                  Formato Desejado do Vídeo
                </label>
                <select
                  value={form.videoFormat}
                  onChange={(e) => setForm({ ...form, videoFormat: e.target.value })}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="Reels / TikTok / Shorts (Vertical 9:16)">Reels / TikTok / Shorts (Vertical 9:16)</option>
                  <option value="Vídeo Institucional / YouTube (Horizontal 16:9)">Vídeo Institucional / YouTube (Horizontal 16:9)</option>
                  <option value="Depoimento de Cliente / Produtor Rural">Depoimento de Cliente / Produtor Rural</option>
                  <option value="Comercial de TV / Painel LED (4K UHD)">Comercial de TV / Painel LED (4K UHD)</option>
                </select>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PHOTO-SPECIFIC FIELDS */}
          {/* ========================================================================= */}
          {selectedService === 'PHOTO' && (
            <div className="space-y-4 p-4 rounded-lg bg-[#101814] border border-emerald-800/40 animate-in fade-in">
              <div>
                <label className="block text-xs font-mono uppercase text-emerald-400 font-bold mb-1">
                  Tipo de Ensaio / Fotografias
                </label>
                <select
                  value={form.photoType}
                  onChange={(e) => setForm({ ...form, photoType: e.target.value })}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="Fotos de Produtos / Catálogo em Estúdio">Fotos de Produtos / Catálogo em Estúdio</option>
                  <option value="Retratos Corporativos da Diretoria & Equipe">Retratos Corporativos da Diretoria & Equipe</option>
                  <option value="Fotografia em Campo / Fazendas e Lavouras">Fotografia em Campo / Fazendas e Lavouras</option>
                  <option value="Cobertura Fotográfica de Lançamento">Cobertura Fotográfica de Lançamento</option>
                </select>
              </div>
            </div>
          )}

          {/* Quantity and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                {selectedService === 'EVENT'
                  ? 'Qtd. de Dias do Evento'
                  : selectedService === 'PHOTO'
                  ? 'Qtd. de Fotos Tratadas'
                  : selectedService === 'DAILY'
                  ? 'Qtd. de Diárias'
                  : 'Qtd. de Vídeos'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Data do Evento / Entrega Desejada
              </label>
              <input
                type="date"
                required
                value={form.desiredDate}
                onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Briefing / Observações da Solicitação
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explique os pontos mais importantes, cronograma ou pessoas que devem ser gravadas/fotografadas..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          {/* Pricing Summary Box */}
          <div className="p-4 rounded bg-[#181818] border border-primary/40 flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-mono">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase block">
                Cálculo do Investimento Extra:
              </span>
              <span className="text-xs text-on-surface">
                {form.quantity}x de {formatCurrency(unitPrice)}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-primary uppercase font-bold block">
                Valor Total Estimado:
              </span>
              <span className="text-2xl font-black text-primary">
                {formatCurrency(calculatedTotal)}
              </span>
              <span className="text-[9px] text-on-surface-variant block">
                (Faturado no fechamento mensal do contrato)
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-black text-xs py-3.5 rounded flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Solicitação para a Equipe Brutal</span>
          </button>
        </form>
      </div>

      {/* History of Requests */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-on-surface font-mono uppercase">
          Minhas Solicitações Registradas ({clientRequests.length})
        </h3>

        <div className="space-y-3">
          {clientRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 bg-[#181818] border border-[#262626] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1 font-mono">
                  <span className="font-bold text-on-surface text-sm">
                    {req.quantity}x {req.serviceType}
                  </span>
                  <span className="text-primary font-bold">
                    ({formatCurrency(req.totalEstimated)})
                  </span>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  {req.description}
                </p>
                <span className="text-[10px] font-mono text-on-surface-variant/60 block mt-1">
                  Solicitado em {req.createdAt} • Data Desejada: {formatDate(req.desiredDate)}
                </span>
              </div>

              <div className="shrink-0">
                {req.status === 'APPROVED' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado & Na Agenda
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
