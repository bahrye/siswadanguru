import Image from "next/image";
import Header from "@/components/Header";
import { SchoolList } from "@/components/SchoolList";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-80">
            <Image
                src="https://picsum.photos/seed/hero/1200/800"
                alt="Hero Image"
                fill
                className="object-cover"
                priority
                data-ai-hint="classroom technology"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-black/30" />
            <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center text-primary-foreground">
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Selamat Datang di Manajer EduCloud</h1>
                <p className="mt-4 max-w-2xl text-base sm:text-lg text-primary-foreground/80">
                    Solusi terpusat untuk mengelola data sekolah, siswa, dan guru di berbagai institusi.
                </p>
            </div>
        </section>

        <SchoolList />

      </main>
      <footer className="py-6 border-t">
          <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Manajer EduCloud. Hak cipta dilindungi undang-undang.
          </div>
      </footer>
    </div>
  );
}
