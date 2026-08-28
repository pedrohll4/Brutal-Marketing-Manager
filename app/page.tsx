'use client';

import React, { useState } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { PortfolioReelsShowcase } from '@/components/landing/PortfolioReelsShowcase';
import { ResultsSection } from '@/components/landing/ResultsSection';
import { TestimonialsMarquee } from '@/components/landing/TestimonialsMarquee';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { WaitlistModal } from '@/components/landing/WaitlistModal';
import { BackgroundReactionsStream } from '@/components/landing/BackgroundReactionsStream';

export default function MarketingLandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] selection:bg-primary selection:text-white font-sans antialiased overflow-x-hidden relative">
      {/* Dynamic Background Particle & Reaction Stream (Likes and Comments descending on scroll) */}
      <BackgroundReactionsStream />

      {/* Header */}
      <LandingHeader onOpenWaitlist={() => setIsWaitlistOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Hero with Realistic 3D Instagram Reels Phone Mockup */}
        <HeroSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />

        {/* 2. Continuous Running Portfolio Showcase with Click-to-Play Video Modal */}
        <PortfolioReelsShowcase onOpenWaitlist={() => setIsWaitlistOpen(true)} />

        {/* 3. Como Funciona a Esteira Brutal (4 Steps) */}
        <ResultsSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />

        {/* 4. Client Testimonials & Authority */}
        <TestimonialsMarquee />
      </main>

      {/* Footer */}
      <LandingFooter onOpenWaitlist={() => setIsWaitlistOpen(true)} />

      {/* Interactive Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}
