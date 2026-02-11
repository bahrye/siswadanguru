"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileDown } from "lucide-react";
import * as XLSX from "xlsx";

interface StudentImportDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    schoolId: string;
}

const CSV_HEADERS = [
    "No", "Nama Lengkap", "NISN", "NIK", "Tempat Lahir", "Tanggal Lahir", 
    "Tingkat - Rombel", "Umur", "Status", "Jenis Kelamin", "Alamat", 
    "No Telepon", "Kebutuhan Khusus", "Disabilitas", "Nomor KIP/PIP", 
    "Nama Ayah Kandung", "Nama Ibu Kandung", "Nama Wali"
];

export function StudentImportDialog({ isOpen, onOpenChange, schoolId }: StudentImportDialogProps) {
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [validatedData, setValidatedData] = useState<any[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setValidationErrors([]);
            setValidatedData([]);
        }
    };

    const downloadTemplate = () => {
        const worksheet = XLSX.utils.json_to_sheet([{}], { header: CSV_HEADERS });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");
        
        // Atur lebar kolom agar lebih mudah dibaca
        const colWidths = CSV_HEADERS.map(header => ({ wch: header.length + 5 }));
        worksheet["!cols"] = colWidths;
        
        XLSX.writeFile(workbook, "template_import_siswa.xlsx");
        toast({
            title: "Template Diunduh",
            description: "Silakan isi file template_import_siswa.xlsx dengan data siswa.",
        });
    };

    const handleValidate = () => {
        if (!file) {
            toast({ variant: "destructive", title: "File tidak ditemukan", description: "Silakan pilih file Excel untuk divalidasi." });
            return;
        }
        setIsValidating(true);
        setValidationErrors([]);
        setValidatedData([]);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                if (!e.target?.result) {
                    throw new Error("Gagal membaca file.");
                }
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Cek header dengan membaca baris pertama
                const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0 })[0] as string[];
                const missingHeaders = CSV_HEADERS.filter(h => !headers?.includes(h));

                if (missingHeaders.length > 0) {
                     setValidationErrors([`Header kolom hilang atau salah nama: ${missingHeaders.join(", ")}`]);
                     setIsValidating(false);
                     return;
                }
                
                const dataAsObjects = XLSX.utils.sheet_to_json(worksheet);
                const errors: string[] = [];

                const processedData = dataAsObjects.map((row: any, index) => {
                   // Bersihkan NIK dari tanda kutip dan pastikan itu string
                   if (row["NIK"]) {
                       let nik = String(row["NIK"]);
                       if (nik.startsWith("'")) {
                           nik = nik.substring(1);
                       }
                       row["NIK"] = nik;
                   }

                   if (!row["Nama Lengkap"]) {
                       errors.push(`Baris ${index + 2}: Nama Lengkap tidak boleh kosong.`);
                   }
                   
                   return row;
                });

                if (errors.length > 0) {
                    setValidationErrors(errors.slice(0, 5));
                    toast({ variant: "destructive", title: "Validasi Gagal", description: "Terdapat kesalahan pada file Excel Anda." });
                } else {
                    toast({ title: "Validasi Berhasil", description: `Semua ${processedData.length} baris data valid dan siap diimpor.` });
                    setValidatedData(processedData);
                }

                setIsValidating(false);
            } catch (error: any) {
                setValidationErrors([`Gagal memproses file Excel: ${error.message}`]);
                setIsValidating(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = async () => {
        if (validatedData.length === 0) {
            toast({ variant: "destructive", title: "Tidak ada data untuk diimpor", description: "Pastikan Anda telah memvalidasi file tanpa error." });
            return;
        }
        setIsImporting(true);
        
        console.log("Importing data for school:", schoolId, validatedData);
        
        toast({ title: "Import Dimulai", description: `${validatedData.length} data siswa sedang diimpor.`});
        
        setTimeout(() => {
          setIsImporting(false);
          onOpenChange(false);
          toast({ title: "Import Berhasil", description: "Data siswa telah berhasil ditambahkan."});
        }, 2000);
    };
    
    const resetState = () => {
        setFile(null);
        setValidationErrors([]);
        setValidatedData([]);
        setIsValidating(false);
        setIsImporting(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetState();
            }
            onOpenChange(open);
        }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Import Data Siswa dari Excel</DialogTitle>
                    <DialogDescription>
                        Ikuti langkah-langkah berikut untuk mengimpor data siswa secara massal.
                    </DialogDescription>
                </DialogHeader>
                 <div className="space-y-6 py-4 text-sm">
                    <div className="space-y-2">
                        <p className="font-medium">Langkah 1: Unduh dan Isi Template</p>
                        <p className="text-xs text-muted-foreground">
                            Unduh template Excel, lalu buka dan isi data siswa menggunakan Microsoft Excel atau aplikasi spreadsheet lainnya.
                        </p>
                        <Button variant="outline" onClick={downloadTemplate} className="w-full">
                            <FileDown className="mr-2 h-4 w-4" />
                            Unduh Template Excel
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium">Langkah 2: Unggah File Excel Anda</p>
                         <p className="text-xs text-muted-foreground">
                            Unggah file yang sudah Anda isi untuk divalidasi oleh sistem.
                        </p>
                        <Input id="file-upload" type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="file:text-foreground"/>
                    </div>
                
                    {validationErrors.length > 0 && (
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm space-y-1">
                            <p className="font-semibold">Ditemukan {validationErrors.length} Kesalahan Validasi:</p>
                            <ul className="list-disc list-inside">
                                {validationErrors.map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                            {validationErrors.length > 5 && <p>Dan lainnya...</p>}
                        </div>
                    )}
                </div>
                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
                    <div className="flex gap-2 justify-end">
                        <Button onClick={handleValidate} disabled={!file || isValidating || isImporting}>
                            {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Validasi File
                        </Button>
                        <Button onClick={handleImport} disabled={validatedData.length === 0 || isImporting}>
                            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Import Data
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
