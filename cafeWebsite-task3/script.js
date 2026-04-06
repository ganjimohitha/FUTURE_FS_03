/* ============================================================
   NOIR & BLOOM — script.js
   Features:
   - Sticky navbar with scroll effect
   - Smooth scrolling with active link tracking
   - Mobile hamburger menu
   - Scroll reveal animations (IntersectionObserver)
   - Menu category filter tabs
   - Contact form validation & success state
   - Staggered card animations
   ============================================================ */

'use strict';

/* ── Wait for DOM ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR — scroll class & active link tracking
     ============================================================ */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('section[id]');

  // Add scrolled class for background blur effect
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  };

  // Highlight nav link for the section currently in view
  const updateActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ============================================================
     2. MOBILE HAMBURGER MENU
     ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinksEl.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ============================================================
     3. SCROLL REVEAL — IntersectionObserver
     ============================================================ */

  // Add scroll-hidden class to elements we want to animate in
  const revealTargets = [
    '.about-grid',
    '.about-text',
    '.about-images',
    '.section-header',
    '.menu-card',
    '.gallery-item',
    '.testimonial-card',
    '.contact-info',
    '.contact-form-wrap',
    '.footer-grid',
    '.highlight',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('scroll-hidden');
    });
  });

  // Observer config
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger child cards/items
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  // Add staggered delays to grid children
  const staggerSelectors = [
    '.menu-card',
    '.gallery-item',
    '.testimonial-card',
    '.highlight',
  ];

  staggerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.delay = i * 80; // 80ms between each
    });
  });

  // Observe all scroll-hidden elements
  document.querySelectorAll('.scroll-hidden').forEach(el => {
    revealObserver.observe(el);
  });


  /* ============================================================
     4. MENU FILTER TABS
     ============================================================ */
  const tabs       = document.querySelectorAll('.tab');
  const menuCards  = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;

      menuCards.forEach((card, i) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('hidden');
          // Re-animate visible cards
          card.style.animationDelay = `${i * 60}ms`;
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ============================================================
     5. CONTACT FORM — validation & submit
     ============================================================ */
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        // Shake the empty required fields
        [{ id: 'name', val: name }, { id: 'email', val: email }, { id: 'message', val: message }]
          .forEach(({ id, val }) => {
            if (!val) {
              const el = form.querySelector(`#${id}`);
              el.style.borderColor = '#e05c5c';
              el.style.animation = 'shake 0.4s ease';
              setTimeout(() => {
                el.style.animation = '';
                el.style.borderColor = '';
              }, 600);
            }
          });
        return;
      }

      if (!isValidEmail(email)) {
        const emailEl = form.querySelector('#email');
        emailEl.style.borderColor = '#e05c5c';
        setTimeout(() => emailEl.style.borderColor = '', 2000);
        return;
      }

      // Simulate async form submission
      const submitBtn = form.querySelector('.btn-primary');
      submitBtn.textContent = 'Sending…';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Send Message ✦';
        submitBtn.style.opacity = '';
        submitBtn.disabled = false;
        successMsg.classList.add('visible');
        setTimeout(() => successMsg.classList.remove('visible'), 5000);
      }, 1400);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ============================================================
     6. SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;

        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ============================================================
     7. GALLERY — hover cursor effect (optional enhancement)
     ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      galleryItems.forEach(other => {
        if (other !== item) other.style.opacity = '0.6';
      });
    });
    item.addEventListener('mouseleave', () => {
      galleryItems.forEach(other => other.style.opacity = '1');
    });
  });


  /* ============================================================
     8. NEWSLETTER form (footer)
     ============================================================ */
  const newsletterBtn = document.querySelector('.newsletter-form button');
  const newsletterInput = document.querySelector('.newsletter-form input');

  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', () => {
      const val = newsletterInput.value.trim();
      if (!val || !isValidEmail(val)) {
        newsletterInput.style.borderColor = '#e05c5c';
        setTimeout(() => newsletterInput.style.borderColor = '', 2000);
        return;
      }
      newsletterBtn.textContent = '✓';
      newsletterBtn.style.background = '#6ebb8a';
      newsletterInput.value = '';
      setTimeout(() => {
        newsletterBtn.textContent = '→';
        newsletterBtn.style.background = '';
      }, 3000);
    });

    newsletterInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') newsletterBtn.click();
    });
  }


  /* ============================================================
     9. Parallax on hero bg (subtle, perf-friendly)
     ============================================================ */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1) translateY(${scrolled * 0.2}px)`;
      }
    }, { passive: true });
  }


  /* ============================================================
     10. Add shake keyframes dynamically
     ============================================================ */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

});
