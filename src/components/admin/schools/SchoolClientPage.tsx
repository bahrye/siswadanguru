"use client";

import { useState } from "react";
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


export function SchoolClientPage({ data }: { data: School[] }) {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

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
      <DataTable columns={columns} data={data} filterColumnId="name" />
    </>
  );
}
