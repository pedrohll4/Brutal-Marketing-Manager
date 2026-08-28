'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  metric: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Nicole Procampo',
    role: 'Diretora de Marketing',
    company: 'Procampo Agronegócios',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    content:
      'A Brutal Marketing elevou a nossa comunicação no Agro para um nível de cinema. Nossos vídeos agora geram leads qualificados toda semana e os produtores elogiam a qualidade técnica.',
    metric: '+480k views na safra',
  },
  {
    name: 'Carlos Mendes',
    role: 'Head de Growth',
    company: 'TechRush Electronics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    content:
      'Os comerciais de lançamento bateram recorde de faturamento no e-commerce. A retenção nos primeiros 3 segundos faz toda a diferença para o tráfego pago converter.',
    metric: '6.4x ROI em vendas',
  },
  {
    name: 'Rodrigo Alencar',
    role: 'Sócio Fundador',
    company: 'Vanguard Empreendimentos',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    content:
      'A cobertura com drone e o aftermovie do nosso lançamento imobiliário venderam todas as cotas em 72 horas. O portal próprio de aprovação facilita muito a rotina.',
    metric: '100% de lotes vendidos',
  },
  {
    name: 'Mariana Duarte',
    role: 'CEO & Founder',
    company: 'Apex Logística Integrada',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    content:
      'O posicionamento institucional que a equipe da Brutal construiu nos colocou como referência no setor de transporte. O cuidado com o som e a cor é impressionante.',
    metric: '+12 contratos B2B',
  },
];

export function TestimonialsMarquee() {
  return (
    <section id="sobre" className="py-20 bg-[#131313] border-t border-[#222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center space-y-2">
        <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
          Depoimentos Reais
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-sans">
          QUEM CONFIA NA BRUTAL MARKETING.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans">
          O que dizem os líderes e marcas que aceleram sua presença audiovisual conosco.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#161616] border border-[#262626] rounded-2xl p-6 sm:p-7 space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-primary bg-primary/10 border border-primary/30 px-2.5 py-0.5 rounded-full font-bold">
                    {t.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans italic">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#262626] flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-primary/40"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-sans flex items-center gap-1">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-primary fill-primary" />
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 block">
                    {t.role} • {t.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
