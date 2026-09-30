import React, { useState, useRef } from 'react';
import { TeacherProfile, DEFAULT_TEACHER_PROFILE } from '../types/admin';
import {
  Camera,
  Check,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Upload,
  User,
  X,
} from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onSave: (updated: TeacherProfile) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>(profile);
  const [successMsg, setSuccessMsg] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, avatar: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefault = () => {
    setFormData(DEFAULT_TEACHER_PROFILE);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-amber-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Kustomisasi Profil Guru & Identitas Sekolah</h3>
              <p className="text-xs text-slate-300">
                Data ini akan otomatis tercantum pada Header, Google Forms, dan Kop Naskah Ujian
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profil berhasil disimpan dan diperbarui!</span>
            </div>
          )}

          {/* Avatar and Main Info Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80">
            <div className="relative group shrink-0">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  {formData.name[0]?.toUpperCase() || 'G'}
                </div>
              )}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 bg-slate-900/50 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Ganti Foto Profil"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Foto & Akun Guru
                </span>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Unggah Foto Guru
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Pilih foto profil resmi guru pengampu untuk ditampilkan di aplikasi dan kop asesmen.
              </p>
            </div>
          </div>

          {/* Row: Guru & NIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar Guru Pengampu
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Ilham Rizky Ramadhan, S.Tr.T."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP / NUPTK Guru (Opsional)
              </label>
              <input
                type="text"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="-"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row: Sekolah & Mata Pelajaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Sekolah / Instansi
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="Contoh: SMK Pertiwi Ciasem"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mata Pelajaran
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Contoh: Koding dan Kecerdasan Artifisial"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          {/* Row: Kelas / Fase, Tahun Ajaran, Paket */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kelas / Fase</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="X / E"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2026/2027"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paket Soal</label>
              <input
                type="text"
                value={formData.packet}
                onChange={(e) => setFormData({ ...formData, packet: e.target.value })}
                placeholder="Paket 3: Algoritma Pemrograman"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row: Kurikulum / Waka & NIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Waka Bidang Kurikulum
              </label>
              <input
                type="text"
                value={formData.curriculumHead}
                onChange={(e) => setFormData({ ...formData, curriculumHead: e.target.value })}
                placeholder="Contoh: Firman Damayanto, S.Pd., Gr."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alokasi Waktu Ujian (Menit)
              </label>
              <input
                type="number"
                min={15}
                max={240}
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 90 })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row: Nilai Budaya Sekolah (Gapura Panca Waluya) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Semboyan Budaya / Nilai Karakter (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={formData.gapuraValues.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gapuraValues: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Bageur, Singer, Pinter, Bener"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembalikan Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
