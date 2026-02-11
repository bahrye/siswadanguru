import Image from "next/image";
import { School, Building, Users } from "lucide-react";
import Header from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockSchools } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const totalStudents = mockSchools.reduce((acc, school) => acc + school.studentCount, 0);
  const totalTeachers = mockSchools.reduce((acc, school) => acc + school.teacherCount, 0);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-80">
            <Image
                src="https://picsum.photos/seed/hero/1200/800"
                alt="Hero Image"
                fill
                className="object-cover"
                priority
                data-ai-hint="classroom technology"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-black/30" />
            <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center text-primary-foreground">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Selamat Datang di Manajer EduCloud</h1>
                <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
                    Solusi terpusat untuk mengelola data sekolah, siswa, dan guru di berbagai institusi.
                </p>
            </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Total Sekolah"
              value={mockSchools.length.toString()}
              description="Di semua wilayah"
              Icon={Building}
            />
            <StatCard
              title="Total Siswa"
              value={totalStudents.toLocaleString('id-ID')}
              description="Terdaftar di semua sekolah"
              Icon={Users}
            />
            <StatCard
              title="Total Guru"
              value={totalTeachers.toLocaleString('id-ID')}
              description="Mengajar di semua sekolah"
              Icon={School}
            />
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 pb-12">
          <Card>
            <CardHeader>
              <CardTitle>Direktori Sekolah</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSchools.map((school) => (
                  <div key={school.id} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors">
                    <div>
                      <h3 className="font-semibold font-headline">{school.name}</h3>
                      <p className="text-sm text-muted-foreground">{school.address}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline">{school.studentCount.toLocaleString('id-ID')} Siswa</Badge>
                        <Badge variant="outline">{school.teacherCount.toLocaleString('id-ID')} Guru</Badge>
                         <Button asChild variant="outline" size="sm">
                             <Link href="/login">Lihat Detail</Link>
                         </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="py-6 border-t">
          <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Manajer EduCloud. Hak cipta dilindungi undang-undang.
          </div>
      </footer>
    </div>
  );
}
