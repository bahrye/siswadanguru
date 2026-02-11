import type { School, Student, Teacher } from './types';

export const mockSchools: School[] = [
  // Data sekolah sekarang diambil dari Firestore
];

export const mockStudents: Student[] = [
  // Data siswa sekarang diambil dari Firestore
];

export const mockTeachers: Teacher[] = [
    // School 1
  { id: 't1', name: 'Dr. Ahmad Fauzi', subject: 'Matematika', hireDate: '2010-07-20', schoolId: '1' },
  { id: 't2', name: 'Siti Nurhaliza, M.Pd.', subject: 'Bahasa Indonesia', hireDate: '2012-03-15', schoolId: '1' },

  // School 2
  { id: 't3', name: 'Bambang Irawan, S.Kom', subject: 'Jaringan Komputer', hireDate: '2015-08-01', schoolId: '2' },

  // School 3
  { id: 't4', name: 'Prof. Dr. Rina Wijaya', subject: 'Fisika', hireDate: '2008-01-10', schoolId: '3' },
];
