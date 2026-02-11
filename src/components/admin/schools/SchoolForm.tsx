"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { School } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(3, "Nama sekolah minimal harus 3 karakter."),
  address: z.string().min(5, "Alamat minimal harus 5 karakter."),
});

interface SchoolFormProps {
  school?: School;
  onFinished: () => void;
}

export function SchoolForm({ school, onFinished }: SchoolFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: school?.name || "",
      address: school?.address || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would call a server action here to save the data.
    console.log(values);
    
    toast({
      title: school ? "Sekolah Diperbarui" : "Sekolah Dibuat",
      description: `Sekolah "${values.name}" telah berhasil disimpan.`,
    });
    
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah</FormLabel>
              <FormControl>
                <Input placeholder="contoh: SMA Negeri 1 Harapan Bangsa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input placeholder="contoh: Jl. Pendidikan No. 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
