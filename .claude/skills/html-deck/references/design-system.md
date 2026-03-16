# Design System Reference — HTML Deck

Complete CSS, typography, color, and component reference for building professional HTML slide decks.

---

## CSS Variables & Tokens

```css
:root {
  /* Backgrounds */
  --bg-primary: #F9F6F0;           /* Main light background */
  --bg-warm: #F2EEE6;              /* Warm variant (cover, alternating) */
  --bg-muted: #E5E2DA;             /* Muted variant */
  --bg-dark: #1a2456;              /* Dark navy (promo, closing slides) */
  --bg-dark-deep: #111a3a;         /* Deeper navy variant */

  /* Text */
  --text-primary: #212C33;         /* Headings, primary text */
  --text-secondary: #333334;       /* Body text */
  --text-muted: rgba(51,51,52,0.5); /* Labels, captions */
  --text-faint: #9e9e9e;           /* Footnotes, meta */
  --text-on-dark: #f0ede7;         /* Text on dark backgrounds */

  /* Borders */
  --border-light: rgba(51,51,52,0.1);
  --border-mid: rgba(51,51,52,0.15);

  /* Accents */
  --accent-navy: #1a2456;          /* Primary brand accent */
  --accent-blue: #2d4a8a;          /* Secondary blue */
  --accent-amber: #c8956c;         /* Warm accent */
  --accent-gold: #d4a853;          /* Gold highlight (use on dark) */

  /* Radius */
  --radius-card: 24px;
  --radius-pill: 999px;

  /* Fonts */
  --font-serif: "Instrument Serif", Georgia, serif;
  --font-sans: "Geist", system-ui, -apple-system, sans-serif;
  --font-mono: "Geist Mono", "Courier New", monospace;

  /* Spacing */
  --slide-pad: clamp(48px, 6vw, 96px);
  --gap-sm: 16px;
  --gap-md: 24px;
  --gap-lg: 40px;
}
```

---

## Google Fonts Import

Always load these three fonts at the top of `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Base Slide Styles

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  overflow: hidden;
  background: var(--bg-primary);
  font-family: var(--font-sans);
  color: var(--text-secondary);
  -webkit-font-smoothing: antialiased;
}

.deck {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

section.slide {
  position: absolute;
  inset: 0;
  padding: var(--slide-pad);
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  overflow: hidden;
}

section.slide.active {
  opacity: 1;
  pointer-events: all;
}

/* Slide background variants */
section.slide.dark {
  background: var(--bg-dark);
  color: var(--text-on-dark);
}
section.slide.warm {
  background: var(--bg-warm);
}
section.slide.muted {
  background: var(--bg-muted);
}
```

---

## Typography

```css
/* Section tag — appears above action title */
.slide-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.slide.dark .slide-tag {
  color: rgba(240, 237, 231, 0.5);
}

/* Action title — main slide heading */
.slide h1, .slide-title {
  font-family: var(--font-serif);
  font-size: clamp(32px, 3.5vw, 52px);
  font-weight: 400;
  line-height: 1.2;
  color: var(--text-primary);
  max-width: 820px;
  margin-bottom: 32px;
}
.slide.dark h1, .slide.dark .slide-title {
  color: var(--text-on-dark);
}

/* Cover title — larger */
.cover-title {
  font-family: var(--font-serif);
  font-size: clamp(48px, 6vw, 80px);
  font-weight: 400;
  line-height: 1.1;
  color: var(--text-primary);
}

/* Body text */
.slide p, .slide li {
  font-family: var(--font-sans);
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.65;
  color: var(--text-secondary);
}

/* Card heading */
.card-title {
  font-family: var(--font-sans);
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* Stat number */
.stat-number {
  font-family: var(--font-sans);
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 700;
  color: var(--accent-navy);
  line-height: 1;
}
.slide.dark .stat-number {
  color: var(--accent-gold);
}

/* Footnote / source */
.footnote {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-faint);
  position: absolute;
  bottom: 28px;
  right: var(--slide-pad);
}
```

---

## Component Library

### Card

```css
.card {
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 28px 32px;
  transition: box-shadow 0.2s ease;
}
.card:hover {
  box-shadow: 0 8px 32px rgba(26,36,86,0.08);
}
/* Accent left bar variant */
.card.accent-bar {
  border-left: 4px solid var(--accent-navy);
}

/* Card on dark background */
.slide.dark .card {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.12);
}
```

### Stat Card

```html
<div class="card stat-card">
  <div class="stat-number">85%</div>
  <div class="stat-label">of fellows received job offers abroad</div>
</div>
```

```css
.stat-card {
  text-align: center;
  padding: 32px 24px;
}
.stat-label {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 8px;
  line-height: 1.4;
}
```

### Grid Layouts

```css
/* 3-column cards */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
}

/* 2-column split */
.grid-2 {
  display: grid;
  grid-template-columns: 55fr 45fr;
  gap: var(--gap-lg);
  align-items: center;
}

/* 4-column stats */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-md);
}
```

### Tag / Pill

```css
.tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  background: rgba(26,36,86,0.08);
  color: var(--accent-navy);
}
.tag.amber { background: rgba(200,149,108,0.12); color: var(--accent-amber); }
```

### Divider / Rule

```css
.rule {
  width: 48px;
  height: 3px;
  background: var(--accent-navy);
  border-radius: 2px;
  margin: 20px 0;
}
.slide.dark .rule { background: var(--accent-gold); }
```

