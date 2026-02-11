"use client";

import type { Student } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { StudentActions } from "./StudentActions";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Siswa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-4 font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "nisn",
    header: "NISN",
  },
  {
    accessorKey: "class",
    header: "Kelas",
  },
    {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === 'Aktif' ? "default" : "destructive"}>{status}</Badge>
    }
  },
  {
    accessorKey: "dateOfBirth",
    header: "Tanggal Lahir",
    cell: ({ row }) => {
        try {
            const dateStr = row.getValue("dateOfBirth") as string;
            if (!dateStr) {
                 return <span className="text-muted-foreground text-xs">N/A</span>;
            }
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return <span className="text-destructive text-xs">Tanggal tidak valid</span>;
            }
            return format(date, "dd MMMM yyyy", { locale: id });
        } catch(e) {
             return <span className="text-destructive text-xs">Tanggal tidak valid</span>;
        }
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const student = row.original;
      const meta = table.options.meta as {
        onEdit: (student: Student) => void;
      };
      return <StudentActions student={student} onEdit={() => meta.onEdit(student)} />;
    },
  },
];
