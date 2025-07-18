
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { WappSenderProLogo } from '@/components/icons';
import { Rocket, Shield, BarChart3, Bot, CheckCircle, ArrowRight } from 'lucide-react';
import LandingHeader from '@/components/landing/header';


const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'ИИ-генерация текстов',
    description: 'Создавайте вовлекающие тексты для ваших рассылок в один клик. Наш ИИ-помощник предложит несколько вариантов, которые повысят отклик аудитории.',
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: 'Модерация и безопасность',
    description: 'Все рассылки проходят проверку перед запуском. Это гарантирует соответствие стандартам и защищает вашу репутацию.',
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: 'Мгновенный запуск',
    description: 'Запускайте рассылки сразу после одобрения. Наша инфраструктура обеспечивает высокую скорость и надежность доставки.',
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: 'Подробная аналитика',
    description: 'Отслеживайте ключевые метрики: количество отправленных сообщений, доставку, прочтения и ответы. Принимайте решения на основе данных.',
  },
];

const pricingTiers = [
    {
        name: "Старт",
        price: "1000 ₽",
        messages: "1 000 сообщений",
        features: ["ИИ-генератор", "Базовая аналитика", "Поддержка 24/7"],
        cta: "Выбрать тариф",
        popular: false
    },
    {
        name: "Профи",
        price: "4500 ₽",
        messages: "5 000 сообщений",
        features: ["ИИ-генератор", "Расширенная аналитика", "API доступ", "Приоритетная поддержка"],
        cta: "Выбрать тариф",
        popular: true
    },
    {
        name: "Бизнес",
        price: "8000 ₽",
        messages: "10 000 сообщений",
        features: ["Все из 'Профи'", "Персональный менеджер", "Кастомные интеграции"],
        cta: "Выбрать тариф",
        popular: false
    }
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 text-center">
            <div 
                className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom mask-gradient"
                style={{ maskImage: 'linear-gradient(to bottom, transparent, black, transparent)' }}
             ></div>
             <div className="container mx-auto px-4 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter leading-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Управляйте WhatsApp рассылками профессионально
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
                    WappSender Pro — это мощная платформа для автоматизации маркетинга в WhatsApp. Генерируйте тексты с помощью ИИ, управляйте контактами и анализируйте результаты.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="font-bold text-lg py-7 px-10 shadow-lg">
                        <Link href="/dashboard">
                            Начать бесплатно
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="font-bold text-lg py-7 px-10">
                        <Link href="#pricing">
                           Смотреть тарифы
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold font-headline text-primary">Все, что нужно для эффективных рассылок</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Наша платформа предоставляет полный набор инструментов для достижения ваших маркетинговых целей.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/20 transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-xl">
                            <CardHeader className="flex flex-row items-center gap-4">
                                {feature.icon}
                                <CardTitle className="text-xl font-headline mb-0">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold font-headline text-primary">Начать работу — это просто</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Всего три шага отделяют вас от успешной рассылки.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 -z-10 hidden md:block">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/30" style={{width: '66%'}}></div>
                     </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background font-bold text-2xl mb-4 z-10">1</div>
                        <h3 className="text-xl font-headline font-semibold">Создайте рассылку</h3>
                        <p className="text-muted-foreground mt-2">Выберите тариф, напишите текст сами или с помощью нашего ИИ-ассистента.</p>
                    </div>
                    <div className="flex flex-col items-center">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background font-bold text-2xl mb-4 z-10">2</div>
                        <h3 className="text-xl font-headline font-semibold">Пройдите модерацию</h3>
                        <p className="text-muted-foreground mt-2">Отправьте рассылку на быструю проверку, чтобы убедиться в ее качестве и соответствии правилам.</p>
                    </div>
                    <div className="flex flex-col items-center">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background font-bold text-2xl mb-4 z-10">3</div>
                        <h3 className="text-xl font-headline font-semibold">Запустите и анализируйте</h3>
                        <p className="text-muted-foreground mt-2">После одобрения запустите рассылку и отслеживайте ее эффективность в реальном времени.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-32 bg-secondary/30">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold font-headline text-primary">Прозрачные тарифы</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Выберите план, который идеально подходит для ваших задач. Никаких скрытых платежей.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {pricingTiers.map(tier => (
                        <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary ring-2 ring-primary scale-105' : ''}`}>
                             {tier.popular && <div className="text-center py-1 bg-primary text-primary-foreground text-sm font-bold rounded-t-lg">Популярный выбор</div>}
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl font-headline">{tier.name}</CardTitle>
                                <CardDescription>{tier.messages}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="text-center mb-6">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                </div>
                                <ul className="space-y-3">
                                    {tier.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                                    <Link href="/dashboard" className="w-full">{tier.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

         {/* CTA Section */}
        <section className="py-20 sm:py-32">
             <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl lg:text-4xl font-bold font-headline text-primary">Готовы увеличить продажи?</h2>
                 <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Присоединяйтесь к сотням компаний, которые уже используют WappSender Pro для роста своего бизнеса.</p>
                 <Button asChild size="lg" className="mt-8 font-bold text-lg py-7 px-10 shadow-lg">
                    <Link href="/dashboard">
                        Начать работу
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
             </div>
        </section>

      </main>

      <footer className="py-8 border-t border-border/20">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          <div className="flex items-center gap-2">
            <WappSenderProLogo className="w-6 h-6" />
            <span className="font-bold">WappSender Pro</span>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <Link href="#features" className="hover:text-primary">Возможности</Link>
             <Link href="#pricing" className="hover:text-primary">Тарифы</Link>
             <Link href="#" className="hover:text-primary">Документация</Link>
          </div>
          <p className="mt-4 md:mt-0">&copy; {new Date().getFullYear()} WappSender Pro. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