### Logo Bar (for partner logos)

```css
.logo-bar {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}
.logo-bar img {
  height: 32px;
  max-width: 120px;
  object-fit: contain;
  filter: grayscale(1) opacity(0.5);
  transition: filter 0.2s ease;
}
.logo-bar img:hover {
  filter: grayscale(0) opacity(1);
}
```

### CTA Button

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.btn-primary {
  background: var(--accent-navy);
  color: #fff;
}
.btn-primary:hover {
  background: var(--accent-blue);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26,36,86,0.25);
}
.btn-outline {
  border: 2px solid currentColor;
  color: var(--accent-navy);
}
.slide.dark .btn-outline { color: var(--text-on-dark); }
```

---

## Navigation Dots

```html
<nav id="slide-nav">
  <!-- Dots are generated by JS, or hardcoded: -->
  <button class="nav-dot active" aria-label="Slide 1"></button>
  <button class="nav-dot" aria-label="Slide 2"></button>
  <!-- etc -->
</nav>
```

```css
#slide-nav {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}
.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(33,44,51,0.2);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}
.nav-dot.active {
  background: var(--accent-navy);
  transform: scale(1.4);
}
/* On dark slides */
#slide-nav.on-dark .nav-dot { background: rgba(255,255,255,0.3); }
#slide-nav.on-dark .nav-dot.active { background: var(--accent-gold); }
```

---

## Animation Library

```css
/* Entrance animations — triggered when slide becomes .active */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
}

.animate { opacity: 0; }
.slide.active .animate { animation: fadeInUp 0.5s ease forwards; }
.slide.active .animate-fade { animation: fadeIn 0.5s ease forwards; }
.slide.active .animate-left { animation: slideInLeft 0.5s ease forwards; }

/* Delay helpers */
.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }
.animate-delay-4 { animation-delay: 0.4s; }
.animate-delay-5 { animation-delay: 0.5s; }
.animate-delay-6 { animation-delay: 0.6s; }

/* IMPORTANT: Reset animations when slide becomes inactive */
.slide:not(.active) .animate,
.slide:not(.active) .animate-fade,
.slide:not(.active) .animate-left {
  opacity: 0;
  animation: none;
}
```

---

## Navigation Engine (Complete JS)

```javascript
(function() {
  const slides = document.querySelectorAll('section.slide');
  const nav = document.getElementById('slide-nav');
  const DARK_SLIDES = []; // Fill with indices of dark-background slides, e.g. [0, 5, 11]
  let current = 0;
  let isTransitioning = false;

  // Generate nav dots dynamically
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); });
    nav.appendChild(dot);
  });
  const dots = nav.querySelectorAll('.nav-dot');

  function goTo(n) {
    if (isTransitioning) return;
    if (n < 0 || n >= slides.length) return;
    isTransitioning = true;

    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = n;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    // Dark slide detection
    nav.classList.toggle('on-dark', DARK_SLIDES.includes(current));

    setTimeout(() => { isTransitioning = false; }, 450);
  }

  // Click to advance
  document.addEventListener('click', e => {
    if (e.target.closest('#slide-nav')) return;
    goTo(current + 1);
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
    if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(slides.length - 1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  });

  goTo(0);
})();
```

---

## Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 900px) {
  :root { --slide-pad: 40px; }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-2 { grid-template-columns: 1fr; gap: var(--gap-md); }
  .slide h1, .slide-title { font-size: 28px; }
}

/* Mobile */
@media (max-width: 480px) {
  :root { --slide-pad: 24px; }
  .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .cover-title { font-size: 36px; }
  #slide-nav { display: none; }
}
```

---

## Full HTML Boilerplate

Use this as the starting template for every new deck:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Presentation Title</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* === PASTE FULL CSS FROM design-system.md HERE === */
</style>
</head>
<body>

<nav id="slide-nav"></nav>

<div class="deck">

  <!-- SLIDE 1: COVER -->
  <section class="slide dark" id="s1">
    <span class="slide-tag">Program Name · Month Year</span>
    <h1 class="cover-title animate">Presentation Title<br><em>Subtitle if needed</em></h1>
    <p class="animate animate-delay-2" style="margin-top:24px; opacity:0.7">Partner: [Name] | Prepared by: [Author]</p>
  </section>

  <!-- SLIDE 2: CONTENT EXAMPLE -->
  <section class="slide warm" id="s2">
    <span class="slide-tag">Section Name</span>
    <h1 class="animate">Action title that makes a specific, provable claim about this slide's content</h1>
    <div class="grid-3 animate animate-delay-2">
      <div class="card">
        <div class="card-title">Point One</div>
        <p>Supporting detail that proves the action title claim.</p>
      </div>
      <div class="card">
        <div class="card-title">Point Two</div>
        <p>Supporting detail that proves the action title claim.</p>
      </div>
      <div class="card">
        <div class="card-title">Point Three</div>
        <p>Supporting detail that proves the action title claim.</p>
      </div>
    </div>
    <span class="footnote">Source: [Name], [Month Year]</span>
  </section>

</div><!-- /.deck -->

<script>
/* === PASTE NAVIGATION ENGINE FROM design-system.md HERE === */
/* Set DARK_SLIDES = [0] for this example (slide index 0 is dark) */
</script>

</body>
</html>
```
