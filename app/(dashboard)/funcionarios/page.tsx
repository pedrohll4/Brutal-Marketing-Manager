'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Plus, Mail, Phone, Shield, ShieldCheck, UserCheck, KeyRound, Sparkles, Copy, Check, User, Lock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function FuncionariosPage() {
  const { employees, clients, addEmployee, updateEmployee, addToast } = useSystemStore();
  const { registerUserAccount } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedWelcome, setCopiedWelcome] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: `Staff@${Math.floor(1000 + Math.random() * 9000)}`,
    phone: '',
    roleTitle: 'Video Maker & Editor',
    department: 'Audiovisual',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    canManageFinance: false,
    canManageClients: true,
  });

  const generateUsername = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '.')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '');
  };

  const handleNameChange = (nameVal: string) => {
    setForm((prev) => ({
      ...prev,
      name: nameVal,
      username: prev.username ? prev.username : generateUsername(nameVal),
    }));
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, password: pass }));
  };

  const handleCopyStaffCredentials = () => {
    const loginUrl = 'https://brutalmanager.vercel.app/login';
    const msg = `Olá, *${form.name}*! 👋

Seu acesso ao *Brutal Marketing Manager* foi criado pelo Administrador.

🌐 *Link de Acesso:*
👉 ${loginUrl}

👤 *Login (E-mail ou Usuário):*
• Usuário: \`${form.username || form.email.split('@')[0]}\`
• E-mail: \`${form.email}\`

🔑 *Senha Inicial:*
\`${form.password}\`

Cargo: *${form.roleTitle}* (${form.department})

_(Você poderá alterar sua senha após o primeiro acesso pelo painel de configurações)._

Bem-vindo à equipe Brutal! 🚀`.trim();

    navigator.clipboard.writeText(msg);
    setCopiedWelcome(true);
    setTimeout(() => setCopiedWelcome(false), 3000);
    addToast({
      title: 'Credenciais Copiadas! 📋',
      description: 'Pronto para enviar no WhatsApp do colaborador.',
      type: 'success',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const empUsername = form.username.trim() || form.email.split('@')[0];
    const empPassword = form.password.trim() || 'Brutal@2026';

    const newEmpId = `emp-${Date.now()}`;

    addEmployee({
      name: form.name,
      email: form.email,
      username: empUsername,
      password: empPassword,
      phone: form.phone,
      roleTitle: form.roleTitle,
      department: form.department,
      status: 'ACTIVE',
      avatarUrl: form.avatarUrl,
      assignedClientIds: ['cli-procampo', 'cli-techrush'],
      canManageFinance: form.canManageFinance,
      canManageClients: form.canManageClients,
    });

    // Register UserAccount for Authentication
    registerUserAccount({
      username: empUsername,
      email: form.email,
      password: empPassword,
      fullName: form.name,
      role: 'EMPLOYEE',
      employeeId: newEmpId,
      avatarUrl: form.avatarUrl,
    });

    addToast({
      title: 'Colaborador Cadastrado! 🚀',
      description: `Conta criada para ${form.name} (${empUsername}).`,
      type: 'success',
    });

    setIsModalOpen(false);
    setForm({
      name: '',
      email: '',
      username: '',
      password: `Staff@${Math.floor(1000 + Math.random() * 9000)}`,
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
            Gerenciamento de colaboradores, cargos, permissões e criação de credenciais de login
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

              <div className="space-y-2 text-xs font-mono text-on-surface-variant mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="text-on-surface font-bold">@{emp.username || emp.email.split('@')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span>{emp.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Ativo
              </span>
              <span className="text-on-surface-variant text-[10px]">
                {emp.canManageFinance ? 'Financeiro + Produção' : 'Apenas Produção'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Colaborador */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Colaborador"
        subtitle="Defina o cargo, permissões e dados de acesso do funcionário ao sistema"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-sm">
          {/* Section 1: Credentials */}
          <div className="p-4 rounded-lg bg-[#181818] border-2 border-primary/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-primary text-xs font-mono uppercase flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>Credenciais de Login (Definidas pelo Admin)</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded">
                Acesso Inicial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                  Nome de Usuário (Username):
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="ex: joao.silva"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s+/g, '.') })}
                    className="w-full bg-[#121212] border border-[#333] rounded pl-9 pr-3 py-2 text-on-surface font-bold focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] uppercase text-on-surface-variant font-bold">
                    Senha Inicial:
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Gerar Senha
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Senha forte..."
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] rounded pl-9 pr-3 py-2 text-on-surface font-bold focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262626] flex justify-end">
              <button
                type="button"
                onClick={handleCopyStaffCredentials}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow ${
                  copiedWelcome
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-700/60'
                }`}
              >
                {copiedWelcome ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Dados Copiados!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> 📋 Copiar Acesso para WhatsApp do Funcionário
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Personal & Role Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                Nome Completo
              </label>
              <input
                type="text"
                required
                placeholder="Ex: João da Silva"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                placeholder="joao@brutalmarketing.com.br"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                Telefone / WhatsApp
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

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                Cargo / Especialidade
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Videomaker & Editor Sênior"
                value={form.roleTitle}
                onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
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
              Permissões de Acesso do Colaborador:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="canManageFinanceCheck"
                checked={form.canManageFinance}
                onChange={(e) => setForm({ ...form, canManageFinance: e.target.checked })}
                className="rounded text-primary focus:ring-primary bg-[#141414] border-[#333]"
              />
              <label htmlFor="canManageFinanceCheck" className="text-xs text-on-surface cursor-pointer font-mono">
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
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold shadow-lg hover:shadow-primary/30"
            >
              Cadastrar Colaborador & Criar Acesso
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
