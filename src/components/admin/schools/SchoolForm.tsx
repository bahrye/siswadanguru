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
  name: z.string().min(3, "School name must be at least 3 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
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
      title: school ? "School Updated" : "School Created",
      description: `The school "${values.name}" has been saved successfully.`,
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
              <FormLabel>School Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. SMA Negeri 1 Harapan Bangsa" {...field} />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Jl. Pendidikan No. 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
