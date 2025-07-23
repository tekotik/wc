
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, ShieldQuestion, Download, Pencil, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";
import { updateCampaignAction } from "@/app/campaigns/actions";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface ModerationListProps {
    initialCampaigns: Campaign[];
}

export default function ModerationList({ initialCampaigns }: ModerationListProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const { toast } = useToast();

  const handleAction = async (id: string) => {
    // This will now just navigate to the edit page
    // The approve/reject logic is handled there
  };

  const getFormattedDate = (dateString?: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
      });
  }

  return (
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <ShieldQuestion className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="font-headline">Рассылки на модерацию</CardTitle>
                    <CardDescription>
                        Здесь показаны все новые рассылки от клиентов, ожидающие вашей проверки.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Дата поступления</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {campaign.userName || 'Unknown User'}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{campaign.userEmail || 'no-email@provided.com'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{getFormattedDate(campaign.submittedAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{campaign.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="link" asChild className="text-primary hover:text-primary/80">
                         <Link href={`/admin/edit/${campaign.id}`}>
                            Проверить
                         </Link>
                     </Button>
                  </TableCell>
                </TableRow>
              ))}
               {campaigns.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                         <ShieldQuestion className="mx-auto h-12 w-12" />
                         <h3 className="mt-2 text-lg font-semibold">Ожидающих рассылок нет</h3>
                         <p className="mt-1 text-sm">Все рассылки отмодерированы.</p>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
