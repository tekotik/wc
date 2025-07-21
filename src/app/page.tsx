
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ElsenderLogo } from '@/components/icons';
import { Sparkles, ShieldCheck, Rocket, BarChart2, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const rainContainerRef = useRef<SVGGElement>(null);
  const growthPathRef = useRef<SVGPathElement>(null);

  // Refs for the new synchronized chart
  const mainChartRef = useRef<SVGSVGElement>(null);
  const growthPath2Ref = useRef<SVGPathElement>(null);
  const areaPathRef = useRef<SVGPathElement>(null);
  const leadsCounterRef = useRef<SVGTextElement>(null);
  const conversionCounterRef = useRef<SVGTextElement>(null);
  const sentCounterRef = useRef<SVGTextElement>(null);
  const point1Ref = useRef<SVGCircleElement>(null);
  const point2Ref = useRef<SVGCircleElement>(null);
  const point3Ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // --- Mobile Menu Logic ---
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
    
    // --- Money Rain Animation Logic ---
    const setupMoneyRain = () => {
        const rainContainer = rainContainerRef.current;
        const path = growthPathRef.current;
        if (!rainContainer || !path) return;
        
        // Clear previous symbols if any
        rainContainer.innerHTML = '';

        const pathLength = path.getTotalLength();
        const numSources = 15;

        for (let i = 0; i < numSources; i++) {
            const point = path.getPointAtLength((i / (numSources - 1)) * pathLength);
            const numRubles = Math.floor(Math.random() * (13 - 7 + 1)) + 7;

            for (let j = 0; j < numRubles; j++) {
                const symbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
                symbol.setAttribute('x', String(point.x));
                symbol.setAttribute('y', String(point.y));
                symbol.setAttribute('class', 'currency-symbol');
                symbol.textContent = '₽';

                const duration = Math.random() * 2 + 2;
                const delay = Math.random() * 4;
                const startX = Math.random() * 20 - 10;
                const endX = Math.random() * 80 - 40;
                const rotation = Math.random() * 720 - 360;

                symbol.style.setProperty('--start-x', `${startX}px`);
                symbol.style.setProperty('--end-x', `${endX}px`);
                symbol.style.setProperty('--r', `${rotation}deg`);
                symbol.style.animationDuration = `${duration}s`;
                symbol.style.animationDelay = `${delay}s`;
                
                rainContainer.appendChild(symbol);
            }
        }
    };

    // --- Synchronized Growth Chart Animation Logic ---
    const setupSyncChart = () => {
        const chart = mainChartRef.current;
        const path = growthPath2Ref.current;
        const areaPath = areaPathRef.current;
        const leadsCounter = leadsCounterRef.current;
        const conversionCounter = conversionCounterRef.current;
        const sentCounter = sentCounterRef.current;
        const points = [point1Ref.current, point2Ref.current, point3Ref.current];

        if (!chart || !path || !areaPath || !leadsCounter || !conversionCounter || !sentCounter) return;

        const finalLeads = 86;
        const finalSent = 1000;
        const finalConversion = 8.6;
        let animationFrameId: number;

        function startAnimation() {
            const pathLength = path.getTotalLength();
            path.style.strokeDasharray = String(pathLength);
            path.style.strokeDashoffset = String(pathLength);
            
            const startTime = performance.now();

            function animate(time: number) {
                const duration = 60000;
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);

                path.style.strokeDashoffset = String(pathLength * (1 - progress));
                areaPath.style.opacity = String(progress);

                const currentLeads = Math.floor(finalLeads * progress);
                const currentSent = Math.floor(finalSent * progress);
                const currentConversion = finalConversion * progress;

                leadsCounter.textContent = `${currentLeads} лидов`;
                sentCounter.textContent = `${currentSent} сообщ.`;
                conversionCounter.textContent = `${currentConversion.toFixed(1)}% конверсия`;
                
                points.forEach((p, i) => {
                    if (p) {
                        if (progress > 0.01 && i === 0) p.style.opacity = '1';
                        if (progress >= 0.5 && i === 1) p.style.opacity = '1';
                        if (progress >= 1 && i === 2) p.style.opacity = '1';
                    }
                });

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            }
            
            animationFrameId = requestAnimationFrame(animate);
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const pathLength = path.getTotalLength();
                path.style.transition = 'none';
                path.style.strokeDashoffset = String(pathLength);
                if(areaPath) areaPath.style.opacity = '0';
                points.forEach(p => { if(p) p.style.opacity = '0' });
                
                setTimeout(() => {
                    if(path) path.style.transition = '';
                }, 50);

                startAnimation();
                observer.unobserve(chart);
            }
        }, { threshold: 0.5 });

        observer.observe(chart);
        
        return () => {
             cancelAnimationFrame(animationFrameId);
             observer.unobserve(chart);
        }
    };
    
    setupMoneyRain();
    const cleanupSyncChart = setupSyncChart();

    return () => {
         // --- Cleanup Listeners ---
         mobileMenuButton?.removeEventListener('click', openMenu);
         closeMenuButton?.removeEventListener('click', closeMenu);
         menuLinks?.forEach(link => {
            link.removeEventListener('click', closeMenu);
         });
         if(cleanupSyncChart) cleanupSyncChart();
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
                Войти
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
            Войти
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
             <div className="absolute inset-0 z-0 overflow-hidden">
                <svg ref={mainChartRef} id="money-rain-svg" className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22D3EE"></stop>
                            <stop offset="50%" stopColor="#34D399"></stop>
                            <stop offset="100%" stopColor="#6EE7B7"></stop>
                        </linearGradient>
                        <linearGradient id="currencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#A7F3D0"></stop>
                            <stop offset="100%" stopColor="#6EE7B7"></stop>
                        </linearGradient>
                    </defs>
                    <path
                        ref={growthPathRef}
                        id="growth-path"
                        className="growth-line"
                        d="M -50 150 C 150 180, 250 100, 400 120 S 600 80, 850 100"
                        stroke="url(#processGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                    <g ref={rainContainerRef} id="rain-container"></g>
                </svg>
            </div>
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Тарифы</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Отправьте сообщения — получите результат</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Превратите рассылки в реальные продажи. Наша платформа показывает прозрачную воронку от отправки до лида.</p>
            </div>
            <div className="relative w-full max-w-4xl p-4 mx-auto">
              <svg ref={mainChartRef} className="w-full h-auto" viewBox="0 0 500 250">
                <defs>
                  <linearGradient id="processGradientChart" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="50%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#6EE7B7" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#111827" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g className="grid" stroke="#1F2937" strokeWidth="1">
                  <line x1="50" y1="200" x2="450" y2="200" /><line x1="50" y1="150" x2="450" y2="150" /><line x1="50" y1="100" x2="450" y2="100" /><line x1="50" y1="50" x2="450" y2="50" />
                </g>
                <path ref={areaPathRef} d="M 50 200 C 150 200, 200 100, 250 100 S 350 100, 450 40 L 450 200 Z" fill="url(#areaGradient)" opacity="0" />
                <path ref={growthPath2Ref} className="growth-line" d="M 50 200 C 150 200, 200 100, 250 100 S 350 100, 450 40" stroke="url(#processGradientChart)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#glow)' }} />
                <g>
                  <circle ref={point1Ref} cx="50" cy="200" r="6" fill="#111827" stroke="#22D3EE" strokeWidth="2" opacity="0" />
                  <circle ref={point2Ref} cx="250" cy="100" r="6" fill="#111827" stroke="#34D399" strokeWidth="2" opacity="0" />
                  <circle ref={point3Ref} cx="450" cy="40" r="6" fill="#111827" stroke="#6EE7B7" strokeWidth="2" opacity="0" />
                </g>
                <g className="text-group">
                  <text x="50" y="35" fontSize="12" fill="#9CA3AF">Результат рассылки:</text>
                  <text ref={leadsCounterRef} x="50" y="65" fontSize="28" fontWeight="bold" fill="#FFFFFF">0 лидов</text>
                  <text ref={conversionCounterRef} x="50" y="85" fontSize="14" fill="#A7F3D0">0.0% конверсия</text>
                  <text x="450" y="25" textAnchor="end" fontSize="12" fill="#9CA3AF">Отправлено:</text>
                  <text ref={sentCounterRef} x="450" y="45" textAnchor="end" fontSize="16" fontWeight="bold" fill="#FFFFFF">0 сообщ.</text>
                </g>
                <g fill="#4B5563" fontSize="12">
                  <text x="50" y="220">День 1</text>
                  <text x="250" y="220" textAnchor="middle">День 2</text>
                  <text x="450" y="220" textAnchor="end">День 3</text>
                </g>
              </svg>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-cyan-500 rounded-full text-2xl font-bold text-cyan-400 mb-4">1</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-headline">Создайте рассылку</h3>
                  <p className="text-gray-400">Загрузите базу, настройте текст и отправьте на проверку.</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500/50 rounded-full text-2xl font-bold text-green-400/80 mb-4">2</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-headline">Пройдите модерацию</h3>
                  <p className="text-gray-400">Наша команда быстро проверит вашу кампанию.</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-800 border-2 border-green-500 rounded-full text-2xl font-bold text-green-400 mb-4">3</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-headline">Запустите и анализируйте</h3>
                  <p className="text-gray-400">Следите за результатами в реальном времени.</p>
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
