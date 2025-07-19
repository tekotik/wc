
'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = !pathname.startsWith('/login') && pathname !== '/';

  React.useEffect(() => {
    if (isDashboard) {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('dashboard');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('dashboard');
       if (pathname === '/') {
        document.body.style.backgroundColor = '#111827';
        document.body.style.color = '#E5E7EB';
       } else {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
       }
    }
  }, [pathname, isDashboard]);


  return (
    <html lang="ru" className={isDashboard ? '' : 'dark'} suppressHydrationWarning>
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
      <body className={cn('antialiased', isDashboard ? 'dashboard' : 'bg-gray-900 text-gray-200')}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

    