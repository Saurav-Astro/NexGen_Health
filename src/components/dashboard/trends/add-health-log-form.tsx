'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Loader2, PlusCircle } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';

const formSchema = z.object({
  logDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  heartRate: z.coerce.number().optional(),
  bloodPressure: z.string().optional(),
  weight: z.coerce.number().optional(),
});

export function AddHealthLogForm() {
  const { toast } = useToast();
  const { user, firestore } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logDate: new Date().toISOString().split('T')[0],
      heartRate: '' as any,
      bloodPressure: '',
      weight: '' as any,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'You must be logged in to add a health log.',
        });
        return;
    }

    try {
      await addDoc(collection(firestore, `users/${user.uid}/healthLogs`), {
        ...values,
        heartRate: values.heartRate || null,
        weight: values.weight || null,
        bloodPressure: values.bloodPressure || '',
        logDate: Timestamp.fromDate(new Date(values.logDate)),
        userId: user.uid,
        symptoms: '', // Add default empty value
      });
      toast({
        title: 'Health Log Added',
        description: 'Your new health data has been saved.',
      });
      form.reset({
        logDate: new Date().toISOString().split('T')[0],
        heartRate: '' as any,
        bloodPressure: '',
        weight: '' as any,
      });
    } catch (error: any) {
      console.error('Error adding health log:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save health log. Please try again.',
      });
    }
  }

  return (
    <GlassCard className="p-6">
       <h2 className="text-2xl font-bold text-foreground mb-4">Add New Health Log</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <FormField
            control={form.control}
            name="logDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="heartRate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Heart Rate (bpm)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="70" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="bloodPressure"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Blood Pressure</FormLabel>
                <FormControl>
                    <Input placeholder="120/80" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                    <Input type="number" step="0.1" placeholder="70.0" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Add Log
            </Button>
        </form>
        </Form>
    </GlassCard>
  );
}
