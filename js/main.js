// AntherLink — shared behavior

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      // close others
      document.querySelectorAll('.faq-item').forEach(function (other) {
        if (other !== item) {
          other.setAttribute('data-open', 'false');
          var otherQ = other.querySelector('.faq-q');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
        }
      });
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
      q.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  // Contact form validation (client-side; no backend wired up yet)
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');

    function setError(field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      var err = wrap.querySelector('.field-error');
      if (err) err.textContent = message;
    }
    function clearError(field) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.remove('has-error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var message = form.querySelector('#message');

      [name, email, message].forEach(clearError);

      if (!name.value.trim()) {
        setError(name, 'Enter your name.');
        valid = false;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        setError(email, 'Enter a valid email address.');
        valid = false;
      }
      if (!message.value.trim()) {
        setError(message, 'Tell us a bit about your project.');
        valid = false;
      }

      if (!valid) {
        if (status) {
          status.textContent = 'Please fix the highlighted fields.';
          status.className = 'form-status visible error';
        }
        return;
      }

      // No backend is connected yet. Replace this block with a real submit
      // (e.g. fetch() to an API route, or a form service) before launch.
      if (status) {
        status.textContent = "Thanks — this form isn't connected to an inbox yet, so nothing was sent. Email " + 'abdullahcms.dev@gmail.com' + ' directly for now.';
        status.className = 'form-status visible error';
      }
    });
  }

  // Cookie consent banner — only shown if a data-analytics="cookie" flag
  // is present on <body>. Vercel Web Analytics (used on this site) is
  // cookieless, so the banner is off by default. See privacy.html.
  var body = document.body;
  if (body.dataset.analytics === 'cookie') {
    var consent = localStorage.getItem('antherlink-cookie-consent');
    var banner = document.querySelector('.cookie-banner');
    if (banner && !consent) {
      banner.classList.add('visible');
      var acceptBtn = banner.querySelector('[data-accept]');
      var declineBtn = banner.querySelector('[data-decline]');
      if (acceptBtn) acceptBtn.addEventListener('click', function () {
        localStorage.setItem('antherlink-cookie-consent', 'accepted');
        banner.classList.remove('visible');
      });
      if (declineBtn) declineBtn.addEventListener('click', function () {
        localStorage.setItem('antherlink-cookie-consent', 'declined');
        banner.classList.remove('visible');
      });
    }
  }
});
import { Analytics } from "@vercel/analytics/next"