'use client';

import React from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export default function ProducaoPage() {
  return (
    <div className="space-y-4 h-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">
          Quadro de Produção
        </h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Gerenciamento de conteúdos audiovisuais em todas as etapas do pipeline
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
