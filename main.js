const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });
document.getElementById('hamburger').addEventListener('click', () => { navbar.classList.toggle('menu-open'); });
document.querySelectorAll('a[href^="#"]').forEach(link => { link.addEventListener('click', e => { e.preventDefault(); navbar.classList.remove('menu-open'); const target = document.querySelector(link.getAttribute('href')); if (target) target.scrollIntoView({ behavior: 'smooth' }); }); });

(function initParticles() {
  const canvas = document.getElementById('engineCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], gears = [];
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 80; i++) { particles.push({ x: Math.random() * 2000, y: Math.random() * 1000, r: Math.random() * 2.5 + 0.5, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.4, alpha: Math.random() * 0.6 + 0.1 }); }
  function createGear(x, y, outerR, teeth, speed, col) { return { x, y, outerR, teeth, speed, col, angle: Math.random() * Math.PI * 2 }; }
  gears = [createGear(0.75, 0.3, 90, 12, 0.008, 'rgba(74,158,255,0.12)'), createGear(0.85, 0.6, 55, 8, -0.012, 'rgba(74,158,255,0.09)'), createGear(0.65, 0.7, 40, 6, 0.018, 'rgba(74,158,255,0.07)'), createGear(0.9, 0.15, 35, 6, -0.02, 'rgba(74,158,255,0.06)')];
  function drawGear(g) { const x = g.x * W, y = g.y * H, r = g.outerR, inner = r * 0.72, teeth = g.teeth, toothH = r * 0.28; ctx.save(); ctx.translate(x, y); ctx.rotate(g.angle); ctx.beginPath(); for (let i = 0; i < teeth; i++) { const a1 = (i / teeth) * Math.PI * 2 - 0.1, a2 = (i / teeth) * Math.PI * 2 + 0.1, a3 = ((i + 0.5) / teeth) * Math.PI * 2 - 0.1, a4 = ((i + 0.5) / teeth) * Math.PI * 2 + 0.1; if (i === 0) ctx.moveTo(Math.cos(a1) * inner, Math.sin(a1) * inner); ctx.lineTo(Math.cos(a1) * inner, Math.sin(a1) * inner); ctx.lineTo(Math.cos(a1) * (r + toothH), Math.sin(a1) * (r + toothH)); ctx.lineTo(Math.cos(a2) * (r + toothH), Math.sin(a2) * (r + toothH)); ctx.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner); ctx.lineTo(Math.cos(a3) * inner, Math.sin(a3) * inner); ctx.lineTo(Math.cos(a4) * inner, Math.sin(a4) * inner); } ctx.closePath(); ctx.strokeStyle = g.col; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, inner * 0.4, 0, Math.PI * 2); ctx.strokeStyle = g.col; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); }
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX / W - 0.5; my = e.clientY / H - 0.5; });
  function animate() { ctx.clearRect(0, 0, W, H); gears.forEach(g => { g.angle += g.speed; drawGear(g); }); particles.forEach(p => { p.x += p.vx + mx * 0.3; p.y += p.vy + my * 0.2; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(74,158,255,${p.alpha})`; ctx.fill(); }); for (let i = 0; i < particles.length; i++) { for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy); if (dist < 120) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(74,158,255,${0.08 * (1 - dist / 120)})`; ctx.lineWidth = 1; ctx.stroke(); } } } requestAnimationFrame(animate); }
  animate();
})();

function animateCounter(el) { const target = parseInt(el.dataset.target), duration = 2000, start = performance.now(); function update(now) { const elapsed = now - start, progress = Math.min(elapsed / duration, 1), eased = 1 - Math.pow(1 - progress, 4); el.textContent = Math.floor(eased * target).toLocaleString('tr-TR'); if (progress < 1) requestAnimationFrame(update); } requestAnimationFrame(update); }
const counterObserver = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } }); }, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

const revealObserver = new IntersectionObserver(entries => { entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); revealObserver.unobserve(e.target); } }); }, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

