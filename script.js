// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 500, // was 800
    easing: 'ease-in-out',
    once: true,
    offset: 80 // was 100
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initScrollToTop();
    initSmoothScrolling();
    initTypingEffect();
    initScrollAnimations();
    initEqualCardHeights();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(112, 102, 119, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(112, 102, 119, 0.1)';
        }
    });
    
    // Active nav link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Typing effect for hero description
function initTypingEffect() {
    const heroDescription = document.querySelector('.hero-description');
    if (!heroDescription) return;

    const words = ["Code", "Data Structures", "Algorithms", "WEB", "Aritificial Intelligence", "CLOUD", "SYSTEM DESIGN"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    heroDescription.textContent = '';
    heroDescription.style.borderRight = '2px solid var(--accent-blue)';

    const type = () => {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            heroDescription.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 900);
                return;
            }
        } else {
            heroDescription.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        const delay = isDeleting ? 60 : 90;
        setTimeout(type, delay);
    };

    setTimeout(type, 600);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.05, // was 0.1
        rootMargin: '0px 0px -20px 0px' // was -50px
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                observer.unobserve(entry.target); // Only animate once for performance
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.skill-tag, .achievement-card, .project-card, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Project card hover effects
function initProjectHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Skill tag click effects
function initSkillTagEffects() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Add a ripple effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Contact form functionality (if needed)
function initContactForm() {
    const contactForm = document.getElementById('contactEmailForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values directly from input elements
            const name = document.getElementById('cf-name').value.trim();
            const subject = document.getElementById('cf-subject').value.trim();
            const message = document.getElementById('cf-message').value.trim();
            
            // Simple validation
            if (!name || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Create mailto URL to open email application
            const to = 'kashyaprupareliya1811@gmail.com';
            const body = `From: ${name}%0D%0A%0D%0A${encodeURIComponent(message)}`;
            const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            // Open email application
            window.location.href = mailtoUrl;
            
            // Reset form after opening email app
            setTimeout(() => {
                this.reset();
            }, 1000);
        });
    }
}

// Social link hover effects
function initSocialLinkEffects() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
}

// Achievement card counter animation
function initAchievementCounters() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    achievementCards.forEach(card => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class
                    card.style.animation = 'slideInUp 0.6s ease-out';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);
    });
}

// Profile image hover effect
function initProfileImageEffect() {
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
}

// Equalize card heights per row across sections
function initEqualCardHeights() {
    const groupConfigs = [
        { containerSelector: '.projects-grid', cardSelector: '.project-card' },
        { containerSelector: '#achievements .row', cardSelector: '.project-card' },
        { containerSelector: '#achievements .projects-grid', cardSelector: '.project-card' },
        { containerSelector: '#achievements .grid-3', cardSelector: '.project-card' }
    ];

    const equalizeInContainer = (container, cardSelector) => {
        const cards = Array.from(container.querySelectorAll(cardSelector));
        if (cards.length === 0) return;
        // reset before measuring
        cards.forEach(card => (card.style.height = 'auto'));
        // group by visual row using top coordinate
        const rows = new Map();
        cards.forEach(card => {
            const top = Math.round(card.getBoundingClientRect().top);
            if (!rows.has(top)) rows.set(top, []);
            rows.get(top).push(card);
        });
        // set each row to the max height
        rows.forEach(rowCards => {
            const maxH = Math.max(...rowCards.map(c => c.offsetHeight));
            rowCards.forEach(c => (c.style.height = `${maxH}px`));
        });
    };

    const run = () => {
        groupConfigs.forEach(cfg => {
            document.querySelectorAll(cfg.containerSelector).forEach(container => {
                equalizeInContainer(container, cfg.cardSelector);
            });
        });
    };

    // run now and on next frame to ensure images loaded
    run();
    setTimeout(run, 200);

    // re-run on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(run, 200);
    });
}

// Masonry grid auto-row span calculator
function initMasonrySpans() {
  const masonry = document.querySelector('.masonry');
  if (!masonry) return;
  const rowHeight = parseInt(getComputedStyle(masonry).getPropertyValue('grid-auto-rows')) || 10;
  const gap = parseInt(getComputedStyle(masonry).getPropertyValue('gap')) || 0;

  const calcSpan = (item) => {
    const content = item.firstElementChild;
    if (!content) return;
    content.style.gridRowEnd = null;
    const totalHeight = content.getBoundingClientRect().height + gap;
    const span = Math.ceil(totalHeight / (rowHeight + gap));
    item.style.gridRowEnd = `span ${span}`;
  };

  const run = () => {
    masonry.querySelectorAll('.masonry-item').forEach(calcSpan);
  };

  // run after load and after images load
  window.addEventListener('load', run);
  run();
  setTimeout(run, 300);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(run, 200);
  });
}

// Initialize masonry spans
initMasonrySpans();

// Initialize all interactive features
document.addEventListener('DOMContentLoaded', function() {
    initProjectHoverEffects();
    initSkillTagEffects();
    initContactForm();
    initSocialLinkEffects();
    initAchievementCounters();
    initProfileImageEffect();
    
    // Ensure resume download link works properly
    const resumeLink = document.querySelector('.resume-download a');
    if (resumeLink) {
        resumeLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior
            console.log('Resume link clicked - opening in new window');
            
            // Explicitly open in new window
            const url = this.getAttribute('href');
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }
    
    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
    }
});

// Utility function for smooth scrolling to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);