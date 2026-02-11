
"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/admin/students/columns";
import type { School, Student } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { StudentForm } from "@/components/admin/students/StudentForm";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, collectionGroup } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddStudentOpen, setAddStudentOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const schoolsQuery = query(collection(db, "schools"), orderBy("name", "asc"));
    const unsubscribeSchools = onSnapshot(schoolsQuery, (snapshot) => {
      const schoolList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
      setSchools(schoolList);
    });

    const studentsQuery = query(collectionGroup(db, 'students'), orderBy('name', 'asc'));
    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(studentList);
      setLoading(false);
    });

    return () => {
        unsubscribeSchools();
        unsubscribeStudents();
    };
  }, []);

  const studentsWithSchoolNames = useMemo(() => {
    const schoolMap = new Map(schools.map(s => [s.id, s.name]));
    return students.map(student => ({
        ...student,
        schoolName: schoolMap.get(student.schoolId) || 'Tidak Diketahui',
    }));
  }, [students, schools]);

  if (loading) {
    return (
       <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-48" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
       </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline md:text-3xl">Manajemen Siswa</h2>
                <p className="text-muted-foreground">
                    Lihat, tambah, dan edit data siswa dari semua sekolah.
                </p>
            </div>
            <div className="flex justify-end w-full md:w-auto">
                <Dialog open={isAddStudentOpen} onOpenChange={setAddStudentOpen}>
                <DialogTrigger asChild>
                    <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Siswa Baru
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
                    <DialogHeader>
                    <DialogTitle>Tambah Siswa Baru</DialogTitle>
                    <DialogDescription>
                        Pilih sekolah lalu masukkan detail siswa baru. Klik simpan jika sudah selesai.
                    </DialogDescription>
                    </DialogHeader>
                    <StudentForm 
                        onFinished={() => setAddStudentOpen(false)}
                        schools={schools}
                    />
                </DialogContent>
                </Dialog>
            </div>
       </div>

        <Dialog open={!!studentToEdit} onOpenChange={(isOpen) => !isOpen && setStudentToEdit(null)}>
            <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Siswa</DialogTitle>
                    <DialogDescription>
                        Ubah detail siswa. Klik simpan jika sudah selesai.
                    </DialogDescription>
                </DialogHeader>
                {studentToEdit && (
                    <StudentForm
                        student={studentToEdit}
                        schoolId={studentToEdit.schoolId}
                        onFinished={() => setStudentToEdit(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
      
      <DataTable 
        columns={columns} 
        data={studentsWithSchoolNames} 
        filterColumnId="name"
        meta={{
          onEdit: (student: Student) => setStudentToEdit(student),
        }}
      />
    </div>
  );
}
