/* ============================================
   TAEYUL KWON PORTFOLIO — INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- 글자별 호버 효과 ---
    const roleAnimation = document.getElementById('roleAnimation');
    const roleLines = document.querySelectorAll('.role-line');

    roleLines.forEach(line => {
        const text = line.textContent;
        line.textContent = '';
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.className = 'role-char';
            span.textContent = char;
            line.appendChild(span);
        });
    });

    if (roleAnimation) {
        roleAnimation.addEventListener('mouseenter', () => {
            roleAnimation.classList.add('char-hover');
        });
        roleAnimation.addEventListener('mouseleave', () => {
            roleAnimation.classList.remove('char-hover');
        });
    }

    // --- 글자 클릭 시 색 채우기 ---
    document.querySelectorAll('.role-char').forEach(char => {
        char.addEventListener('click', () => {
            char.classList.toggle('filled');
        });
    });

    // --- 히어로 부유 파티클 시스템 ---
    const canvas = document.getElementById('particleCanvas');
    const heroEl = document.getElementById('hero');
    if (canvas && heroEl) {
        const ctx = canvas.getContext('2d');
        let mouse = { x: -9999, y: -9999 };
        const PARTICLE_COUNT = 1000;
        const MOUSE_RADIUS = 120;
        const particles = [];

        function resizeCanvas() {
            canvas.width = heroEl.offsetWidth;
            canvas.height = heroEl.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        heroEl.addEventListener('mousemove', (e) => {
            const rect = heroEl.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroEl.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        class FloatingParticle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.originX = this.x;
                this.originY = this.y;
                this.size = 0.75 + Math.random() * 1.25;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.alpha = 0.15 + Math.random() * 0.35;
            }
            update() {
                // 느린 부유 이동
                this.x += this.vx;
                this.y += this.vy;

                // 경계 반사
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // 마우스 반발력
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 8;
                    this.y += Math.sin(angle) * force * 8;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(55, 95, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new FloatingParticle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- 이메일 복사 ---
    const emailCopy = document.getElementById('emailCopy');
    if (emailCopy) {
        emailCopy.addEventListener('click', () => {
            const email = emailCopy.dataset.email;
            const icon = emailCopy.querySelector('.copy-icon');
            const originalHTML = icon ? icon.innerHTML : '';
            navigator.clipboard.writeText(email).then(() => {
                emailCopy.classList.add('copied');
                if (icon) icon.innerHTML = '✓';
                setTimeout(() => {
                    emailCopy.classList.remove('copied');
                    if (icon) icon.innerHTML = originalHTML;
                }, 2000);
            });
        });
    }

    // --- 커스텀 커서 ---
    const cursorDot = document.getElementById('cursorDot');
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    // 모바일 체크
    const isMobile = window.innerWidth < 768;

    if (!isMobile && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            dotX += (mouseX - dotX) * 0.15;
            dotY += (mouseY - dotY) * 0.15;
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // 호버 시 커서 확대
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-tag');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hover'));
        });
    }

    // --- 헤더 스크롤 효과 ---
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- 스크롤 리빌 애니메이션 ---
    const revealElements = document.querySelectorAll(
        '.project-card, .about-brief, .stat-item, .skill-tag, .contact-link'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 순차적 등장 효과
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 프로젝트 카드 호버 효과 ---
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const image = card.querySelector('.card-image');

        card.addEventListener('mouseenter', () => {
            // 다른 카드 흐림 효과
            projectCards.forEach(other => {
                if (other !== card) {
                    other.style.opacity = '0.4';
                    other.style.transition = 'opacity 0.4s ease';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            projectCards.forEach(other => {
                other.style.opacity = '1';
            });
        });

        // 터치 이벤트 (모바일 대응)
        card.addEventListener('touchstart', () => {
            image.style.transform = 'translateY(-4px)';
        }, { passive: true });

        card.addEventListener('touchend', () => {
            image.style.transform = 'translateY(0)';
        }, { passive: true });
    });

    // --- 숫자 카운트업 애니메이션 ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const target = parseFloat(text);
                const suffix = text.replace(/[\d.]/g, '');
                const decimals = (text.split('.')[1] || '').replace(/\D/g, '').length;
                let current = 0;
                const steps = 30;
                const increment = target / steps;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.ceil(current)) + suffix;
                }, 40);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));

    // --- 부드러운 스크롤 네비게이션 ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 페이지 로드 애니메이션 ---
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

});
