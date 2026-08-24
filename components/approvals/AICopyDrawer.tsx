'use client';

import React, { useState, useEffect } from 'react';
import { Task, Client } from '@/lib/types';
import { generateAICopyForTask, GeneratedSocialCopy, CopyTone } from '@/lib/services/aiCopyService';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Hash,
  MessageSquare,
  Clock,
  Radio,
  Share2,
} from 'lucide-react';

interface AICopyDrawerProps {
  task: Task;
  client?: Client;
  onClose?: () => void;
  isOpen: boolean;
}

export function AICopyDrawer({ task, client, isOpen, onClose }: AICopyDrawerProps) {
  const { addToast } = useSystemStore();
  const [loading, setLoading] = useState(false);
  const [copyData, setCopyData] = useState<GeneratedSocialCopy | null>(null);
  const [tone, setTone] = useState<CopyTone>('ENGAGING');
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const fetchCopy = async (selectedTone: CopyTone = tone) => {
    setLoading(true);
    try {
      const result = await generateAICopyForTask(task, client, selectedTone);
      setCopyData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !copyData) {
      fetchCopy();
    }
  }, [isOpen, task.id]);

  const handleCopyFull = () => {
    if (!copyData) return;
    navigator.clipboard.writeText(copyData.fullFormattedText);
    setCopiedFull(true);
    addToast({
      title: 'Legenda Copiada! 📋',
      description: 'Pronto para colar no Instagram, TikTok ou YouTube.',
      type: 'success',
    });
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const handleCopyHashtags = () => {
    if (!copyData) return;
    navigator.clipboard.writeText(copyData.hashtags.join(' '));
    setCopiedHashtags(true);
    addToast({
      title: 'Hashtags Copiadas! 🏷️',
      description: 'Hashtags estratégicas copiadas para a área de transferência.',
      type: 'info',
    });
    setTimeout(() => setCopiedHashtags(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="p-4 bg-[#141414] border border-primary/40 rounded-xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-primary/20 text-primary border border-primary/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span>IA Copywriter & Hashtags Inteligentes</span>
              <span className="text-[9px] font-mono font-bold bg-primary text-white px-1.5 py-0.2 rounded uppercase">
                IA Brutal
              </span>
            </h4>
            <p className="text-[11px] font-mono text-on-surface-variant">
              Legenda estratégica personalizada para {client?.companyName || task.clientName}
            </p>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] p-1 rounded text-[10px] font-mono">
          <button
            type="button"
            onClick={() => {
              setTone('ENGAGING');
              fetchCopy('ENGAGING');
            }}
            className={`px-2 py-0.5 rounded transition-all ${
              tone === 'ENGAGING' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Engajamento
          </button>
          <button
            type="button"
            onClick={() => {
              setTone('SALES');
              fetchCopy('SALES');
            }}
            className={`px-2 py-0.5 rounded transition-all ${
              tone === 'SALES' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Vendas / Conversão
          </button>
          <button
            type="button"
            onClick={() => {
              setTone('STORYTELLING');
              fetchCopy('STORYTELLING');
            }}
            className={`px-2 py-0.5 rounded transition-all ${
              tone === 'STORYTELLING' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Storytelling
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          <span className="text-xs font-mono text-on-surface-variant">
            A IA está analisando o segmento e gerando a copy perfeita...
          </span>
        </div>
      ) : copyData ? (
        <div className="space-y-3.5">
          {/* Main Caption Box */}
          <div className="p-3.5 rounded-lg bg-[#181818] border border-[#282828] space-y-2 text-xs">
            {/* Headline / Hook */}
            <div className="font-bold text-primary font-sans text-sm pb-1 border-b border-[#222]">
              {copyData.headline}
            </div>

            {/* Body */}
            <p className="text-on-surface leading-relaxed whitespace-pre-line">
              {copyData.caption}
            </p>

            {/* CTA */}
            <p className="text-zinc-300 font-semibold pt-1">
              {copyData.cta}
            </p>
          </div>

          {/* Strategic Hashtags */}
          <div className="p-3 rounded-lg bg-[#161616] border border-[#262626] space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant uppercase font-bold">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3 text-primary" />
                Hashtags de Alto Alcance & Nicho ({copyData.hashtags.length})
              </span>
              <button
                type="button"
                onClick={handleCopyHashtags}
                className="text-primary hover:underline flex items-center gap-1 font-bold"
              >
                {copiedHashtags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHashtags ? 'Copiadas!' : 'Copiar apenas #'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {copyData.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#202020] text-primary hover:bg-primary/20 px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(tag);
                    addToast({ title: `Hashtag ${tag} copiada!`, type: 'info' });
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Media Tips Bar */}
          {(copyData.trendingAudioTip || copyData.bestTimeToPost) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              {copyData.trendingAudioTip && (
                <div className="p-2 rounded bg-[#1c1610] border border-primary/20 text-primary flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{copyData.trendingAudioTip}</span>
                </div>
              )}
              {copyData.bestTimeToPost && (
                <div className="p-2 rounded bg-[#101915] border border-emerald-800/30 text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{copyData.bestTimeToPost}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#242424]">
            <button
              type="button"
              onClick={() => fetchCopy()}
              className="px-3 py-2 rounded bg-[#202020] hover:bg-[#282828] text-on-surface text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerar com IA</span>
            </button>

            <button
              type="button"
              onClick={handleCopyFull}
              className="px-5 py-2 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
            >
              {copiedFull ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFull ? 'Copiado para o Instagram!' : 'Copiar Legenda Completa + #'}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
