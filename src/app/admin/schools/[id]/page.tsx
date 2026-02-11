import { mockSchools, mockStudents, mockTeachers } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, School, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table/DataTable";
import { columns as studentColumns } from "@/components/admin/students/columns";
import { columns as teacherColumns } from "@/components/admin/teachers/columns";

async function getSchoolData(id: string) {
    const school = mockSchools.find(s => s.id === id);
    if (!school) return null;

    const students = mockStudents.filter(s => s.schoolId === id);
    const teachers = mockTeachers.filter(t => t.schoolId === id);
    return { school, students, teachers };
}


export default async function SchoolDetailPage({ params }: { params: { id: string } }) {
    const data = await getSchoolData(params.id);

    if (!data) {
        notFound();
    }

    const { school, students, teachers } = data;

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">{school.name}</h2>
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
