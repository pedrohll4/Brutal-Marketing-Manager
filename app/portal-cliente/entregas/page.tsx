'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatDate } from '@/lib/utils';
import {
  Film,
  Camera,
  CheckCircle2,
  Download,
  Play,
  Sparkles,
  Eye,
  Clock,
  Check,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { MediaApprovalModal } from '@/components/approvals/MediaApprovalModal';
import { Task } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';
import { isTaskForClient } from '@/lib/utils/clientMatcher';

export default function ClientEntregasPage() {
  const { clients, tasks } = useSystemStore();
  const { user, activeClientId } = useAuth();

  const client =
    clients.find(
      (c) =>
        c.id === activeClientId ||
        c.id === user?.clientId ||
        c.email.toLowerCase() === (user?.email || '').toLowerCase() ||
        (c.username && c.username.toLowerCase() === (user?.username || '').toLowerCase()) ||
        (c.name.toLowerCase().includes('procampo') && (user?.email || '').includes('procampo'))
    ) || clients[0];

  const clientTasks = tasks.filter((t) => isTaskForClient(t, client, user));
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'REVIEW' | 'VIDEO' | 'PHOTO'>('ALL');

  const pendingReviewTasksCount = clientTasks.filter((t) =>
    ['CLIENT_REVIEW', 'IN_REVIEW'].includes(t.status)
  ).length;

  const filteredTasks = clientTasks.filter((t) => {
    if (filterType === 'REVIEW') return ['CLIENT_REVIEW', 'IN_REVIEW'].includes(t.status);
    if (filterType === 'VIDEO') return t.taskType === 'VIDEO' || !t.taskType;
    if (filterType === 'PHOTO') return t.taskType === 'PHOTO';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#262626] pb-4">
        <div>
          <span className="text-xs font-mono text-primary uppercase font-bold tracking-wider">
            Esteira de Conteúdo • {client.companyName}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface mt-1">
            Central de Entregas & Aprovação de Mídias
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Revise pré-cortes com comentários por segundo (timestamp) e aprove fotos ou vídeos para publicação
          </p>
        </div>

        {/* Filter Type */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition-colors font-bold ${
              filterType === 'ALL'
                ? 'bg-primary text-white border-primary shadow'
                : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todos ({clientTasks.length})
          </button>

          {pendingReviewTasksCount > 0 && (
            <button
              onClick={() => setFilterType('REVIEW')}
              className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-bold ${
                filterType === 'REVIEW'
                  ? 'bg-amber-500 text-black border-amber-400 shadow'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Aguardando Aprovação ({pendingReviewTasksCount})</span>
            </button>
          )}

          <button
            onClick={() => setFilterType('VIDEO')}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-bold ${
              filterType === 'VIDEO'
                ? 'bg-primary text-white border-primary shadow'
                : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Vídeos
          </button>

          <button
            onClick={() => setFilterType('PHOTO')}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-bold ${
              filterType === 'PHOTO'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Fotos & Ensaios
          </button>
        </div>
      </div>

      {/* Grid of media cards */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-[#161616] border border-[#262626] rounded-2xl space-y-3 font-mono">
          <Film className="w-10 h-10 text-primary mx-auto opacity-50" />
          <h3 className="font-bold text-on-surface text-sm">Nenhum conteúdo encontrado nesta categoria</h3>
          <p className="text-xs text-on-surface-variant">
            Seus vídeos em produção aparecerão aqui assim que forem adicionados à esteira.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task, idx) => {
            const isPhoto = task.taskType === 'PHOTO';
            const isApproved = task.status === 'APPROVED' || task.status === 'PUBLISHED';
            const isWaitingReview = task.status === 'CLIENT_REVIEW' || task.status === 'IN_REVIEW';

            return (
              <div
                key={task.id}
                className={`brutal-card rounded-xl overflow-hidden flex flex-col group border transition-all shadow-md ${
                  isWaitingReview
                    ? 'border-amber-500/60 hover:border-amber-400 bg-[#161410]'
                    : 'border-[#262626] hover:border-primary'
                }`}
              >
                {/* Media Thumbnail */}
                <div
                  onClick={() => setSelectedTaskForReview(task)}
                  className="relative aspect-video bg-[#181818] flex items-center justify-center cursor-pointer overflow-hidden group-hover:opacity-95 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      isPhoto
                        ? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={task.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

                  {/* Center Action Badge */}
                  <div className={`absolute z-20 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ${
                    isWaitingReview ? 'bg-amber-500 text-black animate-pulse' : 'bg-primary/90'
                  }`}>
                    {isPhoto ? <Camera className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                  </div>

                  {/* Status Badges */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 font-mono text-[9px] font-bold">
                    {task.isExtra && (
                      <span className="bg-primary text-white px-2 py-0.5 rounded uppercase shadow">
                        Extra
                      </span>
                    )}
                    {isApproved ? (
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow">
                        <Check className="w-3 h-3" /> Aprovado
                      </span>
                    ) : isWaitingReview ? (
                      <span className="bg-amber-500 text-black font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow">
                        <Clock className="w-3 h-3" /> Aguarda Aceite
                      </span>
                    ) : (
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase">
                        Em Produção
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2 left-2 z-20 text-[10px] font-mono text-zinc-300">
                    #{String(idx + 1).padStart(2, '0')} • {isPhoto ? 'Foto / RAW' : 'Vídeo 4K'}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-sans line-clamp-2 mb-2">
                      {task.description}
                    </p>
                    {task.mediaUrl && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                        <FolderOpen className="w-3 h-3" />
                        <span>Link do Drive Anexado</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#222] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-on-surface-variant text-[11px]">
                      {formatDate(task.dueDate)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTaskForReview(task)}
                        className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-all ${
                          isWaitingReview
                            ? 'bg-amber-500 hover:bg-amber-400 text-black font-black shadow'
                            : isApproved
                            ? 'bg-[#222] hover:bg-[#282828] text-on-surface'
                            : 'bg-primary/20 hover:bg-primary text-primary hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isWaitingReview ? 'Revisar & Aprovar' : isApproved ? 'Ver Mídia' : 'Acompanhar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Advanced Media Approval Modal */}
      <MediaApprovalModal
        isOpen={Boolean(selectedTaskForReview)}
        onClose={() => setSelectedTaskForReview(null)}
        task={selectedTaskForReview}
      />
    </div>
  );
}
