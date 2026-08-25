'use client';

import React, { useState } from 'react';
import {
  NotificationTriggerType,
  WhatsAppTemplateData,
  buildWhatsAppMessage,
  createWhatsAppWebLink,
  sendWhatsAppNotificationApi,
} from '@/lib/services/whatsappService';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { MessageCircle } from 'lucide-react';

interface WhatsAppShareButtonProps {
  trigger: NotificationTriggerType;
  data: WhatsAppTemplateData;
  phone?: string;
  label?: string;
  variant?: 'green' | 'ghost' | 'icon';
  className?: string;
  showAutoSend?: boolean;
}

export function WhatsAppShareButton({
  trigger,
  data,
  phone,
  label = 'Notificar no WhatsApp',
  variant = 'green',
  className = '',
}: WhatsAppShareButtonProps) {
  const { addToast, adminWhatsApp } = useSystemStore();
  const [sending, setSending] = useState(false);

  // If notifying about extra requested, default to Admin's personal WhatsApp
  const targetPhone = phone || (trigger === 'EXTRA_SERVICE_REQUESTED' ? adminWhatsApp : '(11) 98877-6655');

  const message = buildWhatsAppMessage(trigger, data);
  const waWebLink = createWhatsAppWebLink(targetPhone, message);

  const handleOpenWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(waWebLink, '_blank');
    addToast({
      title: 'WhatsApp Aberto',
      description: `Mensagem direcionada para ${targetPhone}.`,
      type: 'success',
    });
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleOpenWhatsApp}
        className={`p-1.5 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 transition-colors ${className}`}
        title={`Enviar mensagem para ${targetPhone} no WhatsApp`}
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        onClick={handleOpenWhatsApp}
        className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleOpenWhatsApp}
        className={`px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-600/30 ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    </div>
  );
}
