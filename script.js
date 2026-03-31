/* ═══════════════════════════════════════════════════════
   script.js — Portfolio Interactions
═══════════════════════════════════════════════════════ */

'use strict';

// ─── NAV: scroll state & mobile toggle ───────────────────────────────────────

const nav        = document.querySelector('.nav');
const navToggle  = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// ─── TERMINAL TYPEWRITER ─────────────────────────────────────────────────────

const terminalEl = document.getElementById('terminalCode');

const codeLines = [
  { text: '// Aymen Ben Ali — system init', color: '#555568' },
  { text: '', color: '' },
  { text: '#include "stm32f4xx.h"', color: '#00c4ff' },
  { text: '#include "mqtt_client.h"', color: '#00c4ff' },
  { text: '#include "xbee_rf.h"', color: '#00c4ff' },
  { text: '', color: '' },
  { text: 'int main(void) {', color: '#e4e4f0' },
  { text: '  GPIO_Init(GPIOA, &GPIO_InitStruct);', color: '#888899' },
  { text: '  MQTT_Connect("broker.local", 1883);', color: '#888899' },
  { text: '  XBee_SetChannel(0x0C); // 868 MHz', color: '#888899' },
  { text: '', color: '' },
  { text: '  while(1) {', color: '#e4e4f0' },
  { text: '    uint16_t lux = LDR_Read();', color: '#888899' },
  { text: '    uint8_t  pir = PIR_Read();', color: '#888899' },
  { text: '    uint8_t  dim = Ctrl_Dimming(lux,pir);', color: '#888899' },
  { text: '    MQTT_Publish("node/01/dim", dim);', color: '#00ff88' },
  { text: '    HAL_Delay(500);', color: '#888899' },
  { text: '  }', color: '#e4e4f0' },
  { text: '}', color: '#e4e4f0' },
];

let lineIdx = 0;
let charIdx = 0;
let terminalStarted = false;

function typeTerminal() {
  if (lineIdx >= codeLines.length) return;

  const line = codeLines[lineIdx];

  if (charIdx === 0 && lineIdx > 0) {
    terminalEl.innerHTML += '\n';
  }

  if (charIdx < line.text.length) {
    const char = line.text[charIdx];
    const span = document.createElement('span');
    span.textContent = char;
    if (line.color) span.style.color = line.color;
    terminalEl.appendChild(span);
    charIdx++;
    setTimeout(typeTerminal, char === ' ' ? 18 : Math.random() * 25 + 12);
  } else {
    lineIdx++;
    charIdx = 0;
    setTimeout(typeTerminal, line.text.length === 0 ? 60 : 80);
  }
}

// Start terminal typing when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !terminalStarted) {
    terminalStarted = true;
    setTimeout(typeTerminal, 800);
  }
}, { threshold: 0.1 });

const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── SKILL BARS ANIMATION ────────────────────────────────────────────────────

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-item__fill').forEach((fill, i) => {
        setTimeout(() => fill.classList.add('animated'), i * 100);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(cat => barObserver.observe(cat));

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── ACTIVE NAV LINK HIGHLIGHT ───────────────────────────────────────────────

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a[href^="#"]');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--green)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeSectionObserver.observe(s));

// ─── CONTACT FORM ────────────────────────────────────────────────────────────

const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(field, show) {
  field.classList.toggle('error', show);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');

    let valid = true;

    // Validate fields
    if (!name.value.trim()) {
      setFieldError(name, true);
      valid = false;
    } else {
      setFieldError(name, false);
    }

    if (!validateEmail(email.value)) {
      setFieldError(email, true);
      valid = false;
    } else {
      setFieldError(email, false);
    }

    if (!subject.value) {
      setFieldError(subject, true);
      valid = false;
    } else {
      setFieldError(subject, false);
    }

    if (!message.value.trim() || message.value.trim().length < 20) {
      setFieldError(message, true);
      valid = false;
    } else {
      setFieldError(message, false);
    }

    if (!valid) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    // Simulate send (replace with real endpoint / EmailJS / Netlify Forms)
    await new Promise(r => setTimeout(r, 1400));

    // Success state
    form.innerHTML = `
      <div class="form-success">
        <div class="form-success__icon">&#10003;</div>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
      </div>
    `;
  });

  // Real-time error clearing
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => setFieldError(input, false));
    input.addEventListener('change', () => setFieldError(input, false));
  });
}

// ─── PARALLAX: subtle hero grid movement ─────────────────────────────────────

const gridBg = document.querySelector('.hero__grid-bg');

if (gridBg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    gridBg.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

// ─── CURSOR GLOW (desktop only) ──────────────────────────────────────────────

if (window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  (function animateGlow() {
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animateGlow);
  })();
}

// ─── PROJECT HOVER: circuit diagram accent ───────────────────────────────────

document.querySelectorAll('.project').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelectorAll('circle').forEach(c => {
      c.style.transition = 'opacity 0.4s';
      c.style.opacity = parseFloat(c.getAttribute('opacity') || 1) * 1.8;
    });
  });
  card.addEventListener('mouseleave', () => {
    card.querySelectorAll('circle').forEach(c => {
      c.style.opacity = c.getAttribute('opacity') || 1;
    });
  });
});
