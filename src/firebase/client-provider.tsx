'use client';
import { ReactNode } from 'react';
import { FirebaseProvider } from './provider';

let appInitialized = false;

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  if (typeof window !== 'undefined' && !appInitialized) {
    appInitialized = true;
  }

  return <FirebaseProvider>{children}</FirebaseProvider>;
}
