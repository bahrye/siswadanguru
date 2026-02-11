"use client";

import type { Student } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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
            const date = new Date(row.getValue("dateOfBirth"));
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
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => alert(`Mengedit ${student.name}`)}
            >
              Edit Siswa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => alert(`Menghapus ${student.name}`)}
            >
              Hapus Siswa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
