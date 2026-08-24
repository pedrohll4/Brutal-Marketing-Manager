'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { generateAICampaignPlan, GeneratedCampaignPlan, GeneratedVideoScript } from '@/lib/services/aiCampaignService';
import { Modal } from '../ui/Modal';
import {
  Sparkles,
  RefreshCw,
  Film,
  Check,
  Edit3,
  Flame,
  ArrowRight,
  Plus,
  Trash2,
  Send,
  Video,
  Clapperboard,
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AICampaignGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICampaignGeneratorModal({ isOpen, onClose }: AICampaignGeneratorModalProps) {
  const router = useRouter();
  const { clients, employees, addCampaign, addTask, addToast } = useSystemStore();

  // Wizard Steps: 1 = Config, 2 = Review & Edit Generated Scripts
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Form Inputs
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [userTheme, setUserTheme] = useState('');
  const [videoCount, setVideoCount] = useState(4);
  const [tone, setTone] = useState('Autoridade e Conversão');
  const [platform, setPlatform] = useState('Instagram Reels & TikTok (9:16)');

  // Generated Result Plan (Fully Editable)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedCampaignPlan | null>(null);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);

  const selectedClient = clients.find((c) => c.id === clientId) || clients[0];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await generateAICampaignPlan({
        client: selectedClient,
        userTheme: userTheme.trim() || undefined,
        videoCount,
        tone,
        platform,
      });
      setGeneratedPlan(plan);
      setSelectedScriptIndex(0);
      setStep(2);
      addToast({
        title: 'Campanha e Roteiros Gerados com IA! 🤖',
        description: `${plan.scripts.length} roteiros prontos para revisão e edição.`,
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Erro na Geração',
        description: 'Tente novamente em instantes.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Editing helper for scripts
  const handleUpdateScriptField = (field: keyof GeneratedVideoScript, value: any) => {
    if (!generatedPlan) return;
    const updatedScripts = [...generatedPlan.scripts];
    updatedScripts[selectedScriptIndex] = {
      ...updatedScripts[selectedScriptIndex],
      [field]: value,
    };
    setGeneratedPlan({ ...generatedPlan, scripts: updatedScripts });
  };

  const handleUpdateScene = (sceneIndex: number, field: 'audioSpoken' | 'visualDirection', value: string) => {
    if (!generatedPlan) return;
    const currentScript = generatedPlan.scripts[selectedScriptIndex];
    const updatedScenes = [...currentScript.scenes];
    updatedScenes[sceneIndex] = {
      ...updatedScenes[sceneIndex],
      [field]: value,
    };
    handleUpdateScriptField('scenes', updatedScenes);
  };

  // Final Action: Save Campaign & Inject Tasks into Kanban
  const handleSaveAndInjectToKanban = () => {
    if (!generatedPlan) return;

    // 1. Create the Campaign
    const newCampId = `camp-${Date.now()}`;
    addCampaign({
      name: generatedPlan.campaignName,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      description: generatedPlan.conceptDescription,
      startDate: generatedPlan.startDate,
      endDate: generatedPlan.endDate,
      budget: generatedPlan.suggestedBudget,
      contentCount: generatedPlan.scripts.length,
      progressPct: 15,
      status: 'IN_PRODUCTION',
      currentStep: 'SCRIPT',
      assignedEmployeeIds: [employees[0]?.id || 'emp-1'],
      assignedEmployeeNames: [employees[0]?.name || 'João Silva'],
    });

    // 2. Automatically Create a Kanban Task for each generated Video Script!
    generatedPlan.scripts.forEach((script, idx) => {
      const dueDate = new Date(Date.now() + (idx + 1) * 5 * 86400000).toISOString().split('T')[0];

      // Format scenes into clear text for video editor and videographer
      const formattedScriptBody = `
[ROTEIRO GERADO COM IA]
GANCHO (0-3s): ${script.hook}

${script.scenes.map((s, sIdx) => `CENA ${sIdx + 1} (${s.timestamp}):\n🎥 VÍDEO / DIREÇÃO: ${s.visualDirection}\n🎙️ ÁUDIO / FALA: ${s.audioSpoken}`).join('\n\n')}

CTA FINAL: ${script.cta}
LOCAÇÃO SUGERIDA: ${script.locationTip}
FORMATO: ${script.targetFormat}
      `.trim();

      addTask({
        title: script.title,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        campaignId: newCampId,
        campaignName: generatedPlan.campaignName,
        assigneeId: employees[0]?.id,
        assigneeName: employees[0]?.name,
        taskType: 'VIDEO',
        status: 'PLANNED',
        priority: idx === 0 ? 'HIGH' : 'MEDIUM',
        description: formattedScriptBody,
        dueDate,
        isExtra: false,
        extraPrice: 0,
      });
    });

    addToast({
      title: 'Campanha & Roteiros Lançados no Kanban! 🚀',
      description: `${generatedPlan.scripts.length} tarefas de vídeo criadas na esteira de produção.`,
      type: 'success',
    });

    onClose();
    router.push('/producao');
  };

  const activeScript = generatedPlan?.scripts[selectedScriptIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Estrategista de Campanhas & Roteirista com IA"
      subtitle="Gere temas em alta, conceitos estratégicos e roteiros cena-a-cena 100% editáveis"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: CONFIGURATION */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 font-mono">
                <p className="font-bold text-primary">
                  A IA analisa o segmento do cliente e as tendências mais faladas do mês!
                </p>
                <p className="text-on-surface-variant">
                  Você pode digitar um tema específico ou deixar em branco para a IA criar ideias baseadas no mercado atual.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Client Selection */}
              <div>
                <label className="block text-on-surface-variant uppercase font-bold mb-1">
                  Cliente / Empresa
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#141414]">
                      {c.companyName} ({c.segment || 'Geral'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity of videos */}
              <div>
                <label className="block text-on-surface-variant uppercase font-bold mb-1">
                  Quantidade de Vídeos / Roteiros
                </label>
                <select
                  value={videoCount}
                  onChange={(e) => setVideoCount(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value={3}>3 Vídeos (Campanha Curta / Sprint)</option>
                  <option value={4}>4 Vídeos (1 Vídeo por Semana - Padrão)</option>
                  <option value={6}>6 Vídeos (Série Completa de Conteúdo)</option>
                  <option value={8}>8 Vídeos (Campanha Mensal Pesada)</option>
                </select>
              </div>
            </div>

            {/* Campaign Focus / Theme */}
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant font-bold mb-1 flex items-center justify-between">
                <span>Tema ou Objetivo Principal da Campanha</span>
                <span className="text-primary text-[10px] font-normal">
                  (Opcional - Deixe vazio para usar tendências do mês)
                </span>
              </label>
              <input
                type="text"
                placeholder="Ex: Lançamento Safra 2026, Preparação de Plantio, Black Friday Antecipada, Queima de Estoque..."
                value={userTheme}
                onChange={(e) => setUserTheme(e.target.value)}
                className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            {/* Tone & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-on-surface-variant uppercase font-bold mb-1">
                  Tom de Voz Desejado
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="Autoridade e Conversão">Autoridade de Especialista & Conversão</option>
                  <option value="Vendas Diretas Agressivas">Vendas Diretas & Urgência</option>
                  <option value="Storytelling Emocional">Storytelling Emocional & Conexão</option>
                  <option value="Educativo e Passo a Passo">Educativo & Dicas Práticas</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant uppercase font-bold mb-1">
                  Formato / Plataforma Principal
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="Instagram Reels & TikTok (9:16)">Instagram Reels & TikTok (Vertical 9:16)</option>
                  <option value="YouTube & Institucional (Horizontal 16:9)">YouTube & Institucional (Horizontal 16:9)</option>
                  <option value="Comercial de TV e Painel LED (4K UHD)">Comercial de TV & Painel LED (4K UHD)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-black text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>A IA está analisando tendências e estruturando os roteiros...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✨ Gerar Estratégia de Campanha & Roteiros com IA</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: REVIEW, EDIT & INJECT SCRIPTS */}
        {/* ========================================================================= */}
        {step === 2 && generatedPlan && (
          <div className="space-y-5">
            {/* Top Trending Badge & Macro Concept */}
            <div className="p-4 bg-[#161616] border border-primary/40 rounded-lg space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold bg-primary text-white px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Tendências Detectadas
                </span>
                <span className="text-[11px] font-mono text-primary font-bold">
                  {selectedClient.companyName}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-300">
                {generatedPlan.trendingTopicAnalysis}
              </p>
            </div>

            {/* Campaign Name & Description (Editable) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-on-surface-variant font-bold mb-1">
                  Nome da Campanha (Editável)
                </label>
                <input
                  type="text"
                  value={generatedPlan.campaignName}
                  onChange={(e) => setGeneratedPlan({ ...generatedPlan, campaignName: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-xs font-bold text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-on-surface-variant font-bold mb-1">
                  Conceito Estratégico (Editável)
                </label>
                <input
                  type="text"
                  value={generatedPlan.conceptDescription}
                  onChange={(e) => setGeneratedPlan({ ...generatedPlan, conceptDescription: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Scripts Tabs Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#262626]">
              {generatedPlan.scripts.map((script, idx) => (
                <button
                  key={script.id}
                  type="button"
                  onClick={() => setSelectedScriptIndex(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    selectedScriptIndex === idx
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-[#181818] text-on-surface-variant hover:text-on-surface border border-[#262626]'
                  }`}
                >
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>Vídeo #{idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Selected Video Script Editor */}
            {activeScript && (
              <div className="p-4 rounded-lg bg-[#151515] border border-[#262626] space-y-4 text-xs font-mono">
                {/* Script Title & Hook */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase text-primary font-bold mb-1">
                      Título do Vídeo #{activeScript.videoNumber}:
                    </label>
                    <input
                      type="text"
                      value={activeScript.title}
                      onChange={(e) => handleUpdateScriptField('title', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs font-bold text-on-surface focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-amber-400 font-bold mb-1">
                      ⚡ Gancho Inicial (Primeiros 3 segundos - O que prende a atenção):
                    </label>
                    <input
                      type="text"
                      value={activeScript.hook}
                      onChange={(e) => handleUpdateScriptField('hook', e.target.value)}
                      className="w-full bg-[#181818] border border-amber-500/40 rounded px-3 py-2 text-xs text-on-surface focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2-Column Script Table: Video / Visual Direction vs Audio / Spoken Words */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] uppercase text-on-surface-variant font-bold">
                    <span>Roteiro Cena-a-Cena (Áudio & Vídeo):</span>
                    <span className="text-[10px] text-primary">100% Editável pelo Funcionário</span>
                  </div>

                  <div className="space-y-3">
                    {activeScript.scenes.map((scene, sceneIdx) => (
                      <div
                        key={sceneIdx}
                        className="p-3 bg-[#181818] border border-[#2a2a2a] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        {/* Visual / Camera Direction */}
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">
                            🎥 Vídeo / Direção Visual ({scene.timestamp})
                          </span>
                          <textarea
                            rows={3}
                            value={scene.visualDirection}
                            onChange={(e) => handleUpdateScene(sceneIdx, 'visualDirection', e.target.value)}
                            className="w-full bg-[#121212] border border-[#333] rounded p-2 text-[11px] text-zinc-300 font-sans focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {/* Audio / Spoken Words */}
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                            🎙️ Áudio / Fala do Apresentador
                          </span>
                          <textarea
                            rows={3}
                            value={scene.audioSpoken}
                            onChange={(e) => handleUpdateScene(sceneIdx, 'audioSpoken', e.target.value)}
                            className="w-full bg-[#121212] border border-[#333] rounded p-2 text-[11px] text-zinc-200 font-sans focus:border-emerald-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA and Location Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-on-surface-variant font-bold mb-1">
                      Chamada para Ação (CTA Final):
                    </label>
                    <input
                      type="text"
                      value={activeScript.cta}
                      onChange={(e) => handleUpdateScriptField('cta', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-on-surface-variant font-bold mb-1">
                      Locação & Cenário Recomendado:
                    </label>
                    <input
                      type="text"
                      value={activeScript.locationTip}
                      onChange={(e) => handleUpdateScriptField('locationTip', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#262626]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] text-xs font-mono"
              >
                ← Voltar e Ajustar Tema
              </button>

              <button
                type="button"
                onClick={handleSaveAndInjectToKanban}
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-black text-xs font-mono flex items-center gap-2 transition-all shadow-xl hover:shadow-primary/30"
              >
                <Send className="w-4 h-4" />
                <span>🚀 Salvar Campanha e Injetar Roteiros no Kanban</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
