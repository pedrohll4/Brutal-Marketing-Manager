'use client';

import React, { useState } from 'react';
import { Invoice } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { Modal } from '../ui/Modal';
import { WhatsAppShareButton } from '../automations/WhatsAppShareButton';
import { Copy, Check, QrCode, Sparkles, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function PixPaymentModal({ isOpen, onClose, invoice }: PixPaymentModalProps) {
  const { markInvoiceAsPaid, clients, pixKey, pixBeneficiary } = useSystemStore();
  const [copied, setCopied] = useState(false);

  if (!invoice) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(invoice.pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmManualPayment = () => {
    markInvoiceAsPaid(invoice.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pagamento Instantâneo via PIX"
      subtitle={`Fatura #${invoice.id} • ${invoice.clientName}`}
      maxWidth="md"
    >
      <div className="space-y-5 text-center">
        {/* Value Tag */}
        <div className="bg-[#181818] border border-[#2a2a2a] p-4 rounded-lg">
          <span className="text-xs font-mono text-on-surface-variant uppercase block mb-1">
            Valor Total a Pagar
          </span>
          <span className="text-3xl font-black text-primary font-mono tracking-tight">
            {formatCurrency(invoice.totalAmount)}
          </span>
          {invoice.extrasAmount > 0 && (
            <p className="text-[11px] text-on-surface-variant font-mono mt-1">
              (Plano Base: {formatCurrency(invoice.baseAmount)} + Extras:{' '}
              <strong className="text-primary">{formatCurrency(invoice.extrasAmount)}</strong>)
            </p>
          )}
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg max-w-[200px] mx-auto shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={invoice.pixQrCodeUrl}
            alt="PIX QR Code"
            className="w-44 h-44 object-contain"
          />
          <span className="text-[10px] font-mono text-zinc-600 mt-2 font-semibold">
            Escaneie com o app do seu banco
          </span>
        </div>

        {/* Copy and Paste Box */}
        <div>
          <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1 text-left">
            Código PIX Copia e Cola
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={invoice.pixPayload}
              className="flex-1 bg-[#181818] border border-[#2a2a2a] rounded px-3 py-2 text-xs text-on-surface-variant font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopyPix}
              className={`px-4 py-2 rounded text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-primary hover:bg-primary-hover text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Simulation / Confirmation button */}
        <div className="pt-3 border-t border-[#262626] flex flex-col gap-2">
          <WhatsAppShareButton
            trigger="INVOICE_BILLING_PIX"
            phone={clients.find((c) => c.id === invoice.clientId)?.phone}
            data={{
              clientName: invoice.clientName,
              totalAmount: invoice.totalAmount,
              baseAmount: invoice.baseAmount,
              extrasAmount: invoice.extrasAmount,
              dueDay: new Date(invoice.dueDate).getDate(),
              dueDate: invoice.dueDate,
              pixPayload: invoice.pixPayload,
              pixKey,
              pixBeneficiary,
            }}
            label="Enviar Fatura & Código PIX no WhatsApp do Cliente"
            className="w-full justify-center py-2.5"
          />

          {invoice.status !== 'PAID' ? (
            <button
              onClick={handleConfirmManualPayment}
              className="w-full bg-[#181818] hover:bg-emerald-600 border border-emerald-600/40 text-emerald-400 hover:text-white font-bold text-xs py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all shadow"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirmar Recebimento (Simular Baixa PIX)</span>
            </button>
          ) : (
            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono font-bold text-center">
              ✓ Fatura PAGA e confirmada no sistema
            </div>
          )}

          <button
            onClick={onClose}
            className="text-xs text-on-surface-variant hover:text-on-surface font-mono py-1"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
