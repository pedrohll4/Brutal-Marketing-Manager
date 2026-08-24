'use client';

import React from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { ArrowUpRight, Sparkles, CheckCircle2, DollarSign, Megaphone } from 'lucide-react';
import Link from 'next/link';

export function ActivityFeed() {
  const { notifications } = useSystemStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST':
        return <Sparkles className="w-4 h-4 text-primary" />;
      case 'TASK':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'CAMPAIGN':
        return <Megaphone className="w-4 h-4 text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="brutal-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#262626]">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Atividades Recentes</h3>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Fluxo operacional em tempo real da agência
          </p>
        </div>
        <Link
          href="/solicitacoes"
          className="text-xs text-primary hover:underline font-mono flex items-center gap-1"
        >
          Ver solicitações <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {notifications.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3.5 p-3 rounded bg-[#181818] border border-[#262626] hover:border-[#353534] transition-colors"
          >
            <div className="p-2 rounded bg-[#201f1f] border border-[#2a2a2a] shrink-0">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="text-sm font-semibold text-on-surface truncate">{item.title}</h4>
                <span className="text-[10px] font-mono text-on-surface-variant shrink-0">
                  {item.createdAt}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                {item.message}
              </p>
            </div>
            {item.link && (
              <Link
                href={item.link}
                className="p-1.5 rounded hover:bg-[#262626] text-on-surface-variant hover:text-primary transition-colors shrink-0"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
