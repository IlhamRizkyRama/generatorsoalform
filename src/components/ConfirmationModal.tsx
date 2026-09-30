import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  details?: { label: string; value: string | number }[];
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  details = [],
  confirmText = 'Konfirmasi & Lanjutkan',
  cancelText = 'Batal',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDangerous ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isDangerous ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">{title}</h3>
              <p className="text-xs text-slate-500">Konfirmasi Izin Google Workspace</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

          {details.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                Detail Operasi:
              </div>
              {details.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-200/40 last:border-none">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-medium text-slate-800 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-800">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Operasi ini akan membuat dokumen formulir baru di Google Drive akun Anda dan tidak akan mengubah atau menghapus dokumen lain.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
