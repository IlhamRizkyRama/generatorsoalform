import React, { useState } from 'react';
import { CreatedFormResult, fetchFormResponses } from '../services/googleFormsService';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Loader2,
  QrCode,
  RefreshCw,
  Users,
} from 'lucide-react';

interface FormHistoryProps {
  forms: CreatedFormResult[];
  accessToken: string | null;
  onOpenCreate: () => void;
}

export const FormHistory: React.FC<FormHistoryProps> = ({ forms, accessToken, onOpenCreate }) => {
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [loadingResponses, setLoadingResponses] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQrUrl, setSelectedQrUrl] = useState<string | null>(null);

  const handleFetchResponses = async (formId: string) => {
    if (!accessToken) return;
    setLoadingResponses((prev) => ({ ...prev, [formId]: true }));
    try {
      const data = await fetchFormResponses(accessToken, formId);
      const count = data.responses?.length || 0;
      setResponseCounts((prev) => ({ ...prev, [formId]: count }));
    } catch (err) {
      console.error('Failed to fetch responses:', err);
    } finally {
      setLoadingResponses((prev) => ({ ...prev, [formId]: false }));
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Riwayat Sinkronisasi
          </span>
          <h2 className="text-lg font-bold text-slate-800">
            Daftar Google Forms Ujian yang Dibuat
          </h2>
          <p className="text-xs text-slate-500">
            Pantau status formulir kuis, jumlah tanggapan siswa, dan tautan pengerjaan langsung.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
        >
          <span>Buat Form Baru</span>
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Belum Ada Google Form yang Dibuat</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Klik tab <strong>"Buat Google Form"</strong> untuk mengunggah otomatis ke-50 butir soal ASTS Koding & AI ke Google Forms Anda.
          </p>
          <button
            onClick={onOpenCreate}
            className="mt-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
          >
            Mulai Buat Formulir Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {forms.map((item) => {
            const count = responseCounts[item.formId];
            const isLoading = loadingResponses[item.formId];

            return (
              <div
                key={item.formId}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all p-5 sm:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                        Google Forms Quiz Aktif
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-800">{item.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[11px]">{item.formId}</code></span>
                      <span>Total Soal: <strong className="text-slate-700">{item.totalQuestions} Soal PG</strong></span>
                      <span>Skor Maks: <strong className="text-slate-700">{item.totalPoints} Poin</strong></span>
                    </div>
                  </div>

                  {/* Response Stats & Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-slate-600">
                        {count !== undefined ? `${count} Tanggapan` : 'Cek Respon'}
                      </span>
                      <button
                        onClick={() => handleFetchResponses(item.formId)}
                        disabled={isLoading || !accessToken}
                        className="text-slate-400 hover:text-indigo-600 p-0.5"
                        title="Perbarui jumlah tanggapan"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                      </button>
                    </div>

                    <a
                      href={item.editUri}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Editor</span>
                    </a>

                    <button
                      onClick={() => handleCopy(item.responderUri, item.formId)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{copiedId === item.formId ? 'Disalin!' : 'Salin Link'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedQrUrl(item.responderUri)}
                      className="p-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs"
                      title="Lihat QR Code Siswa"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800">QR Code Pengerjaan Siswa</h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  selectedQrUrl
                )}`}
                alt="QR Code Google Form"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded text-slate-700 break-all select-all">
              {selectedQrUrl}
            </div>
            <button
              onClick={() => setSelectedQrUrl(null)}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
