document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
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
        const rainContainer = document.getElementById('rain-container');
        const path = document.getElementById('growth-path');
        if (!rainContainer || !path) return;
        
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
        const chart = document.getElementById('main-chart-svg');
        const path = document.getElementById('growth-path-2');
        const areaPath = document.getElementById('area-path');
        const leadsCounter = document.getElementById('leads-counter');
        const conversionCounter = document.getElementById('conversion-counter');
        const sentCounter = document.getElementById('sent-counter');
        const points = [
            document.getElementById('point-1'),
            document.getElementById('point-2'),
            document.getElementById('point-3')
        ];

        if (!chart || !path || !areaPath || !leadsCounter || !conversionCounter || !sentCounter) return;

        const finalLeads = 86;
        const finalSent = 1000;
        const finalConversion = 8.6;
        let animationFrameId;

        function startAnimation() {
            const pathLength = path.getTotalLength();
            path.style.strokeDasharray = String(pathLength);
            path.style.strokeDashoffset = String(pathLength);
            
            const startTime = performance.now();

            function animate(time) {
                const duration = 4000; // shorter duration for demo
                const elapsed = time - startTime;
                let progress = Math.min(elapsed / duration, 1);

                path.style.strokeDashoffset = String(pathLength * (1 - progress));
                if(areaPath) areaPath.style.opacity = String(progress);

                const currentLeads = Math.floor(finalLeads * progress);
                const currentSent = Math.floor(finalSent * progress);
                const currentConversion = finalConversion * progress;

                if(leadsCounter) leadsCounter.textContent = `${currentLeads} лидов`;
                if(sentCounter) sentCounter.textContent = `${currentSent} сообщ.`;
                if(conversionCounter) conversionCounter.textContent = `${currentConversion.toFixed(1)}% конверсия`;
                
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
                    if(path) path.style.transition = 'stroke-dashoffset 4s ease-out';
                }, 50);

                startAnimation();
                observer.unobserve(chart);
            }
        }, { threshold: 0.5 });

        observer.observe(chart);
        
        return () => {
             cancelAnimationFrame(animationFrameId);
             if (chart) {
                observer.unobserve(chart);
             }
        }
    };
    
    setupMoneyRain();
    setupSyncChart();

});
