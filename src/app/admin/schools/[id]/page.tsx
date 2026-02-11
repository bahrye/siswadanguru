import { redirect } from 'next/navigation';

// Halaman ini tidak lagi digunakan dan dialihkan ke halaman utama manajemen sekolah.
export default function SchoolDetailPage() {
    redirect('/admin/schools');
}
