
'use client';

import React from 'react';
import Link from 'next/link';
import { 
    ArrowRight, 
    UploadCloud, 
    FileText, 
    CalendarClock, 
    UserCheck, 
    Info,
    BadgePercent, 
    XCircle, 
    CheckCircle2,
    Send
} from 'lucide-react';
import { ElsenderLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/80 transform transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
        <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{children}</p>
    </div>
);

const StepCard = ({ number, icon, title, children }: { number: string, icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="relative bg-gray-800/50 p-6 rounded-2xl border border-gray-700/80">
        <div className="absolute -top-5 -left-5 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-full text-xl font-bold border-4 border-gray-900">
            {number}
        </div>
        <div className="mt-8 flex items-center gap-3 mb-3">
             {icon}
             <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
    </div>
);

export default function LandingPageV2() {
  return (
    <div className="antialiased bg-gray-900 text-gray-200 font-body">
        <header className="py-6 container mx-auto px-6 flex justify-between items-center">
             <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2 font-headline">
                <Send className="w-7 h-7 text-primary" />
                L-Sender
            </Link>
            <Button asChild>
                <Link href="/dashboard">
                    Войти
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </header>

        <main className="container mx-auto px-6">
            {/* --- Welcome Section --- */}
            <section className="text-center py-20 md:py-32">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 font-headline">
                    Добро пожаловать в <span className="text-primary">L-Sender</span>
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
                   L-Sender — это сервис для запуска эффективных и простых WhatsApp-рассылок без лишней сложности и технических препятствий. Всё, что нужно — загрузить базу, отправить текст и выбрать время. Мы берём на себя остальное.
                </p>
                <Button size="lg" asChild>
                    <Link href="/dashboard">
                        Начать рассылку <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </section>
            
            {/* --- How it works --- */}
            <section id="how-it-works" className="py-20">
                 <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 font-headline">Как это работает</h2>
                 <div className="grid md:grid-cols-3 gap-8">
                    <StepCard number="1" icon={<UploadCloud className="h-6 w-6 text-primary" />} title="Загрузите базу номеров">
                        Мы бесплатно проверим её на наличие аккаунтов WhatsApp, чтобы исключить "пустые" отправки.
                    </StepCard>
                     <StepCard number="2" icon={<FileText className="h-6 w-6 text-primary" />} title="Отправьте текст сообщения">
                        Можно обычный или уже рандомизированный.
                    </StepCard>
                     <StepCard number="3" icon={<CalendarClock className="h-6 w-6 text-primary" />} title="Укажите дату и время">
                        Выберите желаемую дату и время отправки вашей рассылки.
                    </StepCard>
                 </div>
            </section>

             {/* --- Moderation & Important Note --- */}
            <section className="py-20 grid md:grid-cols-2 gap-8 items-start">
                <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/80">
                     <div className="flex items-center gap-3 mb-4">
                        <UserCheck className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-bold text-white font-headline">Проверка модератором</h3>
                     </div>
                    <p className="text-gray-300 mb-4">Затем ваш текст попадает на проверку:</p>
                    <ul className="space-y-3 text-gray-400">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <span>Если текст не рандомизирован, мы сделаем это за вас и отправим готовый вариант на согласование.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <span>Если выбранное время недоступно, модератор предложит альтернативные слоты — ближайшие возможные даты и часы.</span>
                        </li>
                    </ul>
                </div>
                 <div className="bg-primary/10 p-8 rounded-2xl border border-primary/50">
                     <div className="flex items-center gap-3 mb-4">
                        <Info className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-bold text-white font-headline">Важно</h3>
                     </div>
                    <p className="text-gray-200 font-medium text-lg">
                        Только после того, как вы одобрите финальный текст рассылки и согласуете время, с вашего баланса будет списана сумма, и рассылка будет запланирована.
                    </p>
                </div>
            </section>


            {/* --- Pricing --- */}
            <section id="pricing" className="py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 font-headline">Стоимость рассылки</h2>
                <p className="text-gray-400 text-center mb-12">Минимальный объём — 300 сообщений.</p>
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-6 rounded-lg text-center">
                        <p className="text-gray-300">300–500 сообщений</p>
                        <p className="text-4xl font-bold text-white my-2">9 <span className="text-2xl text-gray-400">₽</span></p>
                        <p className="text-gray-400">за сообщение</p>
                    </div>
                     <div className="bg-primary/20 border-2 border-primary p-6 rounded-lg text-center shadow-lg shadow-primary/20">
                        <p className="text-white">501–1000 сообщений</p>
                        <p className="text-5xl font-bold text-primary my-1">8 <span className="text-3xl text-gray-200">₽</span></p>
                        <p className="text-gray-300">за сообщение</p>
                    </div>
                     <div className="bg-gray-800 p-6 rounded-lg text-center">
                        <p className="text-gray-300">1001–2000 сообщений</p>
                        <p className="text-4xl font-bold text-white my-2">7 <span className="text-2xl text-gray-400">₽</span></p>
                        <p className="text-gray-400">за сообщение</p>
                    </div>
                </div>
            </section>

            {/* --- Restrictions & Why Us --- */}
            <section className="py-20 grid lg:grid-cols-5 gap-12 items-start">
                 <div className="lg:col-span-2 bg-red-900/20 p-8 rounded-2xl border border-red-500/30">
                     <div className="flex items-center gap-3 mb-4">
                        <XCircle className="h-8 w-8 text-red-400" />
                        <h3 className="text-2xl font-bold text-white font-headline">С чем мы не работаем</h3>
                     </div>
                    <p className="text-gray-300 mb-4">Мы строго соблюдаем требования WhatsApp и законодательства. Поэтому не принимаем заявки от следующих тематик:</p>
                    <ul className="space-y-2 text-red-300/80 text-sm">
                        <li>Гадания, магия, астрология</li>
                        <li>Казино, ставки, букмекерские конторы</li>
                        <li>Финансовые пирамиды, хайпы</li>
                        <li>Скам-проекты и любые сомнительные схемы</li>
                    </ul>
                </div>
                <div className="lg:col-span-3 bg-gray-800/50 p-8 rounded-2xl border border-gray-700/80">
                     <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-bold text-white font-headline">Почему L-Sender</h3>
                     </div>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
                         <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" /><span>Простой процесс запуска</span></div>
                         <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" /><span>Модерация и помощь с рандомизацией</span></div>
                         <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" /><span>Бесплатная проверка базы</span></div>
                         <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" /><span>Оплата — только после вашего подтверждения</span></div>
                         <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" /><span>Прозрачность и уважение к правилам</span></div>
                     </div>
                </div>
            </section>
        </main>
        
        <footer className="text-center py-10 mt-10 border-t border-gray-800">
            <p className="text-gray-500">&copy; 2025 L-Sender. Все права защищены.</p>
        </footer>
    </div>
  );
}
