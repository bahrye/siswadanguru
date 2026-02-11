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
  class: string;
  dateOfBirth: string; // ISO 8601 format
  schoolId: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  hireDate: string; // ISO 8601 format
  schoolId: string;
}
