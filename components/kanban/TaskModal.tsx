'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskType, TaskPriority } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Modal } from '../ui/Modal';
import { AICopyDrawer } from '../approvals/AICopyDrawer';
import { WhatsAppShareButton } from '../automations/WhatsAppShareButton';
import { MediaUploader } from '../media/MediaUploader';
import {
  Film,
  Camera,
  Sparkles,
  Calendar,
  User,
  Clock,
  MessageSquare,
  Paperclip,
  Trash2,
  Send,
  Plus,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
  initialStatus?: TaskStatus;
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  initialStatus = 'BACKLOG',
}: TaskModalProps) {
  const { clients, employees, campaigns, addTask, updateTask, deleteTask, addTaskComment } =
    useSystemStore();
  const { user } = useAuth();
  const [showAICopy, setShowAICopy] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    clientId: clients[0]?.id || '',
    campaignId: '',
    assigneeId: employees[0]?.id || '',
    taskType: 'VIDEO' as TaskType,
    status: initialStatus,
    priority: 'MEDIUM' as TaskPriority,
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    isExtra: false,
    extraPrice: 150,
    mediaUrl: '',
    rawFolderUrl: '',
    scriptUrl: '',
  });

  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        clientId: taskToEdit.clientId,
        campaignId: taskToEdit.campaignId || '',
        assigneeId: taskToEdit.assigneeId || '',
        taskType: taskToEdit.taskType,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate,
        isExtra: taskToEdit.isExtra,
        extraPrice: taskToEdit.extraPrice || 150,
        mediaUrl: taskToEdit.mediaUrl || '',
        rawFolderUrl: taskToEdit.rawFolderUrl || '',
        scriptUrl: taskToEdit.scriptUrl || '',
      });
    } else {
      setFormData({
        title: '',
        clientId: clients[0]?.id || '',
        campaignId: '',
        assigneeId: employees[0]?.id || '',
        taskType: 'VIDEO',
        status: initialStatus,
        priority: 'MEDIUM',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        isExtra: false,
        extraPrice: 150,
        mediaUrl: '',
        rawFolderUrl: '',
        scriptUrl: '',
      });
    }
    setCommentText('');
  }, [taskToEdit, isOpen, initialStatus, clients, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === formData.clientId) || clients[0];
    const selectedEmployee = employees.find((e) => e.id === formData.assigneeId);
    const selectedCampaign = campaigns.find((camp) => camp.id === formData.campaignId);

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        ...formData,
        clientName: selectedClient.name,
        assigneeName: selectedEmployee?.name,
        campaignName: selectedCampaign?.name,
      });
    } else {
      addTask({
        ...formData,
        clientName: selectedClient.name,
        assigneeName: selectedEmployee?.name,
        campaignName: selectedCampaign?.name,
      });
    }
    onClose();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !taskToEdit) return;

    addTaskComment(
      taskToEdit.id,
      commentText.trim(),
      user?.fullName || 'Usuário',
      user?.role || 'ADMIN'
    );
    setCommentText('');
  };

  const handleDelete = () => {
    if (taskToEdit && confirm('Deseja realmente excluir esta tarefa?')) {
      deleteTask(taskToEdit.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Detalhes da Tarefa' : 'Nova Tarefa de Produção'}
      subtitle={taskToEdit ? `ID: ${taskToEdit.id}` : 'Adicione ao fluxo de produção'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
            Título da Tarefa
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Vídeo Reels 08: Depoimento de Produtor"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none font-medium"
          />
        </div>

        {/* Client & Campaign */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Cliente
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#181818]">
                  {c.name} ({c.companyName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Campanha (Opcional)
            </label>
            <select
              value={formData.campaignId}
              onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="">Nenhuma / Conteúdo Avulso</option>
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id} className="bg-[#181818]">
                  {camp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type, Priority, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Tipo de Conteúdo
            </label>
            <select
              value={formData.taskType}
              onChange={(e) =>
                setFormData({ ...formData, taskType: e.target.value as TaskType })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="VIDEO">Vídeo (Reels / Comercial)</option>
              <option value="PHOTO">Fotografia</option>
              <option value="DESIGN">Design & Motion</option>
              <option value="EVENT">Cobertura de Evento</option>
              <option value="COPYWRITING">Roteiro / Copy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Prioridade
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as TaskPriority })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Status Atual (Coluna)
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as TaskStatus })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="PLANNED">Planejado</option>
              <option value="IN_PRODUCTION">Em Produção</option>
              <option value="IN_REVIEW">Em Revisão</option>
              <option value="CLIENT_REVIEW">Aguardando Cliente</option>
              <option value="APPROVED">Aprovado</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Responsável na Equipe
            </label>
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="">Não atribuído</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#181818]">
                  {emp.name} ({emp.roleTitle})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Data de Entrega (Prazo)
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Extras toggle */}
        <div className="p-3 bg-[#181818] border border-[#262626] rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isExtraCheckbox"
              checked={formData.isExtra}
              onChange={(e) => setFormData({ ...formData, isExtra: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary bg-[#1c1b1b] border-[#333] cursor-pointer"
            />
            <label htmlFor="isExtraCheckbox" className="text-xs text-on-surface font-semibold cursor-pointer">
              Marcar como Conteúdo Extra (Fora da Cota Mensal)
            </label>
          </div>

          {formData.isExtra && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-on-surface-variant uppercase">Valor Extra:</span>
              <input
                type="number"
                value={formData.extraPrice}
                onChange={(e) => setFormData({ ...formData, extraPrice: Number(e.target.value) })}
                className="w-24 bg-[#141414] border border-[#333] rounded px-2 py-1 text-xs text-on-surface font-mono"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
            Descrição / Roteiro / Requisitos
          </label>
          <textarea
            rows={3}
            placeholder="Detalhes da captação, referências visuais, trilha sonoras, locações..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
          />
        </div>

        {/* Cloud Media Upload & Drive Links Section */}
        <div className="p-4 bg-[#161616] border border-[#282828] rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-primary flex items-center gap-1.5">
              📁 Entrega de Mídia (Upload Direto ou Link)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded">
              ⚡ Nuvem & Streaming
            </span>
          </div>

          <MediaUploader
            initialUrl={formData.mediaUrl}
            onMediaUploaded={(media) => setFormData((prev) => ({ ...prev, mediaUrl: media.url }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-on-surface-variant mb-1">
                Pasta de Arquivos Brutos / RAW (Google Drive):
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.rawFolderUrl}
                onChange={(e) => setFormData({ ...formData, rawFolderUrl: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface font-mono focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-on-surface-variant mb-1">
                Link do Roteiro / Copywriting (Docs/Notion):
              </label>
              <input
                type="url"
                placeholder="https://docs.google.com/document/d/..."
                value={formData.scriptUrl}
                onChange={(e) => setFormData({ ...formData, scriptUrl: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* AI Copy Button */}
          <div className="pt-2 border-t border-[#262626] flex justify-end">
            <button
              type="button"
              onClick={() => setShowAICopy(!showAICopy)}
              className={`px-3 py-1.5 rounded border text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow ${
                showAICopy
                  ? 'bg-primary text-white border-primary'
                  : 'bg-primary/10 text-primary border-primary/40 hover:bg-primary/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showAICopy ? 'Ocultar Legenda IA' : '✨ Gerar Legenda & Hashtags com IA'}</span>
            </button>
          </div>
        </div>

        {/* AI Copywriting & Hashtags Drawer */}
        {taskToEdit && (
          <AICopyDrawer
            task={taskToEdit}
            client={clients.find((c) => c.id === taskToEdit.clientId)}
            isOpen={showAICopy}
            onClose={() => setShowAICopy(false)}
          />
        )}

        {/* Comments Section (If editing) */}
        {taskToEdit && (
          <div className="border-t border-[#262626] pt-4">
            <h4 className="font-bold text-xs font-mono uppercase text-on-surface mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              Comentários e Histórico ({taskToEdit.comments?.length || 0})
            </h4>

            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {taskToEdit.comments && taskToEdit.comments.length > 0 ? (
                taskToEdit.comments.map((c) => {
                  const isTimestamp = c.content.includes('[Timestamp');
                  const isPhotoPin = c.content.includes('[Marcação na Foto');

                  return (
                    <div
                      key={c.id}
                      className={`p-2.5 rounded text-xs border ${
                        isTimestamp
                          ? 'bg-[#1b1510] border-primary/40'
                          : isPhotoPin
                          ? 'bg-[#101b15] border-emerald-600/40'
                          : 'bg-[#181818] border-[#242424]'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant mb-1">
                        <span className="font-semibold text-primary">
                          {c.authorName} ({c.authorRole})
                        </span>
                        <span>{c.createdAt}</span>
                      </div>
                      <p className="text-on-surface leading-relaxed">
                        {isTimestamp && (
                          <span className="inline-block bg-primary/20 text-primary border border-primary/40 font-mono text-[10px] px-1.5 py-0.2 rounded font-bold mr-1.5">
                            ⏱ VÍDEO
                          </span>
                        )}
                        {isPhotoPin && (
                          <span className="inline-block bg-emerald-950/60 text-emerald-400 border border-emerald-600/40 font-mono text-[10px] px-1.5 py-0.2 rounded font-bold mr-1.5">
                            📸 FOTO
                          </span>
                        )}
                        {c.content}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-on-surface-variant font-mono">
                  Nenhum comentário registrado ainda.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="px-3 py-1.5 rounded bg-primary hover:bg-primary-hover disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Enviar
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-[#262626]">
          {taskToEdit ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1 p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>

              <WhatsAppShareButton
                trigger="MEDIA_READY_FOR_REVIEW"
                data={{
                  clientName: taskToEdit.clientName,
                  taskTitle: taskToEdit.title,
                  mediaType: taskToEdit.taskType === 'PHOTO' ? 'Fotos / Ensaio' : 'Vídeo 4K UHD',
                }}
                label="Avisar no WhatsApp"
              />
            </div>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] transition-colors font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors shadow"
            >
              {taskToEdit ? 'Salvar Tarefa' : 'Criar Tarefa'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
