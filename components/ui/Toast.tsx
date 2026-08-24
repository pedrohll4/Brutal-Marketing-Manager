'use client';

import React from 'react';
import { useSystemStore } from '@/lib/context/SystemStoreContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useSystemStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-primary shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#181818] border border-[#2a2a2a] p-4 rounded shadow-2xl flex items-start gap-3 text-sm animate-in slide-in-from-bottom-2 duration-200"
          >
            {icons[toast.type || 'info']}
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface text-sm">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-on-surface-variant mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
