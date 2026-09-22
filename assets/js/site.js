/* Sresak Software Solutions — site.js (v2, no dependencies) */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ sticky header + back to top */
  var hdr = document.querySelector('.hdr'), totop = document.querySelector('.totop');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (hdr) hdr.classList.toggle('is-stuck', y > 8);
    if (totop) totop.classList.toggle('show', y > 640);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ------------------------------------------------ mobile drawer */
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.drawer a'), function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (totop) totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------ scroll reveal (staggered) */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        /* reveal when it comes into view — and also when it is already above the
           viewport (deep links / reload mid-page must not leave blank sections) */
        if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
        var el = e.target, parent = el.parentNode;
        var sibs = Array.prototype.filter.call(parent.children, function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        el.style.transitionDelay = (Math.min(sibs.indexOf(el), 5) * 60) + 'ms';
        el.classList.add('in'); io.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px' });
    Array.prototype.forEach.call(items, function (el) {
      /* anything already scrolled past (anchor deep link) shows immediately */
      if (el.getBoundingClientRect().top < -40) el.classList.add('in');
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------ counters */
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dec = (el.getAttribute('data-dec') || '0') | 0;
    if (reduced || isNaN(target)) { el.textContent = (isNaN(target) ? '' : target.toFixed(dec)) + suffix; return; }
    var dur = 1200, t0 = performance.now();
    (function tick(t) {
      var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(counters, function (el) { co.observe(el); });
    } else { Array.prototype.forEach.call(counters, runCount); }
  }

  /* ------------------------------------------------ hero terminal */
  /* The script below is illustrative of a first discovery session — it is not
     a recording of any client's environment. */
  var SCRIPT = [
    { t: 'cmd',  v: 'sresak@perth:~$ ./discover --business "your business"' },
    { t: 'dim',  v: '  reading current setup', wait: 260 },
    { t: 'ok',   v: '  ✓ systems mapped · accounts inventoried · data flows traced' },
    { t: 'dim',  v: '  checking the things that bite', wait: 240 },
    { t: 'warn', v: '  ! backups: last verified restore test — unknown' },
    { t: 'warn', v: '  ! admin access: 3 people, no MFA on 2 accounts' },
    { t: 'warn', v: '  ! documentation: one person holds the knowledge' },
    { t: 'cmd',  v: 'sresak@perth:~$ suggest --next --plain-english' },
    { t: 'hi',   v: '  1. test the restores (a backup you have not restored is a rumour)' },
    { t: 'hi',   v: '  2. turn on MFA, remove the shared logins' },
    { t: 'hi',   v: '  3. write it down, so it is not a single point of failure' },
    { t: 'dim',  v: '  4. then talk about what to build' },
    { t: 'dim',  v: '  handover: runbook · credentials · aftercare' },
    { t: 'ok',   v: '  ✓ you keep the keys — documentation is part of the job' }
  ];
  var term = document.getElementById('term');
  if (term) {
    var cursorHTML = '<span class="cursor"></span>';
    if (reduced) {
      term.innerHTML = SCRIPT.map(function (l) { return '<div class="ln ' + l.t + '">' + l.v + '</div>'; }).join('') + cursorHTML;
    } else {
      var i = 0;
      var step = function () {
        if (i >= SCRIPT.length) {
          var c = document.createElement('span'); c.className = 'cursor'; term.appendChild(c); return;
        }
        var l = SCRIPT[i++];
        var d = document.createElement('div');
        d.className = 'ln ' + l.t;
        term.appendChild(d);
        if (l.t === 'cmd') {
          var txt = l.v, k = 0;
          (function type() {
            d.textContent = txt.slice(0, ++k);
            if (k < txt.length) setTimeout(type, 26); else setTimeout(step, 420);
          })();
        } else {
          d.textContent = l.v;
          setTimeout(step, l.wait || 200);
        }
      };
      var start = function () { setTimeout(step, 500); };
      if ('IntersectionObserver' in window) {
        var to = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { start(); to.disconnect(); } });
        }, { threshold: 0.3 });
        to.observe(term);
      } else { start(); }
    }
  }

  /* ------------------------------------------------ year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ------------------------------------------------ enquiry form
     No backend by design: submission is acknowledged on the page. */
  var form = document.querySelector('form[data-enquiry]');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = form.querySelector('.form__ok');
      var bad = null;
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) {
        var empty = !f.value.trim();
        var badMail = f.type === 'email' && f.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim());
        f.style.borderColor = (empty || badMail) ? '#D8342A' : '';
        if ((empty || badMail) && !bad) bad = f;
      });
      if (bad) { bad.focus(); return; }
      var name = (form.querySelector('#f-name') || {}).value || '';
      form.reset();
      if (ok) {
        ok.innerHTML = '<strong>Thanks' + (name ? ', ' + name.trim().split(' ')[0] : '') + ' — your enquiry has been received.</strong><br>' +
          'We reply to every enquiry, usually within one business day. If it is urgent, call ' +
          '<a href="tel:+61851246903" style="color:inherit;text-decoration:underline">08 5124 6903</a>.';
        ok.classList.add('show');
        ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      }
    });
  }

  /* ------------------------------------------------ lazy background clips */
  var lazyVids = document.querySelectorAll('video[data-lazy-video]');
  if (lazyVids.length && 'IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) { v.pause(); }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(lazyVids, function (v) { vo.observe(v); });
  } else {
    Array.prototype.forEach.call(lazyVids, function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
  }

  /* ------------------------------------------------ in-page anchors with header offset */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 92, behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ------------------------------------------------ current nav item */
  var path = location.pathname.replace(/index\.html$/, '');
  Array.prototype.forEach.call(document.querySelectorAll('.nav a, .drawer a'), function (a) {
    var href = a.getAttribute('href') || '';
    if (href === path || (path !== '/' && href === location.pathname)) a.setAttribute('aria-current', 'page');
  });
})();
