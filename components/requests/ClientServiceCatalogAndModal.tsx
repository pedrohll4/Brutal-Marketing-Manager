'use client';

import React, { useState } from 'react';
import {
  Film,
  Camera,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Plus,
  Send,
  Video,
  CheckCircle2,
  Plane,
  FileText,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Client, ServiceType } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { Modal } from '@/components/ui/Modal';
import { notifyExtraRequested } from '@/lib/services/pushNotificationService';

interface ClientServiceCatalogProps {
  client: Client;
  onOpenModalWithService?: (serviceType: ServiceType) => void;
}

export interface ServiceOptionDef {
  type: ServiceType;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  getPrice: (client: Client) => number;
  popular?: boolean;
  unitLabel: string;
}

export const PRESET_SERVICES: ServiceOptionDef[] = [
  {
    type: 'VIDEO',
    title: 'Vídeo Extra em 4K UHD',
    badge: 'Mais Pedido 🔥',
    description: 'Captação ou edição de vídeo extra (Reels/TikTok/Comercial) com trilha e color grading.',
    icon: Film,
    getPrice: (c) => c?.extraVideoPrice || 150,
    popular: true,
    unitLabel: 'por vídeo',
  },
  {
    type: 'PHOTO',
    title: 'Fotos Extras & Ensaios',
    badge: 'Alta Resolução',
    description: 'Lote de fotos tratadas para produtos, estandes, diretoria ou redes sociais.',
    icon: Camera,
    getPrice: (c) => c?.extraPhotoPrice || 80,
    unitLabel: 'por foto tratada',
  },
  {
    type: 'EVENT',
    title: 'Cobertura Completa de Evento',
    badge: 'Presencial',
    description: 'Equipe de captação no local do seu evento com fotos, vídeos dinâmicos e entrevistas.',
    icon: Calendar,
    getPrice: (c) => c?.extraEventPrice || 500,
    popular: true,
    unitLabel: 'por evento',
  },
  {
    type: 'DAILY',
    title: 'Diária Extra de Captação',
    badge: 'Videomaker Dedicado',
    description: 'Diária exclusiva de gravação na sua empresa, estúdio ou locação externa.',
    icon: Video,
    getPrice: (c) => c?.extraDailyPrice || 300,
    unitLabel: 'por diária',
  },
];

