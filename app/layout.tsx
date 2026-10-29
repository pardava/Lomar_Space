import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import AppNav from '@/components/layout/AppNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'LOMAR: AI room design with real furniture',
  description:
    'Upload a photo of your room. AI redesigns it using real furniture you can actually buy.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <AppNav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}