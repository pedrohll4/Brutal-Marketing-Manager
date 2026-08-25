'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, X, Check, ShieldCheck } from 'lucide-react';
import { requestPushPermission, getPushPermissionStatus, sendNativePush } from '@/lib/services/pushNotificationService';

export function PushNotificationPrompt() {
  const [permission, setPermission] = useState<string>('granted');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentStatus = getPushPermissionStatus();
    setPermission(currentStatus);

    if (currentStatus === 'default') {
      const dismissedTime = localStorage.getItem('brutal_push_dismissed');
      if (!dismissedTime || Date.now() - Number(dismissedTime) > 24 * 60 * 60 * 1000) {
        const timer = setTimeout(() => setShowPrompt(true), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnablePush = async () => {
    setIsActivating(true);
    const granted = await requestPushPermission();
    setIsActivating(false);

    if (granted) {
      setPermission('granted');
      setShowPrompt(false);
      // Trigger confirmation push
      await sendNativePush({
        title: '🔔 Notificações Ativadas com Sucesso!',
        body: 'Você receberá alertas em tempo real sobre aprovações de vídeos e novos serviços da Brutal Marketing.',
        url: '/portal-cliente/entregas',
      });
    } else {
      setPermission('denied');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('brutal_push_dismissed', String(Date.now()));
    setShowPrompt(false);
  };

  if (!showPrompt || permission === 'granted' || permission === 'unsupported' || permission === 'denied') {
    return null;
  }

  return (
    <aside
      aria-label="Permissão de Notificações Push"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#161616] border-2 border-primary/60 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(255,85,0,0.25)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-mono text-xs"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30 animate-pulse">
          <BellRing className="w-5 h-5" />
        </div>
        <div>
          <strong className="block text-on-surface text-xs font-bold font-mono">
            Ativar Alertas no Celular
          </strong>
          <p className="text-[11px] text-on-surface-variant font-sans line-clamp-1 mt-0.5">
            Seja avisado na hora quando novos vídeos forem liberados
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleEnablePush}
          disabled={isActivating}
          className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg transition-all active:scale-95"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{isActivating ? 'Ativando...' : 'Ativar'}</span>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
