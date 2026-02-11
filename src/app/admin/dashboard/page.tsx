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
        <h2 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Schools" value={mockSchools.length.toString()} Icon={Building} description="Managed institutions" />
        <StatCard title="Total Students" value={totalStudents.toLocaleString('id-ID')} Icon={Users} description="Across all schools" />
        <StatCard title="Total Teachers" value={totalTeachers.toLocaleString('id-ID')} Icon={School} description="Faculty members" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Student Distribution per School</CardTitle>
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
                        <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Users className="h-5 w-5 mr-4 text-green-500" />
                        <div className="flex-1">
                            <p className="text-sm">New student 'Budi Santoso' added to SMA N 1.</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <Building className="h-5 w-5 mr-4 text-blue-500" />
                        <div className="flex-1">
                            <p className="text-sm">School 'SMK Bisa Berkarya' profile updated.</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <School className="h-5 w-5 mr-4 text-purple-500" />
                        <div className="flex-1">
                            <p className="text-sm">New teacher 'Dr. Ahmad Fauzi' added to SMA N 1.</p>
                            <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
