
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
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

export default function TopUpBalanceDialog({ children }: { children: React.ReactNode }) {
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
    // For now, we'll just show a success message.
    console.log(`Topping up balance by ${amount} ₽`);
    toast({
      title: "Баланс пополнен!",
      description: `Ваш баланс успешно пополнен на ${amount} ₽.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Пополнение баланса</DialogTitle>
          <DialogDescription>
            Введите сумму для пополнения. Минимальная сумма 1000 ₽.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Сумма
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="col-span-3"
              min="1000"
              step="100"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={handleTopUp}>Пополнить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
