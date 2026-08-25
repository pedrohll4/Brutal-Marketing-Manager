'use client';

import React, { useState } from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { KanbanCard } from './KanbanCard';
import { TaskModal } from './TaskModal';
import { WhatsAppNotificationModal } from '../automations/WhatsAppNotificationModal';
import { Plus, Filter, Search, Film, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';

const COLUMNS: { id: TaskStatus; label: string; countBadgeColor: string }[] = [
  { id: 'BACKLOG', label: 'Backlog', countBadgeColor: 'bg-zinc-800 text-zinc-300' },
  { id: 'PLANNED', label: 'Planejado', countBadgeColor: 'bg-blue-950 text-blue-300' },
  { id: 'IN_PRODUCTION', label: 'Em produção', countBadgeColor: 'bg-amber-950 text-amber-300' },
  { id: 'IN_REVIEW', label: 'Em revisão', countBadgeColor: 'bg-purple-950 text-purple-300' },
  { id: 'CLIENT_REVIEW', label: 'Aguardando cliente', countBadgeColor: 'bg-cyan-950 text-cyan-300' },
  { id: 'APPROVED', label: 'Aprovado', countBadgeColor: 'bg-emerald-950 text-emerald-300' },
  { id: 'PUBLISHED', label: 'Publicado', countBadgeColor: 'bg-primary/20 text-primary font-bold' },
];

export function KanbanBoard() {
  const { tasks, clients, updateTaskStatus } = useSystemStore();

  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [targetColumnStatus, setTargetColumnStatus] = useState<TaskStatus>('BACKLOG');
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // WhatsApp Notification Modal State
  const [isWhatsAppNotifyOpen, setIsWhatsAppNotifyOpen] = useState(false);
  const [notifyTask, setNotifyTask] = useState<Task | null>(null);
  const [notifyStatus, setNotifyStatus] = useState<TaskStatus>('CLIENT_REVIEW');

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    if (selectedClientId !== 'ALL' && task.clientId !== selectedClientId) return false;
    if (selectedType !== 'ALL' && task.taskType !== selectedType) return false;
    if (selectedPriority !== 'ALL' && task.priority !== selectedPriority) return false;
    if (
      searchFilter &&
      !task.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !task.clientName.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenNewTask = (status: TaskStatus) => {
    setTaskToEdit(null);
    setTargetColumnStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleStatusChangeWithNotification = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask && targetTask.status !== newStatus) {
      setNotifyTask({ ...targetTask, status: newStatus });
      setNotifyStatus(newStatus);
      setIsWhatsAppNotifyOpen(true);
    }
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      handleStatusChangeWithNotification(taskId, status);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#141414] border border-[#262626] rounded-lg">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por título..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          {/* Client Filter */}
          <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#2a2a2a] px-2.5 py-1 rounded">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase">Cliente:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#181818]">Todos os Clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#181818]">
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter (Vídeos, Fotos, Design, Evento) */}
          <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#2a2a2a] px-2.5 py-1 rounded">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase">Tipo:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#181818]">Todos os Tipos</option>
              <option value="VIDEO" className="bg-[#181818]">🎬 Vídeos</option>
              <option value="PHOTO" className="bg-[#181818]">📸 Fotos / Ensaios</option>
              <option value="DESIGN" className="bg-[#181818]">✨ Design / 3D</option>
              <option value="EVENT" className="bg-[#181818]">📅 Eventos</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#2a2a2a] px-2.5 py-1 rounded">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase">Prioridade:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#181818]">Todas</option>
              <option value="LOW" className="bg-[#181818]">Baixa</option>
              <option value="MEDIUM" className="bg-[#181818]">Média</option>
              <option value="HIGH" className="bg-[#181818]">Alta</option>
              <option value="URGENT" className="bg-[#181818]">Urgente</option>
            </select>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handleOpenNewTask('BACKLOG')}
          className="bg-primary hover:bg-primary-hover text-white font-semibold text-xs py-2 px-4 rounded flex items-center gap-2 transition-all shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Kanban Columns Grid (Horizontal Scrollable with Drag & Drop) */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-3.5 min-w-[1400px] h-[calc(100vh-250px)]">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            const isTarget = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-72 rounded-lg flex flex-col h-full shadow-lg transition-all ${
                  isTarget
                    ? 'bg-[#1e1510] border-2 border-primary ring-2 ring-primary/20 scale-[1.01]'
                    : 'bg-[#131313] border border-[#242424]'
                }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[#242424] bg-[#161616] rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-on-surface font-mono uppercase">
                      {col.label}
                    </h3>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${col.countBadgeColor}`}
                    >
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenNewTask(col.id)}
                    className="p-1 rounded hover:bg-[#262626] text-on-surface-variant hover:text-primary transition-colors"
                    title={`Adicionar tarefa em ${col.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Task Cards Container */}
                <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                  {columnTasks.length === 0 ? (
                    <div className="h-28 border border-dashed border-[#222] rounded flex flex-col items-center justify-center text-center p-3">
                      <span className="text-[11px] text-on-surface-variant font-mono">
                        {isTarget ? 'Soltar aqui' : 'Nenhuma tarefa'}
                      </span>
                      {!isTarget && (
                        <button
                          onClick={() => handleOpenNewTask(col.id)}
                          className="text-[10px] text-primary hover:underline mt-1 font-mono"
                        >
                          + Criar agora
                        </button>
                      )}
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <KanbanCard
                        key={task.id}
                        task={task}
                        onOpenTask={handleOpenEditTask}
                        onMoveStatus={handleStatusChangeWithNotification}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Tarefa */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        initialStatus={targetColumnStatus}
      />

      {/* Pop-up de Notificação de WhatsApp Automático ao mudar status */}
      <WhatsAppNotificationModal
        isOpen={isWhatsAppNotifyOpen}
        onClose={() => setIsWhatsAppNotifyOpen(false)}
        task={notifyTask}
        newStatus={notifyStatus}
        client={clients.find((c) => c.id === notifyTask?.clientId)}
      />
    </div>
  );
}
