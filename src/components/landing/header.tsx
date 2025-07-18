
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WappSenderProLogo } from '@/components/icons';
import { User } from 'lucide-react';

export default function LandingHeader() {
  return (
    <header className="absolute top-0 left-0 w-full p-4 z-30 bg-transparent">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-primary-foreground">
                <WappSenderProLogo className="w-8 h-8" />
                <span className="text-xl font-bold font-headline">WappSender Pro</span>
            </Link>
            <nav className="flex items-center gap-4">
                <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" asChild>
                    <Link href="#features">Возможности</Link>
                </Button>
                 <Button variant="secondary" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                    <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Войти
                    </Link>
                </Button>
            </nav>
        </div>
    </header>
  );
}
