'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Menu } from 'lucide-react';
import { useUser } from '@/firebase/provider';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <div className="hidden md:block">
          <Sidebar collapsible="icon" className="border-r border-white/10">
            <DashboardSidebar />
          </Sidebar>
        </div>
        
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:justify-end">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <DashboardSidebar isMobile onLinkClick={() => setMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>
            
            <div className="md:hidden">
              <Logo />
            </div>

            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
