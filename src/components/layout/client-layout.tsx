'use client';
import { usePathname } from 'next/navigation';
import { Header2 as Header } from '@/components/ui/header-2';
import { Footer } from '@/components/footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <div className="relative flex min-h-dvh flex-col">
      {!isDashboard && <Header />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  );
}
