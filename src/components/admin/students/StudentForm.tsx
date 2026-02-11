"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@/lib/types";
import { studentFormSchema } from "@/lib/schemas";
import { useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { addDoc, collection, doc, increment, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface StudentFormProps {
  student?: Student;
  schoolId: string;
  onFinished: () => void;
}

export function StudentForm({ student, schoolId, onFinished }: StudentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: student?.name || "",
      nisn: student?.nisn || "",
      nik: student?.nik || "",
      birthPlace: student?.birthPlace || "",
      dateOfBirth: student?.dateOfBirth ? new Date(student.dateOfBirth) : undefined,
      class: student?.class || "",
      status: student?.status || 'Aktif',
      gender: student?.gender === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
      address: student?.address || "",
      phone: student?.phone || "",
      specialNeeds: student?.specialNeeds || "",
      disability: student?.disability || "",
      kipPipNumber: student?.kipPipNumber || "",
      fatherName: student?.fatherName || "",
      motherName: student?.motherName || "",
      guardianName: student?.guardianName || "",
    },
  });

  async function onSubmit(values: z.infer<typeof studentFormSchema>) {
    setIsSubmitting(true);
    
    try {
      const studentData = {
          ...values,
          dateOfBirth: values.dateOfBirth.toISOString(),
          schoolId: schoolId,
      };

      if (student) {
        const studentRef = doc(db, 'schools', schoolId, 'students', student.id);
        await updateDoc(studentRef, studentData);
      } else {
        const schoolRef = doc(db, 'schools', schoolId);
        const studentRef = doc(collection(db, 'schools', schoolId, 'students'));
        const batch = writeBatch(db);
        batch.set(studentRef, studentData);
        batch.update(schoolRef, { studentCount: increment(1) });
        await batch.commit();
      }
      toast({
        title: student ? "Siswa Diperbarui" : "Siswa Ditambahkan",
        description: `Data siswa "${values.name}" telah berhasil disimpan.`,
      });
      onFinished();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
      toast({
        variant: "destructive",
        title: "Operasi Gagal",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
            <FormLabel>Nama Lengkap</FormLabel>
            <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
            <FormMessage />
            </FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="nisn" render={({ field }) => (
                <FormItem>
                    <FormLabel>NISN</FormLabel>
                    <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="nik" render={({ field }) => (
                <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="birthPlace" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Tanggal Lahir</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )} disabled={isSubmitting}>
                        {field.value ? (
                            format(field.value, "PPP", { locale: id })
                        ) : (
                            <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="class" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tingkat - Rombel</FormLabel>
                    <FormControl><Input placeholder="contoh: X - A" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Status</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4 pt-2"
                    disabled={isSubmitting}
                    >
                    <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="Aktif" /></FormControl>
                        <FormLabel className="font-normal">Aktif</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="Tidak Aktif" /></FormControl>
                        <FormLabel className="font-normal">Tidak Aktif</FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem className="space-y-3">
            <FormLabel>Jenis Kelamin</FormLabel>
            <FormControl>
                <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4 pt-2"
                disabled={isSubmitting}
                >
                <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Laki-laki" /></FormControl>
                    <FormLabel className="font-normal">Laki-laki</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Perempuan" /></FormControl>
                    <FormLabel className="font-normal">Perempuan</FormLabel>
                </FormItem>
                </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl><Textarea {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
                <FormLabel>No. Telepon</FormLabel>
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="specialNeeds" render={({ field }) => (
                <FormItem>
                    <FormLabel>Kebutuhan Khusus</FormLabel>
                    <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="disability" render={({ field }) => (
                <FormItem>
                    <FormLabel>Disabilitas</FormLabel>
                    <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <FormField control={form.control} name="kipPipNumber" render={({ field }) => (
            <FormItem>
                <FormLabel>Nomor KIP/PIP</FormLabel>
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="fatherName" render={({ field }) => (
            <FormItem>
                <FormLabel>Nama Ayah Kandung</FormLabel>
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="motherName" render={({ field }) => (
            <FormItem>
                <FormLabel>Nama Ibu Kandung</FormLabel>
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="guardianName" render={({ field }) => (
            <FormItem>
                <FormLabel>Nama Wali</FormLabel>
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
