'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Film,
  Megaphone,
  Calendar,
  MousePointerClick,
  CreditCard,
  BarChart3,
  BadgeCheck,
  Settings,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useSystemStore } from '@/lib/context/SystemStoreContext';

interface SideNavBarProps {
  className?: string;
  onItemClick?: () => void;
}

export function SideNavBar({ className = '', onItemClick }: SideNavBarProps) {
  const pathname = usePathname();
  const { isClient, isEmployee } = useAuth();
  const { clients, employees, addCampaign } = useSystemStore();

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    clientId: clients[0]?.id || '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    budget: 5000,
    contentCount: 8,
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === newCampaignForm.clientId) || clients[0];
    addCampaign({
      name: newCampaignForm.name,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      description: newCampaignForm.description,
      startDate: newCampaignForm.startDate,
      endDate: newCampaignForm.endDate,
      budget: Number(newCampaignForm.budget),
      contentCount: Number(newCampaignForm.contentCount),
      progressPct: 10,
      status: 'PLANNING',
      currentStep: 'BRIEFING',
      assignedEmployeeIds: [employees[0]?.id || 'emp-1'],
      assignedEmployeeNames: [employees[0]?.name || 'João Silva'],
    });
    setIsCampaignModalOpen(false);
    setNewCampaignForm({
      name: '',
      clientId: clients[0]?.id || '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      budget: 5000,
      contentCount: 8,
    });
  };

  // Nav Items definition
  const adminNavItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Clientes', href: '/clientes', icon: Users },
    { label: 'Produção', href: '/producao', icon: Film },
    { label: 'Campanhas', href: '/campanhas', icon: Megaphone },
    { label: 'Calendário', href: '/calendario', icon: Calendar },
    { label: 'Solicitações', href: '/solicitacoes', icon: MousePointerClick },
    { label: 'Financeiro', href: '/financeiro', icon: CreditCard },
    { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { label: 'Funcionários', href: '/funcionarios', icon: BadgeCheck },
    { label: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  const clientNavItems = [
    { label: 'Meu Dashboard', href: '/portal-cliente', icon: LayoutDashboard },
    { label: 'Solicitar Serviço', href: '/portal-cliente/solicitacoes', icon: Plus },
    { label: 'Entregas & Vídeos', href: '/portal-cliente/entregas', icon: Film },
    { label: 'Faturas & PIX', href: '/portal-cliente/pagamentos', icon: CreditCard },
  ];

  const navItems = isClient ? clientNavItems : adminNavItems;

  return (
    <>
      <aside
        className={`bg-[#131313] text-on-surface h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r border-[#262626] flex flex-col py-6 z-40 ${className}`}
      >
        {/* Brand Logo Header */}
        <div className="px-6 mb-8">
          <Link href={isClient ? '/portal-cliente' : '/'} className="group block">
            <h1 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none group-hover:text-[#ff6a22] transition-colors">
              Brutal<br />Manager
            </h1>
            <p className="font-mono text-[10px] text-on-surface-variant mt-1.5 uppercase tracking-widest font-semibold flex items-center gap-1">
              <span>Marketing Control</span>
              {isClient && <span className="text-primary text-[9px] font-bold">• CLIENTE</span>}
            </p>
          </Link>
        </div>

        {/* CTA Button */}
        {!isClient && (
          <div className="px-4 mb-6">
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold text-sm py-3 px-4 rounded flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Campanha</span>
            </button>
          </div>
        )}

        {isClient && (
          <div className="px-4 mb-6">
            <Link
              href="/portal-cliente/solicitacoes"
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold text-sm py-3 px-4 rounded flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Solicitar Extra</span>
            </Link>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-sm transition-all ${
                  isActive
                    ? 'text-primary font-bold border-r-2 border-primary bg-primary/10 rounded-r-none'
                    : 'text-on-surface-variant font-medium hover:bg-[#1f1f1f] hover:text-on-surface'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom indicator */}
        <div className="px-6 mt-auto pt-4 border-t border-[#1f1f1f]">
          <div className="flex items-center justify-between text-xs text-on-surface-variant/60 font-mono">
            <span>v1.0 • Brutal Core</span>
            <span className="w-2 h-2 rounded-full bg-green-500" title="Sistema Operacional" />
          </div>
        </div>
      </aside>

      {/* Modal Nova Campanha */}
      <Modal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        title="Criar Nova Campanha"
        subtitle="Inicie um pipeline de produção completo com cronograma e orçamento"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Nome da Campanha
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Campanha Black Friday 2026"
              value={newCampaignForm.name}
              onChange={(e) => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Cliente
              </label>
              <select
                value={newCampaignForm.clientId}
                onChange={(e) => setNewCampaignForm({ ...newCampaignForm, clientId: e.target.value })}
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
                Qtd. de Conteúdos
              </label>
              <input
                type="number"
                min="1"
                required
                value={newCampaignForm.contentCount}
                onChange={(e) =>
                  setNewCampaignForm({ ...newCampaignForm, contentCount: Number(e.target.value) })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                required
                value={newCampaignForm.startDate}
                onChange={(e) =>
                  setNewCampaignForm({ ...newCampaignForm, startDate: e.target.value })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Data Final
              </label>
              <input
                type="date"
                required
                value={newCampaignForm.endDate}
                onChange={(e) =>
                  setNewCampaignForm({ ...newCampaignForm, endDate: e.target.value })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Orçamento Previsto (R$)
            </label>
            <input
              type="number"
              step="100"
              value={newCampaignForm.budget}
              onChange={(e) =>
                setNewCampaignForm({ ...newCampaignForm, budget: Number(e.target.value) })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Briefing / Descrição
            </label>
            <textarea
              rows={3}
              placeholder="Objetivos principais, formatos e diretrizes da campanha..."
              value={newCampaignForm.description}
              onChange={(e) =>
                setNewCampaignForm({ ...newCampaignForm, description: e.target.value })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => setIsCampaignModalOpen(false)}
              className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] transition-colors font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors shadow"
            >
              Lançar Campanha
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
