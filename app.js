document.documentElement.className += ' js';

/* Hero visual: background paths + letter-by-letter title reveal (FR-2).
   Runs immediately at parse so there is no flash of un-animated content. */
(function () {
  'use strict';
  var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* FloatingPaths: two mirrored sets (position = +1 and -1) of 36 deterministic
     cubic-bezier paths, identical to the React reference. Each path has its
     own strokeWidth and strokeOpacity set inline; the CSS .fp-path animation
     drives the flowing dash + pulsing opacity loop. */
  var svg = document.getElementById('bgPaths');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    var N = 36;

    function addPaths(position) {
      for (var i = 0; i < N; i++) {
        var a = 380 - i * 5 * position;
        var b = 189 + i * 6;
        var c = 312 - i * 5 * position;
        var d2 = 216 - i * 6;
        var e = 152 - i * 5 * position;
        var f = 343 - i * 6;
        var g = 616 - i * 5 * position;
        var h = 470 - i * 6;
        var j = 684 - i * 5 * position;
        var k = 875 - i * 6;
        var d = 'M-' + a + ' -' + b +
                'C-' + a + ' -' + b + ' -' + c + ' ' + d2 + ' ' + e + ' ' + f +
                'C' + g + ' ' + h + ' ' + j + ' ' + k + ' ' + j + ' ' + k;
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('pathLength', '1');
        p.setAttribute('class', 'fp-path');
        p.setAttribute('stroke-width', (0.5 + i * 0.03).toFixed(3));
        p.setAttribute('stroke-opacity', (0.1 + i * 0.03).toFixed(3));
        if (motionOK) {
          var dur = 20 + Math.random() * 10;
          p.style.animationDuration = dur.toFixed(2) + 's';
          p.style.animationDelay = (-Math.random() * dur).toFixed(2) + 's';
        }
        svg.appendChild(p);
      }
    }
    addPaths(1);
    addPaths(-1);

    /* Pause the animation when the hero is off-screen (performance NFR). */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { svg.classList.toggle('paused', !es[0].isIntersecting); }).observe(document.querySelector('.hero'));
    }
  }

  /* Letter-by-letter title reveal (skipped under prefers-reduced-motion). */
  var h = document.getElementById('heroTitle');
  if (h) {
    if (motionOK) {
      try {
        var idx = 0;
        (function walk(node) {
          Array.prototype.slice.call(node.childNodes).forEach(function (child) {
            if (child.nodeType === 3) {
              var frag = document.createDocumentFragment(), ch;
              child.textContent.split('').forEach(function (c) {
                if (c === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
                ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c;
                ch.style.setProperty('--i', idx++); frag.appendChild(ch);
              });
              node.replaceChild(frag, child);
            } else if (child.nodeType === 1) walk(child);
          });
        })(h);
      } catch (e) { /* non-fatal: title shows un-animated */ }
    }
    h.classList.add('ready');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ================= CONFIG (replace before launch) ================= */
  var GA_MEASUREMENT_ID = 'G-REPLACE_GA_ID';

  var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Icons */
  if (window.lucide) lucide.createIcons();

  /* Footer year */
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ============ GA4 + consent (FR-13, FR-14) ============ */
  function loadGA() {
    if (window.__dcGA) return; window.__dcGA = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }
  function trackEvent(name, params) {
    if (window.__dcGA && typeof gtag === 'function') gtag('event', name, params || {});
  }

  var CKEY = 'dc-consent-v1';
  function cStore(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function cRead(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  var consent = cRead(CKEY);
  var banner = document.getElementById('consentBanner');

  if (consent === 'granted') { loadGA(); }
  else if (!consent && banner) {
    requestAnimationFrame(function () {
      banner.hidden = false;
      requestAnimationFrame(function () { banner.classList.add('show'); });
    });
  }
  function hideBanner() { banner.classList.remove('show'); setTimeout(function () { banner.hidden = true; }, 350); }
  document.getElementById('consentYes').addEventListener('click', function () { cStore(CKEY, 'granted'); hideBanner(); loadGA(); });
  document.getElementById('consentNo').addEventListener('click', function () { cStore(CKEY, 'denied'); hideBanner(); });
  var cs = document.getElementById('cookieSettings');
  if (cs) cs.addEventListener('click', function () { try { localStorage.removeItem(CKEY); } catch (e) {} location.reload(); });

  /* Generic click tracking for anything with data-ga */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-ga]') : null;
    if (t) trackEvent(t.getAttribute('data-ga'), { label: t.getAttribute('data-ga-label') || (t.textContent || '').trim().slice(0, 60) });
  });

  /* ============ Navbar (FR-1) ============ */
  var navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth < 992 && window.bootstrap) {
          var c = bootstrap.Collapse.getInstance(navMenu); if (c) c.hide();
        }
      });
    });
  }
  /* Active-section highlighting */
  var navLinks = {};
  document.querySelectorAll('.navlink').forEach(function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var l = navLinks[en.target.id]; if (!l || !en.isIntersecting) return;
        Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove('active'); navLinks[k].removeAttribute('aria-current'); });
        l.classList.add('active'); l.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['home', 'services', 'projects', 'process', 'contact'].forEach(function (id) {
      var s = document.getElementById(id); if (s) nio.observe(s);
    });
  }

  /* ============ Projects carousel (FR-5) ============ */
  var track = document.getElementById('projTrack'),
      prev = document.getElementById('carPrev'),
      next = document.getElementById('carNext');
  if (track && prev && next) {
    var carStep = function (dir, evt) {
      var card = track.querySelector('.proj-card');
      if (!card) return;
      var w = card.getBoundingClientRect().width + 20;
      var max = track.scrollWidth - track.clientWidth;
      var x = track.scrollLeft + dir * w;
      if (dir > 0 && track.scrollLeft >= max - 4) x = 0;   /* wrap around */
      if (dir < 0 && track.scrollLeft <= 4) x = max;
      track.scrollTo({ left: x, behavior: motionOK ? 'smooth' : 'auto' });
      if (evt) trackEvent(evt);
    };
    prev.addEventListener('click', function () { carStep(-1, 'carousel_prev'); });
    next.addEventListener('click', function () { carStep(1, 'carousel_next'); });
  }

  /* Scroll-to-Projects event (FR-13, once) */
  if ('IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { trackEvent('scroll_to_projects'); pio.disconnect(); }
    }, { threshold: 0.2 });
    var ps = document.getElementById('projects'); if (ps) pio.observe(ps);
  }

  /* Scroll depth (FR-13): 25 / 50 / 75 / 90, once each */
  var marks = [25, 50, 75, 90], seen = {};
  window.addEventListener('scroll', function () {
    var d = document.documentElement;
    var p = Math.round(((window.scrollY + window.innerHeight) / d.scrollHeight) * 100);
    marks.forEach(function (m) { if (p >= m && !seen[m]) { seen[m] = 1; trackEvent('scroll_depth', { percent: m }); } });
  }, { passive: true });

  /* ============ Contact form: validation + Formspree AJAX (FR-9) ============ */
  var form = document.getElementById('contactForm');
  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var successEl = document.getElementById('formSuccess');
    var errorEl = document.getElementById('formError');
    var submitBtn = document.getElementById('formSubmit');
    var btnLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

    function setErr(input, bad) {
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      var m = document.getElementById('e-' + input.id.replace('f-', ''));
      if (m) m.classList[bad ? 'add' : 'remove']('show');
    }
    ['f-name', 'f-email', 'f-message'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { setErr(el, false); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      /* Honeypot: bots that fill it are silently dropped */
      if (form.querySelector('[name="_gotcha"]').value) return;

      var name = document.getElementById('f-name'),
          email = document.getElementById('f-email'),
          msg = document.getElementById('f-message');
      var checks = [[name, name.value.trim().length > 1],
                    [email, emailRe.test(email.value.trim())],
                    [msg, msg.value.trim().length >= 10]];
      var ok = true, first = null;
      checks.forEach(function (c) { var bad = !c[1]; setErr(c[0], bad); if (bad) { ok = false; first = first || c[0]; } });
      if (!ok) { first.focus(); return; }

      if (submitBtn) { submitBtn.disabled = true; if (btnLabel) btnLabel.textContent = 'Sending…'; }
      trackEvent('form_submit');

      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('Formspree error');
          form.hidden = true;
          if (successEl) { successEl.hidden = false; successEl.focus(); }
          trackEvent('form_submit_success');
        })
        .catch(function () {
          if (errorEl) errorEl.hidden = false;
          if (submitBtn) { submitBtn.disabled = false; if (btnLabel) btnLabel.textContent = 'Send message'; }
          trackEvent('form_submit_error');
        });
    });
  }
});
