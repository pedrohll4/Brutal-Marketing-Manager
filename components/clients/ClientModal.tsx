'use client';

import React, { useState, useEffect } from 'react';
import { Client, ContractModel, ClientStatus } from '@/lib/types';
import { Modal } from '../ui/Modal';
import { useAuth } from '@/lib/context/AuthContext';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { KeyRound, Sparkles, Copy, Check, ShieldCheck, User, Lock } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: any) => void;
  clientToEdit?: Client | null;
}

export function ClientModal({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
}: ClientModalProps) {
  const { registerUserAccount } = useAuth();
  const { addToast } = useSystemStore();

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    document: '',
    segment: '',
    logoUrl: '',
    address: '',
    notes: '',
    status: 'ACTIVE' as ClientStatus,
    contractModel: 'QUANTITY' as ContractModel,
    monthlyFee: 2000,
    dueDay: 10,
    contractedVideos: 12,
    contractedPhotos: 20,
    contractedCampaigns: 1,
    extraVideoPrice: 150,
    extraPhotoPrice: 80,
    extraEventPrice: 500,
    extraDailyPrice: 300,
  });

  const [copiedWelcome, setCopiedWelcome] = useState(false);

  // Auto-generate username from name or company
  const generateUsername = (name: string, company: string) => {
    const base = name.trim() || company.trim();
    if (!base) return '';
    return base
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '.')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '');
  };

  // Generate strong random password
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
  };

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name,
        companyName: clientToEdit.companyName,
        email: clientToEdit.email,
        username: clientToEdit.username || generateUsername(clientToEdit.name, clientToEdit.companyName),
        password: clientToEdit.password || 'Brutal@2026',
        phone: clientToEdit.phone,
        document: clientToEdit.document,
        segment: clientToEdit.segment || '',
        logoUrl: clientToEdit.logoUrl || '',
        address: clientToEdit.address || '',
        notes: clientToEdit.notes || '',
        status: clientToEdit.status,
        contractModel: clientToEdit.contractModel,
        monthlyFee: clientToEdit.monthlyFee,
        dueDay: clientToEdit.dueDay,
        contractedVideos: clientToEdit.contractedVideos,
        contractedPhotos: clientToEdit.contractedPhotos,
        contractedCampaigns: clientToEdit.contractedCampaigns,
        extraVideoPrice: clientToEdit.extraVideoPrice,
        extraPhotoPrice: clientToEdit.extraPhotoPrice,
        extraEventPrice: clientToEdit.extraEventPrice,
        extraDailyPrice: clientToEdit.extraDailyPrice,
      });
    } else {
      const initialPass = `Brutal@${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        name: '',
        companyName: '',
        email: '',
        username: '',
        password: initialPass,
        phone: '',
        document: '',
        segment: 'Agronegócio / B2B',
        logoUrl: '',
        address: '',
        notes: '',
        status: 'ACTIVE',
        contractModel: 'QUANTITY',
        monthlyFee: 2000,
        dueDay: 10,
        contractedVideos: 12,
        contractedPhotos: 20,
        contractedCampaigns: 1,
        extraVideoPrice: 150,
        extraPhotoPrice: 80,
        extraEventPrice: 500,
        extraDailyPrice: 300,
      });
    }
  }, [clientToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const newUsername = prev.username ? prev.username : generateUsername(val, prev.companyName);
      return { ...prev, name: val, username: newUsername };
    });
  };

  const handleCompanyChange = (companyVal: string) => {
    setFormData((prev) => {
      const newUsername = prev.username ? prev.username : generateUsername(prev.name, companyVal);
      return { ...prev, companyName: companyVal, username: newUsername };
    });
  };

  const handleCopyWelcomeMessage = () => {
    const loginUrl = 'https://brutalmanager.vercel.app/login';
    const msg = `Prezado(a) *${formData.name || formData.companyName}*,

Sua conta de acesso ao portal da Brutal Marketing foi configurada com sucesso pelo nosso Administrador.

*Link de Acesso:*
${loginUrl}

*Credenciais de Acesso:*
• Usuário: \`${formData.username || formData.email.split('@')[0]}\`
• E-mail: \`${formData.email}\`
• Senha Inicial: \`${formData.password || 'Brutal@2026'}\`

*Resumo do Plano Contratado:*
• ${formData.contractedVideos} Vídeos / Mês
• ${formData.contractedPhotos} Fotos Tratadas / Mês
• Fechamento e Vencimento: Dia ${formData.dueDay} de cada mês

(Você poderá alterar sua senha inicial no primeiro acesso através da aba de configurações do portal).

Atenciosamente,
Equipe Brutal Marketing`.trim();

    navigator.clipboard.writeText(msg);
    setCopiedWelcome(true);
    setTimeout(() => setCopiedWelcome(false), 3000);
    addToast({
      title: 'Mensagem de Acesso Copiada',
      description: 'Texto pronto para colar no WhatsApp do cliente.',
      type: 'success',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clientUsername = formData.username.trim() || formData.email.split('@')[0];
    const clientPassword = formData.password.trim() || 'Brutal@2026';
    const distinctClientId = clientToEdit?.id || `cli-${Date.now()}`;

    const clientPayload = {
      ...formData,
      id: distinctClientId,
      username: clientUsername,
      password: clientPassword,
    };

    // Register user account linked to this exact clientId
    registerUserAccount({
      username: clientUsername,
      email: formData.email,
      password: clientPassword,
      fullName: formData.name || formData.companyName,
      role: 'CLIENT',
      clientId: distinctClientId,
    });

    onSave(clientPayload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Editar Cliente & Acesso' : 'Novo Cliente & Credenciais de Acesso'}
      subtitle="Cadastre o cliente, defina o login/senha inicial e configure as cotas do contrato"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        {/* ========================================================================= */}
        {/* SECTION 1: CREDENCIAIS DE ACESSO DO CLIENTE (DEFINIDAS PELO ADMIN) */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-lg bg-[#181818] border-2 border-primary/40 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-primary text-xs font-mono uppercase flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" />
              <span>Credenciais de Login para o Cliente (Portal & App Mobile)</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded">
              Acesso Inicial Definido pelo Admin
            </span>
          </div>

          <p className="text-[11px] font-mono text-on-surface-variant">
            O cliente poderá entrar no portal usando o <strong>E-mail</strong> ou o <strong>Nome de Usuário</strong> com a senha definida abaixo.
          </p>

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
                  placeholder="ex: carlos.padaria ou rocha.engenharia"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '.') })}
                  className="w-full bg-[#121212] border border-[#333] rounded pl-9 pr-3 py-2 text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] uppercase text-on-surface-variant font-bold">
                  Senha Inicial de Acesso:
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded pl-9 pr-3 py-2 text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Copy Welcome Message Button */}
          <div className="pt-2 border-t border-[#262626] flex justify-end">
            <button
              type="button"
              onClick={handleCopyWelcomeMessage}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow ${
                copiedWelcome
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-700/60'
              }`}
            >
              {copiedWelcome ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Mensagem Copiada!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar Dados de Acesso para WhatsApp do Cliente
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: DADOS CADASTRAIS DA EMPRESA */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <h4 className="font-bold text-on-surface text-xs font-mono uppercase">
            Dados da Empresa & Responsável
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                Nome do Responsável / Contato
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                Razão Social / Nome da Empresa
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Padaria Real & Confeitaria"
                value={formData.companyName}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                E-mail Principal
              </label>
              <input
                type="email"
                required
                placeholder="contato@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                Telefone / WhatsApp do Cliente
              </label>
              <input
                type="text"
                required
                placeholder="(16) 99123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1 font-bold">
                CPF / CNPJ
              </label>
              <input
                type="text"
                required
                placeholder="12.345.678/0001-90"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Segmento / Nicho de Atuação
              </label>
              <input
                type="text"
                placeholder="Ex: Alimentação, Agronegócio, Moda, Saúde..."
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Status do Cliente
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="ACTIVE">Ativo (Em Produção)</option>
                <option value="PENDING_PAYMENT">Pendente de Pagamento</option>
                <option value="INACTIVE">Inativo / Pausado</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: PLANO MENSAL & REGRAS DE EXTRAS */}
        {/* ========================================================================= */}
        <div className="border-t border-[#262626] pt-4 space-y-3">
          <h4 className="font-bold text-primary text-xs font-mono uppercase">
            Configuração do Plano & Cotas Mensais
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
                Valor Mensal (R$)
              </label>
              <input
                type="number"
                step="50"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
                Dia do Vencimento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.dueDay}
                onChange={(e) => setFormData({ ...formData, dueDay: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
                Cota de Vídeos / Mês
              </label>
              <input
                type="number"
                min="0"
                value={formData.contractedVideos}
                onChange={(e) => setFormData({ ...formData, contractedVideos: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
                Cota de Fotos / Mês
              </label>
              <input
                type="number"
                min="0"
                value={formData.contractedPhotos}
                onChange={(e) => setFormData({ ...formData, contractedPhotos: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-mono uppercase text-on-surface-variant mb-1">
                Preço Vídeo Extra (R$)
              </label>
              <input
                type="number"
                value={formData.extraVideoPrice}
                onChange={(e) => setFormData({ ...formData, extraVideoPrice: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-2.5 py-1 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-on-surface-variant mb-1">
                Preço Foto Extra (R$)
              </label>
              <input
                type="number"
                value={formData.extraPhotoPrice}
                onChange={(e) => setFormData({ ...formData, extraPhotoPrice: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-2.5 py-1 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-on-surface-variant mb-1">
                Preço Evento c/ Drone (R$)
              </label>
              <input
                type="number"
                value={formData.extraEventPrice}
                onChange={(e) => setFormData({ ...formData, extraEventPrice: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-2.5 py-1 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-on-surface-variant mb-1">
                Preço Diária de Gravação (R$)
              </label>
              <input
                type="number"
                value={formData.extraDailyPrice}
                onChange={(e) => setFormData({ ...formData, extraDailyPrice: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-2.5 py-1 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] text-xs font-mono"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs font-mono shadow-lg hover:shadow-primary/30 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{clientToEdit ? 'Salvar Alterações' : 'Salvar & Criar Acesso do Cliente'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
