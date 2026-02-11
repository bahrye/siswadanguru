"use client";

import { useState } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import type { Student } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudentForm } from "./StudentForm";
import { useToast } from "@/hooks/use-toast";
import { doc, writeBatch, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";


interface StudentActionsProps {
  student: Student;
}

export function StudentActions({ student }: StudentActionsProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const studentRef = doc(db, "schools", student.schoolId, "students", student.id);
      const schoolRef = doc(db, "schools", student.schoolId);

      const batch = writeBatch(db);
      batch.delete(studentRef);
      batch.update(schoolRef, { studentCount: increment(-1) });
      await batch.commit();
      
      toast({
        title: "Siswa Dihapus",
        description: `Siswa "${student.name}" telah berhasil dihapus.`,
      });
      setDeleteDialogOpen(false);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
       toast({
        variant: "destructive",
        title: "Gagal Menghapus",
        description: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Siswa</DialogTitle>
            <DialogDescription>
              Ubah detail siswa. Klik simpan jika sudah selesai.
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            student={student}
            schoolId={student.schoolId}
            onFinished={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data siswa
              secara permanen dari server kami.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            Edit Siswa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Hapus Siswa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
