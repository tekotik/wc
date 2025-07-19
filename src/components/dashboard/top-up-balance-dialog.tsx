
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopUpBalanceDialogProps {
    children: React.ReactNode;
    balance: number;
    setBalance: (value: React.SetStateAction<number>) => void;
}

const quickAmounts = [1000, 3000, 5000];

export default function TopUpBalanceDialog({ children, balance, setBalance }: TopUpBalanceDialogProps) {
  const [amount, setAmount] = useState(1000);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleTopUp = () => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 1000) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Минимальная сумма пополнения 1000 ₽.",
      });
      return;
    }
    
    // In a real app, this would trigger a payment flow.
    // For now, we'll just update the state.
    setBalance(prev => prev + numericAmount);
    
    toast({
      title: "Баланс пополнен!",
      description: `Ваш баланс успешно пополнен на ${numericAmount} ₽.`,
    });
    setIsOpen(false);
    setAmount(1000); // Reset to default after top-up
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-muted-foreground" />
            <DialogTitle className="font-headline text-xl text-card-foreground">Пополнение баланса</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2 text-muted-foreground">
            Выберите или введите сумму для пополнения. Минимальная сумма — 1000 ₽.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
                <Button 
                    key={quickAmount} 
                    variant={amount === quickAmount ? "default" : "secondary"}
                    onClick={() => handleAmountSelect(quickAmount)}
                    className={cn(
                        "py-3 text-base font-bold h-auto",
                         amount === quickAmount 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                >
                    {quickAmount} ₽
                </Button>
            ))}
          </div>
          <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₽</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-8 h-12 text-base text-center text-card-foreground"
                min="1000"
                step="100"
                placeholder="1000"
              />
          </div>
        </div>
        <DialogFooter className="flex-col !space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
           <DialogClose asChild>
                <Button variant="ghost">Отмена</Button>
            </DialogClose>
           <Button onClick={handleTopUp} disabled={amount < 1000}>Пополнить на {amount} ₽</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
