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
import { schoolFormSchema, createSchool, updateSchool } from "@/app/admin/schools/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";


interface SchoolFormProps {
  school?: School;
  onFinished: () => void;
}

export function SchoolForm({ school, onFinished }: SchoolFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: school?.name || "",
      address: school?.address || "",
    },
  });

  async function onSubmit(values: z.infer<typeof schoolFormSchema>) {
    setIsSubmitting(true);
    
    const result = school 
      ? await updateSchool(school.id, values) 
      : await createSchool(values);

    if (result.success) {
      toast({
        title: school ? "Sekolah Diperbarui" : "Sekolah Dibuat",
        description: `Sekolah "${values.name}" telah berhasil disimpan.`,
      });
      onFinished();
    } else {
      toast({
        variant: "destructive",
        title: "Operasi Gagal",
        description: result.message,
      });
    }

    setIsSubmitting(false);
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
                <Input placeholder="contoh: SMA Negeri 1 Harapan Bangsa" {...field} disabled={isSubmitting} />
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
                <Input placeholder="contoh: Jl. Pendidikan No. 1" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
