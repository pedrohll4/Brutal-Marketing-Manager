'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Heart, MessageCircle, Flame, Sparkles } from 'lucide-react';

interface FloatingParticle {
  id: number;
  type: 'heart' | 'comment' | 'sparkle';
  x: number; // %
  y: number; // px offset
  baseY: number;
  speed: number;
  scale: number;
  opacity: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  text?: string;
  author?: string;
}

const COMMENTS_POOL = [
  { text: 'Essa edição da safra explodiu! 🔥', author: '@nicole.procampo' },
  { text: 'Bateu 350k visualizações em 24h! 🎬', author: '@carlos.techrush' },
  { text: 'Qualidade de cinema internacional ⚡', author: '@vanguard.imoveis' },
  { text: 'Mais de 40 clientes novos pelo Reels 📈', author: '@apex.log' },
  { text: 'A retenção nos primeiros 3s é surreal 🚀', author: '@mkt.expert' },
  { text: 'Color grading no padrão Netflix 🎥', author: '@cinema.studio' },
  { text: 'Fechamos todas as cotas da feira! 💰', author: '@agro.business' },
];

export function BackgroundReactionsStream() {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const frameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const scrollRef = useRef<number>(0);

  useEffect(() => {
    // Generate 30 dynamic particles spread vertically and horizontally
    const generated: FloatingParticle[] = [];
    for (let i = 0; i < 28; i++) {
      const isComment = i % 5 === 0;
      const commentObj = COMMENTS_POOL[i % COMMENTS_POOL.length];
      
      generated.push({
        id: i,
        type: isComment ? 'comment' : 'heart',
        x: (i * 13.5) % 94 + 3,
        y: i * 130 + Math.random() * 60,
        baseY: i * 130,
        speed: 0.4 + (i % 5) * 0.25,
        scale: isComment ? 0.9 : 0.65 + (i % 4) * 0.2,
        opacity: 0.35 + (i % 3) * 0.25,
        wobbleSpeed: 0.0015 + (i % 3) * 0.001,
        wobbleOffset: i * 1.5,
        text: isComment ? commentObj.text : undefined,
        author: isComment ? commentObj.author : undefined,
      });
    }

    setParticles(generated);

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop for live floating movement & sway
    const animate = (timestamp: number) => {
      timeRef.current = timestamp;
      setParticles((prev) =>
        prev.map((p) => {
          const docHeight = typeof document !== 'undefined' ? document.body.scrollHeight || 3000 : 3000;
          // Calculate dynamic continuous falling + scroll flow
          const scrollFactor = scrollRef.current * p.speed * 0.7;
          const timeFactor = (timestamp * 0.04 * p.speed);
          const rawY = (p.baseY + timeFactor + scrollFactor) % (docHeight + 200);

          return {
            ...p,
            y: rawY,
          };
        })
      );

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {particles.map((p) => {
        // Continuous organic sway using sine wave
        const swayX = Math.sin(timeRef.current * p.wobbleSpeed + p.wobbleOffset) * 28;
        const pulseScale = p.scale * (1 + Math.sin(timeRef.current * 0.003 + p.id) * 0.12);

        if (p.type === 'comment' && p.text) {
          return (
            <div
              key={p.id}
              className="absolute transition-transform duration-75 ease-out hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616]/80 backdrop-blur-md border border-primary/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}px`,
                transform: `translateX(${swayX}px) scale(${pulseScale})`,
                opacity: p.opacity,
              }}
            >
              <div className="w-5 h-5 rounded-full bg-primary/25 flex items-center justify-center text-primary animate-pulse">
                <Heart className="w-2.5 h-2.5 fill-primary" />
              </div>
              <div className="text-[11px] font-sans flex items-center gap-1.5">
                <span className="font-bold text-zinc-200">{p.author}</span>
                <span className="text-zinc-400">{p.text}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={p.id}
            className="absolute transition-transform duration-75 ease-out"
            style={{
              left: `${p.x}%`,
              top: `${p.y}px`,
              transform: `translateX(${swayX}px) scale(${pulseScale}) rotate(${swayX * 1.5}deg)`,
              opacity: p.opacity,
            }}
          >
            <Heart className="w-6 h-6 text-primary fill-primary drop-shadow-[0_0_15px_rgba(255,87,8,0.8)]" />
          </div>
        );
      })}
    </div>
  );
}
