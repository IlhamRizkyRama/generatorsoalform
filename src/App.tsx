import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from './lib/auth';
import { EXAM_QUESTIONS, Question } from './data/examQuestions';
import { TeacherProfile, DEFAULT_TEACHER_PROFILE } from './types/admin';
import { CreatedFormResult } from './services/googleFormsService';
import { Header } from './components/Header';
import { ExamViewer } from './components/ExamViewer';
import { FormCreator } from './components/FormCreator';
import { StudentSimulator } from './components/StudentSimulator';
import { FormHistory } from './components/FormHistory';
import { PrintView } from './components/PrintView';
import { DocxImportModal } from './components/DocxImportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  FileUp,
  GraduationCap,
  Layers,
  Printer,
  Sparkles,
  Users,
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'create-form' | 'simulator' | 'history'>('questions');

  // Teacher Profile State (customizable by Admin)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem('asts_teacher_profile');
      return saved ? JSON.parse(saved) : DEFAULT_TEACHER_PROFILE;
    } catch {
      return DEFAULT_TEACHER_PROFILE;
    }
  });

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('asts_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Questions Bank State: Starts EMPTY (draft dummy cleared as requested!)
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('asts_questions_bank_v3');
      // If user has saved questions in v3, return them; otherwise start empty []
      return saved !== null ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected Questions IDs (for Form export, simulator test, and print)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('asts_selected_question_ids_v3');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return questions.map((q) => q.id);
    } catch {
      return questions.map((q) => q.id);
    }
  });

  const [createdForms, setCreatedForms] = useState<CreatedFormResult[]>(() => {
    try {
      const saved = localStorage.getItem('asts_created_forms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync questions and selection to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('asts_questions_bank_v3', JSON.stringify(questions));
    } catch (e) {
      console.error(e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('asts_selected_question_ids_v3', JSON.stringify(selectedQuestionIds));
    } catch (e) {
      console.error(e);
    }
  }, [selectedQuestionIds]);

  useEffect(() => {
    try {
      localStorage.setItem('asts_teacher_profile', JSON.stringify(teacherProfile));
    } catch (e) {
      console.error(e);
    }
  }, [teacherProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('asts_admin_session', isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isAdminLoggedIn]);

  // Initialize Firebase Auth listener for Google Forms API
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
  };

  const handleFormCreated = (newForm: CreatedFormResult) => {
    const updated = [newForm, ...createdForms];
    setCreatedForms(updated);
    try {
      localStorage.setItem('asts_created_forms', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Selection handlers
  const handleToggleSelect = (id: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedQuestionIds(questions.map((q) => q.id));
  };

  const handleDeselectAll = () => {
    setSelectedQuestionIds([]);
  };

  // CRUD handlers (Guaranteed without browser modal blocks)
  const handleAddQuestion = (newQ: Question) => {
    const updated = [...questions, newQ];
    setQuestions(updated);
    setSelectedQuestionIds((prev) => [...prev, newQ.id]);
  };

  const handleUpdateQuestion = (updatedQ: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setSelectedQuestionIds((prev) => prev.filter((i) => i !== id));
  };

  const handleBatchDelete = (ids: number[]) => {
    setQuestions((prev) => prev.filter((q) => !ids.includes(q.id)));
    setSelectedQuestionIds((prev) => prev.filter((i) => !ids.includes(i)));
  };

  const handleClearAll = () => {
    setQuestions([]);
    setSelectedQuestionIds([]);
  };

  const handleLoadTemplate = () => {
    setQuestions(EXAM_QUESTIONS);
    setSelectedQuestionIds(EXAM_QUESTIONS.map((q) => q.id));
  };

  // Import from Word (.docx) or Docs
  const handleImportQuestions = (imported: Question[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      setQuestions(imported);
      setSelectedQuestionIds(imported.map((q) => q.id));
    } else {
      const maxExistingId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) : 0;
      const reindexed = imported.map((q, idx) => ({
        ...q,
        id: maxExistingId + idx + 1,
      }));
      const updated = [...questions, ...reindexed];
      setQuestions(updated);
      setSelectedQuestionIds((prev) => [...prev, ...reindexed.map((q) => q.id)]);
    }
  };

  // Admin login & profile handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    // Open profile modal so teacher can immediately customize
    setIsProfileModalOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleSaveProfile = (updated: TeacherProfile) => {
    setTeacherProfile(updated);
  };

  // Calculate selected questions
  const selectedQuestions = questions.filter((q) => selectedQuestionIds.includes(q.id));
  const questionsForExam = selectedQuestions.length > 0 ? selectedQuestions : questions;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        teacherProfile={teacherProfile}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onAdminLogout={handleAdminLogout}
        selectedCount={selectedQuestionIds.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Quick Stats Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Total Bank Soal</p>
              <p className="text-lg font-bold text-slate-900">{questions.length} Butir Soal</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Soal Terpilih</p>
              <p className="text-lg font-bold text-slate-900">
                {selectedQuestionIds.length} dari {questions.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Bobot Terpilih</p>
              <p className="text-lg font-bold text-slate-900">{selectedQuestionIds.length * 2} Poin</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Alokasi Waktu</p>
              <p className="text-lg font-bold text-slate-900">{teacherProfile.durationMinutes} Menit</p>
            </div>
          </div>
        </div>

        {/* Tab Sub-Header Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'questions'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              1. Bank Soal & Pilih Soal ({selectedQuestionIds.length})
            </button>

            <button
              onClick={() => setActiveTab('create-form')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'create-form'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>2. Buat Google Form ASTS ({selectedQuestionIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              3. Simulasi Uji Coba ({questionsForExam.length})
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>4. Riwayat Formulir</span>
              {createdForms.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-bold">
                  {createdForms.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs"
            >
              <FileUp className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Import Word (.docx)</span>
              <span className="sm:hidden">Import</span>
            </button>

            {questions.length > 0 && (
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Cetak / PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'questions' && (
          <ExamViewer
            questions={questions}
            selectedQuestionIds={selectedQuestionIds}
            teacherProfile={teacherProfile}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onBatchDelete={handleBatchDelete}
            onClearAll={handleClearAll}
            onLoadTemplate={handleLoadTemplate}
            onOpenPrint={() => setIsPrintModalOpen(true)}
            onSwitchToCreate={() => setActiveTab('create-form')}
            onOpenImport={() => setIsImportModalOpen(true)}
          />
        )}

        {activeTab === 'create-form' && (
          <FormCreator
            user={user}
            accessToken={accessToken}
            onLogin={handleLogin}
            questions={selectedQuestions}
            onFormCreated={handleFormCreated}
            teacherProfile={teacherProfile}
          />
        )}

        {activeTab === 'simulator' && <StudentSimulator questions={questionsForExam} />}

        {activeTab === 'history' && (
          <FormHistory
            forms={createdForms}
            accessToken={accessToken}
            onOpenCreate={() => setActiveTab('create-form')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center space-y-1">
        <p className="font-semibold text-slate-700">
          {teacherProfile.school} — {teacherProfile.subject} ({teacherProfile.grade})
        </p>
        <p>
          Kurikulum Merdeka • Dimensi Profil Pelajar Pancasila: {teacherProfile.dimensions.join(', ')}
        </p>
        <p className="text-[11px] text-slate-400">
          Penyusun: {teacherProfile.name} | Kurikulum: {teacherProfile.curriculumHead} | TP {teacherProfile.academicYear}
        </p>
      </footer>

      {/* Printable Sheet Modal */}
      <PrintView
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        questions={questionsForExam}
        teacherProfile={teacherProfile}
      />

      {/* Docx & Docs Import Modal */}
      <DocxImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportQuestions}
        currentCount={questions.length}
      />

      {/* Admin Login Modal (username: admin, password: admin) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Teacher Profile Customization Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={teacherProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
