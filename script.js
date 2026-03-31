'use strict';

// ─── NAV scroll + mobile toggle ──────────────────────────────────────────────
const nav        = document.querySelector('.nav');
const navToggle  = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.mobile-menu');

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

document.querySelectorAll('.mobile-menu a').forEach(link => {
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
  { text: '// Mayekhav Ahmed — acquisition.c', color: '#555568' },
  { text: '', color: '' },
  { text: '#include "stm32f4xx_hal.h"',        color: '#00c4ff' },
  { text: '#include "modbus_rtu.h"',            color: '#00c4ff' },
  { text: '#include "mqtt_client.h"',           color: '#00c4ff' },
  { text: '#include "rtc_driver.h"',            color: '#00c4ff' },
  { text: '', color: '' },
  { text: 'int main(void) {',                   color: '#e4e4f0' },
  { text: '  HAL_Init();',                      color: '#888899' },
  { text: '  Modbus_Init(RS485, 9600);',        color: '#888899' },
  { text: '  RTC_SetTimestamp();',              color: '#888899' },
  { text: '', color: '' },
  { text: '  while(1) {',                       color: '#e4e4f0' },
  { text: '    float data = Modbus_Read(0x01);',color: '#888899' },
  { text: '    DB_LogWithTimestamp(data);',     color: '#888899' },
  { text: '    MQTT_Publish("prod/line1", data);', color: '#00ff88' },
  { text: '    HAL_Delay(1000);',               color: '#888899' },
  { text: '  }',                                color: '#e4e4f0' },
  { text: '}',                                  color: '#e4e4f0' },
];

let lineIdx = 0, charIdx = 0, termStarted = false;

function typeTerminal() {
  if (lineIdx >= codeLines.length) return;
  const line = codeLines[lineIdx];
  if (charIdx === 0 && lineIdx > 0) terminalEl.innerHTML += '\n';
  if (charIdx < line.text.length) {
    const span = document.createElement('span');
    span.textContent = line.text[charIdx];
    if (line.color) span.style.color = line.color;
    terminalEl.appendChild(span);
    charIdx++;
    setTimeout(typeTerminal, Math.random() * 25 + 12);
  } else {
    lineIdx++; charIdx = 0;
    setTimeout(typeTerminal, line.text.length === 0 ? 60 : 80);
  }
}

new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !termStarted) {
    termStarted = true;
    setTimeout(typeTerminal, 900);
  }
}, { threshold: 0.1 }).observe(document.getElementById('hero'));

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
.observe = (() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  return obs.observe.bind(obs);
})();

// ─── SKILL BARS ──────────────────────────────────────────────────────────────
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-item__fill').forEach((fill, i) => {
        setTimeout(() => fill.classList.add('animated'), i * 100);
      });
    }
  });
}, { threshold: 0.2 })
.observe = (() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-item__fill').forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 100);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-category').forEach(c => obs.observe(c));
  return obs.observe.bind(obs);
})();

// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

// ─── ACTIVE NAV HIGHLIGHT ────────────────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--green)' : '';
      });
    }
  });
}, { threshold: 0.4 })
.observe = (() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--green)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
  return obs.observe.bind(obs);
})();

// ─── CONTACT FORM ────────────────────────────────────────────────────────────
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function setError(field, show) { field.classList.toggle('error', show); }

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    let valid = true;

    if (!name.value.trim())            { setError(name, true);    valid = false; } else setError(name, false);
    if (!validateEmail(email.value))   { setError(email, true);   valid = false; } else setError(email, false);
    if (!subject.value)                { setError(subject, true); valid = false; } else setError(subject, false);
    if (message.value.trim().length < 10) { setError(message, true); valid = false; } else setError(message, false);

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Envoi en cours…';
    await new Promise(r => setTimeout(r, 1400));

    form.innerHTML = `
      <div class="form-success">
        <div style="font-size:2rem">✓</div>
        <h3>Message envoyé !</h3>
        <p>Merci pour votre message. Je vous réponds sous 24h.</p>
      </div>`;
  });

  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input',  () => setError(input, false));
    input.addEventListener('change', () => setError(input, false));
  });
}

// ─── PARALLAX GRID ───────────────────────────────────────────────────────────
const gridBg = document.querySelector('.hero__grid-bg');
if (gridBg && window.matchMedia('(min-width:768px)').matches) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    gridBg.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

// ─── CURSOR GLOW (desktop) ───────────────────────────────────────────────────
if (window.matchMedia('(min-width:1024px) and (hover:hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;width:300px;height:300px;background:radial-gradient(circle,rgba(0,255,136,0.04),transparent 65%);border-radius:50%;pointer-events:none;z-index:0;transform:translate(-50%,-50%);';
  document.body.appendChild(glow);
  let mx=0,my=0,gx=0,gy=0;
  window.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });
  (function loop(){ gx+=(mx-gx)*0.06; gy+=(my-gy)*0.06; glow.style.left=gx+'px'; glow.style.top=gy+'px'; requestAnimationFrame(loop); })();
}
