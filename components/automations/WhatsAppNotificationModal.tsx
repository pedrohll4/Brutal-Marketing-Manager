'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, Client } from '@/lib/types';
import { Modal } from '../ui/Modal';
import {
  NotificationTriggerType,
  buildWhatsAppMessage,
  createWhatsAppWebLink,
  sendWhatsAppNotificationApi,
} from '@/lib/services/whatsappService';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { MessageCircle, Send, Copy, Check, ExternalLink, Smartphone, AlertCircle } from 'lucide-react';

interface WhatsAppNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  newStatus: TaskStatus;
  client?: Client | null;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog',
  PLANNED: 'Planejado / Roteirizado',
  IN_PRODUCTION: 'Em Produção (Captação / Edição)',
  IN_REVIEW: 'Em Revisão Interna',
  CLIENT_REVIEW: 'Aguardando Aprovação do Cliente',
  APPROVED: 'Aprovado pelo Cliente',
  PUBLISHED: 'Publicado nas Redes',
};

export function WhatsAppNotificationModal({
  isOpen,
  onClose,
  task,
  newStatus,
  client,
}: WhatsAppNotificationModalProps) {
  const { addToast } = useSystemStore();
  const [copied, setCopied] = useState(false);

  if (!task || !isOpen) return null;

  const clientName = client?.name || task.clientName;
  const clientPhone = client?.phone || '(11) 98888-7766';

  let trigger: NotificationTriggerType = 'MEDIA_READY_FOR_REVIEW';
  let customMessage = '';

  if (newStatus === 'CLIENT_REVIEW') {
    trigger = 'MEDIA_READY_FOR_REVIEW';
    customMessage = buildWhatsAppMessage('MEDIA_READY_FOR_REVIEW', {
      clientName,
      taskTitle: task.title,
      mediaType: task.taskType === 'PHOTO' ? 'Fotos / Ensaio' : 'Vídeo 4K UHD',
      portalUrl: 'https://brutalmanager.vercel.app/portal-cliente/entregas',
    });
  } else if (newStatus === 'APPROVED') {
    customMessage = `Olá, *${clientName}*! 🎉

O seu conteúdo *"${task.title}"* foi *APROVADO* com sucesso e já está pronto para publicação nas redes sociais!

A equipe da *Brutal Marketing* já preparou as legendas e hashtags estratégicas para o post.

Acompanhe pelo portal:
👉 https://brutalmanager.vercel.app/portal-cliente/entregas`.trim();
  } else {
    customMessage = `Olá, *${clientName}*! 🎬

Atualização de status na *Brutal Marketing*:

O seu conteúdo *"${task.title}"* avançou para a etapa: *${STATUS_LABELS[newStatus] || newStatus}*.

Acompanhe o andamento em tempo real pelo portal do cliente:
👉 https://brutalmanager.vercel.app/portal-cliente`.trim();
  }

  const waWebLink = createWhatsAppWebLink(clientPhone, customMessage);

  const handleOpenWhatsApp = () => {
    window.open(waWebLink, '_blank');
    addToast({
      title: 'WhatsApp Aberto! 💬',
      description: `Mensagem enviada para ${clientName} (${clientPhone}).`,
      type: 'success',
    });
    onClose();
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    addToast({
      title: 'Mensagem Copiada! 📋',
      type: 'success',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notificar Cliente no WhatsApp? 💬"
      subtitle={`O conteúdo avançou para "${STATUS_LABELS[newStatus] || newStatus}"`}
      maxWidth="lg"
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Client & Task Info */}
        <div className="p-3 bg-[#181818] border border-[#2a2a2a] rounded-lg space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold">Cliente Destinatário:</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded text-[10px]">
              {clientPhone}
            </span>
          </div>
          <p className="font-bold text-on-surface text-sm">{clientName} {client?.companyName ? `(${client.companyName})` : ''}</p>
          <p className="text-primary text-[11px]">Conteúdo: {task.title}</p>
        </div>

        {/* WhatsApp Message Preview Bubble */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold uppercase">
            <span>Mensagem Pré-Formatada:</span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-[#005c4b] text-white whitespace-pre-line leading-relaxed shadow-md font-sans">
            {customMessage}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f]"
          >
            Continuar sem Enviar
          </button>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-emerald-600/30 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>💬 Enviar no WhatsApp Agora</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
