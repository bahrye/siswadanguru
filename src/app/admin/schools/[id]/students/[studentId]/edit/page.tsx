import { redirect } from 'next/navigation';

// Halaman ini tidak lagi digunakan dan dialihkan ke halaman utama manajemen siswa.
export default function EditStudentPage() {
    redirect('/admin/students');
}
