"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, MapPin, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table/DataTable";
import { columns as studentColumns } from "@/components/admin/students/columns";
import { columns as teacherColumns } from "@/components/admin/teachers/columns";
import type { School as SchoolType, Student, Teacher } from "@/lib/types";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { mockStudents, mockTeachers } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";


export function SchoolDetailClientPage({ schoolId }: { schoolId: string }) {
    const [school, setSchool] = useState<SchoolType | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function getSchoolData() {
            setLoading(true);
            const schoolRef = doc(db, 'schools', schoolId);
            const schoolSnap = await getDoc(schoolRef);

            if (!schoolSnap.exists()) {
                setLoading(false);
                notFound();
                return;
            }
            
            const schoolData = { id: schoolSnap.id, ...schoolSnap.data() } as SchoolType;
            setSchool(schoolData);

            // For now, students and teachers are still from mock data
            // In a real app, you would fetch these from subcollections.
            const studentData = mockStudents.filter(s => s.schoolId === schoolId);
            const teacherData = mockTeachers.filter(t => t.schoolId === schoolId);
            setStudents(studentData);
            setTeachers(teacherData);

            setLoading(false);
        }

        getSchoolData();
    }, [schoolId]);

    if (loading) {
        return (
             <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <div className="flex items-center gap-4">
                     <Skeleton className="h-8 w-8" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </div>
                <Skeleton className="h-48 w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (!school) {
        return null; // notFound() is called in useEffect
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Kembali</span>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight font-headline md:text-3xl">{school.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4"/> {school.address}
                    </p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Ringkasan Sekolah</CardTitle>
                    <CardDescription>
                        Statistik utama untuk {school.name}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Users className="h-8 w-8 text-primary" />
                        <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Total Siswa</p>
                        <p className="text-2xl font-semibold font-headline">{students.length}</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-4 rounded-md border p-4">
                        <School className="h-8 w-8 text-primary" />
                        <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Total Guru</p>
                        <p className="text-2xl font-semibold font-headline">{teachers.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="students" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="students">
                        <Users className="mr-2 h-4 w-4"/> Siswa
                    </TabsTrigger>
                    <TabsTrigger value="teachers">
                        <School className="mr-2 h-4 w-4"/> Guru
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="students" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manajemen Siswa</CardTitle>
                             <CardDescription>
                                Tambah, edit, atau hapus data siswa untuk sekolah ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <DataTable columns={studentColumns} data={students} filterColumnId="name" />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="teachers" className="space-y-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Manajemen Guru</CardTitle>
                             <CardDescription>
                                Tambah, edit, atau hapus data guru untuk sekolah ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={teacherColumns} data={teachers} filterColumnId="name" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
