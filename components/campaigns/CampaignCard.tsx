'use client';

import React from 'react';
import { Campaign } from '@/lib/types';
import { Building2, Users } from 'lucide-react';
import Link from 'next/link';

interface CampaignCardProps {
  campaign: Campaign;
  isSelected?: boolean;
  onSelect?: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, isSelected = false, onSelect }: CampaignCardProps) {
  const isDelayed = campaign.status === 'DELAYED';
  const isCompleted = campaign.status === 'COMPLETED';

  return (
    <div
      onClick={() => onSelect && onSelect(campaign)}
      className={`bg-[#121212] border rounded-lg p-6 relative group overflow-hidden cursor-pointer transition-all ${
        isSelected
          ? 'border-primary shadow-lg shadow-primary/10'
          : 'border-[#262626] hover:border-[#5c4037]'
      }`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span
            className={`font-mono text-[10px] px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block font-bold ${
              isDelayed
                ? 'text-red-400 bg-red-950/40 border border-red-800/40'
                : isCompleted
                ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                : 'text-primary bg-primary/10 border border-primary/30'
            }`}
          >
            {isDelayed ? 'Atrasado' : isCompleted ? 'Concluída' : 'Em Andamento'}
          </span>

          <h3 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
            {campaign.name}
          </h3>

          <p className="text-on-surface-variant text-xs flex items-center gap-1.5 font-mono">
            <Building2 className="w-3.5 h-3.5 text-on-surface-variant" />
            {campaign.clientName}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex -space-x-2 overflow-hidden mb-2">
            {campaign.assignedEmployeeNames.map((name, idx) => (
              <div
                key={idx}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121212] bg-[#222] border border-[#333] flex items-center justify-center font-bold text-xs text-primary"
                title={name}
              >
                {name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="font-mono text-on-surface-variant text-xs font-semibold">
            {campaign.contentCount} Conteúdos
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-mono text-on-surface-variant mb-1.5">
          <span className={isDelayed ? 'text-red-400' : 'text-primary'}>Progresso Geral</span>
          <span className="font-bold text-on-surface">{campaign.progressPct}%</span>
        </div>
        <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all ${
              isDelayed ? 'bg-red-500' : isCompleted ? 'bg-emerald-500' : 'bg-primary'
            }`}
            style={{ width: `${campaign.progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
