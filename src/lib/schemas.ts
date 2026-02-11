import { z } from 'zod';

export const schoolFormSchema = z.object({
  name: z.string().min(3, "Nama sekolah minimal harus 3 karakter."),
  address: z.string().min(5, "Alamat minimal harus 5 karakter."),
});

export const studentFormSchema = z.object({
  name: z.string().min(3, { message: "Nama lengkap minimal harus 3 karakter." }),
  nisn: z.string().optional().or(z.literal('')),
  nik: z.string().optional().or(z.literal('')),
  birthPlace: z.string().optional().or(z.literal('')),
  dateOfBirth: z.date({ invalid_type_error: "Format tanggal tidak valid." }).optional().nullable(),
  class: z.string().min(1, { message: "Tingkat - Rombel wajib diisi." }),
  status: z.enum(['Aktif', 'Tidak Aktif']),
  gender: z.enum(['Laki-laki', 'Perempuan'], {
    required_error: "Jenis kelamin wajib dipilih.",
  }),
  address: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  specialNeeds: z.string().optional().or(z.literal('')),
  disability: z.string().optional().or(z.literal('')),
  kipPipNumber: z.string().optional().or(z.literal('')),
  fatherName: z.string().optional().or(z.literal('')),
  motherName: z.string().optional().or(z.literal('')),
  guardianName: z.string().optional().or(z.literal('')),
});
