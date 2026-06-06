// Nav scroll effect
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Mobile menu toggle — uses separate overlay div to avoid iOS fixed nesting bug
const toggle = document.getElementById('navToggle');
const overlay = document.getElementById('mobileOverlay');
if (toggle && overlay) {
  let isOpen = false;
  const openMenu = () => {
    isOpen = true;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    isOpen = false;
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  };
  toggle.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });
}

// Contact form — submits to Node.js /contact route
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';
      } else {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        alert('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      alert('Something went wrong. Please try again or call us directly.');
    }
  });
}
