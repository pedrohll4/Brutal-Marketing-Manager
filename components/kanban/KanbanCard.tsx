'use client';

import React from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { Film, Image as ImageIcon, Sparkles, Clock, MessageSquare, GripVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
  onOpenTask: (task: Task) => void;
  onMoveStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const statusColumns: TaskStatus[] = [
  'BACKLOG',
  'PLANNED',
  'IN_PRODUCTION',
  'IN_REVIEW',
  'CLIENT_REVIEW',
  'APPROVED',
  'PUBLISHED',
];

export function KanbanCard({ task, onOpenTask, onMoveStatus }: KanbanCardProps) {
  const currentStatusIndex = statusColumns.indexOf(task.status);

  const priorityStyles = {
    LOW: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    MEDIUM: 'bg-blue-950/40 text-blue-300 border-blue-800/40',
    HIGH: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
    URGENT: 'bg-red-950/40 text-red-300 border-red-800/40',
  }[task.priority];

  const typeIcon = {
    VIDEO: <Film className="w-3.5 h-3.5 text-primary" />,
    PHOTO: <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />,
    DESIGN: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
    EVENT: <Clock className="w-3.5 h-3.5 text-purple-400" />,
    COPYWRITING: <MessageSquare className="w-3.5 h-3.5 text-amber-400" />,
    CAMPAIGN_CONTENT: <Film className="w-3.5 h-3.5 text-primary" />,
  }[task.taskType] || <Film className="w-3.5 h-3.5 text-primary" />;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onOpenTask(task)}
      className="bg-[#181818] border border-[#262626] rounded-lg p-3.5 hover:border-primary/60 transition-all cursor-grab active:cursor-grabbing group shadow-sm flex flex-col gap-2.5 hover:shadow-lg hover:shadow-primary/5 active:opacity-60"
    >
      {/* Top: Drag Grip & Priority & Extra Badge */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-zinc-600 group-hover:text-primary transition-colors shrink-0" />
          <span className="p-1 rounded bg-[#222] border border-[#2e2e2e]">
            {typeIcon}
          </span>
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${priorityStyles}`}>
            {task.priority === 'URGENT' ? 'URGENTE' : task.priority}
          </span>
        </div>

        {task.isExtra && (
          <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" /> Extra
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Client & Campaign info */}
      <div className="text-[11px] font-mono text-on-surface-variant flex flex-col gap-0.5">
        <span className="text-on-surface font-semibold truncate">{task.clientName}</span>
        {task.campaignName && (
          <span className="text-[10px] text-primary/80 truncate">🏷️ {task.campaignName}</span>
        )}
      </div>

      {/* Footer: Assignee & Due Date */}
      <div className="flex justify-between items-center pt-2 border-t border-[#222] text-[10px] font-mono text-on-surface-variant">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-on-surface-variant" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-on-surface-variant font-semibold">
              <MessageSquare className="w-2.5 h-2.5" /> {task.comments.length}
            </span>
          )}

          {task.assigneeName && (
            <div
              className="w-5 h-5 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-[9px]"
              title={`Responsável: ${task.assigneeName}`}
            >
              {task.assigneeName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Quick Move Status Bar on Hover */}
      <div
        className="flex items-center justify-between pt-1 border-t border-[#202020] opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          disabled={currentStatusIndex === 0}
          onClick={() => onMoveStatus(task.id, statusColumns[currentStatusIndex - 1])}
          className="text-[10px] text-on-surface-variant hover:text-primary disabled:opacity-30 px-1 font-mono"
        >
          ← Voltar
        </button>

        <button
          disabled={currentStatusIndex === statusColumns.length - 1}
          onClick={() => onMoveStatus(task.id, statusColumns[currentStatusIndex + 1])}
          className="text-[10px] text-primary hover:underline font-bold disabled:opacity-30 px-1 font-mono"
        >
          Avançar →
        </button>
      </div>
    </div>
  );
}
