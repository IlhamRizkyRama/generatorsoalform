export interface TeacherProfile {
  name: string;
  nip: string;
  school: string;
  subject: string;
  grade: string;
  academicYear: string;
  packet: string;
  curriculumHead: string;
  curriculumNip: string;
  email: string;
  avatar?: string;
  gapuraValues: string[];
  dimensions: string[];
  durationMinutes: number;
}

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  name: 'Ilham Rizky Ramadhan, S.Tr.T.',
  nip: '-',
  school: 'SMK Pertiwi Ciasem',
  subject: 'Koding dan Kecerdasan Artifisial',
  grade: 'X / E',
  academicYear: '2026/2027',
  packet: 'Paket 3: Algoritma Pemrograman',
  curriculumHead: 'Firman Damayanto, S.Pd., Gr.',
  curriculumNip: '-',
  email: 'ilham7h18@gmail.com',
  gapuraValues: ['Bageur', 'Singer', 'Pinter', 'Bener'],
  dimensions: ['Kolaborasi', 'Komunikasi', 'Kreativitas', 'Kemandirian', 'Penalaran Kritis'],
  durationMinutes: 90,
};
