'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientModal } from '@/components/clients/ClientModal';
import { Plus, UserPlus, Search } from 'lucide-react';
import { Client } from '@/lib/types';

export default function ClientesPage() {
  const { clients, addClient, updateClient } = useSystemStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING_PAYMENT'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const filteredClients = clients.filter((client) => {
    if (activeFilter !== 'ALL' && client.status !== activeFilter) return false;
    if (
      searchTerm &&
      !client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenNewClient = () => {
    setClientToEdit(null);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (clientData: any) => {
    if (clientToEdit) {
      updateClient(clientToEdit.id, clientData);
    } else {
      addClient(clientData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching Stitch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface">
            Gerenciamento de Clientes
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Visão geral do portfólio ativo, status de produção e saúde financeira.
          </p>
        </div>

        <button
          onClick={handleOpenNewClient}
          className="bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2.5 px-5 rounded flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,85,0,0.3)] hover:shadow-[0_0_20px_rgba(255,85,0,0.5)] active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo cliente</span>
        </button>
      </div>

      {/* Filters (Minimalist Tab Bar from Stitch) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex overflow-x-auto gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded transition-colors ${
              activeFilter === 'ALL'
                ? 'bg-[#181818] border border-primary text-primary font-bold'
                : 'bg-[#141414] border border-[#262626] text-on-surface-variant hover:bg-[#1a1a1a]'
            }`}
          >
            Todos ({clients.length})
          </button>

          <button
            onClick={() => setActiveFilter('ACTIVE')}
            className={`px-4 py-2 rounded transition-colors ${
              activeFilter === 'ACTIVE'
                ? 'bg-[#181818] border border-primary text-primary font-bold'
                : 'bg-[#141414] border border-[#262626] text-on-surface-variant hover:bg-[#1a1a1a]'
            }`}
          >
            Ativos ({clients.filter((c) => c.status === 'ACTIVE').length})
          </button>

          <button
            onClick={() => setActiveFilter('PENDING_PAYMENT')}
            className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
              activeFilter === 'PENDING_PAYMENT'
                ? 'bg-red-950/40 border border-red-600 text-red-300 font-bold'
                : 'bg-[#141414] border border-[#262626] text-on-surface-variant hover:bg-[#1a1a1a]'
            }`}
          >
            <span>Pagamento Pendente</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveFilter('INACTIVE')}
            className={`px-4 py-2 rounded transition-colors ${
              activeFilter === 'INACTIVE'
                ? 'bg-[#181818] border border-primary text-primary font-bold'
                : 'bg-[#141414] border border-[#262626] text-on-surface-variant hover:bg-[#1a1a1a]'
            }`}
          >
            Inativos ({clients.filter((c) => c.status === 'INACTIVE').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#181818] border border-[#262626] rounded pl-9 pr-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Client Grid (Bento Style matching Stitch) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} onEdit={setClientToEdit} />
        ))}
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />
    </div>
  );
}
