
'use client';

import React, { useEffect } from 'react';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  useEffect(() => {
    // Specific styles for the landing page layout
    document.documentElement.classList.add('dark');
    document.body.classList.remove('dashboard');
    document.body.style.backgroundColor = '#111827';
    document.body.style.color = '#E5E7EB';
    
    // Cleanup function to reset styles when navigating away
    return () => {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
    }
  }, []);

  return <>{children}</>;
}
