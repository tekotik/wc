
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="antialiased bg-gray-900 text-gray-200 font-body">
            {/* Header */}
            <header className="absolute w-full z-20 py-6 px-4 sm:px-6 lg:px-8">
                <nav className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-white font-headline">
                        Elsender
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-gray-300 hover:text-white transition">Возможности</Link>
                        <Link href="/#pricing" className="text-gray-300 hover:text-white transition">Тарифы</Link>
                        <Link href="/#how-it-works" className="text-gray-300 hover:text-white transition">Документация</Link>
                    </div>
                    <Link href="/dashboard" className="hidden md:block btn-gradient text-white font-semibold py-2 px-5 rounded-lg">
                        Начать работу
                    </Link>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white focus:outline-none">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            <div id="mobile-menu" className={cn("fixed top-0 right-0 h-full w-full bg-gray-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out", isMenuOpen ? 'translate-x-0' : 'translate-x-full' )}>
                <button onClick={toggleMenu} className="absolute top-7 right-4 text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <Link href="#features" onClick={closeMenu} className="text-3xl font-bold text-white mb-8 hover:text-green-400 transition-colors duration-300 font-headline">Возможности</Link>
                <Link href="#pricing" onClick={closeMenu} className="text-3xl font-bold text-white mb-8 hover:text-green-400 transition-colors duration-300 font-headline">Тарифы</Link>
                <Link href="#how-it-works" onClick={closeMenu} className="text-3xl font-bold text-white mb-12 hover:text-green-400 transition-colors duration-300 font-headline">Документация</Link>
                <Link href="/dashboard" onClick={closeMenu} className="btn-gradient text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Начать работу
                </Link>
            </div>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
                    <div className="absolute inset-0 hero-gradient"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="max-w-xl text-left">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 font-headline">
                                    Управляйте WhatsApp рассылками <span className="text-green-400">профессионально</span>
                                </h1>
                                <p className="text-lg md:text-xl text-gray-300 mb-10">
                                    Elsender — это мощная платформа для автоматизации маркетинга в WhatsApp. Генерируйте тексты с помощью ИИ, управляйте контактами и анализируйте результаты.
                                </p>
                                <div className="flex justify-start items-center space-x-4">
                                    <Link href="/dashboard" className="btn-gradient text-white font-bold py-3 px-8 rounded-lg text-lg">
                                        Начать работу
                                    </Link>
                                    <Link href="#pricing" className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-600 transition">
                                        Смотреть тарифы
                                    </Link>
                                </div>
                            </div>
                            <div className="relative h-full min-h-[300px] md:min-h-[500px]">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900 z-10"></div>
                                <Image 
                                    src="https://i.imgur.com/vcTgzOW.png"
                                    alt="Dashboard preview"
                                    fill
                                    className="object-contain object-right-top"
                                    data-ai-hint="dashboard ui"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Все, что нужно для эффективных рассылок</h2>
                            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Наша платформа предоставляет полный набор инструментов для достижения ваших маркетинговых целей.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="custom-card p-8 text-center">
                                <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-2.24-.8-4.33-2.18-5.96"/><path d="m18 12-4-4h-4"/><path d="m18 12 4 4"/><path d="m18 12-4 4"/></svg></div>
                                <h3 className="text-xl font-bold text-white mb-2 font-headline">ИИ-генерация текстов</h3>
                                <p className="text-gray-400">Создавайте вовлекающие тексты для ваших рассылок в один клик. Наш ИИ-помощник предложит несколько вариантов.</p>
                            </div>
                            <div className="custom-card p-8 text-center">
                                <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                                <h3 className="text-xl font-bold text-white mb-2 font-headline">Модерация и безопасность</h3>
                                <p className="text-gray-400">Все рассылки проходят проверку перед запуском, что гарантирует соответствие стандартам и защищает вашу репутацию.</p>
                            </div>
                            <div className="custom-card p-8 text-center">
                                <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="m5 19 7-7 7 7"/></svg></div>
                                <h3 className="text-xl font-bold text-white mb-2 font-headline">Мгновенный запуск</h3>
                                <p className="text-gray-400">Запускайте рассылки сразу после одобрения. Наша инфраструктура обеспечивает высокую скорость и надежность.</p>
                            </div>
                            <div className="custom-card p-8 text-center">
                                <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
                                <h3 className="text-xl font-bold text-white mb-2 font-headline">Подробная аналитика</h3>
                                <p className="text-gray-400">Отслеживайте ключевые метрики: доставку, прочтения и ответы. Принимайте решения на основе данных.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 lg:py-24 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Начать работу — это просто</h2>
                            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Всего три шага отделяют вас от успешной рассылки.</p>
                        </div>
                        <div className="relative">
                            <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                                <div className="text-center"><div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500 rounded-full text-2xl font-bold text-green-400 mb-4">1</div></div><h3 className="text-xl font-bold text-white mb-2 font-headline">Создайте рассылку</h3><p className="text-gray-400">Выберите тариф, напишите текст сами или с помощью нашего ИИ-ассистента.</p></div>
                                <div className="text-center"><div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500 rounded-full text-2xl font-bold text-green-400 mb-4">2</div></div><h3 className="text-xl font-bold text-white mb-2 font-headline">Пройдите модерацию</h3><p className="text-gray-400">Отправьте рассылку на быструю проверку на соответствие правилам.</p></div>
                                <div className="text-center"><div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500 rounded-full text-2xl font-bold text-green-400 mb-4">3</div></div><h3 className="text-xl font-bold text-white mb-2 font-headline">Запустите и анализируйте</h3><p className="text-gray-400">После одобрения запустите рассылку и отслеживайте ее эффективность.</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Прозрачные тарифы</h2>
                            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Выберите план, который идеально подходит для ваших задач. Никаких скрытых платежей.</p>
                        </div>
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="custom-card p-8 flex flex-col"><h3 className="text-2xl font-bold text-white mb-2 font-headline">Старт</h3><p className="text-gray-400 mb-6">Для быстрого начала</p><div className="mb-6"><span className="text-5xl font-extrabold text-white">1000</span><span className="text-gray-400 text-lg font-medium"> ₽</span></div><p className="text-green-400 font-semibold text-lg mb-8">1 000 сообщений</p><div className="flex-grow"></div><Link href="/dashboard" className="w-full text-center bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition">Выбрать тариф</Link></div>
                            <div className="custom-card p-8 flex flex-col relative popular-plan"><div className="absolute top-0 -translate-y-1/2 w-full flex justify-center"><span className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">ПОПУЛЯРНЫЙ ВЫБОР</span></div><h3 className="text-2xl font-bold text-white mb-2 font-headline">Профи</h3><p className="text-gray-400 mb-6">Для активного роста</p><div className="mb-6"><span className="text-5xl font-extrabold text-white">4500</span><span className="text-gray-400 text-lg font-medium"> ₽</span></div><p className="text-green-400 font-semibold text-lg mb-8">5 000 сообщений</p><div className="flex-grow"></div><Link href="/dashboard" className="w-full text-center btn-gradient text-white font-bold py-3 px-6 rounded-lg">Выбрать тариф</Link></div>
                            <div className="custom-card p-8 flex flex-col"><h3 className="text-2xl font-bold text-white mb-2 font-headline">Бизнес</h3><p className="text-gray-400 mb-6">Для крупных компаний</p><div className="mb-6"><span className="text-5xl font-extrabold text-white">8000</span><span className="text-gray-400 text-lg font-medium"> ₽</span></div><p className="text-green-400 font-semibold text-lg mb-8">10 000 сообщений</p><div className="flex-grow"></div><Link href="/dashboard" className="w-full text-center bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition">Выбрать тариф</Link></div>
                        </div>
                        <div className="text-center mt-12">
                            <p className="text-lg text-white font-semibold">Все тарифы включают:</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-400">
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>ИИ-генератор текстов</span>
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Подробная аналитика</span>
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Поддержка 24/7</span>
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>API для интеграций</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 lg:py-24 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Готовы увеличить продажи?</h2>
                        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                            Присоединяйтесь к сотням компаний, которые уже используют Elsender для роста своего бизнеса.
                        </p>
                        <Link href="/dashboard" className="btn-gradient text-white font-bold py-4 px-10 rounded-lg text-xl">
                            Начать работу
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
                    <div className="flex justify-center space-x-6 mb-4">
                        <Link href="#features" className="hover:text-white transition">Возможности</Link>
                        <Link href="#pricing" className="hover:text-white transition">Тарифы</Link>
                        <Link href="#how-it-works" className="hover:text-white transition">Документация</Link>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Elsender. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
}
