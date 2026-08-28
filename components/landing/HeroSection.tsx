'use client';

import React from 'react';
import Link from 'next/link';
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Star,
  Film,
  UserCheck,
} from 'lucide-react';
import { ThreeDPhoneMockup } from './ThreeDPhoneMockup';

interface HeroSectionProps {
  onOpenWaitlist: () => void;
}

export function HeroSection({ onOpenWaitlist }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Large Official Brutal Logo Watermark in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl opacity-[0.035] pointer-events-none select-none flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brutal-logo-white-transparent.png"
          alt=""
          className="w-full h-auto object-contain blur-[1px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & High-Impact Conversion */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge with Official Icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-primary/40 text-primary text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(255,87,8,0.15)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brutal-icon-orange-transparent.png"
                alt=""
                className="w-4 h-4 object-contain"
              />
              <span>Agência Audiovisual & Estratégia de Alto Impacto</span>
            </div>

            {/* Massive Brutalist Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-sans">
              PRODUÇÃO AUDIOVISUAL DE CINEMA PARA QUEM{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-500">
                NÃO ACEITA SER IGNORADO.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-sans leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transformamos empresas comuns em marcas desejadas com <strong className="text-white">vídeos em 4K UHD</strong>, roteiros hipnóticos e uma esteira completa de captação e edição profissional.
            </p>

            {/* Waitlist Callout Box */}
            <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Flame className="w-5 h-5 fill-primary" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    Fila de Espera para Novos Clientes
                  </span>
                  <span className="text-[11px] font-sans text-zinc-400 block">
                    Cadastre-se na lista oficial para receber atendimento prioritário assim que abrirmos a agenda.
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-primary/15 border border-primary/30 text-primary text-[11px] font-mono font-bold shrink-0">
                Lista de Espera Ativa
              </span>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenWaitlist}
                className="bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-black text-sm sm:text-base py-4 px-8 rounded-xl shadow-[0_6px_30px_rgba(255,87,8,0.4)] flex items-center justify-center gap-3 transition-all uppercase tracking-wider font-mono border border-primary-light"
              >
                <Flame className="w-5 h-5 fill-white" />
                <span>Entrar na Fila de Espera</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/login"
                className="bg-[#181818] hover:bg-[#222] border border-[#2e2e2e] hover:border-primary text-zinc-200 hover:text-white font-bold text-sm py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all font-mono"
              >
                <UserCheck className="w-4 h-4 text-primary" />
                <span>Já sou Cliente / Entrar</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Interactive Phone */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <ThreeDPhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
