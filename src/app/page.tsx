
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Function to generate the smooth curve path data
function getSmoothCurvePath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i < points.length - 2 ? points[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}


export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // --- Chart State ---
    const svgRef = useRef<SVGSVGElement>(null);
    const [points, setPoints] = useState([
        { x: 50, y: 220 },
        { x: 300, y: 120 },
        { x: 520, y: 40 }
    ]);
    const [draggingPointIndex, setDraggingPointIndex] = useState<number | null>(null);

    const pathData = getSmoothCurvePath(points);
    const areaData = `${pathData} L ${points[points.length - 1].x} 250 L ${points[0].x} 250 Z`;

    const handleMouseDown = (index: number) => {
        setDraggingPointIndex(index);
    };

    const handleMouseUp = useCallback(() => {
        setDraggingPointIndex(null);
    }, []);

    const handleMouseMove = useCallback((event: MouseEvent | TouchEvent) => {
        if (draggingPointIndex === null || !svgRef.current) return;

        const svg = svgRef.current;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;

        let clientX, clientY;
        if (window.TouchEvent && event instanceof TouchEvent) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = (event as MouseEvent).clientX;
            clientY = (event as MouseEvent).clientY;
        }

        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgPoint = pt.matrixTransform(ctm.inverse());

        setPoints(prevPoints => {
            const newPoints = [...prevPoints];
            
            // Constrain movement
            const newY = Math.max(20, Math.min(250, svgPoint.y));
            const newX = Math.max(50, Math.min(520, svgPoint.x));

            // Prevent points from crossing each other horizontally
            if (draggingPointIndex > 0 && newX < newPoints[draggingPointIndex - 1].x + 10) {
              return newPoints;
            }
            if (draggingPointIndex < newPoints.length - 1 && newX > newPoints[draggingPointIndex + 1].x - 10) {
              return newPoints;
            }

            newPoints[draggingPointIndex] = { x: newX, y: newY };
            return newPoints;
        });
    }, [draggingPointIndex]);
    
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);


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
                        <Link href="/#growth-chart" className="text-gray-300 hover:text-white transition">Документация</Link>
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
                <Link href="#" onClick={closeMenu} className="text-3xl font-bold text-white mb-12 hover:text-green-400 transition-colors duration-300 font-headline">Документация</Link>
                <Link href="/dashboard" onClick={closeMenu} className="btn-gradient text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Начать работу
                </Link>
            </div>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
                    <div className="absolute inset-0 hero-gradient"></div>
                     <div className="absolute top-0 right-0 -mr-16 -mt-16 lg:w-1/2 w-2/3 opacity-20 lg:opacity-100">
                        <div className="relative w-full h-full">
                             <Image 
                                src="https://i.imgur.com/8BGxINF.png"
                                alt="Dashboard preview"
                                width={1200}
                                height={1000}
                                className="object-contain"
                                data-ai-hint="dashboard ui"
                            />
                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        </div>
                    </div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left relative">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 font-headline">
                                Управляйте WhatsApp рассылками <span className="text-green-400">профессионально</span>
                            </h1>
                            <p className="max-w-3xl text-lg md:text-xl text-gray-300 mb-10">
                                Elsender — это мощная платформа для автоматизации маркетинга в WhatsApp. Генерируйте тексты с помощью ИИ, управляйте контактами и анализируйте результаты.
                            </p>
                            <div className="flex justify-center lg:justify-start items-center space-x-4">
                                <Link href="/dashboard" className="btn-gradient text-white font-bold py-3 px-8 rounded-lg text-lg">
                                    Начать работу
                                </Link>
                                <Link href="#pricing" className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-600 transition">
                                    Смотреть тарифы
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive Chart Section */}
                <section id="growth-chart" className="py-20 lg:py-24 bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Отправьте сообщения — получите результат</h2>
                            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Превратите рассылки в реальные продажи. Наша платформа показывает прозрачную воронку от отправки до лида.</p>
                        </div>
                        <div className="custom-card p-4 sm:p-8 max-w-4xl mx-auto">
                            <svg ref={svgRef} className="w-full font-sans cursor-default" viewBox="0 0 570 300">
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style={{stopColor:"#00F2FE"}} />
                                        <stop offset="100%" style={{stopColor:"#4ADE80"}} />
                                    </linearGradient>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" style={{stopColor:"#00F2FE", stopOpacity:0.3}} />
                                        <stop offset="100%" style={{stopColor:"#111827", stopOpacity:0}} />
                                    </linearGradient>
                                    <filter id="neonGlow">
                                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <g className="grid-lines" stroke="#374151" strokeOpacity="0.5" strokeWidth="1">
                                    {[50, 100, 150, 200, 250].map(y => <line key={y} x1="50" y1={y} x2="520" y2={y} />)}
                                </g>
                                <g className="y-axis-labels" fill="#9CA3AF" fontSize="12">
                                    {[
                                      {y: 255, label: 0},
                                      {y: 205, label: 250},
                                      {y: 155, label: 500},
                                      {y: 105, label: 750},
                                      {y: 55, label: 1000}
                                    ].map(({y, label}) => <text key={y} x="40" y={y} textAnchor="end">{label}</text>)}
                                </g>

                                <path d={areaData} fill="url(#areaGradient)" />
                                <path d={pathData} stroke="url(#lineGradient)" strokeWidth="4" fill="none" strokeLinecap="round" style={{filter:'url(#neonGlow)'}} />
                                
                                <g className="data-points">
                                    {points.map((p, index) => (
                                        <g key={index} transform={`translate(${p.x}, ${p.y})`} 
                                           className="cursor-grab active:cursor-grabbing"
                                           onMouseDown={() => handleMouseDown(index)}
                                           onTouchStart={() => handleMouseDown(index)}>
                                           <circle r="12" fill="#4ADE80" fillOpacity="0.2" />
                                            <circle r="6" fill={index === 1 ? "#111827" : "#111827"} stroke="#4ADE80" strokeWidth="2" />
                                        </g>
                                    ))}
                                </g>
                                
                                <g className="x-axis-labels" fill="#9CA3AF" fontSize="12">
                                    <text x="50" y="275" textAnchor="middle">День 1</text>
                                    <text x="300" y="275" textAnchor="middle">День 3</text>
                                    <text x="520" y="275" textAnchor="middle">День 5</text>
                                </g>

                                 <g className="integrated-stats" transform="translate(60, 30)">
                                    <text y="0" fontSize="14" fill="#9CA3AF">Результат рассылки:</text>
                                    <text y="30" fontSize="24" fontWeight="bold" fill="#00F2FE">{Math.round((250 - points[2].y) / 230 * 1000)} сообщений</text>
                                    <text y="55" fontSize="16" fontWeight="medium" fill="#E5E7EB">{(((250 - points[2].y) / 230 * 1000) / 1000 * 100).toFixed(1)}% конверсия</text>
                                </g>
                                <g className="integrated-stats-sent" transform="translate(520, 30)" textAnchor="end">
                                    <text y="0" fontSize="14" fill="#9CA3AF">Отправлено:</text>
                                    <text y="30" fontSize="24" fontWeight="bold" fill="#E5E7EB">1000 сообщ.</text>
                                </g>
                            </svg>
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
                <section className="py-20 lg:py-24 bg-gray-900">
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
                        <Link href="#" className="hover:text-white transition">Документация</Link>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Elsender. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
}
