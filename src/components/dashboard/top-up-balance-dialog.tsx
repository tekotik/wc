
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
    if (amount < 1000) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Минимальная сумма пополнения 1000 ₽.",
      });
      return;
    }
    
    // In a real app, this would trigger a payment flow.
    // For now, we'll just update the state.
    setBalance(prev => prev + amount);
    
    toast({
      title: "Баланс пополнен!",
      description: `Ваш баланс успешно пополнен на ${amount} ₽.`,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Wallet className="h-6 w-6" />
            <DialogTitle className="font-headline text-xl">Пополнение баланса</DialogTitle>
          </div>
          <DialogDescription className="text-center sm:text-left pt-2">
            Выберите или введите сумму для пополнения. Минимальная сумма — 1000 ₽.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
                <Button 
                    key={quickAmount} 
                    variant={amount === quickAmount ? "default" : "outline"}
                    onClick={() => handleAmountSelect(quickAmount)}
                    className="py-6 text-lg font-bold"
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
                className="pl-8 h-12 text-lg text-center font-bold"
                min="1000"
                step="100"
                placeholder="Или введите свою сумму"
              />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={handleTopUp}>Пополнить на {amount} ₽</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
