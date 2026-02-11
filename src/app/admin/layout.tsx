"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpenCheck } from 'lucide-react';

const AdminMobileHeader = () => (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold tracking-tight">
            EduCloud
          </span>
        </div>
    </header>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
            <div className="grid grid-cols-[16rem_1fr] h-full w-full">
                <div className="p-4 space-y-4 border-r">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="p-8 space-y-4">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
       </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="min-w-0">
        <AdminMobileHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
