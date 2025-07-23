
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, ShieldQuestion, Download, Pencil, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Request as RequestType } from "@/lib/request-service";
import { updateRequestAction } from "@/app/admin/actions"; // We'll create this action
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface ModerationListProps {
    initialRequests: RequestType[];
}

export default function ModerationList({ initialRequests }: ModerationListProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  const handleReject = async (id: number, comment: string) => {
    const result = await updateRequestAction({ id, status: 'rejected', admin_comment: comment });

    if (result.success && result.request) {
        setRequests(requests.filter(r => r.id !== id));
        toast({
            title: "Заявка отклонена",
            description: `Заявка ${id} была отклонена.`
        });
    } else {
        toast({
            variant: "destructive",
            title: "Ошибка",
            description: result.message || "Не удалось отклонить заявку."
        });
    }
    setSelectedRequest(null);
    setAdminComment("");
  };

  
  const getRequestDetails = (description: string) => {
      try {
        const parsed = JSON.parse(description);
        return { name: parsed.name || 'Без названия', text: parsed.text || 'Нет текста', fileName: parsed.baseFile?.name || 'Файл не прикреплен' };
      } catch(e) {
          return { name: 'Ошибка парсинга', text: description, fileName: 'Н/Д' }
      }
  }

  return (
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <ShieldQuestion className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="font-headline">Заявки на модерацию</CardTitle>
                    <CardDescription>
                        Новые заявки от клиентов, ожидающие вашей проверки.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Пользователь ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const details = getRequestDetails(request.description);
                return (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.user_id}</TableCell>
                  <TableCell>{details.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                     <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/edit/${request.id}`}>
                           <Pencil className="mr-2 h-4 w-4" />
                           Проверить
                        </Link>
                     </Button>
                  </TableCell>
                </TableRow>
              )})}
               {requests.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                         <ShieldQuestion className="mx-auto h-12 w-12" />
                         <h3 className="mt-2 text-lg font-semibold">Ожидающих заявок нет</h3>
                         <p className="mt-1 text-sm">Все заявки отмодерированы.</p>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}

