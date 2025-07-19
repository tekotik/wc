
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ElsenderLogo } from '@/components/icons';
import { User, Menu, Send } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import React from 'react';

export default function LandingHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="absolute top-0 left-0 w-full p-4 z-30 bg-transparent">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-white">
                <Send className="w-7 h-7 text-primary" />
                <span className="text-xl font-bold font-headline">L-Sender</span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
                    <Link href="#how-it-works">Как это работает</Link>
                </Button>
                 <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
                    <Link href="#pricing">Тарифы</Link>
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
                    <Link href="#features">Почему мы</Link>
                </Button>
                 <Button className="bg-primary hover:bg-primary/90 text-primary-foreground ml-4" asChild>
                    <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Войти
                    </Link>
                </Button>
            </nav>

            {/* Mobile Nav */}
            <div className="md:hidden">
                 <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-gray-900 border-gray-800 text-white">
                        <div className="flex flex-col gap-6 pt-10">
                            <Link href="/" className="flex items-center gap-2 text-white mb-4" onClick={() => setIsOpen(false)}>
                                <Send className="w-8 h-8 text-primary" />
                                <span className="text-xl font-bold font-headline">L-Sender</span>
                            </Link>
                            <Link href="#how-it-works" className="text-lg" onClick={() => setIsOpen(false)}>Как это работает</Link>
                            <Link href="#pricing" className="text-lg" onClick={() => setIsOpen(false)}>Тарифы</Link>
                            <Link href="#features" className="text-lg" onClick={() => setIsOpen(false)}>Почему мы</Link>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-6" asChild>
                                <Link href="/dashboard">
                                    <User className="mr-2 h-4 w-4" />
                                    Войти
                                </Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>
  );
}
