import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2 mb-6">
                <BookOpenCheck className="h-10 w-10 text-primary" />
            </Link>
            <h1 className="text-3xl font-bold font-headline">Admin Login</h1>
            <p className="text-muted-foreground">
                Access your EduCloud Manager dashboard.
            </p>
        </div>
        <LoginForm />
         <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-primary"
          >
            Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
