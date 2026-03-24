/* ─────────────────────────────────────────
   VENDICASA — script.js v2
   ───────────────────────────────────────── */

/* ─── Navbar: becomes solid on scroll ─── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Hamburger menu (mobile) ─── */
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));


/* ─── Smooth scroll offset for fixed navbar ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── Scroll-triggered fade-in (.fade-up) ─── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* ─── Count-up on .count-up elements ─── */
function animateCountUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const steps = 60;
  const stepVal = target / steps;
  let current = 0;
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    current = Math.min(Math.round(stepVal * frame), target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, duration / steps);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCountUp(e.target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));


/* ─── Method step animated reveal (left / right) ─── */
document.querySelectorAll('.method-reveal').forEach((step, i) => {
  const isLeft = step.classList.contains('method__step--left');
  step.classList.add(isLeft ? 'method-reveal--left' : 'method-reveal--right');
});

const methodObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // highlight the number circle
      e.target.classList.add('active');
      methodObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.method-reveal').forEach(el => methodObserver.observe(el));


/* ─── Video modal ─── */
const openBtn = document.getElementById('openVideoBtn');
const iframe = document.getElementById('videoIframe');

// Apre il video direttamente su YouTube (embed disabilitato dal proprietario)
function openVideoYouTube() {
  const src = iframe ? iframe.dataset.src : '';
  // Transforma l'URL embed in URL watch standard
  const youtubeUrl = src.replace('https://www.youtube.com/embed/', 'https://www.youtube.com/watch?v=').split('?')[0] + '?v=' + src.split('/embed/')[1]?.split('?')[0];
  window.open('https://www.youtube.com/watch?v=' + src.split('/embed/')[1]?.split('?')[0], '_blank');
}

if (openBtn) openBtn.addEventListener('click', openVideoYouTube);
if (openBtn) {
  openBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideoYouTube(); }
  });
}


/* ─── Cases carousel: auto-scroll + drag-to-scroll + arrow buttons ─── */
const casesScroll = document.getElementById('casesScroll');
const prevBtn = document.getElementById('casesPrev');
const nextBtn = document.getElementById('casesNext');

if (casesScroll) {
  // Arrow navigation
  const scrollAmount = 340;
  if (prevBtn) prevBtn.addEventListener('click', () => {
    pauseAutoScroll(2000);
    casesScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    pauseAutoScroll(2000);
    casesScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // ── Auto-scroll ──
  let autoScrollPaused = false;
  let pauseTimeout = null;
  let rafId = null;
  const SPEED = 0.6; // pixel per frame (~36px/sec a 60fps)

  function tick() {
    if (!autoScrollPaused) {
      casesScroll.scrollLeft += SPEED;
      // Quando raggiunge la fine, torna all'inizio silenziosamente
      if (casesScroll.scrollLeft >= casesScroll.scrollWidth - casesScroll.clientWidth - 1) {
        casesScroll.scrollLeft = 0;
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  function pauseAutoScroll(ms) {
    autoScrollPaused = true;
    clearTimeout(pauseTimeout);
    if (ms) {
      pauseTimeout = setTimeout(() => { autoScrollPaused = false; }, ms);
    }
  }

  function resumeAutoScroll() {
    clearTimeout(pauseTimeout);
    autoScrollPaused = false;
  }

  // Pausa al passaggio del mouse
  casesScroll.addEventListener('mouseenter', () => pauseAutoScroll(0));
  casesScroll.addEventListener('mouseleave', () => resumeAutoScroll());

  // Drag-to-scroll
  let isDown = false;
  let startX, scrollLeft;

  casesScroll.addEventListener('mousedown', (e) => {
    isDown = true;
    casesScroll.style.cursor = 'grabbing';
    startX = e.pageX - casesScroll.offsetLeft;
    scrollLeft = casesScroll.scrollLeft;
    pauseAutoScroll(0);
  });
  casesScroll.addEventListener('mouseleave', () => {
    isDown = false;
    casesScroll.style.cursor = 'grab';
  });
  casesScroll.addEventListener('mouseup', () => {
    isDown = false;
    casesScroll.style.cursor = 'grab';
    resumeAutoScroll();
  });
  casesScroll.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - casesScroll.offsetLeft;
    const walk = (x - startX) * 1.5;
    casesScroll.scrollLeft = scrollLeft - walk;
  });

  // Touch support: pausa durante touch
  casesScroll.addEventListener('touchstart', () => pauseAutoScroll(0), { passive: true });
  casesScroll.addEventListener('touchend', () => pauseAutoScroll(3000), { passive: true });
}


/* ─── Marquee: pause on hover ─── */
const marquee = document.querySelector('.reviews__marquee');
if (marquee) {
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}


/* ─── Form: validation + submit feedback ─── */
const form = document.getElementById('lead-form');
const submitBtn = document.getElementById('submit-btn');

// ⚙️  Sostituisci XXXXXXXX con il tuo Form ID di Formspree (formspree.io)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjglvkw';

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('.form__input').forEach(f => f.classList.remove('error'));

    form.querySelectorAll('[required]').forEach(field => {
      const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      if (isEmpty) { field.classList.add('error'); valid = false; }
    });

    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) { firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstError.focus(); }
      return;
    }

    // Invio reale a Formspree
    submitBtn.textContent = 'Invio in corso…';
    submitBtn.disabled = true;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        submitBtn.textContent = '✓ Richiesta inviata! Ti contatteremo presto.';
        submitBtn.style.background = '#16a34a';
        submitBtn.style.boxShadow = '0 4px 20px rgba(22,163,74,.3)';
        form.reset();
      } else {
        submitBtn.textContent = '❌ Errore nell\'invio. Riprova o scrivici direttamente.';
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }
    } catch {
      submitBtn.textContent = '❌ Errore di rete. Controlla la connessione e riprova.';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }
  });

  form.querySelectorAll('.form__input').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}
