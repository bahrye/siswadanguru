"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { School, Building, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { School as SchoolType } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

export function SchoolList() {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const schoolsCol = collection(db, "schools");
    const q = query(schoolsCol, orderBy("name", "asc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const schoolList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as SchoolType));
      setSchools(schoolList);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching schools: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalStudents = schools.reduce((acc, school) => acc + school.studentCount, 0);
  const totalTeachers = schools.reduce((acc, school) => acc + school.teacherCount, 0);

  return (
    <>
      <section className="container mx-auto px-4 md:px-6 py-12">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Total Sekolah"
              value={schools.length.toString()}
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
        )}
      </section>

      <section className="container mx-auto px-4 md:px-6 pb-12">
        <Card>
          <CardHeader>
            <CardTitle>Direktori Sekolah</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {schools.map((school) => (
                  <div key={school.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold font-headline">{school.name}</h3>
                      <p className="text-sm text-muted-foreground">{school.address}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto">
                        <Badge variant="outline" className="hidden sm:inline-flex">{school.studentCount.toLocaleString('id-ID')} Siswa</Badge>
                        <Badge variant="outline" className="hidden sm:inline-flex">{school.teacherCount.toLocaleString('id-ID')} Guru</Badge>
                         <Button asChild variant="outline" size="sm" className="ml-auto">
                             <Link href={user ? `/admin/schools/${school.id}` : "/login"}>Lihat Detail</Link>
                         </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
