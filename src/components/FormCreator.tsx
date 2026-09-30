import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Question } from '../data/examQuestions';
import { TeacherProfile } from '../types/admin';
import {
  FormCreationConfig,
  CreatedFormResult,
  createExamGoogleForm,
} from '../services/googleFormsService';
import { ConfirmationModal } from './ConfirmationModal';
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Flame,
  HelpCircle,
  Key,
  Layers,
  Plus,
  QrCode,
  Send,
  Share2,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';

interface FormCreatorProps {
  user: User | null;
  accessToken: string | null;
  onLogin: () => void;
  questions: Question[];
  onFormCreated: (form: CreatedFormResult) => void;
  teacherProfile: TeacherProfile;
}

export const FormCreator: React.FC<FormCreatorProps> = ({
  user,
  accessToken,
  onLogin,
  questions,
  onFormCreated,
  teacherProfile,
}) => {
  const [config, setConfig] = useState<FormCreationConfig>(() => ({
    title: `ASTS Ganjil - ${teacherProfile.subject} (${teacherProfile.school})`,
    documentTitle: `ASTS ${teacherProfile.subject} - ${teacherProfile.school} ${teacherProfile.academicYear}`,
    description: `ASESMEN SUMATIF TENGAH SEMESTER (ASTS) GANJIL\nTAHUN PELAJARAN ${teacherProfile.academicYear}\n\nSekolah: ${teacherProfile.school}\nMata Pelajaran: ${teacherProfile.subject}\nKelas / Fase: ${teacherProfile.grade}\nPaket: ${teacherProfile.packet}\nPenyusun: ${teacherProfile.name}\n\nPetunjuk:\n1. Isikan identitas Anda dengan lengkap dan benar.\n2. Pilihlah salah satu jawaban (A, B, C, D, atau E) yang paling tepat!\n3. Dilarang bekerja sama atau membuka catatan selama asesmen berlangsung.\n\nSemboyan: ${teacherProfile.gapuraValues.join(', ')}`,
    classes: ['X TJKT 1', 'X TJKT 2', 'X RPL 1', 'X RPL 2'],
    includeToken: true,
    tokenCode: 'ASTS-2026',
    pointsPerQuestion: 2,
    shuffleOptions: false,
    makeQuiz: true,
  }));

  // Update default titles when teacher profile changes
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      title: `ASTS Ganjil - ${teacherProfile.subject} (${teacherProfile.school})`,
      documentTitle: `ASTS ${teacherProfile.subject} - ${teacherProfile.school} ${teacherProfile.academicYear}`,
    }));
  }, [teacherProfile.school, teacherProfile.subject, teacherProfile.academicYear]);

  const [newClassInput, setNewClassInput] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [lastCreatedForm, setLastCreatedForm] = useState<CreatedFormResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleAddClass = () => {
    if (newClassInput.trim() && !config.classes.includes(newClassInput.trim())) {
      setConfig({ ...config, classes: [...config.classes, newClassInput.trim()] });
      setNewClassInput('');
    }
  };

  const handleRemoveClass = (cls: string) => {
    setConfig({ ...config, classes: config.classes.filter((c) => c !== cls) });
  };

  const handleStartCreation = () => {
    setErrorMessage(null);
    if (!accessToken) {
      onLogin();
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCreation = async () => {
    if (!accessToken) return;
    setIsConfirmModalOpen(false);
    setIsSubmitting(true);
    setProgressPercent(5);
    setProgressStep('Menghubungkan ke Google Forms API...');

    try {
      const result = await createExamGoogleForm(
        accessToken,
        config,
        questions,
        (step, percent) => {
          setProgressStep(step);
          setProgressPercent(percent);
        }
      );
      setLastCreatedForm(result);
      onFormCreated(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat membuat Google Form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = (url: string) => {
    const text = encodeURIComponent(
      `*ASESMEN SUMATIF TENGAH SEMESTER (ASTS)*\n` +
      `Mata Pelajaran: ${teacherProfile.subject}\n` +
      `Sekolah: ${teacherProfile.school}\n` +
      `Kelas: ${teacherProfile.grade}\n` +
      `Token: ${config.includeToken ? config.tokenCode : '-'}\n\n` +
      `Silakan kerjakan soal melalui tautan Google Forms berikut:\n${url}\n\n` +
      `Selamat mengerjakan, junjung tinggi kejujuran!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* If newly created, show prominent success banner */}
      {lastCreatedForm && (
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1">
                  Google Form Berhasil Dibuat!
                </span>
                <h3 className="text-xl font-bold text-slate-900">{lastCreatedForm.title}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Semua 50 butir soal pilihan ganda (A–E) dan kunci jawaban kuis telah tersimpan di akun Google Anda.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                  <span>ID: <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">{lastCreatedForm.formId}</code></span>
                  <span>Total Soal: <strong className="text-slate-800">{lastCreatedForm.totalQuestions}</strong></span>
                  <span>Bobot Nilai: <strong className="text-slate-800">{lastCreatedForm.totalPoints} Poin</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <a
                href={lastCreatedForm.editUri}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka di Google Forms</span>
              </a>
              <button
                onClick={() => handleCopyLink(lastCreatedForm.responderUri)}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{copiedLink ? 'Tautan Disalin!' : 'Salin Tautan Siswa'}</span>
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                className="p-2.5 text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all"
                title="Tampilkan Kode QR untuk Siswa"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShareWhatsApp(lastCreatedForm.responderUri)}
                className="p-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl shadow-xs transition-all"
                title="Bagikan ke WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overlay during creation */}
      {isSubmitting && (
        <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-md text-center space-y-4 animate-pulse">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">Sedang Membuat Google Form ASTS...</h4>
            <p className="text-xs text-slate-500 mt-1">{progressStep}</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden max-w-md mx-auto">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{progressPercent}% selesai</p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">Gagal membuat Google Form</p>
            <p className="text-xs mt-0.5 text-rose-700">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Konfigurasi Generator
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Pengaturan Pembuatan Google Forms Ujian
            </h2>
            <p className="text-xs text-slate-500">
              Sesuaikan judul, petunjuk, kelas target, dan bobot penilaian sebelum diekspor ke Google Workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              {questions.length} Butir Soal Terpilih
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Row 1: Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Formulir (Tampil ke Siswa)
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                placeholder="Judul Google Form"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Berkas Dokumen (Di Google Drive)
              </label>
              <input
                type="text"
                value={config.documentTitle}
                onChange={(e) => setConfig({ ...config, documentTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
                placeholder="Nama file di Drive"
              />
            </div>
          </div>

          {/* Row 2: Description & Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Petunjuk & Informasi Ujian (Deskripsi Form)
            </label>
            <textarea
              rows={5}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all leading-relaxed"
            />
          </div>

          {/* Row 3: Class Rombel Selection */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                Pilihan Kelas / Rombel Siswa (Menu Dropdown)
              </label>
              <span className="text-[11px] text-slate-500">Siswa akan memilih salah satu</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {config.classes.map((cls) => (
                <span
                  key={cls}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                >
                  {cls}
                  <button
                    type="button"
                    onClick={() => handleRemoveClass(cls)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newClassInput}
                onChange={(e) => setNewClassInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddClass())}
                placeholder="Tambah kelas (contoh: X TJKT 3)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddClass}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
            </div>
          </div>

          {/* Row 4: Quiz & Scoring Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Mode Kuis & Kunci Jawaban</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Secara otomatis menetapkan kunci jawaban (A–E) dan skor otomatis.
                </p>
              </div>
              <div className="mt-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.makeQuiz}
                    onChange={(e) => setConfig({ ...config, makeQuiz: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-2 text-xs font-medium text-slate-700">
                    {config.makeQuiz ? 'Aktif (Kuis Resmi)' : 'Nonaktif (Survei)'}
                  </span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Bobot Skor Per Soal</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  50 Soal × {config.pointsPerQuestion} Poin ={' '}
                  <strong className="text-indigo-600">{50 * config.pointsPerQuestion} Nilai Maksimal</strong>.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={config.pointsPerQuestion}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pointsPerQuestion: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-20 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <span className="text-xs text-slate-600 font-medium">poin / nomor</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Token Keamanan Ujian</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Menambahkan kolom verifikasi password/token yang harus diisi siswa.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={config.tokenCode}
                  onChange={(e) => setConfig({ ...config, tokenCode: e.target.value })}
                  placeholder="Kode token"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {questions.length === 0 ? (
                <span className="text-rose-600 font-semibold">
                  Peringatan: Belum ada soal yang dipilih di Bank Soal. Harap pilih minimal 1 soal.
                </span>
              ) : user ? (
                <span>
                  Akan dibuat di Google Drive akun: <strong className="text-slate-800">{user.email}</strong> ({questions.length} soal terpilih)
                </span>
              ) : (
                <span className="text-amber-600 font-medium">
                  Belum terhubung ke Google. Anda akan diminta masuk untuk menyimpan form ke Google Drive Anda.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleStartCreation}
              disabled={isSubmitting || questions.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-md shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buat Google Form Sekarang ({questions.length} Soal)</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal for sharing in classroom */}
      {showQrModal && lastCreatedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800">QR Code Pengerjaan Siswa</h4>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Tampilkan di proyektor kelas atau cetak agar siswa dapat memindai dari smartphone masing-masing.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  lastCreatedForm.responderUri
                )}`}
                alt="QR Code Google Form"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded text-slate-700 break-all select-all">
              {lastCreatedForm.responderUri}
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Modal for Destructive/Mutating Google Workspace Actions */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Buat Google Form Ujian Baru?"
        description="Aplikasi akan memanggil Google Forms API untuk membuat 1 formulir kuis baru yang berisi 50 butir soal pilihan ganda, pilihan jawaban A–E, kunci jawaban otomatis, dan identitas siswa pada akun Google Anda."
        details={[
          { label: 'Judul Formulir', value: config.title },
          { label: 'Jumlah Soal', value: `${questions.length} Butir Soal PG` },
          { label: 'Bobot Penilaian', value: `${questions.length * config.pointsPerQuestion} Poin Maksimal` },
          { label: 'Akun Google', value: user?.email || '-' },
          { label: 'Mode Kuis', value: config.makeQuiz ? 'Aktif (Auto-Grading)' : 'Nonaktif' },
        ]}
        confirmText="Ya, Buat Google Form"
        cancelText="Batal"
        isLoading={isSubmitting}
        onConfirm={handleConfirmCreation}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};
