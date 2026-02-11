export interface School {
  id: string;
  name: string;
  address: string;
  studentCount: number;
  teacherCount: number;
}

export interface Student {
  id: string;
  name: string;
  nisn?: string;
  nik?: string;
  birthPlace?: string;
  dateOfBirth: string; // ISO 8601 format
  class: string;
  status: 'Aktif' | 'Tidak Aktif';
  gender?: string;
  address?: string;
  phone?: string;
  specialNeeds?: string;
  disability?: string;
  kipPipNumber?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  schoolId: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  hireDate: string; // ISO 8601 format
  schoolId: string;
}
