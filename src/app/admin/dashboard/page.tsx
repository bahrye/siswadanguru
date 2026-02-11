"use client";

import { Building, Users, School } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { mockSchools } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminDashboardPage() {
    const totalStudents = mockSchools.reduce((acc, school) => acc + school.studentCount, 0);
    const totalTeachers = mockSchools.reduce((acc, school) => acc + school.teacherCount, 0);

    const chartData = mockSchools.map(school => ({
        name: school.name.split(' ').slice(0,2).join(' '),
        students: school.studentCount,
        teachers: school.teacherCount,
    }));

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dasbor Admin</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Sekolah" value={mockSchools.length.toString()} Icon={Building} description="Institusi yang dikelola" />
        <StatCard title="Total Siswa" value={totalStudents.toLocaleString('id-ID')} Icon={Users} description="Di semua sekolah" />
        <StatCard title="Total Guru" value={totalTeachers.toLocaleString('id-ID')} Icon={School} description="Anggota fakultas" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Distribusi Siswa per Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Siswa" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Aktivitas Terkini</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Users className="h-5 w-5 mr-4 text-green-500" />
                        <div className="flex-1">
                            <p className="text-sm">Siswa baru 'Budi Santoso' ditambahkan ke SMA N 1.</p>
                            <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <Building className="h-5 w-5 mr-4 text-blue-500" />
                        <div className="flex-1">
                            <p className="text-sm">Profil sekolah 'SMK Bisa Berkarya' diperbarui.</p>
                            <p className="text-xs text-muted-foreground">1 hari yang lalu</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <School className="h-5 w-5 mr-4 text-purple-500" />
                        <div className="flex-1">
                            <p className="text-sm">Guru baru 'Dr. Ahmad Fauzi' ditambahkan ke SMA N 1.</p>
                            <p className="text-xs text-muted-foreground">3 hari yang lalu</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
