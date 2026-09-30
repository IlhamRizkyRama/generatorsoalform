import React, { useState } from 'react';
import { Question } from '../data/examQuestions';
import { TeacherProfile } from '../types/admin';
import { Check, CheckCircle2, FileText, Printer, Table, X } from 'lucide-react';

interface PrintViewProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  teacherProfile: TeacherProfile;
}

export const PrintView: React.FC<PrintViewProps> = ({
  isOpen,
  onClose,
  questions,
  teacherProfile,
}) => {
  const [printMode, setPrintMode] = useState<'questions' | 'key' | 'ljk'>('questions');

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs overflow-y-auto p-2 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Navigation Toolbar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Pratinjau Cetak / Ekspor PDF</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setPrintMode('questions')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printMode === 'questions' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Naskah Soal ({questions.length})
            </button>
            <button
              onClick={() => setPrintMode('key')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printMode === 'key' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Kunci Jawaban Guru
            </button>
            <button
              onClick={() => setPrintMode('ljk')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printMode === 'ljk' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lembar Jawaban Siswa (LJK)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="p-6 sm:p-10 font-serif text-slate-900 bg-white min-h-[1100px] leading-relaxed">
          {/* Official Kop Surat */}
          <div className="text-center pb-4 border-b-2 border-slate-900 relative">
            <h3 className="text-sm uppercase tracking-wider font-sans font-bold text-slate-600">
              YAYASAN PENDIDIKAN / DINAS PENDIDIKAN
            </h3>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
              {teacherProfile.school}
            </h1>
            <p className="text-xs text-slate-600 italic font-sans mt-0.5">
              Mata Pelajaran: {teacherProfile.subject} • Kelas / Fase: {teacherProfile.grade}
            </p>
          </div>

          {/* Sub Header */}
          <div className="text-center py-4 border-b border-slate-300">
            <h2 className="text-base font-bold uppercase tracking-wide">
              ASESMEN SUMATIF TENGAH SEMESTER (ASTS)
            </h2>
            <h3 className="text-sm font-semibold uppercase">
              MATA PELAJARAN: {teacherProfile.subject}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              TAHUN PELAJARAN {teacherProfile.academicYear} | KELAS / FASE: {teacherProfile.grade} | {teacherProfile.packet}
            </p>
          </div>

          {/* Student Identity Box (for Questions or LJK) */}
          {printMode !== 'key' && (
            <div className="my-4 p-3 border border-slate-400 rounded-lg text-xs grid grid-cols-2 gap-x-6 gap-y-2 font-sans">
              <div className="flex gap-2">
                <span className="w-24 font-bold">Nama Lengkap</span>
                <span>: ..............................................................</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-bold">Kelas / Jurusan</span>
                <span>: ..............................................................</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-bold">Nomor Absen / NISN</span>
                <span>: ..............................................................</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-bold">Hari / Tanggal</span>
                <span>: ..............................................................</span>
              </div>
            </div>
          )}

          {/* MODE 1: QUESTIONS PRINT */}
          {printMode === 'questions' && (
            <div className="mt-4 space-y-5 text-xs font-serif">
              <div className="p-2 bg-slate-100 rounded text-slate-800 text-[11px] font-sans font-medium mb-4">
                <strong>PETUNJUK UMUM:</strong> Pilihlah salah satu jawaban yang paling tepat dengan memberi tanda silang (X) atau menghitamkan bulatan pada huruf A, B, C, D, atau E!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 print:grid-cols-2">
                {questions.map((q) => (
                  <div key={q.id} className="break-inside-avoid border-b border-slate-200/60 pb-3">
                    <p className="font-bold text-slate-900 leading-snug">
                      {q.id}. {q.question}
                    </p>
                    {q.image && (
                      <div className="my-1.5 p-1 border border-slate-300 rounded inline-block bg-white">
                        <img
                          src={q.image}
                          alt={`Gambar ${q.id}`}
                          className="max-h-36 max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="mt-2 space-y-1 pl-3 font-sans text-[11px] text-slate-800">
                      {q.options.map((opt) => (
                        <div key={opt.key} className="flex items-start gap-2">
                          <span className="font-bold w-4">{opt.key}.</span>
                          <span className="flex-1">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: TEACHER ANSWER KEY */}
          {printMode === 'key' && (
            <div className="mt-6 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                <h3 className="font-bold text-sm text-slate-800">
                  KUNCI JAWABAN & DISTRIBUSI BOBOT NILAI (50 BUTIR SOAL)
                </h3>
                <span className="font-bold text-indigo-700">Bobot: 2 Poin/Soal (Maks: 100)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, colIdx) => (
                  <table key={colIdx} className="w-full text-left border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                        <th className="p-1.5 text-center">No</th>
                        <th className="p-1.5 text-center">Kunci</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.slice(colIdx * 10, colIdx * 10 + 10).map((q) => (
                        <tr key={q.id} className="border-b border-slate-200 last:border-none">
                          <td className="p-1.5 text-center font-medium bg-slate-50">{q.id}</td>
                          <td className="p-1.5 text-center font-black text-indigo-700 bg-indigo-50/50">
                            {q.correctAnswer}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>

              {/* Teacher and Curriculum Sign-off section */}
              <div className="mt-12 pt-6 grid grid-cols-2 text-center text-xs font-sans">
                <div>
                  <p>Menyetujui,</p>
                  <p className="font-semibold">Wakil Kepala Bidang Kurikulum</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{teacherProfile.curriculumHead}</p>
                  <p className="text-slate-500">NIP. {teacherProfile.curriculumNip || '-'}</p>
                </div>
                <div>
                  <p>Kota / Kabupaten, .............................. 2026</p>
                  <p className="font-semibold">Guru Mata Pelajaran</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{teacherProfile.name}</p>
                  <p className="text-slate-500">NIP. {teacherProfile.nip || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: LEMBAR JAWABAN KOMPUTER (LJK) SISWA */}
          {printMode === 'ljk' && (
            <div className="mt-6 space-y-4 font-sans text-xs">
              <div className="text-center font-bold pb-2 border-b border-slate-200">
                LEMBAR JAWABAN ASESMEN SUMATIF (LJK)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, colIdx) => (
                  <div key={colIdx} className="border border-slate-300 rounded-lg p-2 bg-slate-50/50 space-y-1.5">
                    {questions.slice(colIdx * 10, colIdx * 10 + 10).map((q) => (
                      <div key={q.id} className="flex items-center justify-between text-[11px] py-0.5">
                        <span className="w-5 font-bold text-slate-700 text-right pr-1">{q.id}.</span>
                        <div className="flex gap-1">
                          {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                            <span
                              key={letter}
                              className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-600 bg-white"
                            >
                              {letter}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-3">
                <span>ASTS Koding dan Kecerdasan Artifisial - TP 2026/2027</span>
                <span>Tanda Tangan Siswa: .......................................</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
