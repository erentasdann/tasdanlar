/* =============================================
   TASDANLAR OTOMOTİV — MAIN JS
   Production-ready, modular JavaScript
   ============================================= */

'use strict';

/* ---- 1. PRELOADER ---- */
(function initPreloader() {
  window.addEventListener('load', function () {
    setTimeout(function () {
      const pl = document.getElementById('preloader');
      if (pl) pl.classList.add('done');
    }, 1800);
  });
})();

/* ---- 2. CUSTOM CURSOR ---- */
(function initCursor() {
  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  if (!outer || !inner) return;

  let ox = window.innerWidth / 2;
  let oy = window.innerHeight / 2;
  let tx = ox, ty = oy;

  document.addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    inner.style.left = tx + 'px';
    inner.style.top  = ty + 'px';
  });

  (function lerpOuter() {
    ox += (tx - ox) * 0.15;
    oy += (ty - oy) * 0.15;
    outer.style.left = ox + 'px';
    outer.style.top  = oy + 'px';
    requestAnimationFrame(lerpOuter);
  })();

  // Scale outer cursor on interactive elements
  document.querySelectorAll('a, button, .tilt-card, .prod-card, .br-card, .ref-card').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      outer.style.width  = '60px';
      outer.style.height = '60px';
    });
    el.addEventListener('mouseleave', function () {
      outer.style.width  = '40px';
      outer.style.height = '40px';
    });
  });
})();

/* ---- 3. SCROLL PROGRESS LINE ---- */
(function initScrollProgress() {
  const line = document.getElementById('scroll-line');
  if (!line) return;
  window.addEventListener('scroll', function () {
    const docH   = document.documentElement.scrollHeight;
    const winH   = window.innerHeight;
    const pct    = (window.scrollY / (docH - winH)) * 100;
    line.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ---- 4. NAVBAR SCROLL STATE ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ---- 5. HAMBURGER MENU ---- */
(function initHamburger() {
  const btn    = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  if (!btn || !navbar) return;
  btn.addEventListener('click', function () {
    navbar.classList.toggle('menu-open');
  });
})();

/* ---- 6. HERO CANVAS ---- */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  const PARTICLE_COUNT = 100;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:     Math.random() * 2000,
      y:     Math.random() * 1000,
      vx:    (Math.random() - 0.5) * 0.55,
      vy:    (Math.random() - 0.5) * 0.45,
      r:     Math.random() * 2.2 + 0.4,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  // Gear definitions (cx/cy as fraction of canvas)
  const gears = [
    { cfx: 0.75, cfy: 0.35, outer: 92,  teeth: 12, speed:  0.007, col: 'rgba(20,100,255,0.11)', angle: 0 },
    { cfx: 0.85, cfy: 0.65, outer: 58,  teeth:  8, speed: -0.011, col: 'rgba(20,100,255,0.08)', angle: 1 },
    { cfx: 0.66, cfy: 0.72, outer: 42,  teeth:  6, speed:  0.018, col: 'rgba(20,100,255,0.07)', angle: 2 },
    { cfx: 0.92, cfy: 0.18, outer: 36,  teeth:  6, speed: -0.022, col: 'rgba(20,100,255,0.06)', angle: 3 },
  ];

  function drawGear(g) {
    const x = g.cfx * W, y = g.cfy * H;
    const r = g.outer, inner = r * 0.7, th = r * 0.28;
    const n = g.teeth;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(g.angle);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a1 = (i / n) * Math.PI * 2 - 0.12;
      const a2 = (i / n) * Math.PI * 2 + 0.12;
      const a3 = ((i + 0.5) / n) * Math.PI * 2 - 0.12;
      const a4 = ((i + 0.5) / n) * Math.PI * 2 + 0.12;
      if (i === 0) ctx.moveTo(Math.cos(a1) * inner, Math.sin(a1) * inner);
      ctx.lineTo(Math.cos(a1) * inner,     Math.sin(a1) * inner);
      ctx.lineTo(Math.cos(a1) * (r + th),  Math.sin(a1) * (r + th));
      ctx.lineTo(Math.cos(a2) * (r + th),  Math.sin(a2) * (r + th));
      ctx.lineTo(Math.cos(a2) * inner,     Math.sin(a2) * inner);
      ctx.lineTo(Math.cos(a3) * inner,     Math.sin(a3) * inner);
      ctx.lineTo(Math.cos(a4) * inner,     Math.sin(a4) * inner);
    }
    ctx.closePath();
    ctx.strokeStyle = g.col;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Hub circle
    ctx.beginPath();
    ctx.arc(0, 0, inner * 0.38, 0, Math.PI * 2);
    ctx.strokeStyle = g.col;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  // Mouse parallax
  let mx = 0, my = 0;
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX / (W || 1) - 0.5;
    my = e.clientY / (H || 1) - 0.5;
  });

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Gears
    gears.forEach(function (g) {
      g.angle += g.speed;
      drawGear(g);
    });

    // Particles
    particles.forEach(function (p) {
      p.x += p.vx + mx * 0.3;
      p.y += p.vy + my * 0.2;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20,100,255,' + p.alpha + ')';
      ctx.fill();
    });

    // Connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(20,100,255,' + (0.09 * (1 - dist / 130)) + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ---- 7. COUNTER ANIMATION ---- */
(function initCounters() {
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start    = performance.now();
    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      el.textContent = Math.floor(eased * target).toLocaleString('tr-TR');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.si-num').forEach(function (el) {
    obs.observe(el);
  });
})();

