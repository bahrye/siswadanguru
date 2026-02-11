"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/admin/schools/columns";
import type { School } from "@/lib/types";
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
import { SchoolForm } from "./SchoolForm";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export function SchoolClientPage() {
  const [data, setData] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [schoolToEdit, setSchoolToEdit] = useState<School | null>(null);

  useEffect(() => {
    setLoading(true);
    const schoolsCol = collection(db, "schools");
    const q = query(schoolsCol, orderBy("name", "asc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const schoolList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as School));
      setData(schoolList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Sekolah Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Sekolah Baru</DialogTitle>
              <DialogDescription>
                Masukkan detail sekolah baru. Klik simpan jika sudah selesai.
              </DialogDescription>
            </DialogHeader>
            <SchoolForm onFinished={() => setCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!schoolToEdit} onOpenChange={(isOpen) => !isOpen && setSchoolToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sekolah</DialogTitle>
            <DialogDescription>
              Ubah detail sekolah. Klik simpan jika sudah selesai.
            </DialogDescription>
          </DialogHeader>
          {schoolToEdit && (
            <SchoolForm
              school={schoolToEdit}
              onFinished={() => setSchoolToEdit(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <DataTable 
        columns={columns} 
        data={data} 
        filterColumnId="name" 
        meta={{
          onEdit: (school: School) => setSchoolToEdit(school),
        }}
      />
    </>
  );
}
