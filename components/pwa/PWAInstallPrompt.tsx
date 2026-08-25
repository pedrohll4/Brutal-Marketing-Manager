'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, ChevronDown, Check } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isRunningStandalone);

    if (isRunningStandalone) return;

    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture standard install prompt on Android/Desktop
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed recently
      const dismissedTime = localStorage.getItem('brutal_pwa_dismissed');
      if (!dismissedTime || Date.now() - Number(dismissedTime) > 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS, show banner after 2 seconds if not dismissed
    if (isIosDevice && !isRunningStandalone) {
      const dismissedTime = localStorage.getItem('brutal_pwa_dismissed');
      if (!dismissedTime || Date.now() - Number(dismissedTime) > 24 * 60 * 60 * 1000) {
        const timer = setTimeout(() => setShowPrompt(true), 2000);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('brutal_pwa_dismissed', String(Date.now()));
    setShowPrompt(false);
  };

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.warn('PWA SW registration failed:', err));
    }
  }, []);

  if (isStandalone || !showPrompt) return null;

  return (
    <>
      {/* Floating Bottom Install Banner */}
      <aside
        aria-label="Instalação do Aplicativo Mobile"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#181818] border-2 border-primary/70 rounded-xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(255,85,0,0.3)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-center gap-3">
          {/* App Icon */}
          <div className="w-11 h-11 rounded-xl bg-[#121212] border border-primary/40 flex items-center justify-center shrink-0 shadow-md">
            <span className="font-black text-primary text-xl">B</span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-on-surface font-mono flex items-center gap-1.5">
              <span>App Brutal Manager</span>
              <span className="text-[9px] bg-primary text-white font-bold px-1.5 py-0.2 rounded">
                MOBILE
              </span>
            </h4>
            <p className="text-[11px] text-on-surface-variant font-sans line-clamp-1 mt-0.5">
              Instale no seu celular para aprovar vídeos e solicitar serviços
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 shadow-lg transition-all active:scale-95 animate-pulse"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
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

      {/* iOS Installation Instruction Sheet / Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#181818] border-2 border-primary/60 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 text-xs font-mono relative">
            <div className="flex justify-between items-center border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <h3 className="font-black text-on-surface text-sm uppercase">Instalar no iPhone</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-on-surface-variant text-[11px] font-sans leading-relaxed">
              Siga os <strong>2 passos rápidos</strong> abaixo para adicionar o app à sua tela de início do iPhone:
            </p>

            <div className="space-y-3 bg-[#121212] p-4 rounded-2xl border border-[#262626]">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-on-surface text-xs font-bold">
                    1. Toque em Compartilhar
                  </strong>
                  <span className="text-[11px] text-on-surface-variant font-sans">
                    No ícone do meio na barra inferior do Safari.
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 pt-2 border-t border-[#1f1f1f]">
                <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-on-surface text-xs font-bold">
                    2. Escolha &quot;Adicionar à Tela de Início&quot;
                  </strong>
                  <span className="text-[11px] text-on-surface-variant font-sans">
                    Role um pouco para baixo na lista e toque em &quot;Adicionar&quot;.
                  </span>
                </div>
              </div>
            </div>

            {/* Downward bouncing indicator pointing to Safari bar */}
            <div className="flex flex-col items-center justify-center text-primary pt-1">
              <span className="text-[10px] uppercase font-bold text-center">
                Olhe para a barra inferior do seu Safari
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce mt-1 text-primary" />
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-black rounded-xl text-xs shadow-lg"
            >
              OK, Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
