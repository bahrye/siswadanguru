import type { School, Student, Teacher } from './types';

export const mockSchools: School[] = [
  { id: '1', name: 'SMA Negeri 1 Harapan Bangsa', address: 'Jl. Pendidikan No. 1', studentCount: 1250, teacherCount: 80 },
  { id: '2', name: 'SMK Bisa Berkarya', address: 'Jl. Industri No. 10', studentCount: 980, teacherCount: 65 },
  { id: '3', name: 'SMA Cendekia Mulia', address: 'Jl. Kebangsaan No. 22', studentCount: 760, teacherCount: 55 },
];

export const mockStudents: Student[] = [
    // School 1
  { id: 's1', name: 'Budi Santoso', class: '12-A', dateOfBirth: '2006-05-15', schoolId: '1' },
  { id: 's2', name: 'Citra Lestari', class: '11-B', dateOfBirth: '2007-08-22', schoolId: '1' },
  { id: 's3', name: 'Dewi Anggraini', class: '10-C', dateOfBirth: '2008-11-30', schoolId: '1' },

  // School 2
  { id: 's4', name: 'Eko Prasetyo', class: '12-TKJ', dateOfBirth: '2006-02-10', schoolId: '2' },
  { id: 's5', name: 'Fitriani', class: '11-AK', dateOfBirth: '2007-07-18', schoolId: '2' },

  // School 3
  { id: 's6', name: 'Gilang Ramadhan', class: '11-IPA', dateOfBirth: '2007-01-05', schoolId: '3' },
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
