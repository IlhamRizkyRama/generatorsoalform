import React, { useState, useRef } from 'react';
import { Question } from '../data/examQuestions';
import { parseDocxFile, parseRawText, ParseResult } from '../services/docImportService';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileUp,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';

interface DocxImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedQuestions: Question[], mode: 'append' | 'replace') => void;
  currentCount: number;
}

export const DocxImportModal: React.FC<DocxImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentCount,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    setIsParsing(true);

    try {
      const buffer = await file.arrayBuffer();
      const startId = importMode === 'append' ? currentCount + 1 : 1;
      const result = await parseDocxFile(buffer, startId);
      setParseResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal membaca berkas dokumen Word.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleParseRawText = () => {
    if (!rawText.trim()) {
      setError('Harap masukkan teks soal terlebih dahulu.');
      return;
    }
    setError(null);
    setIsParsing(true);
    try {
      const startId = importMode === 'append' ? currentCount + 1 : 1;
      const result = parseRawText(rawText, startId);
      setParseResult(result);
    } catch (err: any) {
      setError('Gagal memproses teks: ' + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleExecuteImport = () => {
    if (!parseResult || parseResult.questions.length === 0) return;
    onImport(parseResult.questions, importMode);
    onClose();
  };

  const questionsWithImagesCount = parseResult?.questions.filter((q) => !!q.image).length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                Import Soal dari Word (.docx) atau Google Docs
              </h3>
              <p className="text-xs text-slate-500">
                Mengekstrak otomatis butir soal, diagram/gambar, rumus matematika, dan pilihan A–E
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('upload');
              setError(null);
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Unggah Berkas .docx / .doc
          </button>
          <button
            onClick={() => {
              setActiveTab('paste');
              setError(null);
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Salin-Tempel (Copy-Paste) dari Docs
          </button>
        </div>

        {/* Body Container */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {fileName ? fileName : 'Pilih atau Tarik Berkas Dokumen Word (.docx)'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Sistem akan otomatis mengekstrak teks, tabel, gambar tertanam, dan format matematika.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Text Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Tempelkan Teks Soal dari Google Docs atau Word
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Contoh format:
1. Manakah rumus luas lingkaran?
A. π × r²
B. 2 × π × r
C. 4/3 × π × r³
D. 2 × r
E. s²
Kunci: A
Pembahasan: Rumus luas lingkaran adalah L = π × r²`}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleParseRawText}
                  disabled={isParsing || !rawText.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  Ekstrak & Pratinjau Soal
                </button>
              </div>
            </div>
          )}

          {/* Parsing Spinner */}
          {isParsing && (
            <div className="p-6 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">Sedang membaca dan mengekstrak dokumen...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Parse Results Preview */}
          {parseResult && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40 p-4 space-y-4">
              {/* Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-800">
                    Terdeteksi {parseResult.totalParsed} Butir Soal
                  </span>
                  {questionsWithImagesCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      <ImageIcon className="w-3 h-3" />
                      {questionsWithImagesCount} Gambar Terdeteksi
                    </span>
                  )}
                </div>

                {/* Import Mode Radio */}
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="accent-indigo-600"
                    />
                    <span>Tambahkan ke Bank Soal (+{parseResult.totalParsed})</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="accent-indigo-600"
                    />
                    <span>Gantikan Semua</span>
                  </label>
                </div>
              </div>

              {/* Warnings if any */}
              {parseResult.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-1">
                  <span className="font-bold block">Catatan Ekstraksi:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {parseResult.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions Preview List (Scrollable) */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {parseResult.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-800">
                        {idx + 1}. {q.question}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        Kunci: {q.correctAnswer}
                      </span>
                    </div>

                    {q.image && (
                      <div className="my-1 border border-slate-200 rounded p-1 bg-slate-50 inline-block">
                        <img
                          src={q.image}
                          alt={`Gambar Soal ${idx + 1}`}
                          className="h-16 rounded object-contain"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[11px] text-slate-600 pt-1">
                      {q.options.map((opt) => (
                        <div key={opt.key} className="truncate">
                          <strong className="text-slate-800">{opt.key}.</strong> {opt.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {parseResult ? `${parseResult.totalParsed} soal siap diimpor` : 'Silakan pilih berkas atau tempel teks'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={!parseResult || parseResult.questions.length === 0}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {importMode === 'append' ? 'Tambahkan ke Bank Soal' : 'Gantikan Seluruh Bank Soal'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
