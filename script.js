const root = document.documentElement;
const header = document.querySelector('.site-header');
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  root.dataset.theme = 'light';
}

function updateThemeLabel() {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
}

updateThemeLabel();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', root.dataset.theme);
  updateThemeLabel();
});

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('.sr-only').textContent = isOpen ? 'Close navigation' : 'Open navigation';
});

links.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('.sr-only').textContent = 'Open navigation';
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('.sr-only').textContent = 'Open navigation';
  }
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-30% 0px -55% 0px' });

sections.forEach((section) => sectionObserver.observe(section));
document.querySelector('#year').textContent = new Date().getFullYear();
