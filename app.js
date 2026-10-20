document.documentElement.className += ' js';

/* Hero visual: WebGL glass folds (FR-2). */
(function () {
  'use strict';
  var canvas = document.getElementById('glassFoldCanvas');
  if (!canvas) return;
  var gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) { canvas.style.display = 'none'; return; }

  var vertex = 'attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
  var fragment = [
    'precision highp float;',
    'uniform float u_time,u_scale,u_noise; uniform vec3 u_color1,u_color2,u_color3; uniform vec2 u_resolution;',
    'varying vec2 vUv;',
    'float grain(vec2 st){return fract(sin(dot(st,vec2(12.9898,78.233)))*43758.5453);}',
    'mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}',
    'vec2 centered(vec2 uv){vec2 p=uv-.5;p.x*=u_resolution.x/max(u_resolution.y,1.);return p;}',
    'vec3 shade(vec2 uv){vec2 q=rot(.6)*centered(uv)*2.*u_scale;float t=u_time*.6;float px=2.*u_scale/max(u_resolution.y,1.);',
    'vec3 color=mix(u_color2,u_color2*.45,clamp(length(centered(uv))*1.3,0.,1.));',
    'for(int i=0;i<6;i++){float fi=float(i),bend=mod(fi,2.)*2.-1.;',
    'float crease=(fi-2.5)*.4+.26*sin(q.x*(1.05+.12*fi)+fi*1.9+t*(.25+.05*fi))+.1*bend*q.x*q.x;',
    'float s=q.y-crease,pane=smoothstep(-px,px,s),back=max(s,0.),body=exp(-back*1.7),fresnel=exp(-back*8.),rim=exp(-back*80.),inner=exp(-pow((back-.045)/.014,2.)),bloom=exp(-abs(s)*20.);',
    'vec3 tint=mix(u_color1,u_color3,clamp(fresnel*.6+.08+.14*sin(fi*2.1+q.x*.8+t*.2),0.,1.));',
    'vec3 light=tint*pane*(body*.24+fresnel*.16)+u_color3*(pane*(rim*.16+inner*.035)+bloom*.025);color+=light*(1.-color);}',
    'return clamp(color,0.,1.);}',
    'void main(){vec3 color=shade(vUv);if(u_noise>.001){float g=grain(vUv*200.+u_time*.1);color*=1.-u_noise*.4+u_noise*g*.4;}gl_FragColor=vec4(color,1.);}'
  ].join('');
  function shader(type, source) {
    var s = gl.createShader(type);
    gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
    return s;
  }
  var vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) { canvas.style.display = 'none'; return; }
  var program = gl.createProgram();
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(program)); canvas.style.display = 'none'; return; }
  gl.useProgram(program);
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  var position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  var u = { time:gl.getUniformLocation(program,'u_time'), color1:gl.getUniformLocation(program,'u_color1'), color2:gl.getUniformLocation(program,'u_color2'), color3:gl.getUniformLocation(program,'u_color3'), scale:gl.getUniformLocation(program,'u_scale'), noise:gl.getUniformLocation(program,'u_noise'), resolution:gl.getUniformLocation(program,'u_resolution') };
  function color(hex) { var n=parseInt(hex.replace('#',''),16); return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255]; }
  var c1=color('#0B1240'), c2=color('#050817'), c3=color('#34558F'), elapsed=0, last=null, active=true, frame=0;
  function resize() { var dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr)); if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;} gl.viewport(0,0,w,h); }
  function draw(now) { if(last!==null) elapsed+=Math.min((now-last)/1000,.1)*.42; last=now; resize(); gl.uniform1f(u.time,elapsed); gl.uniform3fv(u.color1,c1); gl.uniform3fv(u.color2,c2); gl.uniform3fv(u.color3,c3); gl.uniform1f(u.scale,1); gl.uniform1f(u.noise,.08); gl.uniform2f(u.resolution,canvas.width,canvas.height); gl.drawArrays(gl.TRIANGLES,0,6); }
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loop(now) { if(active) draw(now); if(!reduced) frame=requestAnimationFrame(loop); }
  draw(performance.now());
  frame=requestAnimationFrame(loop);
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){active=es[0].isIntersecting; if(active) last=null;}).observe(document.querySelector('.hero'));
  window.addEventListener('resize', resize, { passive:true });
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
