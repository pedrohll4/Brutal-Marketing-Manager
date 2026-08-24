'use client';

import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '@/lib/types';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PixPaymentModal } from './PixPaymentModal';
import { QrCode, CheckCircle2, AlertCircle, Clock, XCircle, Search, Filter } from 'lucide-react';

export function FinancialTable() {
  const { invoices } = useSystemStore();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInvoiceForPix, setSelectedInvoiceForPix] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
    if (
      searchTerm &&
      !inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> PAGO
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" /> PENDENTE
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded">
            <AlertCircle className="w-3 h-3" /> ATRASADO
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-on-surface-variant bg-[#222] border border-[#333] px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3" /> CANCELADO
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#141414] border border-[#262626] rounded-lg">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded pl-9 pr-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-1 rounded">
            <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer font-mono"
            >
              <option value="ALL" className="bg-[#181818]">Todos os Status</option>
              <option value="PENDING" className="bg-[#181818]">Pendentes</option>
              <option value="PAID" className="bg-[#181818]">Pagos</option>
              <option value="OVERDUE" className="bg-[#181818]">Atrasados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="brutal-card rounded-lg overflow-hidden border border-[#262626]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#181818] border-b border-[#262626] text-on-surface-variant uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Mês Ref.</th>
                <th className="py-3 px-4 text-right">Contrato Base</th>
                <th className="py-3 px-4 text-right">Extras</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4 text-center">Vencimento</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant">
                    Nenhuma fatura encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-[#181818] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-sans font-bold text-on-surface text-sm">
                      {inv.clientName}
                      <span className="block text-[10px] font-mono text-on-surface-variant font-normal">
                        #{inv.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                      08/2026
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-on-surface">
                      {formatCurrency(inv.baseAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-primary">
                      {inv.extrasAmount > 0 ? `+${formatCurrency(inv.extrasAmount)}` : '--'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-on-surface">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-on-surface-variant">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedInvoiceForPix(inv)}
                        className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 mx-auto transition-all shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>PIX</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PIX Modal */}
      <PixPaymentModal
        isOpen={Boolean(selectedInvoiceForPix)}
        onClose={() => setSelectedInvoiceForPix(null)}
        invoice={selectedInvoiceForPix}
      />
    </div>
  );
}
