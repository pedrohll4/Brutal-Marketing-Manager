'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import {
  Search,
  Users,
  Film,
  Megaphone,
  Calendar,
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const { clients, tasks, campaigns } = useSystemStore();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable items
  const clientItems = clients.map((c) => ({
    id: `client-${c.id}`,
    category: 'Clientes',
    title: `${c.companyName} (${c.name})`,
    subtitle: `Plano: ${c.contractModel} • Venc. Dia ${c.dueDay}`,
    icon: <Users className="w-4 h-4 text-primary" />,
    action: () => router.push(`/clientes/${c.id}`),
  }));

  const taskItems = tasks.map((t) => ({
    id: `task-${t.id}`,
    category: 'Tarefas de Vídeo & Foto',
    title: t.title,
    subtitle: `${t.clientName} • Status: ${t.status} • Prazo: ${t.dueDate}`,
    icon: t.taskType === 'PHOTO' ? <ImageIcon className="w-4 h-4 text-emerald-400" /> : <Film className="w-4 h-4 text-primary" />,
    action: () => router.push('/producao'),
  }));

  const campaignItems = campaigns.map((camp) => ({
    id: `campaign-${camp.id}`,
    category: 'Campanhas',
    title: camp.name,
    subtitle: `${camp.clientName} • Progresso: ${camp.progressPct}% • Etapa: ${camp.currentStep}`,
    icon: <Megaphone className="w-4 h-4 text-blue-400" />,
    action: () => router.push('/campanhas'),
  }));

  const actionItems = [
    {
      id: 'act-new-campaign',
      category: 'Ações Rápidas',
      title: 'Lançar Nova Campanha',
      subtitle: 'Criar campanha e cronograma',
      icon: <Plus className="w-4 h-4 text-primary" />,
      action: () => router.push('/campanhas'),
    },
    {
      id: 'act-new-task',
      category: 'Ações Rápidas',
      title: 'Adicionar Tarefa de Produção / Vídeo / Foto',
      subtitle: 'Adicionar item ao quadro Kanban',
      icon: <Plus className="w-4 h-4 text-emerald-400" />,
      action: () => router.push('/producao'),
    },
    {
      id: 'act-financial',
      category: 'Navegação',
      title: 'Abrir Painel Financeiro & PIX',
      subtitle: 'Faturas, recebimentos e extrato de extras',
      icon: <CreditCard className="w-4 h-4 text-amber-400" />,
      action: () => router.push('/financeiro'),
    },
    {
      id: 'act-settings',
      category: 'Configurações',
      title: 'Minha Conta & Segurança',
      subtitle: 'Alterar senha e dados do perfil',
      icon: <ShieldCheck className="w-4 h-4 text-primary" />,
      action: () => router.push('/configuracoes'),
    },
    {
      id: 'act-reports',
      category: 'Navegação',
      title: 'Gerador de Relatórios Mensais',
      subtitle: 'Relatórios de entregas e financeiro para WhatsApp/PDF',
      icon: <Megaphone className="w-4 h-4 text-emerald-400" />,
      action: () => router.push('/relatorios'),
    },
  ];

  const allItems = [...actionItems, ...clientItems, ...taskItems, ...campaignItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 10);

  const handleSelect = (item: (typeof allItems)[0]) => {
    item.action();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Box */}
      <div className="relative w-full max-w-2xl bg-[#141414] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#262626] bg-[#111111]">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por clientes, vídeos, fotos, campanhas, ações..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-on-surface text-sm font-sans placeholder:text-on-surface-variant/60"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-[10px] font-mono text-on-surface-variant">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#1c1c1c]">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-on-surface-variant font-mono">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#221c18] border border-primary/40' : 'hover:bg-[#1a1a1a] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded bg-[#1a1a1a] border border-[#262626] shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-on-surface truncate">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono text-on-surface-variant/70 uppercase px-1.5 py-0.2 rounded bg-[#1c1b1b]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-on-surface-variant truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-opacity ${
                      isSelected ? 'text-primary opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#101010] border-t border-[#222] flex items-center justify-between text-[10px] font-mono text-on-surface-variant/80">
          <div className="flex items-center gap-3">
            <span>↑↓ Navegar</span>
            <span>↵ Abrir</span>
            <span>ESC Fechar</span>
          </div>
          <span className="text-primary font-bold">BRUTAL SEARCH</span>
        </div>
      </div>
    </div>
  );
}
