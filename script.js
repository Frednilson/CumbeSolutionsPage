// script.js - Frontend completo com integração para Email e WhatsApp

// Configuração da API
const API_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function() {
    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
        }, 1000);
    }
    
    // Initialize AOS
    AOS.init({ duration: 800, once: true, offset: 100 });
    
    // Initialize Typed.js - CORRIGIDO
    if (document.querySelector('.typed-text')) {
        new Typed('.typed-text', {
            strings: ['Soluções Digitais', 'Sistemas Web', 'ERPs', 'Websites', 'Automação'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Dark Mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const darkModeIcon = darkModeToggle.querySelector('i');
        
        // Check local storage
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            if (darkModeIcon) {
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
            }
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                if (darkModeIcon) {
                    darkModeIcon.classList.remove('fa-moon');
                    darkModeIcon.classList.add('fa-sun');
                }
            } else {
                localStorage.setItem('darkMode', 'disabled');
                if (darkModeIcon) {
                    darkModeIcon.classList.remove('fa-sun');
                    darkModeIcon.classList.add('fa-moon');
                }
            }
        });
    }
    
    // Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
        
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
            });
        });
    }
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Progress Bar
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // Portfolio Filter - VERSÃO CORRIGIDA (sem distorção)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Atualizar botão ativo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');
                
                // Filtrar os cards com animação suave
                portfolioCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        // Mostrar o card
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                            card.style.visibility = 'visible';
                        }, 50 + (index * 30));
                    } else {
                        // Esconder o card suavemente
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px) scale(0.95)';
                        card.style.visibility = 'hidden';
                        setTimeout(() => {
                            if (card.style.opacity === '0') {
                                card.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });
    }
    
    // CONTACT FORM
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    function showFieldError(field, message) {
        const group = field.closest('.form-group');
        const errorSpan = group.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        field.style.borderColor = '#dc2626';
        setTimeout(() => {
            if (errorSpan) errorSpan.textContent = '';
            field.style.borderColor = '';
        }, 3000);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('serviceType').value;
            const message = document.getElementById('message').value.trim();
            
            // Validações
            if (!name) {
                showFieldError(document.getElementById('name'), 'Digite seu nome completo');
                return;
            }
            if (name.length < 2) {
                showFieldError(document.getElementById('name'), 'Nome muito curto');
                return;
            }
            
            if (!email) {
                showFieldError(document.getElementById('email'), 'Digite seu e-mail');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFieldError(document.getElementById('email'), 'E-mail inválido');
                return;
            }
            
            if (!service) {
                showFieldError(document.getElementById('serviceType'), 'Selecione o serviço desejado');
                return;
            }
            
            if (!message) {
                showFieldError(document.getElementById('message'), 'Descreva seu projeto');
                return;
            }
            if (message.length < 10) {
                showFieldError(document.getElementById('message'), 'Descreva melhor seu projeto (mínimo 10 caracteres)');
                return;
            }
            
            // Desabilita botão durante envio
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando solicitação...';
            formMessage.innerHTML = '';
            
            try {
                const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, service, message })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    formMessage.innerHTML = `
                        <div style="background: #16a34a20; border: 2px solid #16a34a; border-radius: 12px; padding: 15px;">
                            <strong>✅ Solicitação enviada com sucesso!</strong><br>
                            📧 Você receberá uma confirmação no e-mail <strong>${email}</strong><br>
                            💬 Nossa equipe entrará em contato pelo WhatsApp em breve!<br>
                            <small>📅 Respondemos em até 2 horas úteis.</small>
                        </div>
                    `;
                    contactForm.reset();
                } else {
                    throw new Error('Erro no servidor');
                }
            } catch (error) {
                console.log('Backend não disponível, usando fallback do WhatsApp');
                
                const whatsappNumber = '258844124493';
                const whatsappText = `*Nova Solicitação CumbeSolutions*%0A%0A` +
                    `*👤 Nome:* ${encodeURIComponent(name)}%0A` +
                    `*📧 Email:* ${encodeURIComponent(email)}%0A` +
                    `*📞 Telefone:* ${encodeURIComponent(phone || 'Não informado')}%0A` +
                    `*🎯 Serviço:* ${encodeURIComponent(service)}%0A` +
                    `*💬 Mensagem:* ${encodeURIComponent(message)}%0A%0A` +
                    `*📅 Data:* ${encodeURIComponent(new Date().toLocaleString('pt-BR'))}`;
                
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;
                
                formMessage.innerHTML = `
                    <div style="background: #fbbf2420; border: 2px solid #fbbf24; border-radius: 12px; padding: 15px;">
                        <strong>⚠️ Modo de contingência ativado</strong><br>
                        Clique no botão abaixo para enviar sua solicitação pelo WhatsApp:<br><br>
                        <a href="${whatsappUrl}" target="_blank" class="btn primary" style="background: #25d366;">
                            💬 Enviar pelo WhatsApp
                        </a>
                    </div>
                `;
                
                window.open(whatsappUrl, '_blank');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar Mensagem <i class="fas fa-paper-plane"></i>';
                
                setTimeout(() => {
                    if (formMessage.innerHTML && !formMessage.innerHTML.includes('⚠️')) {
                        formMessage.innerHTML = '';
                    }
                }, 8000);
            }
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value.trim();
            
            if (!email) {
                newsletterMessage.innerHTML = '❌ Digite seu e-mail';
                newsletterMessage.style.color = '#fbbf24';
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/newsletter`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                
                if (response.ok) {
                    newsletterMessage.innerHTML = '✅ Inscrição realizada! Você receberá nossas novidades.';
                    newsletterMessage.style.color = '#16a34a';
                    newsletterForm.reset();
                } else {
                    newsletterMessage.innerHTML = '✅ Inscrição registrada! (modo offline)';
                    newsletterMessage.style.color = '#16a34a';
                    newsletterForm.reset();
                }
            } catch (error) {
                newsletterMessage.innerHTML = '✅ Inscrição registrada! Obrigado.';
                newsletterMessage.style.color = '#16a34a';
                newsletterForm.reset();
            }
            
            setTimeout(() => {
                newsletterMessage.innerHTML = '';
            }, 5000);
        });
    }
    
    // Back to Top - CORRIGIDO
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#privacyLink' || targetId === '#termsLink') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', (e) => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
            if (e.target.value && !isValid) {
                e.target.style.borderColor = '#dc2626';
            } else if (e.target.value && isValid) {
                e.target.style.borderColor = '#16a34a';
            } else {
                e.target.style.borderColor = '';
            }
        });
    }
    
    // Modals
    const privacyModal = document.getElementById('privacyModal');
    const termsModal = document.getElementById('termsModal');
    
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (privacyModal) privacyModal.classList.add('active');
        });
    }
    
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) termsModal.classList.add('active');
        });
    }
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            if (privacyModal) privacyModal.classList.remove('active');
            if (termsModal) termsModal.classList.remove('active');
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === privacyModal) privacyModal.classList.remove('active');
        if (e.target === termsModal) termsModal.classList.remove('active');
    });
    
    // Code window animation
    const codeLines = document.getElementById('codeLines');
    if (codeLines) {
        const originalContent = codeLines.innerHTML;
        codeLines.innerHTML = '';
        let lineIndex = 0;
        const lines = originalContent.split('\n');
        
        function animateCodeLines() {
            if (lineIndex < lines.length) {
                codeLines.innerHTML = lines.slice(0, lineIndex + 1).join('\n');
                lineIndex++;
                setTimeout(animateCodeLines, 150);
            }
        }
        
        setTimeout(() => {
            animateCodeLines();
        }, 500);
    }
    
    // Console greeting
    console.log('%c🚀 CumbeSolutions - Sistema Online!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
    console.log('%c📧 Recebendo solicitações em: solutionscumbe@gmail.com', 'color: #16a34a; font-size: 12px;');
    console.log('%c💬 WhatsApp: 258844124493', 'color: #25d366; font-size: 12px;');
});

// Cookie consent
function acceptCookies() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.style.display = 'none';
        localStorage.setItem('cookiesAccepted', 'true');
    }
}

// Check for cookie consent
if (localStorage.getItem('cookiesAccepted') === 'true') {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) cookieConsent.style.display = 'none';
}

// Copy email function
function copyEmail() {
    const email = 'solutionscumbe@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const copyBtn = document.querySelector('.copy-btn i');
        if (copyBtn) {
            const originalClass = copyBtn.className;
            copyBtn.className = 'fas fa-check';
            setTimeout(() => {
                copyBtn.className = originalClass;
            }, 2000);
        }
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}