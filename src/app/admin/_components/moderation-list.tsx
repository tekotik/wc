
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

  const handleAction = async (id: number, status: 'approved' | 'rejected', comment?: string) => {
    const result = await updateRequestAction({ id, status, admin_comment: comment });

    if (result.success && result.request) {
        setRequests(requests.filter(r => r.id !== id));
        toast({
            title: "Успех!",
            description: `Заявка ${id} была ${status === 'approved' ? 'одобрена' : 'отклонена'}.`
        });
    } else {
        toast({
            variant: "destructive",
            title: "Ошибка",
            description: result.message || "Не удалось обновить заявку."
        });
    }
    setSelectedRequest(null);
    setAdminComment("");
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
                     <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                        Проверить
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

         {selectedRequest && (
            <Dialog open={!!selectedRequest} onOpenChange={() => { setSelectedRequest(null); setAdminComment(""); }}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Проверка заявки #{selectedRequest.id}</DialogTitle>
                         <DialogDescription>
                            Пользователь ID: {selectedRequest.user_id}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>{getRequestDetails(selectedRequest.description).name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Label>Текст рассылки:</Label>
                                <Textarea readOnly rows={8} value={getRequestDetails(selectedRequest.description).text} className="mt-2" />
                                <p className="text-sm mt-4">
                                   <span className="font-semibold">Прикрепленный файл:</span> {getRequestDetails(selectedRequest.description).fileName}
                                </p>
                            </CardContent>
                        </Card>
                        <div>
                            <Label htmlFor="admin_comment">Комментарий для отклонения (необязательно)</Label>
                            <Textarea 
                                id="admin_comment" 
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                                placeholder="Укажите причину, если отклоняете заявку..."
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => handleAction(selectedRequest.id, 'rejected', adminComment)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Отклонить
                        </Button>
                        <Button onClick={() => handleAction(selectedRequest.id, 'approved')}>
                           <CheckCircle2 className="mr-2 h-4 w-4" />
                           Одобрить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
         )}
      </Card>
  );
}
