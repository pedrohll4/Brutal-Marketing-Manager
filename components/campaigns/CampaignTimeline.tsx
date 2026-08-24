'use client';

import React from 'react';
import { Campaign, CampaignStep } from '@/lib/types';
import { Check, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';

interface CampaignTimelineProps {
  campaign: Campaign;
}

const STEPS: { id: CampaignStep; label: string; defaultDesc: string }[] = [
  { id: 'BRIEFING', label: 'Briefing', defaultDesc: 'Alinhamento de expectativas e escopo' },
  { id: 'SCRIPT', label: 'Roteiro', defaultDesc: 'Roteirização e aprovação de copy' },
  { id: 'RECORDING', label: 'Gravação', defaultDesc: 'Captação externa e em estúdio' },
  { id: 'EDITING', label: 'Edição', defaultDesc: 'Corte, color grading e sound design' },
  { id: 'REVIEW', label: 'Revisão', defaultDesc: 'Ajustes internos da equipe criativa' },
  { id: 'APPROVAL', label: 'Aprovação', defaultDesc: 'Validação final pelo cliente' },
  { id: 'PUBLISHING', label: 'Publicação', defaultDesc: 'Disparo e veiculação nas redes' },
];

export function CampaignTimeline({ campaign }: CampaignTimelineProps) {
  const { updateCampaign } = useSystemStore();

  const currentStepIndex = STEPS.findIndex((s) => s.id === campaign.currentStep);

  const handleSetStep = (step: CampaignStep, stepIdx: number) => {
    const calcProgress = Math.round(((stepIdx + 1) / STEPS.length) * 100);
    updateCampaign(campaign.id, {
      currentStep: step,
      progressPct: calcProgress,
      status: step === 'PUBLISHING' ? 'COMPLETED' : 'IN_PRODUCTION',
    });
  };

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-lg p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#262626]">
        <h3 className="font-bold text-lg text-on-surface">Timeline Detalhada</h3>
        <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
          Etapa {currentStepIndex + 1} de {STEPS.length}
        </span>
      </div>

      <div className="mb-6">
        <p className="font-mono text-xs text-on-surface-variant mb-1">Campanha Selecionada</p>
        <p className="font-bold text-primary text-sm">{campaign.name}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{campaign.clientName}</p>
      </div>

      {/* Vertical Stepper matching Stitch */}
      <div className="relative border-l border-[#262626] ml-3 mt-4 space-y-7">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex || campaign.status === 'COMPLETED';
          const isActive = idx === currentStepIndex && campaign.status !== 'COMPLETED';
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              onClick={() => handleSetStep(step.id, idx)}
              className="relative pl-6 cursor-pointer group"
            >
              {/* Step indicator circle */}
              {isDone ? (
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center ring-4 ring-[#121212]">
                  <Check className="w-2.5 h-2.5 text-[#5c1900] stroke-[3]" />
                </div>
              ) : isActive ? (
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-[#121212] border-2 border-primary flex items-center justify-center ring-4 ring-[#121212]">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-[#262626] ring-4 ring-[#121212] group-hover:bg-[#444]" />
              )}

              {/* Title & Desc */}
              <div className="flex items-baseline justify-between">
                <h4
                  className={`font-mono text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-primary'
                      : isDone
                      ? 'text-on-surface'
                      : 'text-on-surface-variant/60 group-hover:text-on-surface-variant'
                  }`}
                >
                  {step.label}
                </h4>
                {isActive && (
                  <span className="text-[10px] font-mono text-primary animate-pulse">
                    EM ANDAMENTO
                  </span>
                )}
              </div>

              <p
                className={`text-xs mt-0.5 ${
                  isActive
                    ? 'text-on-surface-variant font-medium'
                    : isDone
                    ? 'text-on-surface-variant/80'
                    : 'text-on-surface-variant/40'
                }`}
              >
                {step.defaultDesc}
              </p>

              {isActive && (
                <div className="mt-2 flex gap-2">
                  <button className="text-[11px] font-mono border border-[#262626] px-2.5 py-1 rounded text-on-surface hover:border-primary transition-colors bg-[#181818]">
                    Avançar Etapa →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
