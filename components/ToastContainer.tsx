'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] sm:w-96 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-white/98 border-emerald-200 text-slate-900 shadow-emerald-500/10'
                : isError
                ? 'bg-white/98 border-rose-200 text-slate-900 shadow-rose-500/10'
                : isWarning
                ? 'bg-white/98 border-amber-200 text-slate-900 shadow-amber-500/10'
                : 'bg-white/98 border-purple-200 text-slate-900 shadow-purple-500/10'
            }`}
          >
            {/* Left Accent Bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                isSuccess
                  ? 'bg-emerald-500'
                  : isError
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-[#301d6e]'
              }`}
            />

            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {isSuccess && (
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              {isError && (
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              {isWarning && (
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              {isInfo && (
                <div className="w-6 h-6 rounded-full bg-purple-100 text-[#301d6e] flex items-center justify-center">
                  <Info className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
