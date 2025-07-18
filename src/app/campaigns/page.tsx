"use client";

import React, { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import { WappSenderProLogo } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, FileText, X } from "lucide-react";

interface Message {
  id: number;
  text: string;
}

export default function CampaignsPage() {
  const [message, setMessage] = useState("");
  const [submittedMessages, setSubmittedMessages] = useState<Message[]>([]);
  const [nextId, setNextId] = useState(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setSubmittedMessages(prevMessages => [{ id: nextId, text: message }, ...prevMessages]);
      setNextId(prevId => prevId + 1);
      setMessage("");
    }
  };

  const handleRemoveMessage = (id: number) => {
    setSubmittedMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-center">
            <WappSenderProLogo className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">
              WappSender Pro
            </h1>
          </div>
        </SidebarHeader>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Создать рассылку</CardTitle>
              <CardDescription>
                Напишите текст вашей рассылки и отправьте его на модерацию.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid w-full gap-2">
                  <Label htmlFor="message">Текст рассылки</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Введите текст вашей рассылки здесь..." 
                    rows={10} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Отправить на модерацию
                </Button>
              </CardFooter>
            </form>
          </Card>

          {submittedMessages.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-xl font-bold font-headline">Отправленные сообщения</h3>
                <div className="relative">
                    {submittedMessages.map((msg, index) => (
                        <Card 
                            key={msg.id} 
                            className="relative mb-[-100px] transform transition-all duration-300 ease-out hover:-translate-y-2"
                            style={{ 
                                zIndex: submittedMessages.length - index,
                                transform: `translateY(${index * -100}px) scale(${1 - index * 0.05})`,
                                opacity: 1 - index * 0.1,
                             }}
                        >
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg font-headline">Сообщение #{msg.id}</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveMessage(msg.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-card-foreground">{msg.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