export function ClientServiceCatalogSection({ client }: { client: Client }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>('VIDEO');

  const handleOpenWithService = (type: ServiceType) => {
    setSelectedServiceType(type);
    setIsModalOpen(true);
  };

  return (
    <section className="space-y-4">
      {/* Mega Hero Button & Banner for Mobile and Desktop */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c120c] via-[#161616] to-[#0d0d0d] border-2 border-primary/50 p-5 sm:p-7 shadow-[0_10px_40px_rgba(255,85,0,0.15)] transition-all hover:border-primary">
        {/* Glow effect in background */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[11px] font-mono font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              <span>Solicitação Rápida de Serviços Extras</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              Precisa de mais vídeos, fotos ou cobertura de eventos?
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-sans">
              Peça serviços adicionais com <strong className="text-primary font-mono">1 clique</strong> e valores transparentes direto do seu contrato.
            </p>
          </div>

          {/* Giant Primary Action Button */}
          <button
            onClick={() => handleOpenWithService('VIDEO')}
            className="w-full md:w-auto shrink-0 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-black text-sm sm:text-base py-4 px-7 rounded-xl shadow-[0_4px_25px_rgba(255,85,0,0.45)] flex items-center justify-center gap-3 transition-all uppercase tracking-wider font-mono border border-primary-light"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span>+ NOVA SOLICITAÇÃO</span>
            <ArrowRight className="w-5 h-5 ml-1 hidden sm:inline-block" />
          </button>
        </div>

        {/* Pre-Options Quick Grid inside or right below */}
        <div className="mt-6 pt-5 border-t border-[#2a2a2a] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SERVICES.map((srv) => {
            const Icon = srv.icon;
            const price = srv.getPrice(client);

            return (
              <div
                key={srv.type}
                onClick={() => handleOpenWithService(srv.type)}
                className="group relative bg-[#181818]/90 hover:bg-[#202020] border border-[#2e2e2e] hover:border-primary rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      srv.popular
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-[#252525] text-on-surface-variant border-[#333]'
                    }`}>
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 font-sans">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#262626] flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-mono block">Valor:</span>
                    <strong className="text-sm font-black text-primary font-mono block">
                      {formatCurrency(price)}
                    </strong>
                    <span className="text-[9px] text-zinc-500 font-mono">{srv.unitLabel}</span>
                  </div>

                  <button
                    type="button"
                    className="px-2.5 py-1 bg-primary/20 hover:bg-primary text-primary hover:text-white font-mono text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Pedir</span>
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal */}
      <ClientServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={client}
        initialServiceType={selectedServiceType}
      />
    </section>
  );
}

export function ClientServiceRequestModal({
  isOpen,
  onClose,
  client,
  initialServiceType = 'VIDEO',
}: {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  initialServiceType?: ServiceType;
}) {
  const { addServiceRequest, addToast } = useSystemStore();

  const [selectedService, setSelectedService] = useState<ServiceType>(initialServiceType);
  const [quantity, setQuantity] = useState(1);
  const [desiredDate, setDesiredDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartTime, setEventStartTime] = useState('08:30');
  const [eventEndTime, setEventEndTime] = useState('18:00');
  const [requiresDrone, setRequiresDrone] = useState(false);

  // Sync initial type when opening
  React.useEffect(() => {
    if (isOpen) {
      setSelectedService(initialServiceType);
    }
  }, [isOpen, initialServiceType]);

  const getUnitPrice = (type: ServiceType) => {
    switch (type) {
      case 'VIDEO':
        return client?.extraVideoPrice || 150;
      case 'PHOTO':
        return client?.extraPhotoPrice || 80;
      case 'EVENT':
        return client?.extraEventPrice || 500;
      case 'DAILY':
        return client?.extraDailyPrice || 300;
      default:
        return 150;
    }
  };

  const unitPrice = getUnitPrice(selectedService);
  const totalAmount = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let fullDescription = description.trim();
    if (selectedService === 'EVENT') {
      fullDescription = `[Evento: ${eventName || 'Cobertura'}] ${description.trim()} | Local: ${eventLocation || 'A definir'} | Horário: ${eventStartTime} às ${eventEndTime} ${requiresDrone ? '| [Requer Drone]' : ''}`;
    }

    addServiceRequest({
      clientId: client?.id || 'cli-generic',
      clientName: client?.companyName || client?.name || 'Cliente',
      serviceType: selectedService,
      quantity,
      unitPrice,
      totalEstimated: totalAmount,
      desiredDate,
      description: fullDescription || `Solicitação de ${quantity}x ${selectedService}`,
      eventLocation: selectedService === 'EVENT' ? eventLocation : undefined,
      eventStartTime: selectedService === 'EVENT' ? eventStartTime : undefined,
      eventEndTime: selectedService === 'EVENT' ? eventEndTime : undefined,
      requiresDrone: selectedService === 'EVENT' ? requiresDrone : undefined,
    });

    // Native Push Notification
    notifyExtraRequested(client.companyName || client.name, `${quantity}x ${selectedService}`).catch(() => {});

    addToast({
      title: 'Solicitação Enviada! 🚀',
      description: `Pedido de ${quantity}x ${selectedService} (${formatCurrency(totalAmount)}) enviado ao Administrador.`,
      type: 'success',
    });

    onClose();
    // Reset form
    setQuantity(1);
    setDescription('');
    setEventName('');
    setEventLocation('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ Solicitar Novo Serviço Extra"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
        {/* Step 1: Select Type with live price cards */}
        <div>
          <label className="block text-xs uppercase font-bold text-on-surface-variant mb-2">
            1. Escolha o Tipo de Serviço Desejado:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_SERVICES.map((srv) => {
              const Icon = srv.icon;
              const price = srv.getPrice(client);
              const isSelected = selectedService === srv.type;

              return (
                <button
                  key={srv.type}
                  type="button"
                  onClick={() => setSelectedService(srv.type)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-primary/15 border-primary shadow-[0_0_15px_rgba(255,85,0,0.3)] scale-[1.02]'
                      : 'bg-[#181818] border-[#2c2c2c] hover:border-[#444]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-zinc-400'}`} />
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <div>
                    <span className={`font-bold text-xs block leading-tight ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                      {srv.title.split(' ')[0]} {srv.title.split(' ')[1] || ''}
                    </span>
                    <strong className="text-xs font-black text-on-surface block mt-1">
                      {formatCurrency(price)}
                    </strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Quantity & Live Calculator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#181818] p-4 rounded-xl border border-[#2a2a2a]">
          <div>
            <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1.5">
              Quantidade:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 5].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuantity(qty)}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-xs border transition-all ${
                    quantity === qty
                      ? 'bg-primary text-white border-primary shadow'
                      : 'bg-[#222] border-[#333] text-on-surface hover:bg-[#282828]'
                  }`}
                >
                  {qty}x
                </button>
              ))}
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-[#121212] border border-[#333] rounded-lg px-2.5 py-2 text-center text-xs text-on-surface font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1.5">
              Data Desejada para Entrega/Evento:
            </label>
            <input
              type="date"
              required
              value={desiredDate}
              onChange={(e) => setDesiredDate(e.target.value)}
              className="w-full bg-[#121212] border border-[#333] rounded-lg px-3 py-2 text-xs text-on-surface font-mono focus:border-primary focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Specific Event Fields */}
        {selectedService === 'EVENT' && (
          <div className="space-y-3 bg-[#181818] p-4 rounded-xl border border-amber-500/30">
            <span className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Detalhes do Evento
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-on-surface-variant mb-1">Nome do Evento:</label>
                <input
                  type="text"
                  placeholder="Ex: Lançamento de Produto / Feira"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-on-surface-variant mb-1">Local / Endereço:</label>
                <input
                  type="text"
                  placeholder="Ex: Centro de Convenções / Sede"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-on-surface">
                <input
                  type="checkbox"
                  checked={requiresDrone}
                  onChange={(e) => setRequiresDrone(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary bg-[#1c1b1b] border-[#333]"
                />
                <span className="flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-primary" /> Requer Imagens Aéreas com Drone
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Description / Instructions */}
        <div>
          <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
            Instruções, Objetivos ou Roteiro:
          </label>
          <textarea
            rows={3}
            placeholder="Descreva o que você precisa: temas dos vídeos, produtos a gravar, referências ou detalhes especiais..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl p-3 text-xs text-on-surface focus:border-primary focus:outline-none font-sans"
          />
        </div>

        {/* Total Price Summary Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/15 to-transparent border border-primary/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              Investimento Total Estimado:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-primary font-mono">
                {formatCurrency(totalAmount)}
              </span>
              <span className="text-[10px] text-on-surface-variant font-mono">
                ({quantity}x de {formatCurrency(unitPrice)})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-zinc-400 block font-mono">
              Faturado junto na fatura mensal
            </span>
            <span className="inline-block text-[10px] text-emerald-400 font-bold font-mono">
              ✓ Sem custos surpresa
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-[#333] hover:bg-[#222] text-on-surface-variant hover:text-on-surface font-bold text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 uppercase tracking-wider"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Solicitação ({formatCurrency(totalAmount)})</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
