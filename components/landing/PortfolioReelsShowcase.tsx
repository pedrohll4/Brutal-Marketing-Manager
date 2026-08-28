'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Flame,
  TrendingUp,
  Film,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ReelItem {
  id: string;
  title: string;
  client: string;
  niche: string;
  views: string;
  retention: string;
  coverUrl: string;
  videoPreviewUrl: string;
  description: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: '1',
    title: 'Safra de Ouro & Bioestimulantes Agrícolas',
    client: 'Procampo Agronegócios',
    niche: 'Agronegócio',
    views: '480.200 views',
    retention: '98.4%',
    coverUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    description: 'Captação no campo com lentes anamórficas e iluminação de entardecer para demonstrar a tecnologia de nutrição de solo.',
  },
  {
    id: '2',
    title: 'Lançamento Fone X-Pro Noise Cancelling',
    client: 'TechRush Electronics',
    niche: 'Tecnologia & E-commerce',
    views: '345.900 views',
    retention: '97.8%',
    coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Comercial gravado em estúdio escuro com neon e macro lens para valorizar os acabamentos em titânio do produto.',
  },
  {
    id: '3',
    title: 'Aftermovie Oficial & Cobertura Feira Internacional',
    client: 'Vanguard Empreendimentos',
    niche: 'Eventos & Imóveis',
    views: '210.400 views',
    retention: '96.5%',
    coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    description: 'Cobertura dinâmica com Drone FPV 4K voando entre os estandes e entrevistas no mesmo dia.',
  },
  {
    id: '4',
    title: 'Posicionamento de Autoridade do Diretor',
    client: 'Apex Capital & Logística',
    niche: 'Corporativo & B2B',
    views: '168.000 views',
    retention: '99.1%',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    description: 'Série de vídeos em estúdio executivo falando sobre a expansão logística do porto com trilha cinematográfica.',
  },
  {
    id: '5',
    title: 'Trator Autônomo & Aplicação com Drones',
    client: 'Agrícola Santa Maria',
    niche: 'Agronegócio',
    views: '290.100 views',
    retention: '98.0%',
    coverUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    description: 'Storytelling de automação no campo focado na economia de combustível e produtividade por hectare.',
  },
  {
    id: '6',
    title: 'Case de Transformação Cloud & Data Centers',
    client: 'Nexxus Cloud Solutions',
    niche: 'Tecnologia',
    views: '194.500 views',
    retention: '97.2%',
    coverUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    videoPreviewUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    description: 'Animações 3D integradas a imagens reais dos servidores para explicar a segurança de ponta da plataforma.',
  },
];

export function PortfolioReelsShowcase({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);

  // Simulate video playback progress
  useEffect(() => {
    if (!selectedReel || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 150);
    return () => clearInterval(interval);
  }, [selectedReel, isPlaying]);

  return (
    <section id="producoes" className="py-20 md:py-28 bg-[#111111] border-t border-[#222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1b1b] border border-[#2a2a2a] text-primary text-xs font-mono font-bold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              <span>Vitrine Interativa Contínua</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
              PRODUÇÕES QUE DOMINAM O FEED.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl">
              Clique em qualquer vídeo para assistir aos cortes de cinema e conferir a qualidade das entregas.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenWaitlist}
            className="self-start md:self-auto bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 text-xs font-mono font-bold py-2.5 px-5 rounded-lg transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Garantir Produção Para Minha Marca</span>
          </button>
        </div>
      </div>

      {/* ── Continuous Running Carousel of Video Cards ── */}
      <div className="relative w-full overflow-x-auto pb-6 scrollbar-none">
        <div className="flex gap-6 px-4 sm:px-8 w-max">
          {REELS_DATA.concat(REELS_DATA).map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => {
                setSelectedReel(item);
                setIsPlaying(true);
                setProgress(10);
              }}
              className="group w-[260px] sm:w-[290px] bg-[#161616] border border-[#282828] hover:border-primary/70 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(255,87,8,0.2)] shrink-0 flex flex-col justify-between"
            >
              {/* Thumbnail Container (Reels Aspect) */}
              <div className="relative aspect-[9/14] overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300 font-bold uppercase">
                    {item.niche}
                  </span>
                </div>

                {/* Play Button Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-black/50 border border-primary/60 backdrop-blur-md flex items-center justify-center text-primary group-hover:scale-115 group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_25px_rgba(255,87,8,0.6)]">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Floating Metrics Badge on Bottom */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white font-bold bg-primary/90 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow">
                    <Flame className="w-3 h-3 fill-white" />
                    {item.views}
                  </span>
                  <span className="text-emerald-400 font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                    {item.retention} Retenção
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-1">
                <span className="text-[11px] font-mono text-primary font-bold block">
                  {item.client}
                </span>
                <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-primary transition-colors font-sans">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interactive Video Player Modal ── */}
      {selectedReel && (
        <Modal
          isOpen={!!selectedReel}
          onClose={() => setSelectedReel(null)}
          title=""
          maxWidth="2xl"
        >
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: 9:16 Vertical Video Screen */}
            <div className="md:col-span-6 relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-[#333] shadow-2xl mx-auto w-full max-w-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedReel.coverUrl}
                alt={selectedReel.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-primary/40 text-[10px] font-mono text-primary font-bold uppercase">
                    Cinema 4K HDR
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Center Play/Pause toggle */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-black/50 border border-primary text-primary hover:text-white hover:bg-primary mx-auto flex items-center justify-center backdrop-blur-md transition-all shadow-[0_0_30px_rgba(255,87,8,0.5)]"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>

                {/* Bottom Timeline Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>0:{(progress * 0.3).toFixed(0).padStart(2, '0')}</span>
                    <span>0:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Video Specifications & CTA */}
            <div className="md:col-span-6 space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono text-primary font-bold uppercase">
                  {selectedReel.client}
                </span>
                <h3 className="text-xl font-black text-white font-sans">
                  {selectedReel.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                {selectedReel.description}
              </p>

              {/* Performance Metrics */}
              <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Alcance do Vídeo:</span>
                  <strong className="text-white">{selectedReel.views}</strong>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Taxa de Retenção:</span>
                  <strong className="text-emerald-400">{selectedReel.retention}</strong>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Formato de Entrega:</span>
                  <strong className="text-primary">4K UHD Cinema 60FPS</strong>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReel(null);
                    onOpenWaitlist();
                  }}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-mono font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(255,87,8,0.4)] flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>Quero um Vídeo Como Esse</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
