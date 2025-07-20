
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ElsenderLogo } from '@/components/icons';
import { Sparkles, ShieldCheck, Rocket, BarChart2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const leadsCountRef = useRef<SVGTextElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = mobileMenuRef.current;
    const menuLinks = mobileMenu?.querySelectorAll('.menu-link');

    const openMenu = () => mobileMenu?.classList.add('active');
    const closeMenu = () => mobileMenu?.classList.remove('active');

    mobileMenuButton?.addEventListener('click', openMenu);
    closeMenuButton?.addEventListener('click', closeMenu);
    menuLinks?.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Money Rain Animation Logic
    const rainContainer = document.getElementById('rain-container');
    const path = document.getElementById('growth-path') as SVGPathElement | null;
    if (rainContainer && path) {
        // Clear previous symbols if any
        rainContainer.innerHTML = '';
        const pathLength = path.getTotalLength();
        const numSources = 15; // Number of rain "sources" along the line

        // Create several sources for the symbols
        for (let i = 0; i < numSources; i++) {
            // Distribute sources evenly along the path
            const point = path.getPointAtLength((i / (numSources - 1)) * pathLength);
            
            // Generate a random number of symbols for each source (from 7 to 13)
            const numRubles = Math.floor(Math.random() * (13 - 7 + 1)) + 7;

            for (let j = 0; j < numRubles; j++) {
                const symbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
                symbol.setAttribute('x', String(point.x));
                symbol.setAttribute('y', String(point.y));
                symbol.setAttribute('class', 'currency-symbol');
                symbol.textContent = '₽';

                // Set random parameters for the "ragdoll" animation
                const duration = Math.random() * 2 + 2; // Fall duration from 2 to 4 seconds
                const delay = Math.random() * 4; // Random delay up to 4 seconds for a continuous effect
                const startX = Math.random() * 20 - 10; // Small initial X offset
                const endX = Math.random() * 80 - 40; // Final X offset
                const rotation = Math.random() * 720 - 360; // Random rotation

                symbol.style.setProperty('--start-x', `${startX}px`);
                symbol.style.setProperty('--end-x', `${endX}px`);
                symbol.style.setProperty('--r', `${rotation}deg`);
                symbol.style.animationDuration = `${duration}s`;
                symbol.style.animationDelay = `${delay}s`;
                
                rainContainer.appendChild(symbol);
            }
        }
    }

    // Animated number counter
    const leadsElement = leadsCountRef.current;
    if (leadsElement) {
        const finalCount = 86;
        const animationDuration = 4000; // 4 seconds, to match the line drawing
        const animationStartTime = Date.now() + 1000; // Start after 1 second delay

        const animateCount = () => {
            const now = Date.now();
            const elapsedTime = now - animationStartTime;

            if (elapsedTime >= animationDuration) {
                leadsElement.textContent = `${finalCount} лидов`;
                if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                return;
            }

            const progress = elapsedTime / animationDuration;
            const currentCount = Math.round(progress * finalCount);
            leadsElement.textContent = `${currentCount} лидов`;

            animationFrameId.current = requestAnimationFrame(animateCount);
        };
        
        // Start animation after a delay
        setTimeout(() => {
           animationFrameId.current = requestAnimationFrame(animateCount);
        }, 1000);
    }


    return () => {
         mobileMenuButton?.removeEventListener('click', openMenu);
         closeMenuButton?.removeEventListener('click', closeMenu);
         menuLinks?.forEach(link => {
            link.removeEventListener('click', closeMenu);
         });
         if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, []);


  return (
    <>
      <header className="absolute w-full z-20 py-6 px-4 sm:px-6 lg:px-8">
        <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 text-white hover:text-primary transition-colors">
                <ElsenderLogo className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold font-headline">Elsender</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-300 hover:text-white transition">Возможности</Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition">Тарифы</Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Документация</Link>
            </div>
            <Link href="/dashboard" className="hidden md:block btn-gradient text-white font-semibold py-2 px-5 rounded-lg">
                Начать работу
            </Link>
            <div className="md:hidden">
                <button id="mobile-menu-button" className="text-white focus:outline-none">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </nav>
      </header>

      <div id="mobile-menu" ref={mobileMenuRef} className="mobile-menu fixed top-0 right-0 h-full w-full bg-gray-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <button id="close-menu-button" className="absolute top-7 right-4 text-white">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <Link href="#features" className="text-3xl font-bold text-white mb-8 hover:text-green-400 transition-colors duration-300 menu-link">Возможности</Link>
        <Link href="#pricing" className="text-3xl font-bold text-white mb-8 hover:text-green-400 transition-colors duration-300 menu-link">Тарифы</Link>
        <Link href="/dashboard" className="text-3xl font-bold text-white mb-12 hover:text-green-400 transition-colors duration-300 menu-link">Документация</Link>
        <Link href="/dashboard" className="btn-gradient text-white font-bold py-3 px-8 rounded-lg text-lg menu-link">
            Начать работу
        </Link>
    </div>

      <main>
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 hero-gradient">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 font-headline">
                   WhatsApp рассылка
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
                    L-Sender — это сервис для запуска эффективных и простых WhatsApp-рассылок без лишней сложности и технических препятствий. Всё, что нужно — загрузить базу, отправить текст и выбрать время. Мы берём на себя остальное.
                </p>
                <div className="flex justify-center items-center space-x-4">
                     <Link href="/dashboard" className="btn-gradient text-white font-bold py-3 px-8 rounded-lg text-lg">
                        Начать работу
                    </Link>
                    <Link href="#pricing" className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-600 transition">
                        Смотреть тарифы
                    </Link>
                </div>
            </div>
        </section>

        <section id="pricing" className="py-20 lg:py-24 bg-gray-900 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Тарифы</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                    {/* <!-- Start Plan --> */}
                    <div className="card p-8 flex flex-col h-full">
                        <h3 className="text-2xl font-bold text-white font-headline">Старт</h3>
                        <p className="text-gray-400 mt-2">300–500 сообщений</p>
                        <div className="my-8">
                            <span className="text-5xl font-extrabold text-white">9</span>
                            <span className="text-xl font-medium text-gray-300"> ₽</span>
                        </div>
                        <p className="text-gray-400 text-lg">за сообщение</p>
                        <div className="flex-grow"></div>
                        <button className="w-full mt-8 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors">
                            Выбрать тариф
                        </button>
                    </div>

                    {/* <!-- Pro Plan (Popular) --> */}
                    <div className="card popular-plan p-8 flex flex-col h-full relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full uppercase">Оптимально</div>
                        </div>
                        <h3 className="text-2xl font-bold text-white font-headline">Профи</h3>
                        <p className="text-gray-400 mt-2">501–1000 сообщений</p>
                        <div className="my-8">
                            <span className="text-5xl font-extrabold text-white">8</span>
                            <span className="text-xl font-medium text-gray-300"> ₽</span>
                        </div>
                        <p className="text-green-400 text-lg">за сообщение</p>
                        <div className="flex-grow"></div>
                        <button className="w-full mt-8 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
                            Выбрать тариф
                        </button>
                    </div>

                    {/* <!-- Business Plan --> */}
                    <div className="card p-8 flex flex-col h-full">
                        <h3 className="text-2xl font-bold text-white font-headline">Бизнес</h3>
                        <p className="text-gray-400 mt-2">1001–2000 сообщений</p>
                        <div className="my-8">
                            <span className="text-5xl font-extrabold text-white">7</span>
                            <span className="text-xl font-medium text-gray-300"> ₽</span>
                        </div>
                         <p className="text-gray-400 text-lg">за сообщение</p>
                        <div className="flex-grow"></div>
                        <button className="w-full mt-8 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors">
                            Выбрать тариф
                        </button>
                    </div>
                </div>
                <div className="text-center mt-16">
                    <h3 className="text-xl font-bold text-white mb-6">Все тарифы включают:</h3>
                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-gray-300">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>ИИ-генератор текстов</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Подробная аналитика</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>Поддержка 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>API для интеграций</span>
                        </div>
                    </div>
                </div>
            </div>
             <div className="absolute inset-0 z-0 overflow-hidden">
                <svg id="money-rain-svg" className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22D3EE" />
                            <stop offset="50%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#6EE7B7" />
                        </linearGradient>
                        <linearGradient id="currencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#A7F3D0" />
                            <stop offset="100%" stopColor="#6EE7B7" />
                        </linearGradient>
                    </defs>
                    <path id="growth-path" className="growth-line" 
                            d="M -50 150 C 150 180, 250 100, 400 120 S 600 80, 850 100" 
                            stroke="url(#processGradient)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="rain-container"></g>
                </svg>
            </div>
        </section>
        
        <section id="how-it-works" className="py-20 lg:py-24 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Отправьте сообщения — получите результат</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Превратите рассылки в реальные продажи. Наша платформа показывает прозрачную воронку от отправки до лида.</p>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-full max-w-5xl" viewBox="0 0 1000 200" preserveAspectRatio="none">
                             <defs>
                                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
                                    <polygon points="0 0, 8 3, 0 6" fill="url(#arrowGradient)"/>
                                </marker>
                            </defs>
                            <path d="M 50 150 C 250 200, 400 50, 650 100 S 850 120, 950 80" stroke="url(#arrowGradient)" strokeWidth="5" fill="none" className="draw-arrow" markerEnd="url(#arrowhead)"/>
                        </svg>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="text-center">
                            <div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-cyan-500 rounded-full text-2xl font-bold text-cyan-400 mb-4">1</div></div>
                             <h3 className="text-xl font-bold text-white mb-2 font-headline">Создайте рассылку</h3>
                            <p className="text-gray-400">Загрузите базу, настройте текст и отправьте на проверку.</p>
                        </div>
                        <div className="text-center">
                            <div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500/50 rounded-full text-2xl font-bold text-green-400/80 mb-4">2</div></div>
                             <h3 className="text-xl font-bold text-white mb-2 font-headline">Пройдите модерацию</h3>
                            <p className="text-gray-400">Наша команда быстро проверит вашу кампанию.</p>
                        </div>
                        <div className="text-center">
                            <div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500 rounded-full text-2xl font-bold text-green-400 mb-4">3</div></div>
                           <h3 className="text-xl font-bold text-white mb-2 font-headline">Запустите и анализируйте</h3>
                            <p className="text-gray-400">Следите за результатами в реальном времени.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-20 lg:py-24 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animated-chart-container bg-gray-800/50 rounded-2xl p-4 md:p-8 border border-gray-700/50 transition-all duration-300">
              <svg width="100%" viewBox="0 0 800 450">
                <defs>
                   <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chart-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                </defs>
                
                {/* <!-- Grid lines --> */}
                <g className="text-gray-700">
                  {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="50" y1={350 - y * 3} x2="750" y2={350 - y * 3} stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                  ))}
                </g>
                
                {/* <!-- Y-axis labels --> */}
                <g className="text-gray-400" fill="white" fontSize="14">
                  <text x="30" y="355" textAnchor="end">0</text>
                  <text x="30" y={355 - 25 * 3} textAnchor="end">25</text>
                  <text x="30" y={355 - 50 * 3} textAnchor="end">50</text>
                  <text x="30" y={355 - 75 * 3} textAnchor="end">75</text>
                  <text x="30" y={355 - 100 * 3} textAnchor="end">100</text>
                </g>

                {/* <!-- X-axis labels --> */}
                <g className="text-gray-400" fill="white" fontSize="16" fontWeight="medium">
                  <text x="100" y="380" textAnchor="middle">День 1</text>
                  <text x="260" y="380" textAnchor="middle">День 2</text>
                  <text x="420" y="380" textAnchor="middle">День 3</text>
                  <text x="580" y="380" textAnchor="middle">День 4</text>
                  <text x="740" y="380" textAnchor="middle">День 5</text>
                </g>

                {/* <!-- Data path and fill --> */}
                <path d="M 100 335 C 180 250, 220 180, 420 200 C 580 220, 620 100, 740 70" fill="url(#chart-gradient)" className="chart-line-fill" />
                <path d="M 100 335 C 180 250, 220 180, 420 200 C 580 220, 620 100, 740 70" stroke="url(#chart-line-gradient)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />

                {/* <!-- Data points --> */}
                <g className="chart-point">
                    <circle cx="100" cy="335" r="8" fill="#111827" stroke="url(#chart-line-gradient)" strokeWidth="3" className="chart-point-circle" />
                </g>
                <g className="chart-point">
                    <circle cx="420" cy="200" r="8" fill="#111827" stroke="url(#chart-line-gradient)" strokeWidth="3" className="chart-point-circle" />
                    <g className="chart-tooltip">
                        <rect x="380" y="140" width="80" height="35" rx="8" fill="#1F2937" stroke="#374151" />
                        <text x="420" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">45 лидов</text>
                    </g>
                </g>
                 <g className="chart-point">
                    <circle cx="740" cy="70" r="8" fill="#111827" stroke="url(#chart-line-gradient)" strokeWidth="3" className="chart-point-circle" />
                </g>

                {/* <!-- Text info --> */}
                <g className="text-info">
                    <text x="60" y="60" fontSize="16" fill="#A0AEC0">Результат рассылки:</text>
                    <text ref={leadsCountRef} x="60" y="100" fontSize="32" fontWeight="bold" fill="url(#chart-line-gradient)">0 лидов</text>
                    <text x="60" y="130" fontSize="18" fill="#A0AEC0">8.6% конверсия</text>
                </g>
                <g className="text-info">
                    <text x="740" y="60" fontSize="16" textAnchor="end" fill="#A0AEC0">Отправлено:</text>
                    <text x="740" y="100" fontSize="32" fontWeight="bold" textAnchor="end" fill="url(#chart-line-gradient)">1000 сообщ.</text>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Все, что нужно для эффективных рассылок</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Наша платформа предоставляет полный набор инструментов для достижения ваших маркетинговых целей.</p>
                </div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="card p-8 text-center flex flex-col justify-start">
                        <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto">
                           <Sparkles className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-headline">ИИ-генерация текстов</h3>
                        <p className="text-gray-400">Создавайте вовлекающие тексты для ваших рассылок в один клик. Наш ИИ-помощник предложит несколько вариантов.</p>
                    </div>
                    <div className="card p-8 text-center flex flex-col justify-start">
                        <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto">
                            <ShieldCheck className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-headline">Модерация</h3>
                        <p className="text-gray-400">Все рассылки проходят проверку перед запуском, что гарантирует соответствие стандартам и защищает вашу репутацию.</p>
                    </div>
                    <div className="card p-8 text-center flex flex-col justify-start">
                        <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto">
                            <Rocket className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-headline">Мгновенный запуск</h3>
                        <p className="text-gray-400">Запускайте рассылки сразу после одобрения. Наша инфраструктура обеспечивает высокую скорость и надежность.</p>
                    </div>
                    <div className="card p-8 text-center flex flex-col justify-start">
                        <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full bg-green-900/50 mx-auto">
                           <BarChart2 className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-headline">Подробная аналитика</h3>
                        <p className="text-gray-400">Отслеживайте ключевые метрики: доставку, прочтения и ответы. Принимайте решения на основе данных.</p>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="py-20 lg:py-24 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Готовы увеличить продажи?</h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                    Присоединяйтесь к сотням компаний, которые уже используют Elsender для роста своего бизнеса.
                </p>
                 <Link href="/dashboard" className="btn-gradient text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Начать работу
                </Link>
            </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <div className="flex justify-center space-x-6 mb-4">
                <Link href="#features" className="hover:text-white transition">Возможности</Link>
                <Link href="#pricing" className="hover:text-white transition">Тарифы</Link>
                <Link href="/dashboard" className="hover:text-white transition">Документация</Link>
            </div>
            <p>&copy; 2025 Elsender. Все права защищены.</p>
        </div>
      </footer>
    </>
  );
}
