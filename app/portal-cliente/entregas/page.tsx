'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatDate } from '@/lib/utils';
import { Film, Camera, CheckCircle2, Download, Play, Sparkles, Eye, Clock, Check } from 'lucide-react';
import { MediaApprovalModal } from '@/components/approvals/MediaApprovalModal';
import { Task } from '@/lib/types';

export default function ClientEntregasPage() {
  const { clients, tasks } = useSystemStore();
  const client = clients.find((c) => c.id === 'cli-procampo') || clients[0];

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'VIDEO' | 'PHOTO'>('ALL');

  const filteredTasks = clientTasks.filter((t) => {
    if (filterType !== 'ALL' && t.taskType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
            Central de Entregas & Aprovação de Mídias
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Revise vídeos com comentários por segundo (timestamp) e aprove fotos/ensaios com marcações de retoque
          </p>
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded border transition-colors ${
              filterType === 'ALL'
                ? 'bg-primary/10 border-primary text-primary font-bold'
                : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant'
            }`}
          >
            Todos ({clientTasks.length})
          </button>
          <button
            onClick={() => setFilterType('VIDEO')}
            className={`px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
              filterType === 'VIDEO'
                ? 'bg-primary/10 border-primary text-primary font-bold'
                : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Vídeos
          </button>
          <button
            onClick={() => setFilterType('PHOTO')}
            className={`px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
              filterType === 'PHOTO'
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400 font-bold'
                : 'bg-[#181818] border-[#2a2a2a] text-on-surface-variant'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Fotos & Ensaios
          </button>
        </div>
      </div>

      {/* Grid of media cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task, idx) => {
          const isPhoto = task.taskType === 'PHOTO';
          const isApproved = task.status === 'APPROVED' || task.status === 'PUBLISHED';
          const isWaitingReview = task.status === 'CLIENT_REVIEW' || task.status === 'IN_REVIEW';

          return (
            <div
              key={task.id}
              className="brutal-card rounded-lg overflow-hidden flex flex-col group border border-[#262626] hover:border-primary transition-all shadow-md"
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
                <div className="absolute z-20 w-11 h-11 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  {isPhoto ? <Camera className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
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
                  ) : (
                    <span className="bg-amber-600 text-white px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow">
                      <Clock className="w-3 h-3" /> Revisão
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
                  {task.mediaUrl && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                      <span>📁 Link do Google Drive anexado</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#222] flex items-center justify-between text-xs font-mono">
                  <span className="text-on-surface-variant text-[11px]">
                    Prazo: {formatDate(task.dueDate)}
                  </span>

                  <button
                    onClick={() => setSelectedTaskForReview(task)}
                    className="text-primary hover:underline text-xs flex items-center gap-1 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isApproved ? 'Ver & Baixar' : 'Revisar & Aprovar'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Media Approval Modal */}
      <MediaApprovalModal
        isOpen={Boolean(selectedTaskForReview)}
        onClose={() => setSelectedTaskForReview(null)}
        task={selectedTaskForReview}
      />
    </div>
  );
}
