'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { schoolFormSchema } from '@/lib/schemas';

// Fungsi-fungsi ini sengaja dikosongkan karena logikanya telah dipindahkan
// ke komponen sisi klien untuk menangani autentikasi Firebase dengan benar.
// Server Actions tidak membawa konteks auth klien secara default, menyebabkan
// error 'permission-denied' di Firestore.

export async function createSchool(values: z.infer<typeof schoolFormSchema>) {
  // Logika dipindahkan ke SchoolForm.tsx
  return { success: false, message: 'Fungsi ini tidak lagi digunakan.' };
}

export async function updateSchool(id: string, values: z.infer<typeof schoolFormSchema>) {
  // Logika dipindahkan ke SchoolForm.tsx
   return { success: false, message: 'Fungsi ini tidak lagi digunakan.' };
}

export async function deleteSchool(id: string) {
  // Logika dipindahkan ke SchoolActions.tsx
  return { success: false, message: 'Fungsi ini tidak lagi digunakan.' };
}
