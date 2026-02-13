
// ============ ACTIVE LINK UPDATE ============
function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const links = document.querySelectorAll('.sidebar-links a');
    
    let current = '';
    sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
    }
    });
    
    links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
    }
    });
}

// ============ SIDEBAR LINKS HANDLER ============
document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Update active class
        document.querySelectorAll('.sidebar-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Close mobile menu
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.remove('open');

        // Smooth scroll with offset
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============ SCROLL TO TOP BUTTON ============
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
    scrollToTopBtn.classList.add('show');
    } else {
    scrollToTopBtn.classList.remove('show');
    }
    updateActiveLink();
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ DARK/LIGHT MODE TOGGLE ============
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check for saved light mode preference (default is dark)
if (localStorage.getItem('theme') === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
    darkModeToggle.querySelector('i').className = 'bi bi-sun-fill';
}

darkModeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
    htmlElement.removeAttribute('data-theme');
    darkModeToggle.querySelector('i').className = 'bi bi-moon-stars-fill';
    localStorage.setItem('theme', 'dark');
    } else {
    htmlElement.setAttribute('data-theme', 'light');
    darkModeToggle.querySelector('i').className = 'bi bi-sun-fill';
    localStorage.setItem('theme', 'light');
    }
});

// ============ MOBILE MENU TOGGLE ============
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.querySelector('.sidebar');

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// ============ PROJECT FILTER ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-tech') === filter) {
        card.style.display = 'block';
        setTimeout(() => card.classList.add('show'), 10);
        } else {
        card.classList.remove('show');
        setTimeout(() => card.style.display = 'none', 300);
        }
    });
    });
});

// ============ FORM VALIDATION & SUBMISSION ============
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validation
    if (name.length < 2) {
    e.preventDefault();
    formMessage.textContent = '❌ Name must be at least 2 characters.';
    formMessage.style.color = '#ef4444';
    return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    e.preventDefault();
    formMessage.textContent = '❌ Please enter a valid email.';
    formMessage.style.color = '#ef4444';
    return;
    }

    if (message.length < 10) {
    e.preventDefault();
    formMessage.textContent = '❌ Message must be at least 10 characters.';
    formMessage.style.color = '#ef4444';
    return;
    }

    // If validation passes, Formspree will handle submission
    formMessage.textContent = '⏳ Sending...';
    formMessage.style.color = '#22d3ee';
});

// Handle Formspree responses
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://formspree.io') return;
    
    if (event.data.success) {
    formMessage.textContent = '✅ Message sent successfully!';
    formMessage.style.color = '#22d3ee';
    contactForm.reset();
    setTimeout(() => formMessage.textContent = '', 3000);
    } else if (event.data.errors) {
    formMessage.textContent = '❌ Error sending message. Please try again.';
    formMessage.style.color = '#ef4444';
    }
});

// ============ INTERSECTION OBSERVER (FADE-IN) ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
    } else {
        entry.target.classList.remove('fade-in');
    }
    });
}, observerOptions);

// Observe project cards and skill boxes
document.querySelectorAll('h2, .hero p, .hero-buttons, .project-card, .skill-box, .badge, form').forEach(el => {
    observer.observe(el);
});

// Initialize
updateActiveLink();