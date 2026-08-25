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
} from 'lucide-react';

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

  // Selected Service Template
  const [selectedService, setSelectedService] = useState<'VIDEO' | 'PHOTO' | 'EVENT' | 'DAILY' | 'OTHER'>('EVENT');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    quantity: 1,
    desiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    description: '',
    // Event specific fields
    eventName: '',
    eventLocation: '',
    eventStartTime: '08:30',
    eventEndTime: '18:00',
    requiresDrone: false,
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
      fullDescription = `[Evento: ${form.eventName || 'Cobertura de Evento'}] ${form.description} | Local: ${form.eventLocation || 'A definir'} | Horário: ${form.eventStartTime} às ${form.eventEndTime} ${form.requiresDrone ? '| [Requer Drone]' : ''}`;
    } else if (selectedService === 'VIDEO') {
      fullDescription = `[Formato: ${form.videoFormat}] ${form.description}`;
    } else if (selectedService === 'PHOTO') {
      fullDescription = `[Tipo: ${form.photoType}] ${form.description}`;
    }

    addServiceRequest({
      clientId: client.id,
      clientName: client.companyName || client.name,
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

    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 6000);

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
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">
          Solicitar Serviços Extras & Cobertura de Eventos
        </h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Peça gravações extras, ensaios fotográficos, vídeos ou cobertura com drone diretamente para a equipe Brutal
        </p>
      </div>

      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/60 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 bg-emerald-600 text-white rounded-lg">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-300">Solicitação Enviada com Sucesso!</h4>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">
              Seu pedido foi registrado em nossa esteira e nossa equipe foi notificada para análise.
            </p>
          </div>
        </div>
      )}

      {/* Main Request Form */}
      <div className="brutal-card p-6 rounded-xl space-y-6 border border-[#262626]">
        <div>
          <h3 className="text-sm font-bold font-mono uppercase text-primary border-b border-[#262626] pb-2">
            1. Selecione o Tipo de Serviço Desejado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
            {/* Option: Event */}
            <button
              type="button"
              onClick={() => setSelectedService('EVENT')}
              className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all ${
                selectedService === 'EVENT'
                  ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                  : 'bg-[#181818] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <div>
                <Calendar className={`w-6 h-6 mb-2 ${selectedService === 'EVENT' ? 'text-primary' : 'text-on-surface-variant'}`} />
                <strong className="block text-sm text-on-surface">Cobertura de Evento</strong>
                <span className="text-[11px] text-on-surface-variant font-mono block mt-1">
                  Gravações em feiras, lançamentos, estandes e drone
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-primary mt-3 block">
                {formatCurrency(client.extraEventPrice || 500)} / evento
              </span>
            </button>

            {/* Option: Video */}
            <button
              type="button"
              onClick={() => setSelectedService('VIDEO')}
              className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all ${
                selectedService === 'VIDEO'
                  ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                  : 'bg-[#181818] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <div>
                <Film className={`w-6 h-6 mb-2 ${selectedService === 'VIDEO' ? 'text-primary' : 'text-on-surface-variant'}`} />
                <strong className="block text-sm text-on-surface">Vídeo Extra (4K)</strong>
                <span className="text-[11px] text-on-surface-variant font-mono block mt-1">
                  Produção e edição de vídeo além da cota contratada
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-primary mt-3 block">
                {formatCurrency(client.extraVideoPrice || 150)} / vídeo
              </span>
            </button>

            {/* Option: Photo */}
            <button
              type="button"
              onClick={() => setSelectedService('PHOTO')}
              className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all ${
                selectedService === 'PHOTO'
                  ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                  : 'bg-[#181818] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <div>
                <Camera className={`w-6 h-6 mb-2 ${selectedService === 'PHOTO' ? 'text-primary' : 'text-on-surface-variant'}`} />
                <strong className="block text-sm text-on-surface">Ensaio / Fotos</strong>
                <span className="text-[11px] text-on-surface-variant font-mono block mt-1">
                  Sessão fotográfica tratada de produtos ou retratos
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-primary mt-3 block">
                {formatCurrency(client.extraPhotoPrice || 80)} / foto
              </span>
            </button>

            {/* Option: Daily */}
            <button
              type="button"
              onClick={() => setSelectedService('DAILY')}
              className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all ${
                selectedService === 'DAILY'
                  ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                  : 'bg-[#181818] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <div>
                <Clock className={`w-6 h-6 mb-2 ${selectedService === 'DAILY' ? 'text-primary' : 'text-on-surface-variant'}`} />
                <strong className="block text-sm text-on-surface">Diária de Gravação</strong>
                <span className="text-[11px] text-on-surface-variant font-mono block mt-1">
                  Equipe in loco para captação externa contínua
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-primary mt-3 block">
                {formatCurrency(client.extraDailyPrice || 300)} / diária
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Form based on Selection */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-[#262626] text-sm font-mono">
          <h3 className="text-sm font-bold uppercase text-primary">
            2. Detalhes & Cronograma do Pedido
          </h3>

          {/* If Event */}
          {selectedService === 'EVENT' && (
            <div className="p-4 rounded-lg bg-[#181818] border border-[#2a2a2a] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
                    Nome do Evento / Ocasião:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lançamento de Produto / Feira Regional"
                    value={form.eventName}
                    onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
                    Local / Endereço Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Av. Paulista, 1000 - São Paulo / SP"
                    value={form.eventLocation}
                    onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
                    Horário de Início:
                  </label>
                  <input
                    type="time"
                    value={form.eventStartTime}
                    onChange={(e) => setForm({ ...form, eventStartTime: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
                    Horário de Término:
                  </label>
                  <input
                    type="time"
                    value={form.eventEndTime}
                    onChange={(e) => setForm({ ...form, eventEndTime: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-on-surface font-bold">
                    <input
                      type="checkbox"
                      checked={form.requiresDrone}
                      onChange={(e) => setForm({ ...form, requiresDrone: e.target.checked })}
                      className="rounded text-primary focus:ring-primary bg-[#141414] border-[#333]"
                    />
                    <span>Requer Imagens Aéreas com Drone</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Standard Fields: Quantity & Desired Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
                Quantidade Solicitada:
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

            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
                Data Desejada / Prazo Limite:
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
            <label className="block text-xs uppercase text-on-surface-variant mb-1 font-bold">
              Briefing / Observações da Solicitação:
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
          <div className="p-4 rounded-lg bg-[#181818] border border-primary/40 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase block">
                Cálculo do Investimento Extra:
              </span>
              <span className="text-xs text-on-surface font-bold">
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
              <span className="text-[9px] text-on-surface-variant block font-normal">
                (Consolidado no fechamento mensal da sua fatura)
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-black text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
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
          {clientRequests.length === 0 ? (
            <div className="p-6 bg-[#161616] border border-[#262626] rounded-lg text-center text-xs font-mono text-on-surface-variant">
              Nenhuma solicitação de serviço extra registrada no momento.
            </div>
          ) : (
            clientRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-[#181818] border border-[#262626] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-on-surface text-sm">
                      {req.quantity}x {req.serviceType}
                    </span>
                    <span className="text-primary font-bold">
                      ({formatCurrency(req.totalEstimated)})
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed font-sans">
                    {req.description}
                  </p>
                  <span className="text-[10px] text-on-surface-variant/60 block mt-1">
                    Solicitado em {req.createdAt} • Data Desejada: {formatDate(req.desiredDate)}
                  </span>
                </div>

                <div className="shrink-0">
                  {req.status === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado & Na Agenda
                    </span>
                  ) : req.status === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded">
                      <Clock className="w-3.5 h-3.5" /> Em Análise pela Equipe
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-2.5 py-1 rounded">
                      <XCircle className="w-3.5 h-3.5" /> Recusado
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
