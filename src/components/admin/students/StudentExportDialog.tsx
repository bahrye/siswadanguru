"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import type { Student } from "@/lib/types";
import { format } from 'date-fns';

interface StudentExportDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    students: Student[];
    schoolName: string;
}

const EXPORT_HEADERS = [
    "No", "Nama Lengkap", "NISN", "NIK", "Tempat Lahir", "Tanggal Lahir",
    "Tingkat - Rombel", "Status", "Jenis Kelamin", "Alamat",
    "No Telepon", "Kebutuhan Khusus", "Disabilitas", "Nomor KIP/PIP",
    "Nama Ayah Kandung", "Nama Ibu Kandung", "Nama Wali"
];

export function StudentExportDialog({ isOpen, onOpenChange, students, schoolName }: StudentExportDialogProps) {
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [isExporting, setIsExporting] = useState(false);

    const classOptions = useMemo(() => {
        const classes = new Set(students.map(s => s.class).filter(Boolean));
        return ["all", ...Array.from(classes).sort()];
    }, [students]);

    const handleExport = () => {
        setIsExporting(true);

        try {
            const studentsToExport = selectedClass === "all"
                ? students
                : students.filter(s => s.class === selectedClass);

            if (studentsToExport.length === 0) {
                toast({
                    variant: "destructive",
                    title: "Tidak ada data",
                    description: "Tidak ada siswa yang ditemukan untuk kelas yang dipilih.",
                });
                return;
            }

            const dataForSheet = studentsToExport.map((student, index) => {
                let formattedDate = "";
                if (student.dateOfBirth) {
                    const date = new Date(student.dateOfBirth);
                    if (!isNaN(date.getTime())) {
                        formattedDate = format(date, "yyyy-MM-dd");
                    }
                }
                
                return {
                    "No": index + 1,
                    "Nama Lengkap": student.name,
                    "NISN": student.nisn || '',
                    "NIK": student.nik || '',
                    "Tempat Lahir": student.birthPlace || '',
                    "Tanggal Lahir": formattedDate,
                    "Tingkat - Rombel": student.class || '',
                    "Status": student.status,
                    "Jenis Kelamin": student.gender || '',
                    "Alamat": student.address || '',
                    "No Telepon": student.phone || '',
                    "Kebutuhan Khusus": student.specialNeeds || '',
                    "Disabilitas": student.disability || '',
                    "Nomor KIP/PIP": student.kipPipNumber || '',
                    "Nama Ayah Kandung": student.fatherName || '',
                    "Nama Ibu Kandung": student.motherName || '',
                    "Nama Wali": student.guardianName || '',
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(dataForSheet, { header: EXPORT_HEADERS });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");
            
            const colWidths = EXPORT_HEADERS.map(header => ({ wch: header.length > 20 ? header.length : 20 }));
            worksheet["!cols"] = colWidths;
            
            const safeSchoolName = schoolName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const safeClassName = selectedClass === 'all' ? 'semua_kelas' : selectedClass.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `data_siswa_${safeSchoolName}_${safeClassName}.xlsx`;

            XLSX.writeFile(workbook, fileName);

            toast({
                title: "Export Berhasil",
                description: `${studentsToExport.length} data siswa telah diekspor.`,
            });
            onOpenChange(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
            toast({ variant: "destructive", title: "Export Gagal", description: errorMessage });
        } finally {
            setIsExporting(false);
        }
    };
    
    const resetState = () => {
        setSelectedClass("all");
        setIsExporting(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetState();
            }
            onOpenChange(open);
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Data Siswa</DialogTitle>
                    <DialogDescription>
                        Pilih kelas yang ingin Anda ekspor datanya ke file Excel.
                    </DialogDescription>
                </DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="class-select">Pilih Kelas</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger id="class-select" className="w-full">
                                <SelectValue placeholder="Pilih kelas..." />
                            </SelectTrigger>
                            <SelectContent>
                                {classOptions.map((className) => (
                                    <SelectItem key={className} value={className}>
                                        {className === "all" ? "Semua Kelas" : className}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>Batal</Button>
                    <Button onClick={handleExport} disabled={isExporting}>
                        {isExporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mengekspor...
                            </>
                        ) : (
                             <>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                             </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
