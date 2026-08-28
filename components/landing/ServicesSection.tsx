'use client';

import React, { useState } from 'react';
import {
  Film,
  Camera,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  Tv,
  Eye,
  Sliders,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface ServiceCardDef {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  description: string;
  highlights: string[];
}

const SERVICES: ServiceCardDef[] = [
  {
    icon: Film,
    tag: 'FLAGSHIP • 4K UHD',
    title: 'Captação Cinematográfica & Reels Virais',
    description:
      'Câmeras de cinema com sensor full-frame, lentes anamórficas e iluminação de estúdio profissional para criar vídeos com estética de comerciais internacionais.',
    highlights: ['Resolução 4K HDR', 'Color Grading estilo Netflix', 'Sound Design Imersivo'],
  },
  {
    icon: Zap,
    tag: 'ALGORITMO • ENGAJAMENTO',
    title: 'Edição Hipnótica & Retenção Máxima',
    description:
      'Cortes de ritmo dinâmico, animações de texto personalizadas e efeitos sonoros sincronizados para prender a atenção do público nos primeiros 3 segundos.',
    highlights: ['Ganchos de Alta Retenção', 'Motion Graphics Exclusivos', 'Trilhas Sonoras em Alta'],
  },
  {
    icon: Sparkles,
    tag: 'INTELIGÊNCIA ARTIFICIAL',
    title: 'Roteiros Magnéticos & Engenharia de Atenção',
    description:
      'Desenvolvemos a narrativa completa dos seus vídeos com base em dados de tendências e análise de concorrência, garantindo que cada gravação tenha propósito de venda.',
    highlights: ['Briefings Estruturados', 'Gatilhos de Autoridade', 'Chamadas para Ação Claras'],
  },
  {
    icon: Calendar,
    tag: 'EQUIPE NO LOCAL',
    title: 'Cobertura Completa de Grandes Eventos & Feiras',
    description:
      'Equipe dedicada com múltiplos cinegrafistas, captação com Drone 4K e entregas expressas de reels no mesmo dia para alimentar suas redes sociais em tempo real.',
    highlights: ['Captação com Drone 4K', 'Entregas Expressas', 'Entrevistas & Depoimentos'],
  },
  {
    icon: Camera,
    tag: 'IMAGEM DE MARCA',
    title: 'Fotografia Publicitária & Ensaios Corporativos',
    description:
      'Fotos tratadas em altíssima resolução para diretoria, catálogo de produtos, estandes em feiras e anúncios pagos com pós-produção e retoque refinado.',
    highlights: ['Ensaios de Diretoria', 'Fotos de Estandes & Feiras', 'Tratamento de Pele & Cor'],
  },
  {
    icon: Shield,
    tag: 'TECNOLOGIA PRÓPRIA',
    title: 'Portal Exclusivo do Cliente & Aprovação em 1 Toque',
    description:
      'Você não precisa baixar arquivos pesados nem usar grupos desorganizados de WhatsApp. Assista ao pré-corte com timestamps no celular e aprove com 1 clique.',
    highlights: ['Player Integrado com Pinos', 'Aprovação Instantânea', 'Histórico e Extrato de Cotas'],
  },
];

export function ServicesSection({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  return (
    <section id="metodologia" className="py-20 md:py-28 bg-[#0f0f0f] border-t border-[#222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-primary text-xs font-mono font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Nossa Metodologia Audiovisual</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-sans">
            TUDO O QUE SUA MARCA PRECISA PARA DOMINAR O MERCADO.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            Do roteiro estratégico à entrega com selo de cinema, cuidamos de 100% da esteira de produção.
          </p>
        </div>

        {/* 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#161616] hover:bg-[#1c1c1c] border border-[#262626] hover:border-primary/60 rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_15px_40px_rgba(255,87,8,0.12)] hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Card Top */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#202020] group-hover:bg-primary/20 border border-[#2e2e2e] group-hover:border-primary/40 text-primary flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 bg-[#222] px-2.5 py-1 rounded-full border border-[#333]">
                      {srv.tag}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors font-sans">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                      {srv.description}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="mt-6 pt-5 border-t border-[#262626] space-y-2 font-mono text-xs text-zinc-300">
                  {srv.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#18110b] via-[#161616] to-[#121212] border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-black text-white font-sans">
              Pronto para colocar sua marca em outro patamar?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              Inscreva-se na fila de espera para garantir seu lote de produção prioritário.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenWaitlist}
            className="shrink-0 bg-primary hover:bg-primary-hover text-white font-mono font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(255,87,8,0.3)] flex items-center gap-2"
          >
            <span>Entrar na Fila de Espera</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
