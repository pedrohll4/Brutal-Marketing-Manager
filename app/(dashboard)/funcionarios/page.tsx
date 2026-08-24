'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { Plus, Mail, Phone, Shield, ShieldCheck, UserCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function FuncionariosPage() {
  const { employees, clients, addEmployee, updateEmployee } = useSystemStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    roleTitle: 'Video Maker & Editor',
    department: 'Audiovisual',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    canManageFinance: false,
    canManageClients: true,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      name: form.name,
      email: form.email,
      phone: form.phone,
      roleTitle: form.roleTitle,
      department: form.department,
      status: 'ACTIVE',
      avatarUrl: form.avatarUrl,
      assignedClientIds: ['cli-procampo', 'cli-techrush'],
      canManageFinance: form.canManageFinance,
      canManageClients: form.canManageClients,
    });
    setIsModalOpen(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      roleTitle: 'Video Maker & Editor',
      department: 'Audiovisual',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      canManageFinance: false,
      canManageClients: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface">
            Equipe & Funcionários
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Gerenciamento de colaboradores, cargos, projetos atribuídos e permissões
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2.5 px-4 rounded flex items-center gap-1.5 shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Colaborador</span>
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="brutal-card p-5 rounded-lg flex flex-col justify-between border border-[#262626] hover:border-primary/50 transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    emp.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={emp.name}
                  className="w-12 h-12 rounded-full border border-[#2a2a2a] object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm text-on-surface">{emp.name}</h3>
                  <span className="text-[10px] font-mono text-primary font-bold block">
                    {emp.roleTitle}
                  </span>
                  <span className="text-[9px] font-mono text-on-surface-variant">
                    {emp.department}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono text-on-surface-variant mb-4">
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-primary shrink-0" /> {emp.email}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-primary shrink-0" /> {emp.phone}
                </p>
              </div>

              {/* Permissions Tags */}
              <div className="p-2.5 bg-[#181818] border border-[#242424] rounded text-[10px] font-mono space-y-1 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Gerenciar Clientes:</span>
                  <span className={emp.canManageClients ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                    {emp.canManageClients ? 'Sim' : 'Não'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Acesso Financeiro:</span>
                  <span className={emp.canManageFinance ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                    {emp.canManageFinance ? 'Sim' : 'Bloqueado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#222] flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
              <span>{emp.assignedClientIds.length} Clientes Atribuídos</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Ativo" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Colaborador */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Colaborador"
        subtitle="Adicione um membro à equipe de produção ou atendimento"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Gabriel Rocha"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                placeholder="gabriel@brutalmarketing.com.br"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Telefone
              </label>
              <input
                type="text"
                required
                placeholder="(11) 98888-7777"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Cargo
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Video Maker Sênior"
                value={form.roleTitle}
                onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Departamento
              </label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="Audiovisual">Audiovisual</option>
                <option value="Criação & Estratégia">Criação & Estratégia</option>
                <option value="Design & VFX">Design & VFX</option>
                <option value="Operações & CS">Operações & CS</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#181818] border border-[#242424] rounded space-y-2">
            <span className="font-bold text-xs font-mono uppercase text-on-surface block mb-1">
              Permissões de Acesso:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="canManageFinanceCheck"
                checked={form.canManageFinance}
                onChange={(e) => setForm({ ...form, canManageFinance: e.target.checked })}
                className="rounded text-primary focus:ring-primary bg-[#141414] border-[#333]"
              />
              <label htmlFor="canManageFinanceCheck" className="text-xs text-on-surface cursor-pointer">
                Permitir visualização e gestão de relatórios financeiros
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface text-xs font-mono"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold shadow"
            >
              Cadastrar Colaborador
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
