
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

// ============ PROJECT MODAL & DATA ============
const projectModal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

const projectsData = {
  "portfolio": {
    details: `
**Overview**
This portfolio is a showcase of modern frontend development practices. It features a glassmorphism design system, fully responsive layout, and performance optimizations.

**Key Features:**
- Dark/Light mode with local storage persistence
- Smooth scrolling and active link highlighting
- **Intersection Observer** for scroll animations
- Formspree integration for contact emails

**Technical Implementation**
The project utilizes vanilla JavaScript for maximum performance without heavy framework overhead. CSS variables handle the theming engine, allowing for instant switching between dark and light modes. The layout relies on CSS Grid for the project cards and Flexbox for the navigation components.

The modal system is custom-built to support dynamic content loading, ensuring that the DOM remains lightweight by only populating details when requested.
    `
  },
  "todo": {
    details: `
**Overview**
A minimal yet functional Todo application built with vanilla JavaScript. It focuses on CRUD operations and state management without external libraries.

**Key Features:**
- Add, edit, and delete tasks
- Local Storage support to save data
- Filter tasks by status (All, Active, Completed)
- **Drag and drop** reordering (planned)

**Future Improvements**
Planned updates include adding a backend with Node.js to support user accounts and cloud syncing. I also plan to implement a drag-and-drop library like SortableJS to allow users to prioritize their tasks visually.
    `
  },
  "weather": {
    details: `
**Overview**
A real-time weather dashboard that fetches data from the OpenWeatherMap API. It handles asynchronous requests and updates the DOM dynamically.

**Key Features:**
- Search by city name
- Displays temperature, humidity, and wind speed
- Dynamic background based on weather conditions
- **Error handling** for invalid city names
    `
  }
};

// Simple Markdown Parser
function parseMarkdown(text) {
  const lines = text.trim().split('\n');
  let html = '';
  let inList = false;

  lines.forEach(line => {
    line = line.trim();
    // Bold formatting
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.substring(2)}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (line.length > 0) html += `<p>${line}</p>`;
    }
  });
  if (inList) html += '</ul>';
  return html;
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Prevent opening if clicking a link inside the card
    if (e.target.tagName === 'A') return;

    const id = card.getAttribute('data-id');
    const data = projectsData[id];
    const title = card.querySelector('h3').innerText;
    const img = card.querySelector('img').src;

    if (data) {
      modalBody.innerHTML = `
        <img src="${img}" style="width:100%; height: 200px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
        <h3>${title}</h3>
        ${parseMarkdown(data.details)}
      `;
      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

modalClose.addEventListener('click', () => {
  projectModal.classList.remove('open');
  document.body.style.overflow = '';
});

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});