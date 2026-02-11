import { SchoolDetailClientPage } from "@/components/admin/schools/SchoolDetailClientPage";

export default function SchoolDetailPage({ params }: { params: { id: string } }) {
    return <SchoolDetailClientPage schoolId={params.id} />;
}