/* ---- 8. REVEAL ON SCROLL ---- */
(function initReveal() {
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        setTimeout(function () {
          e.target.classList.add('visible');
        }, i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    obs.observe(el);
  });
})();

/* ---- 9. ENGINE SCROLL ANIMATION ---- */
(function initEngineScroll() {
  const section = document.getElementById('engine-scroll');
  if (!section) return;

  const carSVG       = document.getElementById('carSVG');
  const engBlock     = document.getElementById('engBlock');
  const starterMotor = document.getElementById('starterMotor');
  const boltGroup    = document.getElementById('boltGroup');
  const elWire       = document.getElementById('elWire');
  const sparkGrp     = document.getElementById('sparkGrp');
  const esTitle      = document.getElementById('esTitle');
  const esDesc       = document.getElementById('esDesc');
  const esSteps      = document.querySelectorAll('.es-step');

  const stepData = [
    {
      title: 'Kalite Kontrolü',
      desc:  'Yüksek kaliteli marş motorumuz montaj öncesi kapsamlı kalite kontrol sürecinden geçirildi. Her parça hassas toleranslarla üretilmiştir.'
    },
    {
      title: 'Motor Bloğu',
      desc:  'Araç motor bloğu tespit edildi. Marş motoru bağlantı noktaları ve dişli sistemi hizalanmaya hazır durumda.'
    },
    {
      title: 'Araç Entegrasyonu',
      desc:  'Marş motoru araç motor bölmesine yerleştirildi. Elektrik bağlantısı ve montaj cıvataları hazırlanıyor.'
    },
    {
      title: '✅ Montaj Tamam',
      desc:  'Marş motoru başarıyla monte edildi. Elektrik bağlantısı yapıldı, tork değerleri kontrol edildi. Araç çalışmaya hazır!'
    }
  ];

  let currentStep = -1;

  function setStep(step) {
    if (step === currentStep) return;
    currentStep = step;

    esSteps.forEach(function (s, i) {
      s.classList.toggle('active', i <= step);
    });

    if (esTitle && esDesc) {
      esTitle.style.opacity = '0';
      esDesc.style.opacity  = '0';
      setTimeout(function () {
        esTitle.textContent    = stepData[step].title;
        esDesc.textContent     = stepData[step].desc;
        esTitle.style.opacity  = '1';
        esDesc.style.opacity   = '1';
      }, 200);
      esTitle.style.transition = 'opacity 0.35s';
      esDesc.style.transition  = 'opacity 0.35s';
    }
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  function applyProgress(progress) {
    const p1 = clamp01(progress / 0.25);
    const p2 = clamp01((progress - 0.25) / 0.25);
    const p3 = clamp01((progress - 0.50) / 0.25);
    const p4 = clamp01((progress - 0.75) / 0.25);

    // p1: starter motor scales + fades in, lerp from off-screen to resting position
    if (starterMotor) {
      starterMotor.setAttribute('opacity', p1.toFixed(3));
      const smScale = 0.3 + p1 * 0.7;
      const smX     = lerp(750, 650, clamp01(p1 * 1.5));
      const smY     = lerp(500, 420, clamp01(p1 * 1.5));
      starterMotor.setAttribute('transform', 'translate(' + smX + ',' + smY + ') scale(' + smScale + ')');
    }

    // p2: engine block fades + scales in
    if (engBlock) {
      const ebOp    = clamp01(p2 * 1.5 - 0.15);
      const ebScale = 0.5 + p2 * 0.5;
      engBlock.setAttribute('opacity', ebOp.toFixed(3));
      engBlock.setAttribute('transform', 'translate(400,250) scale(' + ebScale + ')');
    }

    // p3: car SVG fades in
    if (carSVG) {
      const cOp = clamp01(p3 * 1.5 - 0.1);
      carSVG.setAttribute('opacity', cOp.toFixed(3));
    }

    // p4: starter motor translates from resting to mounted position
    if (p4 > 0 && starterMotor) {
      const finalX = lerp(650, 310, easeInOut(p4));
      const finalY = lerp(420, 310, easeInOut(p4));
      starterMotor.setAttribute('transform', 'translate(' + finalX + ',' + finalY + ') scale(0.85)');
    }
    if (boltGroup) {
      boltGroup.setAttribute('opacity', clamp01(p4 * 1.6).toFixed(3));
    }
    if (elWire) {
      elWire.setAttribute('opacity', clamp01(p4 * 1.4).toFixed(3));
    }
    if (sparkGrp) {
      const sparkOp = p4 > 0.8 ? clamp01((p4 - 0.8) * 5 * 0.9) : 0;
      sparkGrp.setAttribute('opacity', sparkOp.toFixed(3));
    }

    // Determine current step
    if      (progress < 0.25) setStep(0);
    else if (progress < 0.50) setStep(1);
    else if (progress < 0.75) setStep(2);
    else                       setStep(3);
  }

  window.addEventListener('scroll', function () {
    const rect    = section.getBoundingClientRect();
    const sectionH = section.offsetHeight;
    const viewH   = window.innerHeight;
    const scrolled = -rect.top;
    const total   = sectionH - viewH;
    const progress = Math.max(0, Math.min(scrolled / total, 1));
    applyProgress(progress);
  }, { passive: true });

  // Initialise
  setStep(0);
})();

/* ---- 10. BRAND FILTER ---- */
(function initBrandFilter() {
  const btns = document.querySelectorAll('.bcat');
  const cards = document.querySelectorAll('.br-card');
  if (!btns.length) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat');
      cards.forEach(function (card) {
        const match = cat === 'all' || card.getAttribute('data-cat') === cat;
        if (match) {
          card.style.display = '';
          card.classList.remove('hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ---- 11. TESTIMONIAL SLIDER ---- */
(function initTestimonials() {
  const data = [
    {
      text:   'Tasdanlar ile araç duruş sürelerimiz %60 azaldı. Hızlı teslimat ve kaliteli ürün anlayışları rakipsiz.',
      author: 'Mehmet Yılmaz',
      role:   'Arkas Lojistik, Filo Müdürü'
    },
    {
      text:   'Teknik destek kalitesi beklentilerimizin çok üzerindeydi. Uzun yıllar sürecek bir iş birliği planlamaktayız.',
      author: 'Ayşe Kaya',
      role:   'İETT, Bakım Koordinatörü'
    },
    {
      text:   'Fiyat-performans açısından sektörün en iyi alternatifi. Orijinal parça tedarikinde tüm sorunlarımızı çözdüler.',
      author: 'Ali Demir',
      role:   'Kalyon İnşaat, Makine Şefi'
    }
  ];

  const tbText   = document.getElementById('tbText');
  const tbAuthor = document.getElementById('tbAuthor');
  const dots     = document.querySelectorAll('.tbd');
  if (!tbText || !tbAuthor) return;

  let current = 0;
  let timer;

  function show(idx) {
    current = idx;
    const d = data[idx];

    tbText.style.opacity   = '0';
    tbAuthor.style.opacity = '0';
    setTimeout(function () {
      tbText.textContent     = d.text;
      tbAuthor.innerHTML     = '<strong>' + d.author + '</strong><span>' + d.role + '</span>';
      tbText.style.opacity   = '1';
      tbAuthor.style.opacity = '1';
    }, 250);
    tbText.style.transition   = 'opacity 0.4s';
    tbAuthor.style.transition = 'opacity 0.4s';

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === idx);
    });
  }

  function next() { show((current + 1) % data.length); }
  timer = setInterval(next, 5000);

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      clearInterval(timer);
      show(i);
      timer = setInterval(next, 5000);
    });
  });
})();

