'use client';

import React, { useState, useEffect } from 'react';
import { Client, ContractModel, ClientStatus } from '@/lib/types';
import { Modal } from '../ui/Modal';

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
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
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

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name,
        companyName: clientToEdit.companyName,
        email: clientToEdit.email,
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
      setFormData({
        name: '',
        companyName: '',
        email: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}
      subtitle="Cadastre o cliente, configure o modelo de contrato e regras de extras"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Nome do Contato Principal
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Nicole Procampo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Nome da Empresa / Marca
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Procampo Agronegócios"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              E-mail
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
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              required
              placeholder="(11) 99999-8888"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
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

        {/* Contract Section */}
        <div className="border-t border-[#262626] pt-4 mt-4">
          <h4 className="font-bold text-primary text-xs font-mono uppercase mb-3">
            Configuração do Contrato & Cotas
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Modelo de Contrato
              </label>
              <select
                value={formData.contractModel}
                onChange={(e) =>
                  setFormData({ ...formData, contractModel: e.target.value as ContractModel })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="QUANTITY">Por Quantidade (Ex: 12 vídeos)</option>
                <option value="CAMPAIGN">Por Campanha (Fixo)</option>
                <option value="CUSTOM">Personalizado (Preços unitários)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Valor Mensal Base (R$)
              </label>
              <input
                type="number"
                step="50"
                required
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Dia de Vencimento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                required
                value={formData.dueDay}
                onChange={(e) => setFormData({ ...formData, dueDay: Number(e.target.value) })}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Vídeos Contratados / Mês
              </label>
              <input
                type="number"
                min="0"
                value={formData.contractedVideos}
                onChange={(e) =>
                  setFormData({ ...formData, contractedVideos: Number(e.target.value) })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Fotos Contratadas / Mês
              </label>
              <input
                type="number"
                min="0"
                value={formData.contractedPhotos}
                onChange={(e) =>
                  setFormData({ ...formData, contractedPhotos: Number(e.target.value) })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                Campanhas / Mês
              </label>
              <input
                type="number"
                min="0"
                value={formData.contractedCampaigns}
                onChange={(e) =>
                  setFormData({ ...formData, contractedCampaigns: Number(e.target.value) })
                }
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing for Extras */}
          <div className="p-3 bg-[#181818] border border-[#262626] rounded mb-4">
            <p className="text-xs font-bold text-on-surface mb-2 font-mono">
              Tabela de Preços para Serviços Extras deste Cliente
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-on-surface-variant uppercase mb-1">
                  Vídeo Extra (R$)
                </label>
                <input
                  type="number"
                  value={formData.extraVideoPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, extraVideoPrice: Number(e.target.value) })
                  }
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-2 py-1 text-xs text-on-surface focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-on-surface-variant uppercase mb-1">
                  Foto Extra (R$)
                </label>
                <input
                  type="number"
                  value={formData.extraPhotoPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, extraPhotoPrice: Number(e.target.value) })
                  }
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-2 py-1 text-xs text-on-surface focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-on-surface-variant uppercase mb-1">
                  Evento Extra (R$)
                </label>
                <input
                  type="number"
                  value={formData.extraEventPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, extraEventPrice: Number(e.target.value) })
                  }
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-2 py-1 text-xs text-on-surface focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-on-surface-variant uppercase mb-1">
                  Diária Extra (R$)
                </label>
                <input
                  type="number"
                  value={formData.extraDailyPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, extraDailyPrice: Number(e.target.value) })
                  }
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded px-2 py-1 text-xs text-on-surface focus:border-primary focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Status do Cliente
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as ClientStatus })
              }
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="ACTIVE">Ativo</option>
              <option value="PENDING_PAYMENT">Pagamento Pendente</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
              Segmento / Nicho
            </label>
            <input
              type="text"
              placeholder="Ex: E-commerce, Saúde, Imóveis"
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-2 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-transparent border border-[#2a2a2a] text-on-surface hover:bg-[#1f1f1f] transition-colors font-semibold text-xs"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors shadow"
          >
            {clientToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
