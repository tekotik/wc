
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Campaign } from '@/lib/mock-data';
import { createCampaignAction } from '@/app/campaigns/actions';


const packages = [
  { messages: 1000, price: 100, recommended: false },
  { messages: 5000, price: 450, recommended: true },
  { messages: 10000, price: 800, recommended: false },
];

interface PurchaseCampaignDialogProps {
  children: React.ReactNode;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export default function PurchaseCampaignDialog({ children, balance, setBalance }: PurchaseCampaignDialogProps) {
  const [selectedPackage, setSelectedPackage] = React.useState(packages[1]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [baseFile, setBaseFile] = React.useState<{ name: string; content: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setBaseFile({ name: file.name, content });
         toast({
            title: "Файл прикреплен",
            description: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };


  const handleCreateCampaign = async () => {
    if (balance < selectedPackage.price) {
        toast({
            variant: "destructive",
            title: "Недостаточно средств",
            description: `На вашем балансе ${balance} ₽, а пакет стоит ${selectedPackage.price} ₽. Пожалуйста, пополните баланс.`,
        });
        return;
    }
    
    setBalance(prev => prev - selectedPackage.price);

    const newCampaign: Campaign = {
        id: `draft_${Date.now()}`,
        name: "",
        status: "Черновик",
        text: "",
        ...(baseFile && { baseFile: baseFile })
    };

    const result = await createCampaignAction(newCampaign);

    if (result.success && result.campaign) {
      toast({
        title: "Пакет приобретен!",
        description: `С вашего баланса списано ${selectedPackage.price} ₽. Теперь заполните детали рассылки.`,
      });

      setIsOpen(false);
      setBaseFile(null); // Reset file state
      
      localStorage.setItem('pendingCampaign', JSON.stringify(result.campaign));
      router.push(`/campaigns/${result.campaign.id}/edit`);
    } else {
       toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message,
       });
       setBalance(prev => prev + selectedPackage.price);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="font-headline text-2xl text-card-foreground">Создать новую рассылку</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Создайте рассылку, напишите текст, отправьте на модерацию. После успешной модерации рассылка будет запущена, деньги спишутся с вашего баланса.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {packages.map((pkg) => (
            <div
              key={pkg.messages}
              className={cn(
                "cursor-pointer transition-all relative text-center border rounded-lg p-4 flex flex-col justify-between",
                selectedPackage.messages === pkg.messages
                  ? "border-primary ring-2 ring-primary"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Рекомендуем
                </div>
              )}
               {selectedPackage.messages === pkg.messages && (
                  <CheckCircle className="h-6 w-6 text-primary absolute top-4 right-4" />
                )}
              <div className="flex-grow flex flex-col items-center justify-center pt-4">
                 <p className="text-2xl font-bold text-card-foreground">{pkg.messages.toLocaleString()}</p>
                <p className="text-muted-foreground">сообщений</p>
              </div>
              <p className="text-2xl font-bold text-card-foreground mt-4">{pkg.price} ₽</p>
            </div>
          ))}
        </div>
        <DialogFooter className="sm:justify-between items-center mt-4">
          <Button variant="ghost" className="text-muted-foreground">Отмена</Button>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv, .txt, .json"
             />
             <Button variant="outline" onClick={handleAttachClick}>
                <Paperclip className={cn("mr-2 h-4 w-4", baseFile && "text-primary")} />
                {baseFile ? baseFile.name : "Прикрепить базу"}
            </Button>
            <Button onClick={handleCreateCampaign} className="btn-gradient">
                Создать рассылку
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
