'use client';

import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import { getEmbeddableMediaUrl } from '@/lib/utils';
import { Modal } from '../ui/Modal';
import { AICopyDrawer } from './AICopyDrawer';
import {
  Film,
  Camera,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Send,
  Sparkles,
  MapPin,
  ExternalLink,
  FolderOpen,
  FileText,
  Download,
} from 'lucide-react';

interface MediaApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

interface PhotoPin {
  id: string;
  xPercent: number;
  yPercent: number;
  comment: string;
  author: string;
  createdAt: string;
}

export function MediaApprovalModal({ isOpen, onClose, task }: MediaApprovalModalProps) {
  const { updateTaskStatus, addTaskComment, addToast, clients } = useSystemStore();
  const { user } = useAuth();

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(15);
  const totalDuration = 60; // 60s video simulation
  const [timestampComment, setTimestampComment] = useState('');

  // Photo State (Visual Pinning on Image)
  const [photoPins, setPhotoPins] = useState<PhotoPin[]>([
    {
      id: 'pin-1',
      xPercent: 45,
      yPercent: 32,
      comment: 'Ajustar o contraste da pele e suavizar reflexo na lente.',
      author: 'Nicole Procampo (Cliente)',
      createdAt: '14:20',
    },
  ]);
  const [newPinComment, setNewPinComment] = useState('');
  const [pendingPinPos, setPendingPinPos] = useState<{ x: number; y: number } | null>(null);

  // AI Copy State
  const [showAICopy, setShowAICopy] = useState(false);

  if (!task) return null;

  const isVideo = task.taskType === 'VIDEO' || !task.taskType;
  const isPhoto = task.taskType === 'PHOTO';

  const mediaInfo = getEmbeddableMediaUrl(task.mediaUrl);
  const hasEmbedPlayer = mediaInfo.type === 'gdrive_file' || mediaInfo.type === 'youtube' || mediaInfo.type === 'vimeo';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Video Timestamp Comment Add
  const handleAddVideoTimestampComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timestampComment.trim()) return;

    const formattedTime = formatTime(currentSecond);
    const fullComment = `[Timestamp ${formattedTime}] ${timestampComment.trim()}`;

    addTaskComment(
      task.id,
      fullComment,
      user?.fullName || 'Cliente',
      user?.role || 'CLIENT'
    );

    setTimestampComment('');
    addToast({
      title: 'Comentário com Timestamp Registrado',
      description: `Marcado no segundo ${formattedTime}.`,
      type: 'info',
    });
  };

  // Photo Pin Click
  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPendingPinPos({ x, y });
  };

  const handleAddPhotoPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinComment.trim() || !pendingPinPos) return;

    const newPin: PhotoPin = {
      id: `pin-${Date.now()}`,
      xPercent: pendingPinPos.x,
      yPercent: pendingPinPos.y,
      comment: newPinComment.trim(),
      author: user?.fullName || 'Cliente',
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setPhotoPins((prev) => [...prev, newPin]);

    // Also log in task comments
    addTaskComment(
      task.id,
      `[Marcação na Foto ${newPin.xPercent}%x${newPin.yPercent}%] ${newPin.comment}`,
      user?.fullName || 'Cliente',
      user?.role || 'CLIENT'
    );

    setNewPinComment('');
    setPendingPinPos(null);
    addToast({
      title: 'Marcação de Retoque Adicionada',
      description: 'Ponto fixado na imagem com sucesso.',
      type: 'info',
    });
  };

  // Approval actions
  const handleApprove = () => {
    updateTaskStatus(task.id, 'APPROVED');
    addTaskComment(
      task.id,
      '✓ Conteúdo Aprovado com Sucesso pelo Cliente!',
      user?.fullName || 'Cliente',
      user?.role || 'CLIENT'
    );
    addToast({
      title: 'Conteúdo Aprovado! 🎉',
      description: `"${task.title}" foi aprovado. A IA gerou a legenda para postagem!`,
      type: 'success',
    });
    // Automatically trigger AI copywriter generator!
    setShowAICopy(true);
  };

  const handleRequestAdjustments = () => {
    updateTaskStatus(task.id, 'IN_REVIEW');
    addTaskComment(
      task.id,
      '⚠ Cliente solicitou ajustes no conteúdo conforme notas e marcações.',
      user?.fullName || 'Cliente',
      user?.role || 'CLIENT'
    );
    addToast({
      title: 'Ajustes Solicitados',
      description: 'A equipe de edição/fotografia foi notificada para correções.',
      type: 'warning',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVideo ? 'Revisão & Aprovação de Vídeo' : 'Revisão & Aprovação Fotográfica'}
      subtitle={`${task.clientName} • ${task.title}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Drive Resources Header Links */}
        {(task.rawFolderUrl || task.scriptUrl || task.mediaUrl) && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-[#181818] border border-[#262626] rounded-lg text-xs font-mono">
            <span className="text-on-surface-variant font-bold uppercase text-[10px] mr-1">
              Recursos de Produção:
            </span>

            {task.mediaUrl && (
              <a
                href={task.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#222] hover:bg-primary/20 hover:text-primary border border-[#333] text-on-surface flex items-center gap-1 transition-colors"
              >
                <Film className="w-3 h-3 text-primary" />
                <span>Abrir Mídia Original</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
              </a>
            )}

            {task.rawFolderUrl && (
              <a
                href={task.rawFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#222] hover:bg-primary/20 hover:text-primary border border-[#333] text-on-surface flex items-center gap-1 transition-colors"
              >
                <FolderOpen className="w-3 h-3 text-amber-400" />
                <span>Pasta de Brutos (Drive)</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
              </a>
            )}

            {task.scriptUrl && (
              <a
                href={task.scriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#222] hover:bg-primary/20 hover:text-primary border border-[#333] text-on-surface flex items-center gap-1 transition-colors"
              >
                <FileText className="w-3 h-3 text-blue-400" />
                <span>Roteiro / Docs</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowAICopy(!showAICopy)}
              className={`ml-auto px-3 py-1 rounded border text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
                showAICopy
                  ? 'bg-primary text-white border-primary'
                  : 'bg-primary/15 text-primary border-primary/40 hover:bg-primary/25'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showAICopy ? 'Ocultar Legenda IA' : '✨ Gerar Legenda & Hashtags com IA'}</span>
            </button>
          </div>
        )}

        {/* AI Copywriting & Hashtags Drawer */}
        <AICopyDrawer
          task={task}
          client={clients.find((c) => c.id === task.clientId)}
          isOpen={showAICopy}
          onClose={() => setShowAICopy(false)}
        />

        {/* ========================================================================= */}
        {/* VIDEO MODE */}
        {/* ========================================================================= */}
        {isVideo && (
          <div className="space-y-4">
            {/* If there is a Google Drive / YouTube / Vimeo Embed */}
            {hasEmbedPlayer && mediaInfo.embedUrl ? (
              <div className="relative aspect-video bg-black rounded-lg border border-[#2e2e2e] overflow-hidden shadow-2xl">
                <iframe
                  src={mediaInfo.embedUrl}
                  title="Player de Pré-visualização"
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Fallback: Interactive Video Player Simulation */
              <div className="relative aspect-video bg-black rounded-lg border border-[#2e2e2e] overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                {/* Top Watermark / Info */}
                <div className="flex justify-between items-center text-xs font-mono z-10">
                  <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded text-primary font-bold border border-primary/20 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" /> PREVIEW 4K UHD • 60 FPS
                  </span>
                  <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded text-zinc-300">
                    {formatTime(currentSecond)} / {formatTime(totalDuration)}
                  </span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </button>
                </div>

                {/* Bottom Scrubber Timeline */}
                <div className="space-y-2 z-10">
                  <input
                    type="range"
                    min="0"
                    max={totalDuration}
                    value={currentSecond}
                    onChange={(e) => setCurrentSecond(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>Início (00:00)</span>
                    <span className="text-primary font-bold">Pausa atual: {formatTime(currentSecond)}</span>
                    <span>Fim ({formatTime(totalDuration)})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp Comment Input */}
            <form
              onSubmit={handleAddVideoTimestampComment}
              className="p-3 bg-[#181818] border border-[#2a2a2a] rounded-lg flex flex-col sm:flex-row gap-2"
            >
              <div className="flex items-center gap-2 bg-[#141414] border border-[#333] px-3 py-1.5 rounded shrink-0">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-xs text-primary font-bold">
                  {formatTime(currentSecond)}
                </span>
              </div>

              <input
                type="text"
                placeholder={`Adicionar observação no segundo ${formatTime(currentSecond)} (ex: Ajustar corte, trocar áudio)...`}
                value={timestampComment}
                onChange={(e) => setTimestampComment(e.target.value)}
                className="flex-1 bg-[#141414] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />

              <button
                type="submit"
                disabled={!timestampComment.trim()}
                className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" /> Marcar
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHOTO MODE */}
        {/* ========================================================================= */}
        {isPhoto && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Camera className="w-4 h-4" /> Ensaio Fotográfico em Alta Resolução (RAW / ProRGB)
              </span>
              <span>Clique na imagem para adicionar um ponto de ajuste</span>
            </div>

            {/* Interactive Photo Canvas with Click-to-Pin */}
            <div
              onClick={handlePhotoClick}
              className="relative aspect-[4/3] bg-[#181818] rounded-lg border border-[#2e2e2e] overflow-hidden cursor-crosshair group select-none shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  task.mediaUrl && !task.mediaUrl.includes('drive.google.com')
                    ? task.mediaUrl
                    : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=90'
                }
                alt="Ensaio Fotográfico"
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Existing Pins */}
              {photoPins.map((pin, idx) => (
                <div
                  key={pin.id}
                  style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white font-mono font-black text-[11px] flex items-center justify-center ring-4 ring-black/70 shadow-2xl cursor-pointer hover:scale-125 transition-transform">
                    {idx + 1}
                  </div>
                  {/* Tooltip on Hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-[#121212] border border-primary rounded text-[11px] text-on-surface shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-30 font-sans">
                    <strong className="text-primary block font-mono text-[10px]">Ponto #{idx + 1}:</strong>
                    {pin.comment}
                  </div>
                </div>
              ))}

              {/* Pending Pin Indicator */}
              {pendingPinPos && (
                <div
                  style={{ left: `${pendingPinPos.x}%`, top: `${pendingPinPos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-black font-mono font-black text-[11px] flex items-center justify-center ring-4 ring-black/70 shadow-2xl animate-bounce">
                    +
                  </div>
                </div>
              )}
            </div>

            {/* Form for new pin */}
            {pendingPinPos && (
              <form
                onSubmit={handleAddPhotoPin}
                className="p-3 bg-[#1e1712] border border-amber-500/40 rounded-lg flex flex-col sm:flex-row gap-2 animate-in fade-in"
              >
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold shrink-0">
                  <MapPin className="w-4 h-4" />
                  <span>Ponto ({pendingPinPos.x}%, {pendingPinPos.y}%):</span>
                </div>

                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Descreva o que precisa ser ajustado nesta área (ex: remover reflexo, clarear fundo)..."
                  value={newPinComment}
                  onChange={(e) => setNewPinComment(e.target.value)}
                  className="flex-1 bg-[#141414] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingPinPos(null)}
                    className="px-3 py-1.5 rounded bg-transparent border border-[#333] text-on-surface text-xs font-mono"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs font-mono shadow"
                  >
                    Salvar Ponto
                  </button>
                </div>
              </form>
            )}

            {/* List of Photo Pins */}
            <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg">
              <h4 className="text-xs font-bold font-mono uppercase text-on-surface mb-2">
                Pontos de Ajuste Registrados na Imagem ({photoPins.length})
              </h4>
              <div className="space-y-1.5 text-xs">
                {photoPins.map((pin, idx) => (
                  <div key={pin.id} className="flex items-start gap-2 p-2 rounded bg-[#141414] border border-[#222]">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary border border-primary/40 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-on-surface leading-tight">{pin.comment}</p>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        Por {pin.author} às {pin.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Existing Comments Log */}
        <div className="border-t border-[#262626] pt-4 space-y-2">
          <h4 className="font-bold text-xs font-mono uppercase text-on-surface flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            Histórico de Revisões & Feedbacks ({task.comments?.length || 0})
          </h4>

          <div className="max-h-32 overflow-y-auto space-y-1.5">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((c) => (
                <div key={c.id} className="p-2 rounded bg-[#181818] border border-[#222] text-xs font-mono">
                  <div className="flex justify-between text-[10px] text-on-surface-variant mb-0.5">
                    <strong className="text-primary">{c.authorName}</strong>
                    <span>{c.createdAt}</span>
                  </div>
                  <p className="text-on-surface font-sans">{c.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-on-surface-variant">
                Nenhum comentário registrado ainda.
              </p>
            )}
          </div>
        </div>

        {/* Action Decision Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1a1a1a] text-xs font-mono"
          >
            Fechar sem Alterar
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRequestAdjustments}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Solicitar Ajustes</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-lg hover:shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Aprovar Conteúdo</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
