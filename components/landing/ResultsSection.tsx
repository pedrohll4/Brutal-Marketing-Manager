'use client';

import React from 'react';
import {
  Layers,
  ArrowRight,
  Flame,
  Film,
  Sparkles,
  CheckCircle2,
  Tv,
} from 'lucide-react';

export function ResultsSection({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  const steps = [
    {
      num: '01',
      tag: 'PLANEJAMENTO',
      title: 'Roteirização Estratégica & Ganchos Virais',
      desc: 'Analisamos o seu nicho, mapeamos os melhores ganchos de atenção e criamos o roteiro com gatilhos magnéticos para prender o público nos primeiros 3 segundos.',
    },
    {
      num: '02',
      tag: 'PRODUÇÃO',
      title: 'Captação de Cinema 4K UHD no Local',
      desc: 'Nossa equipe técnica vai até sua empresa, estúdio ou evento com câmeras de cinema, iluminação profissional e áudio cristalino de alta fidelidade.',
    },
    {
      num: '03',
      tag: 'PÓS-PRODUÇÃO',
      title: 'Edição Hipnótica & Color Grading Netflix',
      desc: 'Cortes dinâmicos, sound design imersivo, motion graphics personalizados e colorimetria avançada que transformam o visual da sua marca.',
    },
    {
      num: '04',
      tag: 'ENTREGA RÁPIDA',
      title: 'Aprovação em 1 Toque no Portal do Cliente',
      desc: 'Você assiste aos pré-cortes com pinos de revisão direto pelo celular ou computador e aprova com 1 clique, sem burocracia nem perda de tempo.',
    },
  ];

  return (
    <section id="metodologia" className="py-20 md:py-28 bg-[#0e0e0e] border-t border-[#222] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#2a2a2a] text-primary text-xs font-mono font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Esteira Operacional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-sans">
            COMO FUNCIONA A ESTEIRA BRUTAL.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            Processo estruturado do início ao fim para você não se preocupar com nada técnico.
          </p>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-[#141414] hover:bg-[#181818] border border-[#262626] hover:border-primary/50 rounded-2xl p-6 sm:p-7 space-y-4 relative transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(255,87,8,0.1)] group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-primary/40 group-hover:text-primary font-mono transition-colors">
                    {s.num}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-zinc-400 bg-[#1f1f1f] px-2 py-0.5 rounded border border-[#2d2d2d]">
                    {s.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors font-sans">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#222] flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Padrão Brutal</span>
              </div>
            </div>
          ))}
        </div>

        {/* Conversion Action */}
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={onOpenWaitlist}
            className="bg-primary hover:bg-primary-hover text-white font-mono font-bold text-xs sm:text-sm py-4 px-8 rounded-xl uppercase tracking-wider transition-all shadow-[0_4px_25px_rgba(255,87,8,0.35)] inline-flex items-center gap-2"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Entrar na Fila de Espera Oficial</span>
          </button>
        </div>
      </div>
    </section>
  );
}
