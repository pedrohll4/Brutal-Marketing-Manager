'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Send,
  Users,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { createWhatsAppWebLink } from '@/lib/services/whatsappService';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [videoGoal, setVideoGoal] = useState('8 a 12 vídeos/mês');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistNumber, setWaitlistNumber] = useState(14);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;

    const randomPosition = Math.floor(Math.random() * 8) + 7; // e.g. #11
    setWaitlistNumber(randomPosition);
    setIsSubmitted(true);

    // Build WhatsApp direct message for Admin
    const waMessage = `Olá, equipe da *Brutal Marketing*! 🎬\n\nAcabei de entrar na *Fila de Espera Exclusiva* pelo site oficial:\n\n👤 *Nome:* ${name}\n🏢 *Empresa / Instagram:* ${company || 'Não informado'}\n📱 *WhatsApp:* ${whatsapp}\n🎯 *Demanda Estimada:* ${videoGoal}\n\nGostaria de garantir minha prioridade na lista de espera assim que os novos atendimentos iniciarem!`;

    const waLink = createWhatsAppWebLink('(16) 99123-4567', waMessage);

    // Save to local storage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('brutal_waitlist_leads') || '[]');
      existing.push({
        name,
        company,
        whatsapp,
        videoGoal,
        date: new Date().toISOString(),
      });
      localStorage.setItem('brutal_waitlist_leads', JSON.stringify(existing));
    } catch {}

    // Open WhatsApp in new tab after 1.2s to guarantee smooth UX
    setTimeout(() => {
      window.open(waLink, '_blank');
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setCompany('');
    setWhatsapp('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="" maxWidth="lg">
      <div className="relative">
        {!isSubmitted ? (
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="space-y-2 text-center">
              <div className="flex justify-center mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/brutal-logo-white-transparent.png"
                  alt="Brutal Marketing"
                  className="h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,85,0,0.3)]"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-mono font-bold tracking-wider uppercase">
                <Flame className="w-3.5 h-3.5 fill-primary" />
                <span>Lista de Espera VIP • 2026</span>
              </div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight font-sans">
                Entre na Fila de Espera da Brutal Marketing
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant font-sans max-w-sm mx-auto">
                Cadastre-se na lista oficial para receber atendimento prioritário assim que abrirmos a agenda para novos clientes.
              </p>
            </div>

            {/* Waitlist status notice */}
            <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-mono text-zinc-300">
                  Status Atual: <strong className="text-primary font-bold">Fila de Espera Ativa</strong>
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-[#202020] px-2 py-0.5 rounded border border-[#2a2a2a]">
                Ordem de Inscrição
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Antunes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2c2c2c] focus:border-primary rounded-lg px-3.5 py-2.5 text-sm text-white font-sans outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Empresa ou @ do Instagram
                </label>
                <input
                  type="text"
                  placeholder="Ex: @minhaempresa ou Procampo Agro"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2c2c2c] focus:border-primary rounded-lg px-3.5 py-2.5 text-sm text-white font-sans outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Seu WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2c2c2c] focus:border-primary rounded-lg px-3.5 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Volume de Conteúdo Desejado
                </label>
                <select
                  value={videoGoal}
                  onChange={(e) => setVideoGoal(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2c2c2c] focus:border-primary rounded-lg px-3.5 py-2.5 text-sm text-white font-sans outline-none transition-colors cursor-pointer"
                >
                  <option value="4 a 6 vídeos/mês (Início Estratégico)">4 a 6 vídeos/mês (Início Estratégico)</option>
                  <option value="8 a 12 vídeos/mês (Presença Forte & Reels Diários)">8 a 12 vídeos/mês (Presença Forte & Reels Diários)</option>
                  <option value="16 a 24+ vídeos/mês (Escala Total & Campanhas)">16 a 24+ vídeos/mês (Escala Total & Campanhas)</option>
                  <option value="Cobertura de Evento Pontual ou Lançamento">Cobertura de Evento Pontual ou Lançamento</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-black text-sm py-3.5 px-6 rounded-xl shadow-[0_4px_25px_rgba(255,85,0,0.35)] flex items-center justify-center gap-2 font-mono uppercase tracking-wider transition-all"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>Garantir Minha Prioridade na Fila</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Seus dados são 100% confidenciais e protegidos.</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 font-mono text-xs font-bold uppercase">
                Posição #{waitlistNumber} na Fila de Espera
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Inscrição Confirmada, {name.split(' ')[0]}! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-sm mx-auto">
                Sua prioridade foi registrada. Estamos abrindo o WhatsApp da equipe para você confirmar seu contato imediatamente.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] text-left space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">Responsável:</span>
                <span className="text-white font-bold">{name}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">WhatsApp:</span>
                <span className="text-primary font-bold">{whatsapp}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">Objetivo:</span>
                <span className="text-white font-bold">{videoGoal.split('(')[0]}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-[#202020] hover:bg-[#282828] text-white font-mono text-xs font-bold py-3 rounded-lg border border-[#333] transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
