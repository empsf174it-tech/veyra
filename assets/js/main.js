import store from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    // Nav toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('open');
            navMenu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', !isOpen);
            
            if (!isOpen) {
                menuToggle.innerHTML = '<i class="ph ph-x"></i>';
            } else {
                menuToggle.innerHTML = '<i class="ph ph-list"></i>';
            }
        });
    }

    // Nav Links - close menu on mobile
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024 && navMenu) {
                navMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', false);
                menuToggle.innerHTML = '<i class="ph ph-list"></i>';
            }
        });
    });

    // Navbar border once scrolled
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // FAQ accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const isOpen = item.classList.toggle('active');
            header.setAttribute('aria-expanded', isOpen);
        });
    });

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // Active Section Highlight
    const sections = document.querySelectorAll('section[id]');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(s => scrollObserver.observe(s));

    // Modals
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            // focus trap
            const closeBtn = modal.querySelector('.modal-close');
            if(closeBtn) closeBtn.focus();
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModal(modal.id);
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // Dropdown toggle for mobile
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const parent = dropdownTrigger.parentElement;
                parent.classList.toggle('active');
            }
        });
    }

    // Generic tabs
    document.querySelectorAll('.tabs-nav').forEach(nav => {
        nav.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const container = e.target.closest('.modal-content') || document;
                const targetId = e.target.getAttribute('data-target');
                if(!targetId) return;

                nav.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                if (container) {
                    const panes = container.querySelectorAll('.tab-pane');
                    // Only hide panes that are siblings/within the same context
                    // To be safe, find all panes that could belong to this tab group
                    const targetPane = container.querySelector(`#${targetId}`);
                    if(targetPane && targetPane.parentElement) {
                        Array.from(targetPane.parentElement.children).forEach(child => {
                            if(child.classList.contains('tab-pane')) {
                                child.classList.remove('active');
                            }
                        });
                        targetPane.classList.add('active');
                    }
                }
            }
        });
    });

    // Auth State Updates for Nav
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        const userStr = localStorage.getItem('veyra_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'admin') {
                authBtn.outerHTML = `
                    <div class="dropdown">
                        <a href="#" class="btn btn-outline">${user.name} <i class="ph ph-caret-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="dashboard.html">Dashboard</a>
                            <a href="#" id="logoutAction">Logout</a>
                        </div>
                    </div>
                `;
            } else {
                authBtn.outerHTML = `
                    <div class="dropdown">
                        <a href="#" class="btn btn-outline">${user.name} <i class="ph ph-caret-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="#" id="logoutAction">Logout</a>
                        </div>
                    </div>
                `;
            }

            document.getElementById('logoutAction')?.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('veyra_user');
                window.location.reload();
            });
        }
    }

    // Render Testimonials
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (testimonialsGrid) {
        const testimonials = store.get('testimonials');
        const treatments = store.get('treatments');
        
        testimonialsGrid.innerHTML = '';
        testimonials.forEach(ts => {
            const tr = treatments.find(t => t.id === ts.treatmentId);
            const card = document.createElement('div');
            card.className = 'card quote-card';
            card.innerHTML = `
                <div class="stars" aria-label="${ts.rating} out of 5 stars">
                    ${Array(ts.rating).fill('<i class="ph-fill ph-star"></i>').join('')}
                </div>
                <blockquote>“${ts.text}”</blockquote>
                <div class="q-foot">
                    <div class="flex items-center gap-3">
                        ${ts.image
                            ? `<img class="avatar" src="${ts.image}" alt="${ts.initials}" loading="lazy">`
                            : `<span class="avatar">${ts.initials}</span>`}
                        <span class="flex flex-col" style="gap: 0; line-height: 1.3;"><strong class="text-sm">${ts.initials}</strong><span class="text-xs text-light">Verified client (demo)</span></span>
                    </div>
                    <span class="badge" style="margin: 0;">${tr ? tr.name : 'Treatment'}</span>
                </div>
            `;
            testimonialsGrid.appendChild(card);
        });
    }
});
