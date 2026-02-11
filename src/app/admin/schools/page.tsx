import { SchoolClientPage } from "@/components/admin/schools/SchoolClientPage";
import { mockSchools } from "@/lib/mock-data";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// In a real application, you would fetch this data from Firestore
async function getSchools() {
  return mockSchools;
}

export default async function SchoolsPage() {
  const schools = await getSchools();

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Manajemen Sekolah</h2>
            <p className="text-muted-foreground">
                Lihat, tambah, edit, dan hapus data sekolah.
            </p>
        </div>
      </div>
      <SchoolClientPage data={schools} />
    </div>
  );
}
