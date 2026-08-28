'use client';

import React from 'react';
import Link from 'next/link';
import {
  Flame,
  MessageCircle,
  Instagram,
  Mail,
  MapPin,
  ArrowUp,
  ShieldCheck,
  Film,
} from 'lucide-react';
import { createWhatsAppWebLink } from '@/lib/services/whatsappService';

interface LandingFooterProps {
  onOpenWaitlist: () => void;
}

export function LandingFooter({ onOpenWaitlist }: LandingFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const waFooterLink = createWhatsAppWebLink(
    '(16) 99123-4567',
    'Olá, equipe da *Brutal Marketing*! 🎬\n\nGostaria de falar com o atendimento sobre a agência e serviços.'
  );

  return (
    <footer className="bg-[#0c0c0c] border-t border-[#222] text-zinc-400 font-sans pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#222]">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brutal-logo-white-transparent.png"
                alt="Brutal Marketing"
                className="h-10 w-auto object-contain drop-shadow-[0_2px_12px_rgba(255,85,0,0.3)] group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Agência especializada em captação de cinema 4K UHD, edição de alta retenção para Reels e gestão de autoridade para marcas que lideram seus mercados.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={waFooterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#181818] border border-[#2a2a2a] hover:border-primary text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Oficial"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#181818] border border-[#2a2a2a] hover:border-primary text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram @brutalmarketing"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
              </a>
              <a
                href="mailto:contato@brutalmarketing.com.br"
                className="w-9 h-9 rounded-lg bg-[#181818] border border-[#2a2a2a] hover:border-primary text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                title="E-mail"
              >
                <Mail className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Col 3: Navegação */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider block">
              Navegação
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#metodologia" className="hover:text-primary transition-colors">
                  • Metodologia 4K
                </a>
              </li>
              <li>
                <a href="#producoes" className="hover:text-primary transition-colors">
                  • Portfólio & Reels
                </a>
              </li>
              <li>
                <a href="#resultados" className="hover:text-primary transition-colors">
                  • Resultados & Métricas
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-primary transition-colors">
                  • Depoimentos de Clientes
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Plataforma & Acesso */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider block">
              Área de Clientes
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-primary hover:underline font-bold">
                  → Acessar Sistema
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  • Portal do Cliente
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  • Central de Aprovações
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenWaitlist}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Entrar na Fila de Espera</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contato */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider block">
              Atendimento
            </span>
            <div className="space-y-2 text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Ribeirão Preto & São Paulo / SP</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contato@brutalmarketing.com.br</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded bg-[#181818] border border-[#2a2a2a] text-[10px] text-zinc-400">
                  Seg a Sex • 08h às 18h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Brutal Marketing Ltda. Todos os direitos reservados.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
