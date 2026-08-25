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
import { Send, MessageCircle, Check, ExternalLink } from 'lucide-react';

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
  phone = '(11) 98877-6655',
  label = 'Avisar no WhatsApp',
  variant = 'green',
  className = '',
}: WhatsAppShareButtonProps) {
  const { addToast } = useSystemStore();
  const [sending, setSending] = useState(false);

  const message = buildWhatsAppMessage(trigger, data);
  const waWebLink = createWhatsAppWebLink(phone, message);

  const handleOpenWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(waWebLink, '_blank');
    addToast({
      title: 'WhatsApp Aberto! 💬',
      description: `Mensagem pronta para envio para ${data.clientName || 'o cliente'}.`,
      type: 'success',
    });
  };

  const handleAutoSendApi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSending(true);
    try {
      const res = await sendWhatsAppNotificationApi({ phone, message });
      if (res.success) {
        addToast({
          title: 'Notificação Enviada no WhatsApp! 🚀',
          description: `Disparado com sucesso para ${phone}.`,
          type: 'success',
        });
      } else {
        // Fallback to web link
        window.open(waWebLink, '_blank');
      }
    } catch {
      window.open(waWebLink, '_blank');
    } finally {
      setSending(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleOpenWhatsApp}
        className={`p-1.5 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 transition-colors ${className}`}
        title={`Enviar mensagem para ${phone} no WhatsApp`}
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
        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
      </button>
    </div>
  );
}
