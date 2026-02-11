'use server';

import { z } from 'zod';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { schoolFormSchema } from '@/lib/schemas';

export async function createSchool(values: z.infer<typeof schoolFormSchema>) {
  try {
    await addDoc(collection(db, 'schools'), {
      ...values,
      studentCount: 0,
      teacherCount: 0,
    });
    revalidatePath('/admin/schools');
    return { success: true, message: 'Sekolah berhasil dibuat.' };
  } catch (error) {
    return { success: false, message: 'Gagal membuat sekolah.' };
  }
}

export async function updateSchool(id: string, values: z.infer<typeof schoolFormSchema>) {
   try {
    const schoolRef = doc(db, 'schools', id);
    await updateDoc(schoolRef, values);
    revalidatePath('/admin/schools');
    revalidatePath(`/admin/schools/${id}`);
    return { success: true, message: 'Sekolah berhasil diperbarui.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui sekolah.' };
  }
}

export async function deleteSchool(id: string) {
  try {
    await deleteDoc(doc(db, 'schools', id));
    revalidatePath('/admin/schools');
    return { success: true, message: 'Sekolah berhasil dihapus.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus sekolah.' };
  }
}
