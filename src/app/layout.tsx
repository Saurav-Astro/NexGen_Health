
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ClientLayout } from '@/components/layout/client-layout';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-headline',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NexGen Health - Empowering Smarter, Connected Health Management',
  description: 'NexGen Health is a futuristic platform for proactive and intelligent health management. Featuring an AI Chatbot, Prescription Tracking, Health Trend Analysis, and more.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark">
      <body 
        className={cn(
          "min-h-screen font-body antialiased",
          fontInter.variable,
          fontPoppins.variable
        )}
      >
        <FirebaseClientProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
