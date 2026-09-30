import React from 'react';
import { User } from 'firebase/auth';
import { TeacherProfile } from '../types/admin';
import {
  Award,
  BookOpen,
  Edit2,
  GraduationCap,
  Lock,
  LogOut,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  activeTab: 'questions' | 'create-form' | 'simulator' | 'history';
  setActiveTab: (tab: 'questions' | 'create-form' | 'simulator' | 'history') => void;
  teacherProfile: TeacherProfile;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onOpenProfileModal: () => void;
  onAdminLogout: () => void;
  selectedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  isLoggingIn,
  activeTab,
  setActiveTab,
  teacherProfile,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onOpenProfileModal,
  onAdminLogout,
  selectedCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top School & Admin Status Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 font-medium border border-blue-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              {teacherProfile.school}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-200 hidden sm:inline">
              Tahun Ajaran {teacherProfile.academicYear} | Kelas {teacherProfile.grade}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-300">
              <span className="font-semibold text-amber-300">Panca Waluya:</span>
              <span>{teacherProfile.gapuraValues.join(' • ')}</span>
            </div>

            {/* Admin Profile Status / Login Trigger */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin: <strong>{teacherProfile.name.split(',')[0]}</strong></span>
                <button
                  onClick={onOpenProfileModal}
                  className="hover:text-white p-0.5 rounded hover:bg-emerald-600/30"
                  title="Kustomisasi Profil Guru & Sekolah"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={onAdminLogout}
                  className="text-slate-300 hover:text-rose-300 p-0.5 rounded ml-0.5"
                  title="Keluar Admin"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 border border-indigo-400/40 text-[11px] font-semibold transition-colors"
              >
                <Lock className="w-3 h-3 text-indigo-300" />
                <span>Login Admin (admin/admin)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Exam Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              {teacherProfile.avatar ? (
                <img
                  src={teacherProfile.avatar}
                  alt={teacherProfile.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                  <BookOpen className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {teacherProfile.packet}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedCount} Soal Siap Ujian
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                Asesmen Sumatif (ASTS): {teacherProfile.subject}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Penyusun: <strong className="text-slate-700">{teacherProfile.name}</strong></span>
                {isAdminLoggedIn && (
                  <button
                    onClick={onOpenProfileModal}
                    className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold underline flex items-center gap-0.5"
                  >
                    (Edit Profil)
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Action Tabs & User Auth */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'questions'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                Bank Soal
              </button>
              <button
                onClick={() => setActiveTab('create-form')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'create-form'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Buat Google Form
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'simulator'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Simulasi Siswa
              </button>
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2 pr-1.5 py-1 rounded-xl">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
                    {user.displayName || 'Guru'}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  title="Keluar dari akun Google"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
