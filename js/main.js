// AntherLink — shared behavior

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero entrance animation
  if (!reduceMotion) {
    document.querySelectorAll('.hero .eyebrow, .hero h1, .hero .hero-sub, .hero .hero-actions, .hero .proof').forEach(function (el) {
      el.classList.add('reveal-up');
    });
  }

  // Scroll reveal for section heads, service rows, portfolio cards, process steps
  var revealTargets = document.querySelectorAll('.section-head, .service-row, .portfolio-card, .process-step');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('will-reveal'); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { observer.observe(el); });
  }

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

  // Contact form: client-side validation + Formspree AJAX submit
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    function setError(field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      var err = wrap.querySelector('.field-error');
      if (err) err.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    }
    function clearError(field) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.remove('has-error');
      field.removeAttribute('aria-invalid');
    }
    function showStatus(message, type) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status visible ' + type;
    }
    function clearStatus() {
      if (!status) return;
      status.textContent = '';
      status.className = 'form-status';
    }

    var nameField = form.querySelector('#name');
    var emailField = form.querySelector('#email');
    var messageField = form.querySelector('#message');

    // Clear errors as the user fixes each field
    [nameField, emailField, messageField].forEach(function (field) {
      if (!field) return;
      field.addEventListener('input', function () {
        clearError(field);
        clearStatus();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      [nameField, emailField, messageField].forEach(clearError);

      if (!nameField.value.trim()) {
        setError(nameField, 'Enter your name.');
        valid = false;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailField.value.trim() || !emailPattern.test(emailField.value.trim())) {
        setError(emailField, 'Enter a valid email address.');
        valid = false;
      }
      if (!messageField.value.trim()) {
        setError(messageField, 'Tell us a bit about your project.');
        valid = false;
      }

      if (!valid) {
        showStatus('Please fix the highlighted fields.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      showStatus('Sending…', 'success');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            showStatus("Thanks — your message was sent. We'll reply within a day.", 'success');
          } else if (res.status === 429) {
            showStatus('Too many submissions right now. Please wait a minute and try again.', 'error');
          } else {
            res.json().then(function (data) {
              if (data && data.errors && data.errors.length) {
                var firstError = data.errors[0];
                showStatus(firstError.message || 'Something went wrong. Please try again.', 'error');
              } else {
                showStatus('Something went wrong. Please try again, or email abdullahcms.dev@gmail.com.', 'error');
              }
            }).catch(function () {
              showStatus('Something went wrong. Please try again, or email abdullahcms.dev@gmail.com.', 'error');
            });
          }
        })
        .catch(function () {
          showStatus('Network error — please check your connection and try again.', 'error');
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
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
