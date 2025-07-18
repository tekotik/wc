
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WappSenderProLogo } from '@/components/icons';
import { Rocket, Shield, BarChart3, Bot } from 'lucide-react';
import LandingHeader from '@/components/landing/header';


const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'Галактическая скорость',
    description: 'Наши гипердвигатели доставят ваши сообщения со скоростью света.',
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Имперская безопасность',
    description: 'Все ваши данные под защитой силового поля высочайшего уровня.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Аналитика от джедаев',
    description: 'Предсказывайте поведение клиентов с точностью мастера-джедая.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'ИИ-дроиды-копирайтеры',
    description: 'Наши дроиды создадут тексты, которые убедят даже Хатта.',
  },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
             <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
             <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: 'url(https://placehold.co/1920x1080.png)', filter: 'blur(4px)'}}
                data-ai-hint="star wars space battle"
             ></div>
            <div className="relative z-20 text-primary-foreground max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter leading-tight">
                    Покорите Галактику Клиентов
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
                    WappSender Pro — ваш командный мостик для управления рассылками. Запускайте, анализируйте и побеждайте.
                </p>
                <Button asChild size="lg" className="mt-8 font-bold text-lg py-7 px-10">
                    <Link href="/dashboard">
                        <Rocket className="mr-2" />
                        Запустить Рассылку
                    </Link>
                </Button>
            </div>
        </section>

        <section id="features" className="py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-4xl font-bold font-headline text-primary">Арсенал для Вашей Империи</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Инструменты, которые приведут вас к доминированию.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/20 transform hover:-translate-y-2 transition-transform duration-300">
                            <CardHeader className="items-center">
                                {feature.icon}
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardTitle className="text-xl font-headline mb-2">{feature.title}</CardTitle>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="py-6 border-t border-border/20">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WappSender Pro. Да пребудет с вами Сила.</p>
        </div>
      </footer>
    </div>
  );
}
