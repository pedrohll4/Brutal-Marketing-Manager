'use client';

import React, { useState, useEffect } from 'react';
import { CalendarEvent, EventType } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { Modal } from '../ui/Modal';
import { Trash2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEvent | null;
  initialDate?: string;
}

export function EventModal({
  isOpen,
  onClose,
  eventToEdit,
  initialDate,
}: EventModalProps) {
  const { clients, employees, campaigns, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } =
    useSystemStore();

  const [formData, setFormData] = useState({
    title: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    location: 'Estúdio Principal',
    eventType: 'RECORDING' as EventType,
    clientId: clients[0]?.id || '',
    employeeId: employees[0]?.id || '',
    campaignId: '',
    description: '',
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        date: eventToEdit.date,
        startTime: eventToEdit.startTime || '09:00',
        endTime: eventToEdit.endTime || '12:00',
        location: eventToEdit.location || 'Estúdio Principal',
        eventType: eventToEdit.eventType,
        clientId: eventToEdit.clientId || clients[0]?.id || '',
        employeeId: eventToEdit.employeeId || employees[0]?.id || '',
        campaignId: eventToEdit.campaignId || '',
        description: eventToEdit.description || '',
      });
    } else {
      setFormData({
        title: '',
        date: initialDate || new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '12:00',
        location: 'Estúdio Principal A',
        eventType: 'RECORDING',
        clientId: clients[0]?.id || '',
        employeeId: employees[0]?.id || '',
        campaignId: '',
        description: '',
      });
    }
  }, [eventToEdit, initialDate, isOpen, clients, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === formData.clientId);
    const selectedEmployee = employees.find((e) => e.id === formData.employeeId);
    const selectedCampaign = campaigns.find((camp) => camp.id === formData.campaignId);

    if (eventToEdit) {
      updateCalendarEvent(eventToEdit.id, {
        ...formData,
        clientName: selectedClient?.companyName,
        employeeName: selectedEmployee?.name,
        campaignName: selectedCampaign?.name,
      });
    } else {
      addCalendarEvent({
        ...formData,
        clientName: selectedClient?.companyName,
        employeeName: selectedEmployee?.name,
        campaignName: selectedCampaign?.name,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (eventToEdit && confirm('Excluir este evento do calendário?')) {
      deleteCalendarEvent(eventToEdit.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Editar Evento' : 'Novo Evento na Agenda'}
      subtitle="Gravações, produções, fotografias, entregas ou reuniões"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
            Título do Evento
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Gravação TechRush Comercial 01"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Tipo de Evento
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="RECORDING">Gravação (Vídeo)</option>
              <option value="PRODUCTION">Produção / Edição</option>
              <option value="PHOTO">Fotografia</option>
              <option value="DELIVERY">Entrega de Material</option>
              <option value="FINANCIAL">Financeiro / Fechamento</option>
              <option value="MEETING">Reunião / Alinhamento</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Data
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Início
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Término
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Local / Estúdio
            </label>
            <input
              type="text"
              placeholder="Estúdio A, Externa..."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Cliente Associado
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="">Nenhum (Geral / Interno)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#181818]">
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Responsável na Equipe
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="">Equipe Geral</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#181818]">
                  {emp.name} ({emp.roleTitle})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
            Observações
          </label>
          <textarea
            rows={2}
            placeholder="Detalhes dos equipamentos necessários, iluminação, equipe..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
          {eventToEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1 p-1 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" /> Excluir
            </button>
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
              {eventToEdit ? 'Salvar Evento' : 'Adicionar à Agenda'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
