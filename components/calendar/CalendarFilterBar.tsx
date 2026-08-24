'use client';

import React from 'react';
import { Video, Film, Camera, Package, DollarSign, Users, Building2 } from 'lucide-react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';

interface CalendarFilterBarProps {
  selectedClientId: string;
  onChangeClientId: (id: string) => void;
  selectedEmployeeId: string;
  onChangeEmployeeId: (id: string) => void;
  selectedEventType: string;
  onChangeEventType: (type: string) => void;
}

export function CalendarFilterBar({
  selectedClientId,
  onChangeClientId,
  selectedEmployeeId,
  onChangeEmployeeId,
  selectedEventType,
  onChangeEventType,
}: CalendarFilterBarProps) {
  const { clients, employees } = useSystemStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Filter Client */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-3.5 flex flex-col justify-center">
        <label className="text-[10px] font-mono text-on-surface-variant uppercase mb-1.5 font-bold tracking-wider">
          Filtrar Cliente
        </label>
        <select
          value={selectedClientId}
          onChange={(e) => onChangeClientId(e.target.value)}
          className="bg-transparent text-on-surface text-sm border-b border-[#353534] pb-1 focus:outline-none focus:border-primary w-full cursor-pointer font-sans"
        >
          <option value="ALL" className="bg-[#181818]">Todos os Clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#181818]">
              {c.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Team */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-3.5 flex flex-col justify-center">
        <label className="text-[10px] font-mono text-on-surface-variant uppercase mb-1.5 font-bold tracking-wider">
          Filtrar Equipe
        </label>
        <select
          value={selectedEmployeeId}
          onChange={(e) => onChangeEmployeeId(e.target.value)}
          className="bg-transparent text-on-surface text-sm border-b border-[#353534] pb-1 focus:outline-none focus:border-primary w-full cursor-pointer font-sans"
        >
          <option value="ALL" className="bg-[#181818]">Toda a Equipe</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id} className="bg-[#181818]">
              {e.name} ({e.roleTitle})
            </option>
          ))}
        </select>
      </div>

      {/* Event Types Legend Bar (Span 2 cols on Desktop) */}
      <div className="md:col-span-2 bg-[#1c1b1b] border border-[#2a2a2a] rounded p-3.5 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-4 text-xs font-mono">
          <div
            onClick={() => onChangeEventType(selectedEventType === 'RECORDING' ? 'ALL' : 'RECORDING')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded transition-colors ${
              selectedEventType === 'RECORDING' ? 'bg-[#ff5708]/20 text-[#ff5708] font-bold' : 'text-on-surface'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#ff5708]" />
            <span>Gravação</span>
          </div>

          <div
            onClick={() => onChangeEventType(selectedEventType === 'PRODUCTION' ? 'ALL' : 'PRODUCTION')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded transition-colors ${
              selectedEventType === 'PRODUCTION' ? 'bg-[#3b82f6]/20 text-[#3b82f6] font-bold' : 'text-on-surface'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Produção</span>
          </div>

          <div
            onClick={() => onChangeEventType(selectedEventType === 'PHOTO' ? 'ALL' : 'PHOTO')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded transition-colors ${
              selectedEventType === 'PHOTO' ? 'bg-[#10b981]/20 text-[#10b981] font-bold' : 'text-on-surface'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Fotografia</span>
          </div>

          <div
            onClick={() => onChangeEventType(selectedEventType === 'DELIVERY' ? 'ALL' : 'DELIVERY')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded transition-colors ${
              selectedEventType === 'DELIVERY' ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] font-bold' : 'text-on-surface'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>Entrega</span>
          </div>

          <div
            onClick={() => onChangeEventType(selectedEventType === 'FINANCIAL' ? 'ALL' : 'FINANCIAL')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded transition-colors ${
              selectedEventType === 'FINANCIAL' ? 'bg-[#f59e0b]/20 text-[#f59e0b] font-bold' : 'text-on-surface'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Financeiro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
