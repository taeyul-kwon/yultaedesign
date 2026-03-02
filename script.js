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
                const target = parseInt(el.textContent);
                const suffix = el.textContent.replace(/\d/g, '');
                let current = 0;
                const increment = Math.ceil(target / 30);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
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