/* ---- 12. TILT EFFECT ---- */
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const rotX   = (-dy / (rect.height / 2)) * 10;
      const rotY   = ( dx / (rect.width  / 2)) * 10;
      card.style.transform    = 'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-8px)';
      card.style.transition   = 'transform 0.08s linear';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    });
  });
})();

/* ---- 13. MAGNETIC BUTTONS ---- */
(function initMagneticButtons() {
  document.querySelectorAll('.mag-btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.4;
      const dy   = (e.clientY - cy) * 0.4;
      btn.style.transform  = 'translate(' + dx + 'px, ' + dy + 'px)';
      btn.style.transition = 'transform 0.1s linear';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform  = 'translate(0, 0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    });
  });
})();

/* ---- 14. CONTACT FORM ---- */
(function initContactForm() {
  const form = document.getElementById('cfForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btnText  = document.getElementById('cfBtnText');
    const btnIcon  = document.getElementById('cfBtnIcon');
    const success  = document.getElementById('cfSuccess');
    const submitBtn = form.querySelector('.cf-submit');

    if (btnText) btnText.textContent = 'Gönderiliyor...';
    if (btnIcon) btnIcon.textContent = '⏳';
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(function () {
      if (btnText) btnText.textContent = 'Gönderildi!';
      if (btnIcon) btnIcon.textContent = '✓';
      if (success) success.style.display = 'block';
      form.reset();

      setTimeout(function () {
        if (btnText)  btnText.textContent  = 'Mesaj Gönder';
        if (btnIcon)  btnIcon.textContent  = '→';
        if (submitBtn) submitBtn.disabled  = false;
      }, 3000);
    }, 1200);
  });
})();

/* ---- 15. SMOOTH SCROLL ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // Close mobile menu if open
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.classList.remove('menu-open');
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ---- 16. ACTIVE NAV LINK ---- */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-menu .nav-link');
  if (!sections.length || !navLinks.length) return;

  function update() {
    let current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 130) {
        current = s.id;
      }
    });
    navLinks.forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === '#' + current) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
