'use client';

export type PushNotificationType =
  | 'VIDEO_READY_FOR_REVIEW'
  | 'VIDEO_APPROVED'
  | 'EXTRA_REQUESTED'
  | 'PAYMENT_CONFIRMED'
  | 'NEW_COMMENT';

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function getPushPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function sendNativePush(payload: PushPayload): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const hasPermission = await requestPushPermission();
  if (!hasPermission) return false;

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: payload.tag || 'brutal-notification',
        vibrate: [200, 100, 200],
        data: {
          url: payload.url || '/portal-cliente/entregas',
        },
      } as NotificationOptions);
      return true;
    } else if ('Notification' in window) {
      new Notification(payload.title, {
        body: payload.body,
        icon: '/icons/icon-192x192.png',
      });
      return true;
    }
  } catch (err) {
    console.warn('Erro ao disparar notificação push:', err);
  }

  return false;
}

export async function notifyVideoReadyForClient(clientName: string, videoTitle: string) {
  return sendNativePush({
    title: '🎬 Novo Vídeo Disponível para Aprovação!',
    body: `Olá ${clientName}! O vídeo "${videoTitle}" foi finalizado pela Brutal Marketing e aguarda sua aprovação.`,
    url: '/portal-cliente/entregas',
    tag: `video-ready-${Date.now()}`,
  });
}

export async function notifyVideoApproved(clientName: string, videoTitle: string) {
  return sendNativePush({
    title: '🎉 Vídeo Aprovado pelo Cliente!',
    body: `${clientName} aprovou a entrega do vídeo "${videoTitle}". Pronto para publicação!`,
    url: '/producao',
    tag: `video-approved-${Date.now()}`,
  });
}

export async function notifyExtraRequested(clientName: string, serviceTitle: string) {
  return sendNativePush({
    title: '⚡ Nova Solicitação de Serviço Extra!',
    body: `${clientName} solicitou um novo serviço extra: "${serviceTitle}".`,
    url: '/solicitacoes',
    tag: `extra-req-${Date.now()}`,
  });
}
