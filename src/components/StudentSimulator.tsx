import React, { useState, useEffect } from 'react';
import { Question, EXAM_INFO } from '../data/examQuestions';
import {
  AlertCircle,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  HelpCircle,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';

interface StudentSimulatorProps {
  questions: Question[];
}

export const StudentSimulator: React.FC<StudentSimulatorProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: key }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  // Calculate score upon submission
  let correctCount = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const finalScore = Math.round((correctCount / questions.length) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setAnswers({});
    setFlagged({});
    setTimeLeft(90 * 60);
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Timer and Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Mode Uji Coba Siswa
            </span>
            <span className="text-xs text-slate-500 font-medium">SMK Pertiwi Ciasem</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mt-1">
            Simulasi Pengerjaan ASTS: {EXAM_INFO.subject}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold shadow-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Sisa Waktu: {formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all"
            >
              Kumpulkan Ujian
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mulai Ulang</span>
            </button>
          )}
        </div>
      </div>

      {/* Submitted Score Card */}
      {isSubmitted && (
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xs text-amber-300 mb-1">
            <Award className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Hasil Evaluasi Asesmen Mandiri</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Berikut adalah rekapitulasi capaian pengerjaan 50 butir soal Koding dan Kecerdasan Artifisial:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 uppercase block font-semibold">Skor Akhir</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{finalScore} / 100</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 uppercase block font-semibold">Benar</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">{correctCount}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 uppercase block font-semibold">Salah</span>
              <span className="text-2xl sm:text-3xl font-black text-rose-400">
                {questions.length - correctCount}
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 uppercase block font-semibold">Predikat</span>
              <span className="text-2xl sm:text-3xl font-black text-blue-300">
                {finalScore >= 85 ? 'Sangat Baik (A)' : finalScore >= 75 ? 'Baik (B)' : finalScore >= 60 ? 'Cukup (C)' : 'Perlu Bimbingan'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Question Left, Nav Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Area (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                  Soal Nomor {currentQ.id} dari {questions.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">{currentQ.category}</span>
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleToggleFlag}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    flagged[currentQ.id]
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged[currentQ.id] ? 'Ragu-ragu' : 'Tandai Ragu'}</span>
                </button>
              )}
            </div>

            {/* Question Text */}
            <div className="text-base font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </div>

            {/* Attached Question Image if available */}
            {currentQ.image && (
              <div className="my-2 p-2 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                <img
                  src={currentQ.image}
                  alt={`Diagram Soal ${currentQ.id}`}
                  className="max-h-60 max-w-full rounded-lg object-contain"
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.key;
                const isCorrect = isSubmitted && opt.key === currentQ.correctAnswer;
                const isWrongSelection = isSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full text-left flex items-start gap-3.5 p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-2 ring-emerald-400'
                        : isWrongSelection
                        ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold ring-2 ring-rose-300'
                        : isSelected
                        ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 font-semibold ring-2 ring-indigo-400'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isWrongSelection
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="pt-0.5 flex-1">{opt.text}</span>
                    {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {isWrongSelection && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* If submitted, show answer review and explanation */}
            {isSubmitted && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">
                  Kunci Jawaban Resmi: Opsi {currentQ.correctAnswer}
                </span>
                <p className="text-blue-800 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Nav Prev / Next */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <span className="text-xs text-slate-400">
                {currentIndex + 1} dari {questions.length}
              </span>

              <button
                type="button"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-40"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Grid Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Navigasi Nomor Soal
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-indigo-600"></span>
                <span>Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300"></span>
                <span>Belum ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-400"></span>
                <span>Ragu-ragu ({Object.values(flagged).filter(Boolean).length})</span>
              </div>
              {isSubmitted && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500"></span>
                  <span>Benar ({correctCount})</span>
                </div>
              )}
            </div>

            {/* 50-number buttons grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2 max-h-[420px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];
                const isCorrect = isSubmitted && answers[q.id] === q.correctAnswer;
                const isWrong = isSubmitted && isAnswered && !isCorrect;

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                if (isSubmitted) {
                  if (isCorrect) btnClass = 'bg-emerald-600 text-white border-emerald-700';
                  else if (isWrong) btnClass = 'bg-rose-600 text-white border-rose-700';
                  else btnClass = 'bg-slate-200 text-slate-500 border-slate-300';
                } else if (isFlagged) {
                  btnClass = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
                } else if (isAnswered) {
                  btnClass = 'bg-indigo-600 text-white border-indigo-700 font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-medium border flex items-center justify-center transition-all ${btnClass} ${
                      isCurrent ? 'ring-2 ring-indigo-500 ring-offset-1 font-black scale-105' : ''
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Kumpulkan Jawaban Ujian?</h4>
            <p className="text-xs text-slate-600">
              Anda telah menjawab <strong>{answeredCount}</strong> dari <strong>{questions.length}</strong> butir soal.
              {unansweredCount > 0 && (
                <span className="block text-rose-600 font-semibold mt-1">
                  Peringatan: Masih terdapat {unansweredCount} soal yang belum dijawab!
                </span>
              )}
            </p>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Periksa Kembali
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  setIsSubmitted(true);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
