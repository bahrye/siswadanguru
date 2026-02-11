import { z } from 'zod';

export const schoolFormSchema = z.object({
  name: z.string().min(3, "Nama sekolah minimal harus 3 karakter."),
  address: z.string().min(5, "Alamat minimal harus 5 karakter."),
});
