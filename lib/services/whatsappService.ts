import { Task, Client, Invoice, ServiceRequest } from '../types';
import { formatCurrency } from '../utils';

export type NotificationTriggerType =
  | 'MEDIA_READY_FOR_REVIEW'
  | 'EXTRA_SERVICE_REQUESTED'
  | 'EXTRA_SERVICE_APPROVED'
  | 'INVOICE_BILLING_PIX'
  | 'MEDIA_ADJUSTMENTS_REQUESTED';

export function sanitizePhoneNumber(phone?: string): string {
  if (!phone) return '';
  // Remove non-numeric characters
  let digits = phone.replace(/\D/g, '');
  // If no country code, add Brazil 55
  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }
  return digits;
}

export function createWhatsAppWebLink(phone: string, message: string): string {
  const sanitized = sanitizePhoneNumber(phone);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encodedMsg}`;
}

export interface WhatsAppTemplateData {
  clientName?: string;
  taskTitle?: string;
  mediaType?: string;
  portalUrl?: string;
  totalAmount?: number;
  baseAmount?: number;
  extrasAmount?: number;
  dueDay?: number | string;
  pixPayload?: string;
  serviceType?: string;
  quantity?: number;
  eventLocation?: string;
  requestedChanges?: string;
}

export function buildWhatsAppMessage(trigger: NotificationTriggerType, data: WhatsAppTemplateData): string {
  const portalBase = 'https://brutalmanager.vercel.app/portal-cliente';

  switch (trigger) {
    case 'MEDIA_READY_FOR_REVIEW':
      return `Olá, *${data.clientName || 'Cliente'}*! 👋

Aqui é da equipe *Brutal Marketing*.

O seu conteúdo *"${data.taskTitle || 'Vídeo'}"* (${data.mediaType || 'Vídeo 4K'}) acabou de ser finalizado e já está disponível para sua revisão e aprovação!

▶️ *Assista, comente por segundo ou aprove com 1 clique:*
👉 ${data.portalUrl || `${portalBase}/entregas`}

Qualquer dúvida ou ajuste, estamos à disposição! 🚀`.trim();

    case 'EXTRA_SERVICE_REQUESTED':
      return `🔔 *NOVA SOLICITAÇÃO DE EXTRA RECEBIDA*

👤 *Cliente:* ${data.clientName}
📦 *Serviço:* ${data.quantity || 1}x ${data.serviceType}
💰 *Valor Estimado:* ${formatCurrency(data.totalAmount || 0)}
${data.eventLocation ? `📍 *Local:* ${data.eventLocation}\n` : ''}
Acesse o painel para aprovar e injetar no Kanban:
👉 https://brutalmanager.vercel.app/solicitacoes`.trim();

    case 'EXTRA_SERVICE_APPROVED':
      return `Olá, *${data.clientName}*! ✅

Sua solicitação de serviço extra *(${data.quantity || 1}x ${data.serviceType})* foi *APROVADA* pela equipe da Brutal Marketing!

O serviço já foi agendado em nossa esteira de produção e o valor será consolidado em seu fechamento mensal.

Acompanhe o andamento pelo seu portal:
👉 ${data.portalUrl || portalBase}`.trim();

    case 'INVOICE_BILLING_PIX':
      return `Olá, *${data.clientName}*! 📄

O fechamento da sua fatura mensal da *Brutal Marketing* está disponível.

💵 *Valor Total:* *${formatCurrency(data.totalAmount || 0)}*
${data.extrasAmount && data.extrasAmount > 0 ? `• Plano Base: ${formatCurrency(data.baseAmount || 0)}\n• Serviços Extras: ${formatCurrency(data.extrasAmount || 0)}\n` : ''}
📅 *Vencimento:* Dia ${data.dueDay || '10'}

🔑 *PIX COPIA E COLA:*
\`${data.pixPayload || '00020126580014br.gov.bcb.pix0136financeiro@brutalmarketing.com.br5204000053039865802BR'}\`

📲 *Pague e veja o recibo no portal:*
👉 ${data.portalUrl || `${portalBase}/pagamentos`}

Agradecemos pela parceria! 🚀`.trim();

    case 'MEDIA_ADJUSTMENTS_REQUESTED':
      return `⚠️ *AJUSTES SOLICITADOS PELO CLIENTE*

👤 *Cliente:* ${data.clientName}
🎬 *Conteúdo:* ${data.taskTitle}
📝 *Notas de Ajuste:* ${data.requestedChanges || 'Verificar marcações de timestamp no painel.'}

Acesse a tarefa para iniciar os retoques:
👉 https://brutalmanager.vercel.app/producao`.trim();

    default:
      return `Notificação da Brutal Marketing para ${data.clientName}.`;
  }
}

export async function sendWhatsAppNotificationApi(params: {
  phone: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Erro ao conectar à API de WhatsApp' };
  }
}
