'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Music,
  Volume2,
  VolumeX,
  CheckCircle2,
  TrendingUp,
  Flame,
  Play,
} from 'lucide-react';

interface ActiveParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export function ThreeDPhoneMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRigRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);

  // Motion target references for smooth 60fps LERP interpolation
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const scrollYRef = useRef(0);

  const [isLiked, setIsLiked] = useState(true);
  const [likeCount, setLikeCount] = useState(94280);
  const [isMuted, setIsMuted] = useState(true);
  const [heartBurst, setHeartBurst] = useState(false);
  const [activeCommentIndex, setActiveCommentIndex] = useState(0);
  const [particles, setParticles] = useState<ActiveParticle[]>([]);
  const frameRef = useRef<number | null>(null);

  const comments = [
    {
      author: 'nicole.procampo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Essa edição da safra converteu 40% a mais! 🔥',
      badge: 'Cliente VIP',
    },
    {
      author: 'carlos.techrush',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Mais de 350k views em 48h! Produção de cinema 🎬',
      badge: 'Case Viral',
    },
    {
      author: 'rodrigo.vanguard',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      text: 'Fechamos todas as cotas do lançamento 💰',
      badge: 'Top ROI',
    },
  ];

  // Rotate comments
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCommentIndex((prev) => (prev + 1) % comments.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [comments.length]);

  // Continuously spawn floating hearts from the phone
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      const newParticle: ActiveParticle = {
        id: Date.now() + Math.random(),
        x: 68 + (Math.random() * 16 - 8),
        y: 65 + (Math.random() * 12 - 6),
        vx: (Math.random() - 0.4) * 1.5,
        vy: -(1.6 + Math.random() * 1.5),
        scale: 0.75 + Math.random() * 0.4,
        opacity: 1,
        rotation: (Math.random() - 0.5) * 30,
      };

      setParticles((prev) => [...prev.slice(-10), newParticle]);
    }, 800);

    return () => clearInterval(spawnTimer);
  }, []);

  // Real-time 60fps GPU Animation Loop, Mouse, Touch & Gyroscope Tracking
  useEffect(() => {
    // 1. Mouse Tracking (Desktop)
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetXRef.current = (e.clientX - centerX) / centerX;
      targetYRef.current = (e.clientY - centerY) / centerY;
    };

    // 2. Touch Drag Tracking (Mobile Screen Drag)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        targetXRef.current = (touch.clientX - centerX) / (centerX * 0.7);
        targetYRef.current = (touch.clientY - centerY) / (centerY * 0.7);
      }
    };

    const handleTouchEnd = () => {
      // Smoothly float back to natural ambient position
      targetXRef.current = 0;
      targetYRef.current = 0;
    };

    // 3. Gyroscope / Device Orientation (Physical Hand Tilting on Mobile)
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // Gamma = Left/Right Tilt [-90, 90]
        // Beta = Front/Back Tilt [-180, 180], baseline holding angle is ~45deg
        const normGamma = Math.min(Math.max(e.gamma / 25, -1.2), 1.2);
        const normBeta = Math.min(Math.max((e.beta - 45) / 30, -1.2), 1.2);
        targetXRef.current = normGamma;
        targetYRef.current = normBeta;
      }
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    let startTime = performance.now();

    const animateLoop = (timestamp: number) => {
      const time = (timestamp - startTime) * 0.002;

      // Smooth LERP towards target position (0.08 damping)
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.08;
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.08;

      // Continuous ambient floating sine wave motion
      const ambientTiltX = Math.sin(time * 1.2) * 4.5;
      const ambientTiltY = Math.cos(time * 0.9) * 5.5;
      const ambientFloatY = Math.sin(time * 1.4) * 8.5;

      // Scroll calculations
      const scrollY = scrollYRef.current;
      const exitProgress = Math.min(Math.max((scrollY - 400) / 450, 0), 1);
      const scrollTranslateY = ambientFloatY + exitProgress * 140;
      const scrollScale = 1 - exitProgress * 0.3;
      const scrollOpacity = 1 - exitProgress;

      // High Sensitivity Rotations
      const rotateY = currentXRef.current * 26 + ambientTiltY;
      const rotateX = -currentYRef.current * 24 + ambientTiltX + exitProgress * 14;
      const rotateZ = currentXRef.current * -5;

      // Apply transforms directly via hardware-accelerated CSS for 60fps buttery smoothness
      if (phoneRigRef.current) {
        phoneRigRef.current.style.transform = `translateY(${scrollTranslateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scrollScale})`;
      }

      if (containerRef.current) {
        containerRef.current.style.opacity = `${scrollOpacity}`;
        containerRef.current.style.pointerEvents = scrollOpacity <= 0.01 ? 'none' : 'auto';
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${rotateY * 2}px, ${-rotateX * 2}px, -50px)`;
      }

      if (badge1Ref.current) {
        badge1Ref.current.style.transform = `translate3d(${rotateY * -1.4}px, ${rotateX * -1.4}px, 50px)`;
      }

      if (badge2Ref.current) {
        badge2Ref.current.style.transform = `translate3d(${rotateY * 1.5}px, ${targetYRef.current * 1.5}px, 60px)`;
      }

      // Update particle physics
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.35,
            y: p.y + p.vy * 0.5,
            opacity: p.opacity - 0.016,
            scale: p.scale * 1.01,
            rotation: p.rotation + p.vx * 1.5,
          }))
          .filter((p) => p.opacity > 0)
      );

      frameRef.current = requestAnimationFrame(animateLoop);
    };

    frameRef.current = requestAnimationFrame(animateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleDoubleTap = () => {
    setHeartBurst(true);
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setTimeout(() => setHeartBurst(false), 800);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[275px] sm:max-w-[295px] mx-auto py-2 select-none touch-none"
      style={{
        perspective: '1300px',
      }}
    >
      {/* 3D Volumetric Glow Aura in Background */}
      <div
        ref={auraRef}
        className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-orange-600/15 to-transparent blur-[70px] rounded-full scale-120 pointer-events-none transition-transform duration-75 ease-out"
      />

      {/* Floating Particles Shooting Out of the Phone */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            right: `${p.x}%`,
            top: `${p.y}%`,
            transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
          }}
        >
          <Heart className="w-5 h-5 text-red-500 fill-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]" />
        </div>
      ))}

      {/* Floating Status Badge 1 (Top Left) */}
      <div
        ref={badge1Ref}
        className="absolute -top-3 -left-4 sm:-left-8 z-40 bg-[#161616]/95 backdrop-blur-xl border border-primary/50 rounded-xl px-2.5 py-2 shadow-[0_10px_25px_rgba(0,0,0,0.85)] flex items-center gap-2 pointer-events-none"
      >
        <div className="w-6 h-6 rounded-lg bg-primary/25 border border-primary/40 flex items-center justify-center text-primary animate-pulse">
          <Flame className="w-3.5 h-3.5 fill-primary" />
        </div>
        <div>
          <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-wider">
            Reels Em Alta
          </span>
          <strong className="text-[11px] font-mono font-bold text-white block">
            🔥 +94.2k Likes
          </strong>
        </div>
      </div>

      {/* Floating Status Badge 2 (Right Side) */}
      <div
        ref={badge2Ref}
        className="absolute top-1/2 -right-4 sm:-right-8 z-40 bg-[#161616]/95 backdrop-blur-xl border border-emerald-500/50 rounded-xl px-2.5 py-2 shadow-[0_10px_25px_rgba(0,0,0,0.85)] flex items-center gap-2 pointer-events-none"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-wider">
            Retenção
          </span>
          <strong className="text-[11px] font-mono font-bold text-emerald-400 block">
            98.6% nos 3s
          </strong>
        </div>
      </div>

      {/* ── 3D IPHONE CHASSIS (Smooth 60FPS Continuous Motion Rig) ── */}
      <div
        ref={phoneRigRef}
        className="relative mx-auto cursor-pointer will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
        }}
        onDoubleClick={handleDoubleTap}
      >
        {/* Outer Titanium Rim Shell */}
        <div
          className="relative rounded-[48px] p-[2.5px] bg-gradient-to-b from-[#555] via-[#2a2a2a] to-[#141414]"
          style={{
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.95),
              0 10px 20px rgba(0, 0, 0, 0.7),
              0 0 35px rgba(255, 87, 8, 0.22),
              inset 0 1px 2px rgba(255, 255, 255, 0.35),
              inset 0 -2px 3px rgba(0, 0, 0, 0.8)
            `,
          }}
        >
          {/* Mid-Bezel Chamfer with Smooth Continuous Metallic Highlight */}
          <div
            className="rounded-[45.5px] p-[6px]"
            style={{
              background: 'linear-gradient(135deg, #444 0%, #1e1e1e 40%, #2e2e2e 70%, #4a4a4a 100%)',
              boxShadow: 'inset 0 0 2px rgba(0,0,0,0.9)',
            }}
          >
            {/* Black Display Bezel Frame */}
            <div className="relative rounded-[39.5px] overflow-hidden bg-black aspect-[9/18.5] flex flex-col justify-between p-3 text-white border border-[#262626] shadow-inner">
              
              {/* Dynamic Light Sheen across Front Glass */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden z-30 opacity-70"
                style={{
                  background: 'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 30%, transparent 60%)',
                }}
              />

              {/* Dynamic Island Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-inner border border-white/10">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[7.5px] font-mono text-zinc-300 font-bold tracking-tight">4K HDR</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#181818] border border-[#333] flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-primary/80" />
                </div>
              </div>

              {/* Active Cinematic Video Background */}
              <div className="absolute inset-0 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80"
                  alt="Produção Brutal"
                  className="w-full h-full object-cover opacity-90 scale-105"
                />
                {/* Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/65 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/15 to-black/85" />
              </div>

              {/* Central Play Pulse Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-12 h-12 rounded-full bg-black/50 border border-primary/60 backdrop-blur-md flex items-center justify-center text-primary shadow-[0_0_25px_rgba(255,87,8,0.7)] group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-primary ml-0.5" />
                </div>
              </div>

              {/* Double Tap Heart Burst Animation */}
              {heartBurst && (
                <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none animate-in zoom-in-50 duration-200">
                  <Heart className="w-20 h-20 text-red-500 fill-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,1)] animate-bounce" />
                </div>
              )}

              {/* Top Instagram Reels Header */}
              <div className="relative z-20 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
                  <div className="w-5 h-5 rounded-full bg-[#181818] border border-primary/40 flex items-center justify-center p-0.5 shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/brutal-icon-orange-transparent.png"
                      alt="Brutal Marketing"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white tracking-tight">
                    brutalmarketing
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-primary fill-primary" />
                </div>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-6 h-6 rounded-full bg-black/65 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>

              {/* Instagram Action Column (Right Side) */}
              <div className="absolute right-2.5 bottom-18 z-20 flex flex-col items-center gap-3 text-white">
                {/* Like */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
                  }}
                  className="flex flex-col items-center gap-0.5 group cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      isLiked
                        ? 'bg-red-500/30 text-red-500 border border-red-500/60 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                        : 'bg-black/50 text-white border border-white/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                  </div>
                  <span className="text-[8.5px] font-mono font-bold drop-shadow">
                    {(likeCount / 1000).toFixed(1)}k
                  </span>
                </button>

                {/* Comments */}
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8.5px] font-mono font-bold drop-shadow">2.4k</span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8.5px] font-mono font-bold drop-shadow">38k</span>
                </div>

                {/* Save */}
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Feed Information & Pop-up Live Comment */}
              <div className="relative z-20 space-y-1.5 pr-10">
                {/* Pop-up Live Comment inside Phone */}
                <div className="bg-[#141414]/95 backdrop-blur-md border border-primary/40 rounded-lg p-1.5 shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[9px] font-bold text-white truncate">
                      @{comments[activeCommentIndex].author}
                    </span>
                    <span className="text-[7.5px] font-mono px-1 py-0.2 rounded bg-primary/20 text-primary border border-primary/30 font-bold shrink-0">
                      {comments[activeCommentIndex].badge}
                    </span>
                  </div>
                  <p className="text-[9px] text-zinc-200 leading-snug font-sans line-clamp-2">
                    {comments[activeCommentIndex].text}
                  </p>
                </div>

                {/* Caption & Track */}
                <div className="space-y-0.5">
                  <p className="text-[9.5px] text-white leading-snug drop-shadow font-sans font-medium line-clamp-1">
                    Como transformar vídeos em vendas diárias. 🎬⚡
                  </p>
                  <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-300">
                    <Music className="w-2 h-2 text-primary animate-spin" />
                    <span className="truncate">Áudio Original • Brutal Track</span>
                  </div>
                </div>

                {/* Sound Equalizer Waves */}
                <div className="flex items-end gap-0.5 h-2 pt-0.5">
                  {[50, 90, 60, 100, 45, 95, 70, 85, 40, 75, 95, 60, 100, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 100}ms`,
                        animationDuration: '700ms',
                      }}
                    />
                  ))}
                </div>

                {/* Home Indicator Bar */}
                <div className="w-24 h-0.5 bg-white/40 rounded-full mx-auto mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
