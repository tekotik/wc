
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ElsenderLogo } from '@/components/icons';
import { Sparkles, ShieldCheck, Rocket, BarChart2, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const chartSectionRef = useRef<HTMLElement>(null);
  const leadsCountRef = useRef<SVGTextElement>(null);
  const conversionRateRef = useRef<SVGTextElement>(null);

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

    function animateSVGText(obj: SVGTextElement | null, start: number, end: number, duration: number, suffix: string, isFloat = false) {
        if (!obj) return;
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            let currentValue = progress * (end - start) + start;
            if (isFloat) {
                obj.textContent = `${currentValue.toFixed(1)}${suffix}`;
            } else {
                obj.textContent = `${Math.floor(currentValue)}${suffix}`;
            }
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const chartSection = chartSectionRef.current;
    const leadsCountText = leadsCountRef.current;
    const conversionRateText = conversionRateRef.current;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSVGText(leadsCountText, 0, 86, 2000, ' лидов');
                animateSVGText(conversionRateText, 0, 8.6, 2000, '% конверсия', true);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (chartSection) {
        observer.observe(chartSection);
    }
    
    return () => {
         mobileMenuButton?.removeEventListener('click', openMenu);
         closeMenuButton?.removeEventListener('click', closeMenu);
         menuLinks?.forEach(link => {
            link.removeEventListener('click', closeMenu);
         });
         if (chartSection) {
            observer.unobserve(chartSection);
         }
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
                    <Link href="/dashboard" className="bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg text-lg hover:bg-primary/90 transition">
                        <span className="link-inner">Начать работу</span>
                    </Link>
                    <Link href="#pricing" className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-600 transition">
                        Смотреть тарифы
                    </Link>
                </div>
            </div>
        </section>

        <section id="growth-chart" ref={chartSectionRef} className="py-20 lg:py-24 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Отправьте сообщения — получите результат</h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Превратите рассылки в реальные продажи. Наша платформа показывает прозрачную воронку от отправки до лида.</p>
            </div>

            <div className="card p-4 sm:p-8 max-w-4xl mx-auto">
                <svg className="w-full font-sans" viewBox="0 0 550 300">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: '#22C55E'}} />
                            <stop offset="100%" style={{stopColor: '#4ADE80'}} />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" style={{stopColor: '#22C55E', stopOpacity: 0.3}} />
                            <stop offset="100%" style={{stopColor: '#111827', stopOpacity: 0}} />
                        </linearGradient>
                         <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    <g className="grid-lines" stroke="#374151" strokeWidth="1">
                        <line x1="50" y1="50" x2="520" y2="50" />
                        <line x1="50" y1="100" x2="520" y2="100" />
                        <line x1="50" y1="150" x2="520" y2="150" />
                        <line x1="50" y1="200" x2="520" y2="200" />
                        <line x1="50" y1="250" x2="520" y2="250" />
                    </g>

                    <g className="y-axis-labels" fill="#9CA3AF" fontSize="12">
                        <text x="40" y="255" textAnchor="end">0</text>
                        <text x="40" y="205" textAnchor="end">25</text>
                        <text x="40" y="155" textAnchor="end">50</text>
                        <text x="40" y="105" textAnchor="end">75</text>
                        <text x="40" y="55" textAnchor="end">100</text>
                    </g>

                    <path className="chart-area" d="M 50 250 L 50 220 C 150 200, 200 100, 300 120 S 420 20, 520 40 L 520 250 Z" fill="url(#areaGradient)" />

                    <path className="chart-line" d="M 50 220 C 150 200, 200 100, 300 120 S 420 20, 520 40" stroke="url(#lineGradient)" strokeWidth="4" fill="none" strokeLinecap="round" style={{filter: 'url(#glow)'}} />

                    <g className="data-points">
                        <g className="chart-point" transform="translate(50, 220)">
                            <circle className="chart-point-circle-hover" r="10" fill="#4ADE80" fillOpacity="0.2" />
                            <circle className="chart-point-circle" r="5" fill="#111827" stroke="#4ADE80" strokeWidth="2" />
                            <g className="chart-tooltip" transform="translate(0, -35)">
                                <rect x="-35" y="-20" width="70" height="25" rx="5" fill="#111827" stroke="#4ADE80" strokeWidth="1" />
                                <text x="0" y="-3" fill="#E5E7EB" textAnchor="middle" fontSize="12">12 лидов</text>
                            </g>
                        </g>
                        <g className="chart-point" transform="translate(300, 120)">
                            <circle className="chart-point-circle-hover" r="10" fill="#4ADE80" fillOpacity="0.2" />
                            <circle className="chart-point-circle" r="5" fill="#111827" stroke="#4ADE80" strokeWidth="2" />
                            <g className="chart-tooltip" transform="translate(0, -35)">
                                <rect x="-35" y="-20" width="70" height="25" rx="5" fill="#111827" stroke="#4ADE80" strokeWidth="1" />
                                <text x="0" y="-3" fill="#E5E7EB" textAnchor="middle" fontSize="12">45 лидов</text>
                            </g>
                        </g>
                        <g className="chart-point" transform="translate(520, 40)">
                            <circle className="chart-point-circle-hover" r="10" fill="#4ADE80" fillOpacity="0.2" />
                            <circle className="chart-point-circle" r="5" fill="#111827" stroke="#4ADE80" strokeWidth="2" />
                            <g className="chart-tooltip" transform="translate(0, -35)">
                                <rect x="-35" y="-20" width="70" height="25" rx="5" fill="#111827" stroke="#4ADE80" strokeWidth="1" />
                                <text x="0" y="-3" fill="#E5E7EB" textAnchor="middle" fontSize="12">86 лидов</text>
                            </g>
                        </g>
                    </g>

                    <g className="x-axis-labels" fill="#9CA3AF" fontSize="12">
                        <text x="50" y="275" textAnchor="middle">День 1</text>
                        <text x="185" y="275" textAnchor="middle">День 2</text>
                        <text x="300" y="275" textAnchor="middle">День 3</text>
                        <text x="415" y="275" textAnchor="middle">День 4</text>
                        <text x="520" y="275" textAnchor="middle">День 5</text>
                    </g>

                    <g className="integrated-stats" transform="translate(60, 30)">
                        <text y="0" fontSize="14" fill="#9CA3AF">Результат рассылки:</text>
                        <text y="30" fontSize="24" fontWeight="bold" fill="#22C55E" id="leads-count-text" ref={leadsCountRef}>0 лидов</text>
                        <text y="55" fontSize="16" fontWeight="medium" fill="#E5E7EB" id="conversion-rate-text" ref={conversionRateRef}>0.0% конверсия</text>
                    </g>
                    <g className="integrated-stats-sent" transform="translate(520, 30)" textAnchor="end">
                        <text y="0" fontSize="14" fill="#9CA3AF">Отправлено:</text>
                         <text y="30" fontSize="24" fontWeight="bold" fill="#E5E7EB">1000 сообщ.</text>
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
                        <h3 className="text-xl font-bold text-white mb-2 font-headline">Модерация и безопасность</h3>
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
        
        <section id="how-it-works" className="py-20 lg:py-24 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Начать работу — это просто</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Всего три шага отделяют вас от успешной рассылки.</p>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 -translate-y-1/2">
                      <svg width="100%" height="100%" viewBox="0 0 1000 60" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full">
                          <defs>
                              <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#06b6d4" /> 
                                  <stop offset="100%" stopColor="#22c55e" />
                              </linearGradient>
                          </defs>
                          <path
                              d="M 20 30 Q 250 50 500 30 T 980 30"
                              stroke="url(#curve-gradient)"
                              strokeWidth="8"
                              fill="none"
                              className="curve-line"
                          />
                      </svg>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="text-center">
                            <div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-cyan-500 rounded-full text-2xl font-bold text-cyan-400 mb-4">1</div></div>
                            <h3 className="text-xl font-bold text-white mb-2 font-headline">Создайте рассылку</h3>
                            <p className="text-gray-400">Выберите тариф, напишите текст сами или с помощью нашего ИИ-ассистента.</p>
                        </div>
                        <div className="text-center">
                            <div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500/50 rounded-full text-2xl font-bold text-green-400/80 mb-4">2</div></div>
                            <h3 className="text-xl font-bold text-white mb-2 font-headline">Пройдите модерацию</h3>
                            <p className="text-gray-400">Отправьте рассылку на быструю проверку на соответствие правилам.</p>
                        </div>
                        <div className="text-center">
                            <div className="relative inline-block"><div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500 rounded-full text-2xl font-bold text-green-400 mb-4">3</div></div>
                            <h3 className="text-xl font-bold text-white mb-2 font-headline">Запустите и анализируйте</h3>
                            <p className="text-gray-400">После одобрения запустите рассылку и отслеживайте ее эффективность.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing" className="py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Тарифы</h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="card p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 font-headline">Старт</h3>
                    <p className="text-gray-300 text-lg">300–500 сообщений — <span className="text-primary font-semibold">9 ₽</span> за сообщение</p>
                </div>
                <div className="card p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 font-headline">Профи</h3>
                    <p className="text-gray-300 text-lg">501–1000 сообщений — <span className="text-primary font-semibold">8 ₽</span> за сообщение</p>
                </div>
                <div className="card p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 font-headline">Бизнес</h3>
                    <p className="text-gray-300 text-lg">1001–2000 сообщений — <span className="text-primary font-semibold">7 ₽</span> за сообщение</p>
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
        </section>

        <section className="py-20 lg:py-24 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Готовы увеличить продажи?</h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                    Присоединяйтесь к сотням компаний, которые уже используют Elsender для роста своего бизнеса.
                </p>
                <Link href="/dashboard" className="bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg text-lg hover:bg-primary/90 transition">
                    <span className="link-inner">Начать работу</span>
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
