'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { CampaignTimeline } from '@/components/campaigns/CampaignTimeline';
import { Plus, Filter } from 'lucide-react';
import { Campaign } from '@/lib/types';

export default function CampanhasPage() {
  const { campaigns } = useSystemStore();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(campaigns[0]);

  const filteredCampaigns = campaigns.filter((camp) => {
    if (statusFilter === 'active') return camp.status === 'IN_PRODUCTION';
    if (statusFilter === 'draft') return camp.status === 'PLANNING';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header matching Stitch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
            Gerenciamento de Campanhas
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            Visão geral do pipeline de produção e entregas.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative flex items-center bg-[#121212] border border-[#262626] rounded px-3 py-1.5 focus-within:border-primary transition-colors flex-grow md:flex-grow-0">
            <Filter className="w-3.5 h-3.5 text-on-surface-variant mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-on-surface font-mono text-xs w-full cursor-pointer pr-4"
            >
              <option value="all" className="bg-[#181818]">Todos os Status</option>
              <option value="active" className="bg-[#181818]">Ativas</option>
              <option value="draft" className="bg-[#181818]">Planejamento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Layout Grid matching Stitch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Active Campaigns List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {filteredCampaigns.map((camp) => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              isSelected={selectedCampaign?.id === camp.id}
              onSelect={setSelectedCampaign}
            />
          ))}
        </div>

        {/* Right Column: Detailed View (Pinned/Selected Timeline) */}
        <div className="lg:col-span-1">
          {selectedCampaign ? (
            <CampaignTimeline campaign={selectedCampaign} />
          ) : (
            <div className="brutal-card p-6 rounded-lg text-center text-xs text-on-surface-variant font-mono">
              Selecione uma campanha para ver a timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
