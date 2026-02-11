import { EditStudentClientPage } from "@/components/admin/students/EditStudentClientPage";

export default function EditStudentPage({ params }: { params: { schoolId: string, studentId: string } }) {
    return <EditStudentClientPage schoolId={params.schoolId} studentId={params.studentId} />;
}
