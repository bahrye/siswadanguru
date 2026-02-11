"use client";

import type { School } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolActions } from "./SchoolActions";

export const columns: ColumnDef<School>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Sekolah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-4 font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "address",
    header: "Alamat",
  },
  {
    accessorKey: "studentCount",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Siswa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-center"><Badge variant="secondary">{row.getValue("studentCount")}</Badge></div>,
  },
  {
    accessorKey: "teacherCount",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Guru
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-center"><Badge variant="secondary">{row.getValue("teacherCount")}</Badge></div>,
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const school = row.original;
      const meta = table.options.meta as {
        onEdit: (school: School) => void;
      };
      return <SchoolActions school={school} onEdit={() => meta.onEdit(school)} />;
    },
  },
];
