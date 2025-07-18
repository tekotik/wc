
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Campaign } from '@/lib/mock-data';
import { mockCampaigns } from '@/lib/mock-data';

const packages = [
  { messages: 1000, price: 100, recommended: false },
  { messages: 5000, price: 450, recommended: true },
  { messages: 10000, price: 800, recommended: false },
];

interface PurchaseCampaignDialogProps {
  children: React.ReactNode;
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export default function PurchaseCampaignDialog({ children, setCampaigns, balance, setBalance }: PurchaseCampaignDialogProps) {
  const [selectedPackage, setSelectedPackage] = React.useState(packages[1]);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateCampaign = () => {
    if (balance < selectedPackage.price) {
        toast({
            variant: "destructive",
            title: "Недостаточно средств",
            description: `На вашем балансе ${balance} ₽, а пакет стоит ${selectedPackage.price} ₽. Пожалуйста, пополните баланс.`,
        });
        return;
    }
    
    // Deduct balance
    setBalance(prev => prev - selectedPackage.price);

    // Create a new campaign draft
    const newCampaign: Campaign = {
        id: `draft_${Date.now()}`,
        name: `Новая рассылка на ${selectedPackage.messages} сообщений`,
        status: "Черновик",
        text: "",
    };

    // This is a mock of updating global state.
    // In a real app, you would use a state manager or API call.
    mockCampaigns.unshift(newCampaign); // Add to the beginning of the array
    if (setCampaigns) {
        setCampaigns(prev => [newCampaign, ...prev]);
    }
    
    toast({
      title: "Пакет приобретен!",
      description: `С вашего баланса списано ${selectedPackage.price} ₽. Теперь заполните детали рассылки.`,
    });

    setIsOpen(false);
    
    // Redirect to the new campaign's edit page
    router.push(`/campaigns/${newCampaign.id}/edit`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Создать новую рассылку</DialogTitle>
          <DialogDescription>
            Создайте рассылку, напишите текст, отправьте на модерацию. После успешной модерации рассылка будет запущена, деньги спишутся с вашего баланса.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {packages.map((pkg) => (
            <Card
              key={pkg.messages}
              className={cn(
                "cursor-pointer transition-all relative",
                selectedPackage.messages === pkg.messages
                  ? "border-primary ring-2 ring-primary"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  Рекомендуем
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-xl">{pkg.messages.toLocaleString()}</CardTitle>
                <CardDescription>сообщений</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{pkg.price} ₽</p>
                {selectedPackage.messages === pkg.messages && (
                  <CheckCircle className="h-6 w-6 text-primary absolute top-4 right-4" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={handleCreateCampaign}>
            Создать рассылку
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
