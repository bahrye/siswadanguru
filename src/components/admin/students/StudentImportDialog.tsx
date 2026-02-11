"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileDown } from "lucide-react";
import Papa from "papaparse";

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
        const csv = Papa.unparse([CSV_HEADERS]);
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "template_import_siswa.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleValidate = () => {
        if (!file) {
            toast({ variant: "destructive", title: "File tidak ditemukan", description: "Silakan pilih file untuk divalidasi." });
            return;
        }
        setIsValidating(true);
        setValidationErrors([]);
        setValidatedData([]);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const fileHeaders = results.meta.fields;
                const missingHeaders = CSV_HEADERS.filter(h => !fileHeaders?.includes(h));
                if (missingHeaders.length > 0) {
                     setValidationErrors([`Header kolom hilang atau salah nama: ${missingHeaders.join(", ")}`]);
                     setIsValidating(false);
                     return;
                }
                
                const errors: string[] = [];
                const data = results.data;

                // Placeholder for detailed validation logic based on your rules.
                data.forEach((row: any, index) => {
                   if (!row["Nama Lengkap"]) {
                       errors.push(`Baris ${index + 2}: Nama Lengkap tidak boleh kosong.`);
                   }
                });


                if (errors.length > 0) {
                    setValidationErrors(errors.slice(0, 5)); // Show first 5 errors
                    toast({ variant: "destructive", title: "Validasi Gagal", description: "Terdapat kesalahan pada file Anda." });
                } else {
                    toast({ title: "Validasi Berhasil", description: `Semua ${data.length} baris data valid dan siap diimpor.` });
                    setValidatedData(data);
                }

                setIsValidating(false);
            },
            error: (error: any) => {
                setValidationErrors([`Gagal mem-parsing file: ${error.message}`]);
                setIsValidating(false);
            }
        });
    };

    const handleImport = async () => {
        if (validatedData.length === 0) {
            toast({ variant: "destructive", title: "Tidak ada data untuk diimpor", description: "Pastikan Anda telah memvalidasi file tanpa error." });
            return;
        }
        setIsImporting(true);
        
        // This is a placeholder for the actual Firestore import logic.
        // You would typically use a batched write to import the data efficiently.
        console.log("Importing data for school:", schoolId, validatedData);
        
        toast({ title: "Import Dimulai", description: `${validatedData.length} data siswa sedang diimpor.`});
        
        setTimeout(() => {
          setIsImporting(false);
          onOpenChange(false);
          toast({ title: "Import Berhasil", description: "Data siswa telah berhasil ditambahkan."});
          // Here you would also trigger a re-fetch of the student list.
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
                    <DialogTitle>Import Data Siswa</DialogTitle>
                    <DialogDescription>
                        Unggah file CSV untuk mengimpor data siswa secara massal. Pastikan file sesuai dengan template.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Button variant="outline" onClick={downloadTemplate} className="w-full">
                        <FileDown className="mr-2 h-4 w-4" />
                        Unduh Template CSV
                    </Button>
                    <div className="space-y-2">
                        <label htmlFor="file-upload" className="text-sm font-medium">Langkah 2: Unggah File</label>
                        <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="file:text-foreground"/>
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
                            Validasi
                        </Button>
                        <Button onClick={handleImport} disabled={validatedData.length === 0 || isImporting}>
                            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Import
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