(function initEngineScroll() {
  const section = document.getElementById('engine-scroll'), carBody = document.getElementById('carBody'), engineBlock = document.getElementById('engineBlock'), starterMotor = document.getElementById('starterMotor'), rotationRing = document.getElementById('rotationRing'), mountBolts = document.getElementById('mountBolts'), sparkLines = document.getElementById('sparkLines'), connectWire = document.getElementById('connectWire'), headline = document.getElementById('engineHeadline'), desc = document.getElementById('engineDesc'), steps = document.querySelectorAll('.pstep');
  const stepData = [{ headline: 'Marş Motoru Hazırlandı', desc: 'Yüksek kaliteli marş motorumuz montaj öncesi kalite kontrol sürecinden geçirildi.' }, { headline: 'Motor Bloğu Konumlandırıldı', desc: 'Araç motor bloğu tespit edildi. Marş motoru bağlantı noktaları hizalanmaya hazır.' }, { headline: 'Araç ile Eşleştirildi', desc: 'Marş motoru araç motor bölmesine yerleştirildi. Elektrik bağlantısı hazırlanıyor.' }, { headline: '✅ Montaj Tamamlandı!', desc: 'Marş motoru başarıyla monte edildi. Elektrik bağlantısı yapıldı, araç çalışmaya hazır!' }];
  let currentStep = -1;
  function setStep(step) { if (step === currentStep) return; currentStep = step; steps.forEach((s, i) => s.classList.toggle('active', i <= step)); headline.style.opacity = '0'; desc.style.opacity = '0'; setTimeout(() => { headline.textContent = stepData[step].headline; desc.textContent = stepData[step].desc; headline.style.opacity = '1'; desc.style.opacity = '1'; }, 200); headline.style.transition = 'opacity 0.35s'; desc.style.transition = 'opacity 0.35s'; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function applyStep(progress) {
    const p1 = Math.min(progress / 0.25, 1), p2 = Math.min((progress - 0.25) / 0.25, 1), p3 = Math.min((progress - 0.5) / 0.25, 1), p4 = Math.min((progress - 0.75) / 0.25, 1);
    const sm = starterMotor; sm.setAttribute('opacity', p1.toFixed(3)); const smScale = 0.4 + p1 * 0.6, smX = lerp(700, 600, Math.min(p1 * 1.5, 1)), smY = lerp(300, 400, Math.min(p1 * 1.5, 1)); sm.setAttribute('transform', `translate(${smX},${smY}) scale(${smScale})`);
    rotationRing.setAttribute('opacity', (p1 * 0.7).toFixed(3));
    engineBlock.setAttribute('opacity', Math.max(0, (p2 * 1.5 - 0.2)).toFixed(3)); const ebScale = 0.6 + p2 * 0.4; engineBlock.setAttribute('transform', `translate(400,250) scale(${ebScale})`);
    carBody.setAttribute('opacity', Math.max(0, p3 * 1.5 - 0.1).toFixed(3));
    if (p4 > 0) { const finalX = lerp(600, 320, easeInOut(p4)), finalY = lerp(400, 310, easeInOut(p4)); sm.setAttribute('transform', `translate(${finalX},${finalY}) scale(0.85)`); mountBolts.setAttribute('opacity', (p4 * 1.5).toFixed(3)); connectWire.setAttribute('opacity', (p4 * 1.2).toFixed(3)); if (p4 > 0.8) sparkLines.setAttribute('opacity', ((p4 - 0.8) * 5 * 0.9).toFixed(3)); }
    if (progress < 0.25) setStep(0); else if (progress < 0.5) setStep(1); else if (progress < 0.75) setStep(2); else setStep(3);
  }
  window.addEventListener('scroll', () => { const rect = section.getBoundingClientRect(), sectionH = section.offsetHeight, viewH = window.innerHeight, scrolled = -rect.top, total = sectionH - viewH, progress = Math.max(0, Math.min(scrolled / total, 1)); applyStep(progress); });
  setStep(0);
})();

document.querySelectorAll('.bf-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.bf-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); const cat = btn.dataset.cat; document.querySelectorAll('.brand-card').forEach(card => { if (cat === 'all' || card.dataset.cat === cat) { card.style.display = ''; card.classList.remove('hidden'); } else { card.style.display = 'none'; card.classList.add('hidden'); } }); }); });

(function initTestimonials() { const testimonials = document.querySelectorAll('.testimonial'), dots = document.querySelectorAll('.tdot'); let current = 0, timer; function show(idx) { testimonials[current].classList.remove('active'); dots[current].classList.remove('active'); current = idx; testimonials[current].classList.add('active'); dots[current].classList.add('active'); } function next() { show((current + 1) % testimonials.length); } timer = setInterval(next, 5000); dots.forEach((dot, i) => { dot.addEventListener('click', () => { clearInterval(timer); show(i); timer = setInterval(next, 5000); }); }); })();

document.getElementById('contactForm').addEventListener('submit', function(e) { e.preventDefault(); const btn = this.querySelector('.btn-text'), icon = this.querySelector('.btn-icon'); btn.textContent = 'Gönderiliyor...'; icon.textContent = '⏳'; setTimeout(() => { btn.textContent = 'Gönderildi!'; icon.textContent = '✓'; document.getElementById('formSuccess').style.display = 'block'; this.reset(); setTimeout(() => { btn.textContent = 'Mesaj Gönder'; icon.textContent = '→'; }, 3000); }, 1200); });

const sections = document.querySelectorAll('section[id]'), navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => { let current = ''; sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; }); navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--blue)' : ''; }); }, { passive: true });