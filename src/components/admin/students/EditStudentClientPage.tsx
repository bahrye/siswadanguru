"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";

import type { Student } from "@/lib/types";
import { db } from "@/lib/firebase";
import { StudentForm } from "@/components/admin/students/StudentForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EditStudentClientPage({ schoolId, studentId }: { schoolId: string, studentId: string }) {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            const studentRef = doc(db, 'schools', schoolId, 'students', studentId);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                setStudent({ id: studentSnap.id, ...studentSnap.data() } as Student);
            } else {
                notFound();
            }
            setLoading(false);
        };

        fetchStudent();
    }, [schoolId, studentId]);

    if (loading) {
        return (
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }
    
    if (!student) {
        return null; // notFound is called in useEffect
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 min-w-0">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Kembali</span>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight font-headline md:text-3xl">Edit Siswa</h2>
                     <p className="text-muted-foreground">
                        Mengubah data untuk {student.name}.
                    </p>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Formulir Data Siswa</CardTitle>
                    <CardDescription>
                        Ubah detail siswa di bawah ini. Klik simpan jika sudah selesai.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentForm
                        student={student}
                        schoolId={schoolId}
                        onFinished={() => router.push(`/admin/schools/${schoolId}`)}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
