// Navigation scroll effect
const nav = document.getElementById('main-nav');
const maxScroll = 1000;
let rafId = null;

function updateNav() {
  if (window.scrollY > 0) {
    nav.classList.add('scrolling');
    
    if (window.innerWidth >= 768) {
      const scrollProgress = Math.min(window.scrollY / maxScroll, 1);
      const easeProgress = 1 - Math.pow(1 - scrollProgress, 4);
      const minWidth = 528;
      const maxWidth = window.innerWidth * 0.8;
      const currentWidth = maxWidth - (maxWidth - minWidth) * easeProgress;
      nav.style.setProperty('width', `${currentWidth}px`);
    }
  } else {
    nav.classList.remove('scrolling');
    if (window.innerWidth >= 768) {
      nav.style.setProperty('width', '80%');
    }
  }
  rafId = null;
}

window.addEventListener('scroll', () => {
  if (!rafId) {
    rafId = requestAnimationFrame(updateNav);
  }
}, { passive: true });

// Active nav indicator
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const observerOptions = { threshold: 0.6 };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`nav a[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => observer.observe(section));

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    });
  });
});

// Formspree contact form handling
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      form.style.display = 'none';
      formMessage.classList.add('show');

      // Reset after 3 seconds
      setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        formMessage.classList.remove('show');
      }, 3000);
    } else {
      const data = await response.json();
      if (data.errors) {
        alert('There was a problem sending your message.');
        console.error('Form errors:', data.errors);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('There was a problem sending your message.');
  }
});
