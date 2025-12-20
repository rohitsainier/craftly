/* ===================================
   CRAFTLY WEBSITE SCRIPTS
   =================================== */

(function() {
    'use strict';

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // ===================================
    // NAVBAR FUNCTIONALITY
    // ===================================

    class Navbar {
        constructor() {
            this.navbar = $('#navbar');
            this.mobileMenuToggle = $('#mobileMenuToggle');
            this.mobileMenu = $('#mobileMenu');
            this.mobileNavLinks = $$('.mobile-nav-link');
            this.lastScrollY = 0;
            this.scrollThreshold = 100;

            this.init();
        }

        init() {
            this.handleScroll();
            this.setupMobileMenu();
            this.setupSmoothScroll();
            window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
        }

        handleScroll() {
            const currentScrollY = window.scrollY;

            // Add scrolled class when scrolled down
            if (currentScrollY > this.scrollThreshold) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Hide navbar on scroll down, show on scroll up
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }

            this.lastScrollY = currentScrollY;
        }

        setupMobileMenu() {
            if (!this.mobileMenuToggle) return;

            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.mobileMenu.classList.contains('active') &&
                    !this.mobileMenu.contains(e.target) &&
                    !this.mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu when clicking on links
            this.mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }

        toggleMobileMenu() {
            this.mobileMenu.classList.toggle('active');
            this.mobileMenuToggle.classList.toggle('active');
            document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
        }

        closeMobileMenu() {
            this.mobileMenu.classList.remove('active');
            this.mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }

        setupSmoothScroll() {
            $$('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#' || href === '#download') return;

                    e.preventDefault();
                    const target = $(href);
                    
                    if (target) {
                        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }

    // ===================================
    // FAQ ACCORDION
    // ===================================

    class FAQ {
        constructor() {
            this.faqItems = $$('.faq-item');
            this.init();
        }

        init() {
            this.faqItems.forEach((item, index) => {
                const question = item.querySelector('.faq-question');
                
                question.addEventListener('click', () => {
                    this.toggleFAQ(item, index);
                });
            });
        }

        toggleFAQ(item, index) {
            const isActive = item.classList.contains('active');

            // Close all FAQs
            this.faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });

            // Open clicked FAQ if it wasn't active
            if (!isActive) {
                item.classList.add('active');

                // Track event
                this.trackEvent('FAQ Clicked', {
                    question: index + 1
                });
            }
        }

        trackEvent(eventName, data) {
            // Add analytics tracking here
            console.log('Event:', eventName, data);
        }
    }

    // ===================================
    // FLOATING PARTICLES
    // ===================================

    class FloatingParticles {
        constructor() {
            this.container = $('.floating-particles');
            this.particleCount = 30;
            this.particles = [];

            if (this.container) {
                this.init();
            }
        }

        init() {
            this.createParticles();
            this.animateParticles();
        }

        createParticles() {
            for (let i = 0; i < this.particleCount; i++) {
                const particle = this.createParticle();
                this.container.appendChild(particle);
                this.particles.push({
                    element: particle,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 4 + 2
                });
            }
        }

        createParticle() {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            
            const colors = [
                'rgba(102, 126, 234, 0.3)',
                'rgba(118, 75, 162, 0.3)',
                'rgba(240, 147, 251, 0.3)',
                'rgba(67, 233, 123, 0.3)',
                'rgba(79, 172, 254, 0.3)'
            ];
            
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.filter = 'blur(2px)';
            
            return particle;
        }

        animateParticles() {
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > window.innerWidth) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > window.innerHeight) {
                    particle.vy *= -1;
                }

                // Update position
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                particle.element.style.width = `${particle.size}px`;
                particle.element.style.height = `${particle.size}px`;
            });

            requestAnimationFrame(() => this.animateParticles());
        }
    }

    // ===================================
    // ANIMATE ON SCROLL (AOS)
    // ===================================

    class AnimateOnScroll {
        constructor() {
            this.elements = $$('[data-aos]');
            this.animatedElements = new Set();
            this.init();
        }

        init() {
            this.observe();
            window.addEventListener('scroll', throttle(() => this.checkElements(), 100));
            this.checkElements(); // Initial check
        }

        observe() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateElement(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                this.elements.forEach(element => observer.observe(element));
            } else {
                // Fallback for browsers without IntersectionObserver
                this.checkElements();
            }
        }

        checkElements() {
            this.elements.forEach(element => {
                if (this.isElementInViewport(element) && !this.animatedElements.has(element)) {
                    this.animateElement(element);
                }
            });
        }

        isElementInViewport(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            return (
                rect.top <= windowHeight * 0.9 &&
                rect.bottom >= 0
            );
        }

        animateElement(element) {
            if (this.animatedElements.has(element)) return;

            const delay = element.getAttribute('data-aos-delay') || 0;
            
            setTimeout(() => {
                element.classList.add('aos-animate');
                this.animatedElements.add(element);
            }, delay);
        }
    }

    // ===================================
    // PRICING CARD INTERACTIONS
    // ===================================

    class PricingCards {
        constructor() {
            this.cards = $$('.pricing-card');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.addEventListener('mouseenter', (e) => {
                    this.handleCardHover(e.currentTarget);
                });

                card.addEventListener('mouseleave', (e) => {
                    this.handleCardLeave(e.currentTarget);
                });
            });
        }

        handleCardHover(card) {
            // Add hover effects
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        }

        handleCardLeave(card) {
            // Reset effects
        }
    }

    // ===================================
    // SHOWCASE MODAL
    // ===================================

    class ShowcaseModal {
        constructor() {
            this.playButtons = $$('.play-button');
            this.modal = null;
            this.init();
        }

        init() {
            this.playButtons.forEach((button, index) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openModal(index);
                });
            });
        }

        openModal(index) {
            // Get the showcase item
            const showcaseItem = this.playButtons[index].closest('.showcase-item');
            const gif = showcaseItem.querySelector('.showcase-gif');
            const content = showcaseItem.querySelector('.showcase-content');
            
            // Create modal
            this.modal = document.createElement('div');
            this.modal.className = 'showcase-modal';
            this.modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                    <div class="modal-media">
                        <img src="${gif.src}" alt="${content.querySelector('h3').textContent}">
                    </div>
                    <div class="modal-text">
                        <h3>${content.querySelector('h3').textContent}</h3>
                        <p>${content.querySelector('p').textContent}</p>
                    </div>
                </div>
            `;

            // Add styles
            this.addModalStyles();

            // Append to body
            document.body.appendChild(this.modal);
            document.body.style.overflow = 'hidden';

            // Animate in
            setTimeout(() => {
                this.modal.classList.add('active');
            }, 10);

            // Setup close handlers
            this.modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
            this.modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());
        }

        closeModal() {
            if (!this.modal) return;

            this.modal.classList.remove('active');
            
            setTimeout(() => {
                document.body.removeChild(this.modal);
                document.body.style.overflow = '';
                this.modal = null;
            }, 300);
        }

        addModalStyles() {
            if ($('#showcase-modal-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'showcase-modal-styles';
            styles.textContent = `
                .showcase-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .showcase-modal.active {
                    opacity: 1;
                }

                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                }

                .modal-content {
                    position: relative;
                    max-width: 900px;
                    width: 90%;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }

                .showcase-modal.active .modal-content {
                    transform: scale(1);
                }

                .modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.2s ease;
                }

                .modal-close:hover {
                    background: rgba(0, 0, 0, 0.8);
                    transform: rotate(90deg);
                }

                .modal-close svg {
                    stroke: white;
                }

                .modal-media {
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%);
                }

                .modal-media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .modal-text {
                    padding: 30px;
                }

                .modal-text h3 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #1a202c;
                }

                .modal-text p {
                    font-size: 16px;
                    color: #4a5568;
                    line-height: 1.6;
                }

                @media (max-width: 768px) {
                    .modal-content {
                        width: 95%;
                    }

                    .modal-text {
                        padding: 20px;
                    }

                    .modal-text h3 {
                        font-size: 20px;
                    }

                    .modal-text p {
                        font-size: 14px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // ===================================
    // SCROLL TO TOP BUTTON
    // ===================================

    class ScrollToTop {
        constructor() {
            this.button = this.createButton();
            this.init();
        }

        createButton() {
            const button = document.createElement('button');
            button.className = 'scroll-to-top';
            button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18 15 12 9 6 15"/>
                </svg>
            `;
            button.setAttribute('aria-label', 'Scroll to top');
            
            // Add styles
            this.addStyles();
            
            document.body.appendChild(button);
            return button;
        }

        init() {
            window.addEventListener('scroll', throttle(() => this.toggleButton(), 100));
            this.button.addEventListener('click', () => this.scrollToTop());
        }

        toggleButton() {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        addStyles() {
            if ($('#scroll-to-top-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'scroll-to-top-styles';
            styles.textContent = `
                .scroll-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .scroll-to-top.visible {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .scroll-to-top:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }

                .scroll-to-top svg {
                    stroke: white;
                }

                @media (max-width: 768px) {
                    .scroll-to-top {
                        bottom: 20px;
                        right: 20px;
                        width: 45px;
                        height: 45px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // ===================================
    // CURSOR EFFECTS (OPTIONAL)
    // ===================================

    class CursorEffects {
        constructor() {
            this.cursor = null;
            this.cursorFollower = null;
            this.isDesktop = window.innerWidth > 1024;

            if (this.isDesktop && !('ontouchstart' in window)) {
                this.init();
            }
        }

        init() {
            this.createCursor();
            this.setupEvents();
        }

        createCursor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            
            this.cursorFollower = document.createElement('div');
            this.cursorFollower.className = 'cursor-follower';
            
            document.body.appendChild(this.cursor);
            document.body.appendChild(this.cursorFollower);
            
            this.addStyles();
        }

        setupEvents() {
            let mouseX = 0, mouseY = 0;
            let followerX = 0, followerY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                this.cursor.style.left = `${mouseX}px`;
                this.cursor.style.top = `${mouseY}px`;
            });

            // Smooth follower animation
            const animateFollower = () => {
                followerX += (mouseX - followerX) * 0.1;
                followerY += (mouseY - followerY) * 0.1;
                
                this.cursorFollower.style.left = `${followerX}px`;
                this.cursorFollower.style.top = `${followerY}px`;
                
                requestAnimationFrame(animateFollower);
            };
            animateFollower();

            // Add hover effects
            $$('a, button, .feature-card, .pricing-card').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                    this.cursorFollower.classList.add('hover');
                });
                
                element.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                    this.cursorFollower.classList.remove('hover');
                });
            });
        }

        addStyles() {
            if ($('#cursor-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'cursor-styles';
            styles.textContent = `
                .custom-cursor,
                .cursor-follower {
                    position: fixed;
                    pointer-events: none;
                    z-index: 10000;
                    border-radius: 50%;
                    transition: all 0.1s ease;
                }

                .custom-cursor {
                    width: 10px;
                    height: 10px;
                    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                    transform: translate(-50%, -50%);
                }

                .cursor-follower {
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(102, 126, 234, 0.5);
                    transform: translate(-50%, -50%);
                }

                .custom-cursor.hover {
                    transform: translate(-50%, -50%) scale(1.5);
                }

                .cursor-follower.hover {
                    transform: translate(-50%, -50%) scale(1.5);
                    border-color: rgba(102, 126, 234, 0.8);
                }

                * {
                    cursor: none !important;
                }
            `;
            document.body.appendChild(styles);
        }
    }

    // ===================================
    // ANALYTICS & TRACKING
    // ===================================

    class Analytics {
        constructor() {
            this.init();
        }

        init() {
            this.trackPageView();
            this.trackDownloadClicks();
            this.trackSocialClicks();
        }

        trackPageView() {
            // Add your analytics code here (Google Analytics, Plausible, etc.)
            console.log('Page view tracked');
        }

        trackDownloadClicks() {
            $$('a[href="https://testflight.apple.com/join/rCjyxU41"]').forEach(link => {
                link.addEventListener('click', () => {
                    this.trackEvent('Download Button', 'Click', link.textContent);
                });
            });
        }

        trackSocialClicks() {
            $$('.social-link').forEach(link => {
                link.addEventListener('click', () => {
                    const platform = link.getAttribute('aria-label');
                    this.trackEvent('Social Link', 'Click', platform);
                });
            });
        }

        trackEvent(category, action, label) {
            // Add your event tracking code here
            console.log('Event tracked:', { category, action, label });
            
            // Example: Google Analytics
            // if (window.gtag) {
            //     gtag('event', action, {
            //         'event_category': category,
            //         'event_label': label
            //     });
            // }
        }
    }

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================

    class PerformanceOptimizer {
        constructor() {
            this.init();
        }

        init() {
            this.lazyLoadImages();
            this.prefetchLinks();
        }

        lazyLoadImages() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });

                $$('img[data-src]').forEach(img => imageObserver.observe(img));
            }
        }

        prefetchLinks() {
            // Prefetch important resources on hover
            $$('a').forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        const prefetch = document.createElement('link');
                        prefetch.rel = 'prefetch';
                        prefetch.href = href;
                        document.head.appendChild(prefetch);
                    }
                }, { once: true });
            });
        }
    }

    // ===================================
    // INITIALIZATION
    // ===================================

    class App {
        constructor() {
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        }

        initializeComponents() {
            console.log('🚀 Craftly Website Initialized');

            // Initialize all components
            new Navbar();
            new FAQ();
            new FloatingParticles();
            new AnimateOnScroll();
            new PricingCards();
            new ShowcaseModal();
            new ScrollToTop();
            new Analytics();
            new PerformanceOptimizer();

            // Optional: Custom cursor (uncomment to enable)
            // new CursorEffects();

            // Add loaded class to body
            document.body.classList.add('loaded');

            // Easter egg
            console.log(
                '%c🎨 Craftly - Built with ❤️',
                'background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: white; padding: 10px 20px; font-size: 16px; border-radius: 8px;'
            );
        }
    }

    // Start the app
    new App();

})();