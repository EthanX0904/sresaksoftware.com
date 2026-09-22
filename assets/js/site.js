/* Sresak Software Solutions — site.js (no dependencies) */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* sticky header state */
  var hdr = document.querySelector('.hdr');
  var totop = document.querySelector('.totop');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (hdr) hdr.classList.toggle('is-stuck', y > 12);
    if (totop) totop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile drawer */
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.drawer a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* back to top */
  if (totop) totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* scroll reveal (staggered) */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (Math.min(i, 6) * 70) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* animated counters */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dec = (el.getAttribute('data-dec') || '0') | 0;
    if (reduced) { el.textContent = target.toFixed(dec) + suffix; return; }
    var dur = 1400, t0 = performance.now();
    function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    } else { counters.forEach(runCount); }
  }

  /* year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* enquiry form: graceful handling while the Formspree endpoint is pending */
  var form = document.querySelector('form[data-enquiry]');
  if (form) {
    form.addEventListener('submit', function (ev) {
      var action = form.getAttribute('action') || '';
      var ok = form.querySelector('.form__ok');
      if (action.indexOf('formspree.io/f/') === -1 || action.indexOf('[待确认]') !== -1) {
        ev.preventDefault();
        if (ok) {
          ok.classList.add('show');
          ok.textContent = 'Thanks — this demo form is not wired to a mailbox yet. ' +
            'Please email info@sresaksoftware.com until the form endpoint is configured.';
          ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }
      /* real endpoint: submit in background, keep the user on the page */
      ev.preventDefault();
      var data = new FormData(form);
      fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          form.reset();
          if (ok) { ok.classList.add('show'); ok.textContent = 'Thanks — your enquiry has been sent. We will reply within one business day.'; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        })
        .catch(function () {
          if (ok) { ok.classList.add('show'); ok.textContent = 'Something went wrong. Please email info@sresaksoftware.com instead.'; }
        });
    });
  }

  /* smooth in-page anchors with sticky-header offset */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* mark current nav item if the server didn't already */
  var path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav a, .drawer a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === path || (path !== '/' && href === location.pathname)) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
