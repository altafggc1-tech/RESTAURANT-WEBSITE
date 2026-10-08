/* =============================================
   FOOD HAVEN — script.js
   ============================================= */

'use strict';

/* ==============================
   NAVBAR: scroll & active links
   ============================== */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');
const sections = document.querySelectorAll('section[id], div[id="home"]');

window.addEventListener('scroll', () => {
  // Sticky style
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Active link highlight
  highlightActiveLink();
});

function highlightActiveLink() {
  const scrollY = window.scrollY + 100;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const targetId = link.getAttribute('href').replace('#', '');
    const section  = document.getElementById(targetId);
    if (!section) return;
    if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* ==============================
   HAMBURGER MENU
   ============================== */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ==============================
   SMOOTH SCROLL (older browsers)
   ============================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ==============================
   MENU TAB FILTER
   ============================== */
const tabs     = document.querySelectorAll('.tab');
const menuCards = document.querySelectorAll('.menu-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.tab;
    menuCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
        // Small fade-in animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeUp .35s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inject fadeUp keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`;
document.head.appendChild(styleSheet);

/* ==============================
   ADD TO CART TOAST
   ============================== */
const cartToast = document.getElementById('cart-toast');
let toastTimer;

document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', () => {
    const name  = btn.dataset.name;
    const price = btn.dataset.price;
    showToast(`🛒 "${name}" added — $${price}`);
  });
});

function showToast(message) {
  clearTimeout(toastTimer);
  cartToast.textContent = message;
  cartToast.classList.add('show');
  toastTimer = setTimeout(() => cartToast.classList.remove('show'), 3000);
}

/* ==============================
   CONTACT FORM VALIDATION
   ============================== */
const contactForm  = document.getElementById('contact-form');
const formSuccess  = document.getElementById('form-success');

const validators = {
  name: {
    el: () => document.getElementById('name'),
    err: () => document.getElementById('err-name'),
    validate(val) {
      if (!val.trim()) return 'Full name is required.';
      if (val.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }
  },
  email: {
    el: () => document.getElementById('email'),
    err: () => document.getElementById('err-email'),
    validate(val) {
      if (!val.trim()) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email.';
      return '';
    }
  },
  phone: {
    el: () => document.getElementById('phone'),
    err: () => document.getElementById('err-phone'),
    validate(val) {
      if (!val.trim()) return ''; // optional
      if (!/^[\d\s()\-+]{7,20}$/.test(val)) return 'Please enter a valid phone number.';
      return '';
    }
  },
  service: {
    el: () => document.getElementById('service'),
    err: () => document.getElementById('err-service'),
    validate(val) {
      if (!val) return 'Please select a service type.';
      return '';
    }
  }
};

// Live validation on blur
Object.values(validators).forEach(({ el, err, validate }) => {
  el().addEventListener('blur', () => {
    const msg = validate(el().value);
    err().textContent = msg;
    el().classList.toggle('invalid', !!msg);
  });
  el().addEventListener('input', () => {
    if (el().classList.contains('invalid')) {
      const msg = validate(el().value);
      err().textContent = msg;
      el().classList.toggle('invalid', !!msg);
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;

  Object.values(validators).forEach(({ el, err, validate }) => {
    const msg = validate(el().value);
    err().textContent = msg;
    el().classList.toggle('invalid', !!msg);
    if (msg) valid = false;
  });

  if (!valid) return;

  // Simulate submission
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    submitBtn.textContent = 'Send Request';
    submitBtn.disabled = false;
    formSuccess.classList.add('show');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 1200);
});

/* ==============================
   SCROLL-REVEAL ANIMATION
   ============================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Inject reveal CSS
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity .55s ease, transform .55s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

// Apply to cards and items
document.querySelectorAll(
  '.menu-card, .review-card, .gallery-item, .highlight, .stat, .info-item, .about-text, .about-img'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

/* ==============================
   GALLERY LIGHTBOX (simple)
   ============================== */
const galleryItems = document.querySelectorAll('.gallery-item');

// Create lightbox overlay
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div class="lb-backdrop"></div>
  <div class="lb-content">
    <button class="lb-close">✕</button>
    <img class="lb-img" src="" alt="Gallery image" />
  </div>
`;
document.body.appendChild(lightbox);

const lbStyle = document.createElement('style');
lbStyle.textContent = `
  #lightbox {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity .3s ease;
  }
  #lightbox.open { opacity: 1; pointer-events: all; }
  .lb-backdrop {
    position: absolute; inset: 0;
    background: rgba(10,10,20,.88);
  }
  .lb-content {
    position: relative; z-index: 1;
    max-width: 90vw; max-height: 90vh;
  }
  .lb-img {
    max-width: 90vw; max-height: 82vh;
    border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0,0,0,.6);
  }
  .lb-close {
    position: absolute; top: -44px; right: 0;
    background: none; border: none;
    color: #fff; font-size: 1.6rem;
    cursor: pointer; line-height: 1;
    padding: 4px 10px;
  }
`;
document.head.appendChild(lbStyle);

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    lightbox.querySelector('.lb-img').src = src;
    lightbox.classList.add('open');
  });
});

lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() { lightbox.classList.remove('open'); }
