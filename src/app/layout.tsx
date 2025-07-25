
'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import React from 'react';
import { AuthProvider } from '@/providers/auth-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // We identify dashboard pages if they are NOT the root landing page or other public pages.
  const isDashboardPage = pathname !== '/' && !pathname.startsWith('/login') && !pathname.startsWith('/signup') && !pathname.startsWith('/c/');

  React.useEffect(() => {
    // This logic now correctly assumes that the (landing) layout will handle its own styling.
    // We only add 'dashboard' class for non-landing pages.
    if (isDashboardPage) {
      document.body.classList.add('dashboard');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.remove('dashboard');
    }
  }, [isDashboardPage]);


  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <title>Elsender — Профессиональные WhatsApp рассылки</title>
        <meta name="description" content="L-Sender — это мощная платформа для автоматизации маркетинга в WhatsApp. Генерируйте тексты с помощью ИИ, управляйте контактами и анализируйте результаты." />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('antialiased')}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
