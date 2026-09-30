import React, { useState } from 'react';
import { Question } from '../data/examQuestions';
import { TeacherProfile } from '../types/admin';
import { QuestionEditorModal } from './QuestionEditorModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eraser,
  Eye,
  EyeOff,
  FileText,
  FileUp,
  Filter,
  Image as ImageIcon,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface ExamViewerProps {
  questions: Question[];
  selectedQuestionIds: number[];
  teacherProfile: TeacherProfile;
  onToggleSelect: (id: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onAddQuestion: (newQ: Question) => void;
  onUpdateQuestion: (updated: Question) => void;
  onDeleteQuestion: (id: number) => void;
  onBatchDelete: (ids: number[]) => void;
  onClearAll: () => void;
  onLoadTemplate: () => void;
  onOpenPrint: () => void;
  onSwitchToCreate: () => void;
  onOpenImport: () => void;
}

export const ExamViewer: React.FC<ExamViewerProps> = ({
  questions,
  selectedQuestionIds,
  teacherProfile,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onBatchDelete,
  onClearAll,
  onLoadTemplate,
  onOpenPrint,
  onSwitchToCreate,
  onOpenImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterSelectedOnly, setFilterSelectedOnly] = useState(false);
  const [showAnswerKeys, setShowAnswerKeys] = useState(true);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

  // Question Editor Modal state
  const [editorModalState, setEditorModalState] = useState<{
    isOpen: boolean;
    question: Partial<Question> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    question: null,
    isNew: false,
  });

  // In-App Deletion Modal State (Reliable inside iframe without window.confirm)
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'single' | 'batch' | 'clear-all';
    targetId?: number;
    snippet?: string;
    count?: number;
  }>({
    isOpen: false,
    type: 'single',
  });

  const categories = Array.from(new Set(questions.map((q) => q.category).filter(Boolean)));

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.options.some((o) => o.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.id.toString() === searchTerm.trim();
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSelection = !filterSelectedOnly || selectedQuestionIds.includes(q.id);
    return matchesSearch && matchesCategory && matchesSelection;
  });

  const toggleExplanation = (id: number) => {
    setExpandedExplanations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddModal = () => {
    const nextId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setEditorModalState({
      isOpen: true,
      question: {
        id: nextId,
        question: '',
        options: [
          { key: 'A', text: '' },
          { key: 'B', text: '' },
          { key: 'C', text: '' },
          { key: 'D', text: '' },
          { key: 'E', text: '' },
        ],
        correctAnswer: 'A',
        category: categories[0] || 'Materi Umum',
        explanation: '',
        points: 2,
      },
      isNew: true,
    });
  };

  const handleOpenEditModal = (q: Question) => {
    setEditorModalState({
      isOpen: true,
      question: q,
      isNew: false,
    });
  };

  const handleSaveQuestion = (q: Question) => {
    if (editorModalState.isNew) {
      onAddQuestion(q);
    } else {
      onUpdateQuestion(q);
    }
  };

  // Safe In-App Delete Handlers (No window.confirm!)
  const triggerDeleteSingle = (q: Question) => {
    setDeleteModalState({
      isOpen: true,
      type: 'single',
      targetId: q.id,
      snippet: q.question.length > 70 ? q.question.substring(0, 70) + '...' : q.question,
    });
  };

  const triggerDeleteBatch = () => {
    if (selectedQuestionIds.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      type: 'batch',
      count: selectedQuestionIds.length,
    });
  };

  const triggerClearAll = () => {
    if (questions.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      type: 'clear-all',
      count: questions.length,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.type === 'single' && deleteModalState.targetId !== undefined) {
      onDeleteQuestion(deleteModalState.targetId);
    } else if (deleteModalState.type === 'batch') {
      onBatchDelete(selectedQuestionIds);
    } else if (deleteModalState.type === 'clear-all') {
      onClearAll();
    }
  };

  const allFilteredSelected =
    filteredQuestions.length > 0 &&
    filteredQuestions.every((q) => selectedQuestionIds.includes(q.id));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/40">
                {teacherProfile.school}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {questions.length} Butir Soal di Bank
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-400/30 text-indigo-200 border border-indigo-400/30">
                {selectedQuestionIds.length} Soal Dipilih
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Bank Soal ASTS: {teacherProfile.subject}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Kelas {teacherProfile.grade} | {teacherProfile.packet} | Guru: {teacherProfile.name}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenImport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-xs transition-all"
            >
              <FileUp className="w-4 h-4 text-indigo-600" />
              <span>Import Word (.docx)</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Soal</span>
            </button>

            {questions.length > 0 && (
              <button
                onClick={onOpenPrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span>Cetak / PDF</span>
              </button>
            )}

            <button
              onClick={onSwitchToCreate}
              disabled={selectedQuestionIds.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kirim ke Google Forms ({selectedQuestionIds.length})</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Control Bar (Only if questions exist or to load template) */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          {/* Row 1: Search and Category Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari soal atau kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categories.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
                  >
                    <option value="all">Semua Topik ({questions.length})</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({questions.filter((q) => q.category === cat).length})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => setFilterSelectedOnly(!filterSelectedOnly)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  filterSelectedOnly
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Hanya Terpilih ({selectedQuestionIds.length})
              </button>

              <button
                onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  showAnswerKeys
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {showAnswerKeys ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showAnswerKeys ? 'Kunci: Tampil' : 'Kunci: Sembunyi'}</span>
              </button>

              <button
                onClick={triggerClearAll}
                title="Kosongkan seluruh bank soal"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Kosongkan</span>
              </button>
            </div>
          </div>

          {/* Row 2: Multi-select Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={() => {
                    if (allFilteredSelected) onDeselectAll();
                    else onSelectAll();
                  }}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <span>
                  {allFilteredSelected ? 'Batal Pilih Semua' : 'Pilih Semua Soal'}
                </span>
              </label>

              <span className="text-slate-300">|</span>

              <span className="text-slate-500 font-medium">
                <strong className="text-indigo-600 font-bold">{selectedQuestionIds.length}</strong> dari{' '}
                <strong className="text-slate-800">{questions.length}</strong> butir soal terpilih
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedQuestionIds.length > 0 && (
                <button
                  type="button"
                  onClick={triggerDeleteBatch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Hapus {selectedQuestionIds.length} Soal Terpilih</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions List OR Clean Empty State */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <FileText className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Bank Soal Saat Ini Kosong
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Draft soal dummy telah dibersihkan. Anda dapat mengimpor naskah soal dari berkas Word (.docx), menambahkan soal baru secara manual, atau memuat template 50 soal resmi SMK Pertiwi Ciasem.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenImport}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all hover:scale-105"
            >
              <FileUp className="w-4 h-4" />
              <span>Import Soal dari Word (.docx)</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>+ Buat Soal Manual</span>
            </button>

            <button
              onClick={onLoadTemplate}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Muat Template 50 Soal Asli (SMK Pertiwi)</span>
            </button>
          </div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="font-semibold text-slate-700">Tidak ada butir soal yang sesuai filter pencarian.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setFilterSelectedOnly(false);
            }}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            Reset semua filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = !!expandedExplanations[q.id];
            const isSelected = selectedQuestionIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs ${
                  isSelected
                    ? 'border-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row: Checkbox, Question Number, Category, Actions */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(q.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                      title="Pilih soal ini untuk Google Forms / Ujian"
                    />

                    <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {q.id}
                    </span>

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {q.category}
                    </span>

                    {q.image && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        <ImageIcon className="w-3 h-3" />
                        Ada Gambar
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {showAnswerKeys && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Kunci: {q.correctAnswer}
                      </span>
                    )}
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Soal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => triggerDeleteSingle(q)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Soal Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed mb-3">
                  {q.question}
                </div>

                {/* Attached Image (if any) */}
                {q.image && (
                  <div className="mb-4 p-2 bg-slate-50 rounded-xl border border-slate-200/80 inline-block">
                    <img
                      src={q.image}
                      alt={`Ilustrasi Soal ${q.id}`}
                      className="max-h-56 max-w-full rounded-lg object-contain shadow-2xs"
                    />
                  </div>
                )}

                {/* Options (A–E) */}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isCorrect = showAnswerKeys && opt.key === q.correctAnswer;
                    return (
                      <div
                        key={opt.key}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                            : 'bg-slate-50/50 border-slate-200/70 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 font-bold ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="pt-0.5 flex-1">{opt.text}</span>
                        {isCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Expandable */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleExplanation(q.id)}
                    className="text-xs text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan / Analisis'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Bobot: {q.points || 2} Poin
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-indigo-900 block mb-0.5">Penjelasan Materi:</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Question Editor Modal */}
      <QuestionEditorModal
        isOpen={editorModalState.isOpen}
        question={editorModalState.question}
        isNew={editorModalState.isNew}
        onSave={handleSaveQuestion}
        onClose={() => setEditorModalState({ isOpen: false, question: null, isNew: false })}
        categories={categories}
      />

      {/* In-App Reliable Deletion Modal (Without browser confirm) */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={
          deleteModalState.type === 'single'
            ? `Hapus Soal #${deleteModalState.targetId}?`
            : deleteModalState.type === 'batch'
            ? `Hapus ${deleteModalState.count} Soal Terpilih?`
            : 'Kosongkan Seluruh Bank Soal?'
        }
        message={
          deleteModalState.type === 'single'
            ? 'Apakah Anda yakin ingin menghapus soal ini dari bank soal? Tindakan ini tidak dapat dibatalkan.'
            : deleteModalState.type === 'batch'
            ? `Apakah Anda yakin ingin menghapus ${deleteModalState.count} butir soal yang sedang dipilih secara permanen?`
            : 'Apakah Anda yakin ingin mengosongkan seluruh butir soal di bank soal? Anda tetap dapat mengimpor berkas Word baru atau memuat template asli kapan saja.'
        }
        itemSnippet={deleteModalState.snippet}
        confirmLabel={
          deleteModalState.type === 'clear-all' ? 'Ya, Kosongkan Semua' : 'Ya, Hapus Soal'
        }
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalState({ isOpen: false, type: 'single' })}
      />
    </div>
  );
};
