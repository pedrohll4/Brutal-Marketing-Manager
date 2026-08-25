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
  dueDate?: string;
  pixPayload?: string;
  pixKey?: string;
  pixBeneficiary?: string;
  serviceType?: string;
  quantity?: number;
  eventLocation?: string;
  requestedChanges?: string;
  desiredDate?: string;
}

export function buildWhatsAppMessage(trigger: NotificationTriggerType, data: WhatsAppTemplateData): string {
  const portalBase = 'https://brutalmanager.vercel.app/portal-cliente';

  switch (trigger) {
    case 'MEDIA_READY_FOR_REVIEW':
      return `Olá, *${data.clientName || 'Cliente'}*.

Informamos que o conteúdo *"${data.taskTitle || 'Vídeo'}"* (${data.mediaType || 'Vídeo em Alta Resolução'}) foi concluído pela nossa equipe e está disponível para sua revisão e aprovação.

Para assistir à mídia, fazer anotações ou aprovar a entrega, acesse:
${data.portalUrl || `${portalBase}/entregas`}

Atenciosamente,
Equipe Brutal Marketing`.trim();

    case 'EXTRA_SERVICE_REQUESTED':
      return `*NOTIFICAÇÃO: NOVA SOLICITAÇÃO DE SERVIÇO EXTRA*

Cliente: ${data.clientName}
Serviço: ${data.quantity || 1}x ${data.serviceType}
Valor Previsto: ${formatCurrency(data.totalAmount || 0)}
${data.desiredDate ? `Data Prevista: ${data.desiredDate}\n` : ''}${data.eventLocation ? `Local do Evento: ${data.eventLocation}\n` : ''}
Para analisar e aprovar esta solicitação no sistema:
https://brutalmanager.vercel.app/solicitacoes`.trim();

    case 'EXTRA_SERVICE_APPROVED':
      return `Olá, *${data.clientName}*.

Confirmamos que sua solicitação de serviço extra (*${data.quantity || 1}x ${data.serviceType}*) foi aprovada e integrada à esteira de produção da Brutal Marketing.

O acompanhamento da produção pode ser realizado diretamente em seu portal:
${data.portalUrl || portalBase}

Atenciosamente,
Brutal Marketing`.trim();

    case 'INVOICE_BILLING_PIX':
      return `Prezado(a) *${data.clientName}*,

Segue o demonstrativo de fechamento da sua fatura mensal da Brutal Marketing.

• Valor Total: *${formatCurrency(data.totalAmount || 0)}*
${data.extrasAmount && data.extrasAmount > 0 ? `• Mensalidade Contratual: ${formatCurrency(data.baseAmount || 0)}\n• Serviços Extras Consolidados: ${formatCurrency(data.extrasAmount || 0)}\n` : ''}• Vencimento: Dia ${data.dueDay || data.dueDate || '10'}

*Código PIX Copia e Cola:*
\`${data.pixPayload || '00020126580014br.gov.bcb.pix0136financeiro@brutalmarketing.com.br5204000053039865802BR'}\`

${data.pixKey ? `*Chave PIX:* ${data.pixKey}\n` : ''}${data.pixBeneficiary ? `*Titular:* ${data.pixBeneficiary}\n` : ''}
Para visualizar o demonstrativo detalhado e o recibo de pagamento:
${data.portalUrl || `${portalBase}/pagamentos`}

Atenciosamente,
Departamento Financeiro - Brutal Marketing`.trim();

    case 'MEDIA_ADJUSTMENTS_REQUESTED':
      return `*NOTIFICAÇÃO: AJUSTE DE CONTEÚDO SOLICITADO*

Cliente: ${data.clientName}
Conteúdo: "${data.taskTitle}"

Detalhes dos ajustes solicitados:
${data.requestedChanges || 'Verifique os comentários com marcações de timestamp no portal.'}

Acesse a esteira de produção para revisar as alterações:
https://brutalmanager.vercel.app/producao`.trim();

    default:
      return '';
  }
}

export async function sendWhatsAppNotificationApi(payload: {
  phone: string;
  trigger: NotificationTriggerType;
  data: WhatsAppTemplateData;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: sanitizePhoneNumber(payload.phone),
        message: buildWhatsAppMessage(payload.trigger, payload.data),
        trigger: payload.trigger,
      }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro ao conectar à API do WhatsApp' };
  }
}
