
import React from 'react';
import { getLogs } from '@/lib/log-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
    const logs = await getLogs();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle className="font-headline">Логи взаимодействия с БД</CardTitle>
                            <CardDescription>
                                Здесь отображаются все операции чтения и записи пользователей.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh] border rounded-md">
                        <Table>
                            <TableHeader className="sticky top-0 bg-secondary">
                                <TableRow>
                                    <TableHead className="w-[200px]">Время</TableHead>
                                    <TableHead className="w-[150px]">Действие</TableHead>
                                    <TableHead>Детали</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-mono text-xs">{new Date(log.timestamp).toLocaleString('ru-RU')}</TableCell>
                                        <TableCell className="font-medium">{log.action}</TableCell>
                                        <TableCell className="text-muted-foreground">{log.details}</TableCell>
                                    </TableRow>
                                ))}
                                 {logs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                            Логов пока нет.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                     <div className="text-center mt-4">
                        <Button variant="link" asChild>
                            <Link href="/signup">
                                Назад к регистрации
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
