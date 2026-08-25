'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PixPaymentModal } from '@/components/financial/PixPaymentModal';
import { CreditCard, QrCode, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function ClientPagamentosPage() {
  const { clients, invoices } = useSystemStore();
  const { user, activeClientId } = useAuth();

  const client =
    clients.find(
      (c) =>
        c.id === activeClientId ||
        c.id === user?.clientId ||
        c.email.toLowerCase() === user?.email.toLowerCase() ||
        (c.username && c.username.toLowerCase() === user?.username?.toLowerCase())
    ) || clients[0];

  const clientInvoices = invoices.filter((i) => i.clientId === client?.id);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Minhas Faturas & Pagamento PIX</h2>
        <p className="text-xs text-on-surface-variant font-mono mt-1">
          Acompanhe seu faturamento mensal, serviços extras e realize pagamentos instantâneos
        </p>
      </div>

      <div className="space-y-4">
        {clientInvoices.map((inv) => (
          <div
            key={inv.id}
            className="brutal-card p-6 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-6 border border-[#262626]"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-bold text-lg text-on-surface font-sans">
                  Fatura de Agosto / 2026
                </h3>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  #{inv.id}
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-on-surface-variant mb-3">
                <p>Plano Base: <strong className="text-on-surface">{formatCurrency(inv.baseAmount)}</strong></p>
                {inv.extrasAmount > 0 && (
                  <p>
                    Extras Produzidos: <strong className="text-primary font-bold">{formatCurrency(inv.extrasAmount)}</strong>
                  </p>
                )}
                <p>Vencimento: <strong className="text-on-surface">{formatDate(inv.dueDate)}</strong></p>
              </div>

              <div className="text-xl font-black text-primary font-mono">
                Total: {formatCurrency(inv.totalAmount)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {inv.status === 'PAID' ? (
                <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fatura Quitada em {inv.paidAt || '20/08/2026'}</span>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedInvoice(inv)}
                  className="bg-primary hover:bg-primary-hover text-white font-bold text-xs py-3 px-6 rounded flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pagar Agora via PIX</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <PixPaymentModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
