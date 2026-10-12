// Interactive enhancements for the Dr. Arslan Mahmood website concept.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav?.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
}));

// Animate sections as they enter the viewport; keep content visible if unsupported.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// One-open-at-a-time FAQ interaction.
document.querySelectorAll('.faq details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq details').forEach(other => {
        if (other !== item) other.open = false;
      });
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
const form = document.getElementById('appointment-form');
const status = document.getElementById('form-status');

// IMPORTANT: replace with the clinic's verified WhatsApp number in international format,
// digits only (for example, 923001234567). Do not publish a guessed number.
const WHATSAPP_NUMBER = 'REPLACE_WITH_VERIFIED_NUMBER';

form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    'Assalam-o-alaikum, I would like to request a consultation.',
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Area of concern: ${data.get('interest')}`,
    data.get('message') ? `Note: ${data.get('message')}` : ''
  ].filter(Boolean).join('\n');

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    status.textContent = 'The form is ready, but the practice WhatsApp number has not been configured yet. Please contact the practice through its verified official channel.';
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  status.textContent = 'Your message draft has been prepared in WhatsApp. Please review and send it there.';
});
