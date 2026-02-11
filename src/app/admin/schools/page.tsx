import { SchoolClientPage } from "@/components/admin/schools/SchoolClientPage";

export default function SchoolsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline md:text-3xl">Manajemen Sekolah</h2>
            <p className="text-muted-foreground">
                Lihat, tambah, edit, dan hapus data sekolah.
            </p>
        </div>
      </div>
      <SchoolClientPage />
    </div>
  );
}
