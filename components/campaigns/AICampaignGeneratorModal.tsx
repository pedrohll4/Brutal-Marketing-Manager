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
  MessageSquare,
  Camera,
  FileText,
  Lightbulb,
  FolderPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AICampaignGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type GenerationMode = 'THEMES_ONLY' | 'FULL_SCRIPTS' | 'MANUAL';

export function AICampaignGeneratorModal({ isOpen, onClose }: AICampaignGeneratorModalProps) {
  const router = useRouter();
  const { clients, employees, addCampaign, addTask, addToast } = useSystemStore();

  // Wizard Steps: 1 = Config, 2 = Review & Edit
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Generation Mode Selected
  const [mode, setMode] = useState<GenerationMode>('THEMES_ONLY');

  // Form Inputs
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [userTheme, setUserTheme] = useState('');
  const [videoCount, setVideoCount] = useState(4);
  const [tone, setTone] = useState('Autoridade e Conversão');
  const [platform, setPlatform] = useState('Instagram Reels & TikTok (9:16)');

  // Manual Mode Inputs
  const [manualCampaignName, setManualCampaignName] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualBudget, setManualBudget] = useState(5000);

  // Generated Result Plan (Fully Editable)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedCampaignPlan | null>(null);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);
  const [viewDetailMode, setViewDetailMode] = useState<'THEMES' | 'SCRIPTS'>('THEMES');

  const selectedClient = clients.find((c) => c.id === clientId) || clients[0] || {
    id: 'cli-generic',
    name: 'Cliente Geral',
    companyName: 'Cliente Geral',
    email: '',
    phone: '',
    document: '',
    monthlyFee: 0,
    contractedVideos: 0,
    contractedPhotos: 0,
    contractedCampaigns: 0,
    extraVideoPrice: 150,
    extraPhotoPrice: 80,
    extraEventPrice: 500,
    extraDailyPrice: 300,
    status: 'ACTIVE',
    contractModel: 'QUANTITY',
    createdAt: new Date().toISOString(),
  };

  const handleGenerate = async () => {
    // If manual mode, create simple campaign and exit
    if (mode === 'MANUAL') {
      if (!manualCampaignName.trim()) {
        addToast({ title: 'Preencha o nome da campanha', type: 'warning' });
        return;
      }
      addCampaign({
        name: manualCampaignName,
        clientId: selectedClient.id,
        clientName: selectedClient.companyName || selectedClient.name,
        description: manualDescription || 'Campanha criada manualmente.',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        budget: Number(manualBudget),
        contentCount: 0,
        progressPct: 0,
        status: 'PLANNING',
        currentStep: 'BRIEFING',
        assignedEmployeeIds: [employees[0]?.id || 'emp-1'],
        assignedEmployeeNames: [employees[0]?.name || 'João Silva'],
      });
      addToast({
        title: 'Campanha Criada com Sucesso! 📁',
        description: 'Você pode adicionar os vídeos e tarefas quando quiser.',
        type: 'success',
      });
      onClose();
      return;
    }

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
      setViewDetailMode(mode === 'FULL_SCRIPTS' ? 'SCRIPTS' : 'THEMES');
      setStep(2);
      addToast({
        title: mode === 'THEMES_ONLY' ? 'Temas e Títulos Gerados com IA! 💡' : 'Roteiros Completos Gerados com IA! 🤖',
        description: `${plan.scripts.length} vídeos sugeridos com base nas tendências do mês.`,
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

  const handleAddNewVideoTopic = () => {
    if (!generatedPlan) return;
    const newIndex = generatedPlan.scripts.length + 1;
    const newScript: GeneratedVideoScript = {
      id: `script-custom-${Date.now()}`,
      videoNumber: newIndex,
      title: `Vídeo ${String(newIndex).padStart(2, '0')}: Novo Tema Personalizado`,
      hook: 'Gancho inicial chamativo...',
      targetFormat: 'Reels / TikTok (9:16) - 45s',
      locationTip: 'Estúdio ou Locação Externa',
      cta: 'Siga nosso perfil e compartilhe!',
      scenes: [
        {
          timestamp: '00:00 - 00:03 (Gancho)',
          visualDirection: 'Take de abertura com texto dinâmico na tela.',
          audioSpoken: 'Frase de impacto inicial do apresentador.',
        },
        {
          timestamp: '00:03 - 00:25 (Desenvolvimento)',
          visualDirection: 'Takes de produto / operação com cortes a cada 2s.',
          audioSpoken: 'Explicação clara dos benefícios e diferenciais.',
        },
        {
          timestamp: '00:25 - 00:45 (Encerramento)',
          visualDirection: 'Take final com card da marca e texto CTA.',
          audioSpoken: 'Chamada para ação clara.',
        },
      ],
    };

    setGeneratedPlan({
      ...generatedPlan,
      scripts: [...generatedPlan.scripts, newScript],
    });
    setSelectedScriptIndex(generatedPlan.scripts.length);
  };

  const handleRemoveVideoTopic = (indexToRemove: number) => {
    if (!generatedPlan || generatedPlan.scripts.length <= 1) return;
    const updated = generatedPlan.scripts.filter((_, idx) => idx !== indexToRemove);
    setGeneratedPlan({ ...generatedPlan, scripts: updated });
    setSelectedScriptIndex(0);
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
      progressPct: 10,
      status: 'IN_PRODUCTION',
      currentStep: viewDetailMode === 'SCRIPTS' ? 'SCRIPT' : 'BRIEFING',
      assignedEmployeeIds: [employees[0]?.id || 'emp-1'],
      assignedEmployeeNames: [employees[0]?.name || 'João Silva'],
    });

    // 2. Automatically Create a Kanban Task for each video!
    generatedPlan.scripts.forEach((script, idx) => {
      const dueDate = new Date(Date.now() + (idx + 1) * 5 * 86400000).toISOString().split('T')[0];

      let descriptionContent = '';

      if (viewDetailMode === 'SCRIPTS') {
        // Detailed Scene-by-Scene Script Format
        descriptionContent = `
[ROTEIRO ESTRUTURADO COM IA]
🎯 GANCHO INICIAL (0-3s): "${script.hook}"

${script.scenes.map((s, sIdx) => `--- CENA ${sIdx + 1} (${s.timestamp}) ---
🎥 O QUE MOSTRAR NA CÂMERA (VÍDEO):
${s.visualDirection}

🎙️ O QUE O APRESENTADOR FALA (ÁUDIO):
"${s.audioSpoken}"`).join('\n\n')}

🚀 CTA FINAL: ${script.cta}
📍 LOCAÇÃO RECOMENDADA: ${script.locationTip}
📐 FORMATO: ${script.targetFormat}
        `.trim();
      } else {
        // Topic / Concept Format (Roteiro to be written later)
        descriptionContent = `
[TEMA & CONCEITO DE VÍDEO]
📌 TEMA: ${script.title}
⚡ GANCHO SUGERIDO: "${script.hook}"
🎯 OBJETIVO: Desenvolver roteiro e captação para a campanha "${generatedPlan.campaignName}".
📍 LOCAÇÃO PREVISTA: ${script.locationTip}
📐 FORMATO: ${script.targetFormat}
💡 Status do Roteiro: Pendente de redação / aprovação da equipe.
        `.trim();
      }

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
        description: descriptionContent,
        dueDate,
        isExtra: false,
        extraPrice: 0,
      });
    });

    addToast({
      title: 'Campanha & Tarefas Criadas no Kanban! 🚀',
      description: `${generatedPlan.scripts.length} tarefas criadas. Roteiros prontos para produção.`,
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
      title="Planejamento de Campanha & Roteiros com IA"
      subtitle="Escolha como deseja criar: apenas temas e títulos, roteiros completos ou campanha manual"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE CREATION MODE & CONFIG */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Mode Selection Cards */}
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant font-bold mb-2">
                Como você deseja criar a campanha?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mode 1: Themes Only */}
                <div
                  onClick={() => setMode('THEMES_ONLY')}
                  className={`p-4 rounded-lg cursor-pointer border transition-all flex flex-col justify-between ${
                    mode === 'THEMES_ONLY'
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 ring-1 ring-primary'
                      : 'border-[#262626] bg-[#161616] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase">
                      Mais Rápido
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">1. Apenas Temas & Ideias (IA)</h4>
                    <p className="text-[11px] font-mono text-on-surface-variant mt-1 leading-relaxed">
                      A IA sugere os temas em alta do mês e títulos de cada vídeo. Você cria os roteiros depois com a equipe.
                    </p>
                  </div>
                </div>

                {/* Mode 2: Full Scripts */}
                <div
                  onClick={() => setMode('FULL_SCRIPTS')}
                  className={`p-4 rounded-lg cursor-pointer border transition-all flex flex-col justify-between ${
                    mode === 'FULL_SCRIPTS'
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : 'border-[#262626] bg-[#161616] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clapperboard className="w-5 h-5 text-emerald-400" />
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 uppercase">
                      Completo
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">2. Roteiros Cena-a-Cena (IA)</h4>
                    <p className="text-[11px] font-mono text-on-surface-variant mt-1 leading-relaxed">
                      A IA escreve o roteiro completo de cada vídeo separando o que falar e o que mostrar na câmera.
                    </p>
                  </div>
                </div>

                {/* Mode 3: Manual Empty Campaign */}
                <div
                  onClick={() => setMode('MANUAL')}
                  className={`p-4 rounded-lg cursor-pointer border transition-all flex flex-col justify-between ${
                    mode === 'MANUAL'
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                      : 'border-[#262626] bg-[#161616] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FolderPlus className="w-5 h-5 text-cyan-400" />
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 uppercase">
                      Livre
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">3. Campanha Manual</h4>
                    <p className="text-[11px] font-mono text-on-surface-variant mt-1 leading-relaxed">
                      Crie a campanha em branco e adicione os vídeos manualmente no seu próprio ritmo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* If Manual Mode */}
            {mode === 'MANUAL' ? (
              <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] space-y-4 text-xs font-mono animate-in fade-in">
                <div>
                  <label className="block text-on-surface-variant uppercase font-bold mb-1">
                    Cliente
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#141414]">
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface-variant uppercase font-bold mb-1">
                    Nome da Campanha
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Campanha Primavera Verão 2026 / Safra de Soja..."
                    value={manualCampaignName}
                    onChange={(e) => setManualCampaignName(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-on-surface-variant uppercase font-bold mb-1">
                    Descrição / Objetivos
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Resumo das metas, canais e ideias..."
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>Criar Campanha e Adicionar Vídeos Depois</span>
                </button>
              </div>
            ) : (
              /* If AI Mode (Themes Only or Full Scripts) */
              <div className="space-y-4">
                <div className="p-3.5 bg-primary/10 border border-primary/30 rounded-lg flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs font-mono text-on-surface-variant leading-relaxed">
                    A IA vai analisar o segmento de <strong>{selectedClient.companyName}</strong> ({selectedClient.segment || 'Geral'}) e sugerir os temas mais quentes do mês.
                  </p>
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
                      Quantidade de Vídeos Planejados
                    </label>
                    <select
                      value={videoCount}
                      onChange={(e) => setVideoCount(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
                    >
                      <option value={3}>3 Vídeos (Sprint Curta)</option>
                      <option value={4}>4 Vídeos (1 por Semana - Padrão)</option>
                      <option value={6}>6 Vídeos (Série de Conteúdo)</option>
                      <option value={8}>8 Vídeos (Campanha Completa)</option>
                    </select>
                  </div>
                </div>

                {/* Campaign Focus / Theme */}
                <div>
                  <label className="block text-xs font-mono uppercase text-on-surface-variant font-bold mb-1 flex items-center justify-between">
                    <span>Tema Específico da Campanha</span>
                    <span className="text-primary text-[10px] font-normal">
                      (Opcional - Deixe vazio para usar tendências do mês)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Lançamento de Produto, Manejo de Safra, Queima de Estoque..."
                    value={userTheme}
                    onChange={(e) => setUserTheme(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
                  />
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
                      <span>Analisando tendências do mês e gerando sugestões...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {mode === 'THEMES_ONLY'
                          ? '✨ Gerar Temas & Ideias de Vídeos com IA'
                          : '✨ Gerar Campanha com Roteiros Completos (IA)'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: REVIEW, EDIT & INJECT */}
        {/* ========================================================================= */}
        {step === 2 && generatedPlan && (
          <div className="space-y-5">
            {/* Top Trending Badge & Macro Concept */}
            <div className="p-4 bg-[#161616] border border-primary/40 rounded-lg space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold bg-primary text-white px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Tendências em Alta no Mês
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

            {/* View Mode Toggle: [Temas e Títulos] vs [Roteiros Completos] */}
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-xs font-mono font-bold uppercase text-on-surface flex items-center gap-1.5">
                <Film className="w-4 h-4 text-primary" />
                Vídeos Planejados ({generatedPlan.scripts.length})
              </span>

              <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] p-1 rounded text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setViewDetailMode('THEMES')}
                  className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                    viewDetailMode === 'THEMES'
                      ? 'bg-primary text-white font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Lightbulb className="w-3 h-3" />
                  <span>Apenas Temas & Títulos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewDetailMode('SCRIPTS')}
                  className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                    viewDetailMode === 'SCRIPTS'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Clapperboard className="w-3 h-3" />
                  <span>Roteiros Completos (Áudio & Vídeo)</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VIEW A: THEMES & TOPICS LIST (CLEAN, FAST & INTUITIVE) */}
            {/* ========================================================================= */}
            {viewDetailMode === 'THEMES' && (
              <div className="space-y-3">
                {generatedPlan.scripts.map((script, idx) => (
                  <div
                    key={script.id}
                    className="p-3.5 rounded-lg bg-[#181818] border border-[#2a2a2a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex-1 space-y-1 w-full">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/40 font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={script.title}
                          onChange={(e) => {
                            const updated = [...generatedPlan.scripts];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setGeneratedPlan({ ...generatedPlan, scripts: updated });
                          }}
                          className="flex-1 bg-[#121212] border border-[#333] rounded px-2.5 py-1 text-xs font-bold text-on-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-on-surface-variant pl-8">
                        ⚡ <strong>Gancho:</strong> &quot;{script.hook}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-8 sm:pl-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedScriptIndex(idx);
                          setViewDetailMode('SCRIPTS');
                        }}
                        className="px-2.5 py-1 rounded bg-[#222] hover:bg-primary/20 text-primary border border-[#333] text-[10px] font-bold transition-colors"
                      >
                        Escrever Roteiro ➔
                      </button>

                      {generatedPlan.scripts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVideoTopic(idx)}
                          className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                          title="Remover vídeo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddNewVideoTopic}
                  className="w-full py-2.5 rounded-lg border border-dashed border-[#333] hover:border-primary text-xs font-mono text-on-surface-variant hover:text-primary flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Adicionar Outro Vídeo a esta Campanha</span>
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW B: FULL SCENE-BY-SCENE SCRIPTS (CRYSTAL CLEAR SPEECH VS VISUALS) */}
            {/* ========================================================================= */}
            {viewDetailMode === 'SCRIPTS' && activeScript && (
              <div className="space-y-4">
                {/* Tabs Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {generatedPlan.scripts.map((script, idx) => (
                    <button
                      key={script.id}
                      type="button"
                      onClick={() => setSelectedScriptIndex(idx)}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold shrink-0 transition-all ${
                        selectedScriptIndex === idx
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-[#181818] text-on-surface-variant hover:text-on-surface border border-[#262626]'
                      }`}
                    >
                      Vídeo #{idx + 1}
                    </button>
                  ))}
                </div>

                {/* Script Editor Card */}
                <div className="p-4 rounded-lg bg-[#141414] border border-[#262626] space-y-4 text-xs font-mono">
                  {/* Title & Hook */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] uppercase text-emerald-400 font-bold mb-1">
                        Título do Vídeo #{activeScript.videoNumber}:
                      </label>
                      <input
                        type="text"
                        value={activeScript.title}
                        onChange={(e) => handleUpdateScriptField('title', e.target.value)}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs font-bold text-on-surface focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase text-amber-400 font-bold mb-1">
                        ⚡ Gancho Inicial de Retenção (Primeiros 3 segundos):
                      </label>
                      <input
                        type="text"
                        value={activeScript.hook}
                        onChange={(e) => handleUpdateScriptField('hook', e.target.value)}
                        className="w-full bg-[#181818] border border-amber-500/40 rounded px-3 py-1.5 text-xs text-on-surface focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* HIGH CONTRAST SCENES: Clear Distinction between SPEECH and VISUALS */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-[11px] uppercase text-on-surface-variant font-bold border-b border-[#242424] pb-1">
                      <span>Roteiro Cena-a-Cena</span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        Diferenciação Clara entre Fala e Câmera
                      </span>
                    </div>

                    {activeScript.scenes.map((scene, sceneIdx) => (
                      <div
                        key={sceneIdx}
                        className="p-3.5 rounded-lg bg-[#181818] border border-[#2a2a2a] space-y-3"
                      >
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#222] text-zinc-300 uppercase">
                          Cena {sceneIdx + 1} ({scene.timestamp})
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* GREEN BOX: EXACT SPOKEN WORDS / SPEECH */}
                          <div className="p-3 rounded-lg bg-[#0c1811] border-2 border-emerald-600/50 space-y-1">
                            <label className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>🎙️ O QUE O APRESENTADOR FALA (VOZ ALTA):</span>
                            </label>
                            <textarea
                              rows={3}
                              value={scene.audioSpoken}
                              onChange={(e) => handleUpdateScene(sceneIdx, 'audioSpoken', e.target.value)}
                              className="w-full bg-[#122319] border border-emerald-500/30 rounded p-2 text-xs text-emerald-100 font-sans leading-relaxed focus:border-emerald-400 focus:outline-none"
                              placeholder="Digite a fala exata palavra por palavra..."
                            />
                          </div>

                          {/* CYAN BOX: CAMERA & VISUAL DIRECTION */}
                          <div className="p-3 rounded-lg bg-[#0c141c] border-2 border-cyan-600/50 space-y-1">
                            <label className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5" />
                              <span>🎬 O QUE MOSTRAR NA CÂMERA (DIREÇÃO VISUAL):</span>
                            </label>
                            <textarea
                              rows={3}
                              value={scene.visualDirection}
                              onChange={(e) => handleUpdateScene(sceneIdx, 'visualDirection', e.target.value)}
                              className="w-full bg-[#111e2b] border border-cyan-500/30 rounded p-2 text-xs text-cyan-100 font-sans leading-relaxed focus:border-cyan-400 focus:outline-none"
                              placeholder="Takes, cortes, motion graphics e textos na tela..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA and Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] uppercase text-on-surface-variant font-bold mb-1">
                        Chamada para Ação (CTA):
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
                        Locação Recomendada:
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
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#262626]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] text-xs font-mono"
              >
                ← Voltar e Ajustar
              </button>

              <button
                type="button"
                onClick={handleSaveAndInjectToKanban}
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-black text-xs font-mono flex items-center gap-2 transition-all shadow-xl hover:shadow-primary/30"
              >
                <Send className="w-4 h-4" />
                <span>
                  {viewDetailMode === 'THEMES'
                    ? '🚀 Salvar Campanha & Criar Vídeos no Kanban'
                    : '🚀 Salvar Campanha e Injetar Roteiros Completos no Kanban'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
