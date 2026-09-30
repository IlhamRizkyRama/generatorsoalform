import React, { useState, useRef } from 'react';
import { Question } from '../data/examQuestions';
import { MathSymbolPalette } from './MathSymbolPalette';
import { Check, Image as ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';

interface QuestionEditorModalProps {
  isOpen: boolean;
  question: Partial<Question> | null;
  isNew?: boolean;
  onSave: (q: Question) => void;
  onClose: () => void;
  categories: string[];
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  question,
  isNew = false,
  onSave,
  onClose,
  categories,
}) => {
  if (!isOpen || !question) return null;

  const [formData, setFormData] = useState<Question>({
    id: question.id || 1,
    question: question.question || '',
    image: question.image || undefined,
    options: question.options && question.options.length === 5
      ? question.options
      : [
          { key: 'A', text: '' },
          { key: 'B', text: '' },
          { key: 'C', text: '' },
          { key: 'D', text: '' },
          { key: 'E', text: '' },
        ],
    correctAnswer: question.correctAnswer || 'A',
    category: question.category || 'Materi Umum',
    explanation: question.explanation || '',
    points: question.points || 2,
  });

  const [activeInputRef, setActiveInputRef] = useState<'question' | number | 'explanation'>('question');
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertSymbol = (symbol: string) => {
    if (activeInputRef === 'question') {
      const el = questionInputRef.current;
      if (el) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newText = formData.question.substring(0, start) + symbol + formData.question.substring(end);
        setFormData({ ...formData, question: newText });
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start + symbol.length, start + symbol.length);
        }, 0);
      } else {
        setFormData({ ...formData, question: formData.question + symbol });
      }
    } else if (typeof activeInputRef === 'number') {
      const idx = activeInputRef;
      const currentOptText = formData.options[idx].text;
      const newOpts = [...formData.options];
      newOpts[idx] = { ...newOpts[idx], text: currentOptText + symbol };
      setFormData({ ...formData, options: newOpts });
    } else if (activeInputRef === 'explanation') {
      setFormData({ ...formData, explanation: (formData.explanation || '') + symbol });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      setValidationError('Teks pertanyaan tidak boleh kosong.');
      return;
    }
    const filledOptions = formData.options.filter((o) => o.text.trim().length > 0);
    if (filledOptions.length < 2) {
      setValidationError('Harap isi minimal 2 pilihan jawaban.');
      return;
    }

    setValidationError(null);
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {isNew ? '+ Tambah Soal Baru' : `Edit Soal #${formData.id}`}
            </h3>
            <p className="text-xs text-slate-500">
              Mendukung teks, gambar ilustrasi, dan simbol matematika/koding
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              {validationError}
            </div>
          )}

          {/* Row 1: Nomor, Kategori, Poin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Soal</label>
              <input
                type="number"
                min={1}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori / Topik</label>
              <input
                type="text"
                list="category-suggestions"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Topik materi"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
              />
              <datalist id="category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bobot Poin</label>
              <input
                type="number"
                min={1}
                value={formData.points || 2}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Math Symbol Palette Bar */}
          <MathSymbolPalette onInsertSymbol={handleInsertSymbol} />

          {/* Question Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Teks Pertanyaan</label>
              <span className="text-[10px] text-slate-400">Gunakan simbol di atas jika diperlukan</span>
            </div>
            <textarea
              ref={questionInputRef}
              rows={3}
              value={formData.question}
              onFocus={() => setActiveInputRef('question')}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Tuliskan teks pertanyaan soal..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Image Attachment */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                Gambar / Diagram Soal (Opsional)
              </span>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: undefined })}
                  className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Hapus Gambar
                </button>
              )}
            </div>

            {formData.image ? (
              <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden bg-white p-1">
                <img
                  src={formData.image}
                  alt="Ilustrasi Soal"
                  className="max-h-40 max-w-full rounded object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unggah Gambar (JPG/PNG/Diagram)</span>
                </button>
                <span className="text-[11px] text-slate-400">Atau sisipkan otomatis via import Word (.docx)</span>
              </div>
            )}
          </div>

          {/* Options (A–E) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Pilihan Jawaban & Kunci Jawaban
            </label>
            {formData.options.map((opt, idx) => (
              <div key={opt.key} className="flex items-center gap-2">
                <span className="w-6 text-xs font-bold text-slate-500 text-center">{opt.key}.</span>
                <input
                  type="text"
                  value={opt.text}
                  onFocus={() => setActiveInputRef(idx)}
                  onChange={(e) => {
                    const newOpts = [...formData.options];
                    newOpts[idx] = { ...newOpts[idx], text: e.target.value };
                    setFormData({ ...formData, options: newOpts });
                  }}
                  placeholder={`Pilihan ${opt.key}`}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
                />
                <label
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                    formData.correctAnswer === opt.key
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === opt.key}
                    onChange={() => setFormData({ ...formData, correctAnswer: opt.key })}
                    className="accent-emerald-600"
                  />
                  <span>Kunci</span>
                </label>
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pembahasan / Solusi Materi (Opsional)
            </label>
            <textarea
              rows={2}
              value={formData.explanation}
              onFocus={() => setActiveInputRef('explanation')}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Penjelasan mengapa jawaban tersebut benar..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isNew ? 'Tambahkan ke Bank Soal' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
