
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  collection
} from 'firebase/firestore';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Loader2, Bell, Clock } from 'lucide-react';
import { GlassCard } from '../glass-card';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase/provider';
import { cn } from '@/lib/utils';
import { addHours, format, differenceInSeconds } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  frequency: z.coerce.number().min(1, 'Frequency must be at least 1 hour.'),
  lastTaken: z.string().optional(),
});

type Prescription = z.infer<typeof formSchema> & { 
  id: string;
  lastTaken?: Timestamp;
};

const CountdownTimer = ({ lastTaken, frequency }: { lastTaken: Timestamp, frequency: number }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isDue, setIsDue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
    }
  }, []);

  useEffect(() => {
    const nextDoseTime = addHours(lastTaken.toDate(), frequency);
    
    const interval = setInterval(() => {
      const now = new Date();
      const diffSeconds = differenceInSeconds(nextDoseTime, now);

      if (diffSeconds <= 0) {
        if (!isDue) {
            setIsDue(true);
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
        }
        setTimeLeft('00:00:00');
        clearInterval(interval);
      } else {
        setIsDue(false);
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;
        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastTaken, frequency, isDue]);

  if (isDue) {
    return (
      <span className="flex items-center gap-2 text-destructive font-bold animate-pulse">
        <Bell className="h-4 w-4" />
        Take Now
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2 font-mono">
      <Clock className="h-4 w-4 text-primary" />
      {timeLeft}
    </span>
  );
};

export function PrescriptionManager() {
  const { user, firestore, prescriptions, loading } = useFirebase();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', dosage: '', frequency: 8, lastTaken: '' },
  });

  const handleDialogOpen = (prescription: Prescription | null = null) => {
    setEditingPrescription(prescription);
    if (prescription) {
        const lastTakenTime = prescription.lastTaken ? format(prescription.lastTaken.toDate(), 'HH:mm') : '';
        form.reset({...prescription, lastTaken: lastTakenTime });
    } else {
      form.reset({ name: '', dosage: '', frequency: 8, lastTaken: '' });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) return;

    try {
        const { name, dosage, frequency, lastTaken } = values;
        
        let lastTakenTimestamp: Timestamp | null = null;
        if (lastTaken) {
            const [hours, minutes] = lastTaken.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            lastTakenTimestamp = Timestamp.fromDate(date);
        }

        const dataToSave = {
            name,
            dosage,
            frequency,
            lastTaken: lastTakenTimestamp,
            userId: user.uid,
        };

        if (editingPrescription) {
            const docRef = doc(firestore, 'prescriptions', editingPrescription.id);
            await updateDoc(docRef, dataToSave);
            toast({ title: 'Success', description: 'Prescription updated.' });
        } else {
            await addDoc(collection(firestore, 'prescriptions'), dataToSave);
            toast({ title: 'Success', description: 'Prescription added.' });
        }
        setIsDialogOpen(false);
    } catch (error) {
        console.error(error);
        toast({variant: 'destructive', title: 'Error', description: 'Could not save prescription.'});
    }
  };

  const handleDelete = async (id: string) => {
    if(!firestore) return;
    if(!confirm('Are you sure you want to delete this prescription?')) return;
    try {
        await deleteDoc(doc(firestore, 'prescriptions', id));
        toast({ title: 'Success', description: 'Prescription deleted.' });
    } catch(error) {
        toast({variant: 'destructive', title: 'Error', description: 'Could not delete prescription.'});
    }
  };

  const handleTakeNow = async (prescription: Prescription) => {
    if (!firestore) return;
    try {
        const docRef = doc(firestore, 'prescriptions', prescription.id);
        await updateDoc(docRef, {
            lastTaken: Timestamp.now()
        });
        toast({ title: 'Dose Recorded', description: `Recorded ${prescription.name} as taken.`})
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not record dose.'})
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Your Medications</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogOpen()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPrescription ? 'Edit' : 'Add'} Prescription</DialogTitle>
              <DialogDescription>
                Fill in the details of your medication below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Medication Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dosage" render={({ field }) => (
                    <FormItem><FormLabel>Dosage (e.g., 500mg)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="frequency" render={({ field }) => (
                    <FormItem><FormLabel>Frequency (in hours)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="lastTaken" render={({ field }) => (
                    <FormItem><FormLabel>Last Taken Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency (hrs)</TableHead>
              <TableHead>Last Taken</TableHead>
              <TableHead>Next Dose In</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
            ) : prescriptions.length > 0 ? (
              prescriptions.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.dosage}</TableCell>
                  <TableCell>{p.frequency}</TableCell>
                  <TableCell>
                    {p.lastTaken ? format(p.lastTaken.toDate(), 'p') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {p.lastTaken ? <CountdownTimer lastTaken={p.lastTaken} frequency={p.frequency} /> : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleTakeNow(p as Prescription)}>
                        Take Now
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDialogOpen(p as Prescription)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center">No prescriptions added yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  );
}
