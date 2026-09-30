
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle with aria-expanded and body scroll lock
    const menuBtn = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuBtn && mainNav) {
        const mobileNavQuery = window.matchMedia('(max-width: 768px)');

        const syncMobileNavAccessibility = () => {
            const isMobile = mobileNavQuery.matches;
            const isOpen = mainNav.classList.contains('active');

            if (isMobile) {
                mainNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
                mainNav.inert = !isOpen;
            } else {
                mainNav.removeAttribute('aria-hidden');
                mainNav.inert = false;
            }
        };

        const closeMobileNav = (returnFocus = false) => {
            mainNav.classList.remove('active');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            syncMobileNavAccessibility();
            if (returnFocus) menuBtn.focus();
        };

        syncMobileNavAccessibility();
        mobileNavQuery.addEventListener?.('change', syncMobileNavAccessibility);

        menuBtn.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            menuBtn.classList.toggle('active', isActive);
            menuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.classList.toggle('menu-open', isActive);
            syncMobileNavAccessibility();
        });

        // Close menu when a nav link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMobileNav(false));
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMobileNav(true);
            }
        });
    }

    // FAQ Accordion with accessibility
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question, index) => {
        const answer = question.nextElementSibling;
        if (!answer) return;

        const questionId = question.id || `faq-question-${index + 1}`;
        const answerId = answer.id || `faq-answer-${index + 1}`;
        question.id = questionId;
        answer.id = answerId;
        question.setAttribute('aria-controls', answerId);
        question.setAttribute('aria-expanded', question.getAttribute('aria-expanded') === 'true' ? 'true' : 'false');
        answer.setAttribute('role', answer.getAttribute('role') || 'region');
        answer.setAttribute('aria-labelledby', questionId);
        answer.setAttribute('aria-hidden', question.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');

        question.addEventListener('click', () => {
            const item = question.parentNode;
            
            // Close other open items
            const activeItem = document.querySelector('.faq-item.active');
            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('active');
                const activeQuestion = activeItem.querySelector('.faq-question');
                const activeAnswer = activeItem.querySelector('.faq-answer');
                activeQuestion?.setAttribute('aria-expanded', 'false');
                activeAnswer?.setAttribute('aria-hidden', 'true');
            }
            
            // Toggle current item
            const isActive = item.classList.toggle('active');
            question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            answer.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        // Keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });

    // GA4 CTA Click Tracking with location-specific whatsapp_click event
    function trackWhatsAppClick(location) {
        try {
            if (typeof gtag === 'function') {
                gtag('event', 'whatsapp_click', {
                    location: location,
                    page_path: window.location.pathname
                });

                // WhatsApp is the primary conversion path for Asas Material.
                // Every WhatsApp click is treated as a conversion/intent proxy.
                // The location parameter above remains available for analysis.
                if (!sessionStorage.getItem('asas_wa_converted')) {
                    sessionStorage.setItem('asas_wa_converted', '1');
                    gtag('event', 'conversion', {
                        'send_to': 'AW-18319521188/wdu9CM7Q7t0cEKTrtp9E'
                    });
                }
            }
        } catch (e) {
            console.error('Tracking failed', e);
        }
    }

    // Delegated click handler for WhatsApp links
    document.addEventListener('click', function (event) {
        const link = event.target.closest('a[href*="wa.me/6285144901210"]');

        if (!link) return;

        const location =
            link.dataset.waLocation ||
            (link.closest('.site-footer') ? 'footer' :
            link.closest('.wa-float-btn') ? 'floating' :
            link.closest('.nav-cta') ? 'navigation' :
            link.closest('.hero') ? 'hero' :
            link.closest('.cta-section') ? 'cta_section' :
            link.closest('.article-cta') ? 'blog_article' :
            'text_link');

        trackWhatsAppClick(location);
    });
        // Social profile click tracking (GA4 only, not Google Ads conversion)
    document.querySelectorAll('.social-links a[data-platform]').forEach(el => {
        el.addEventListener('click', function() {
            var platform = this.getAttribute('data-platform');
            if (typeof gtag === 'function' && platform) {
                gtag('event', 'social_profile_click', { platform: platform });
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
