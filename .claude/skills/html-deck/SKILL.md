---
name: html-deck
description: "Use this skill whenever the user wants to create an HTML slide deck, pitch deck, sponsorship proposal, partnership offer, or investor presentation as an interactive web page. This includes creating full-screen slide-based HTML presentations with click/scroll navigation, professional typography, animations, and consulting-quality structure. Trigger whenever the user mentions 'deck', 'pitch', 'proposal', 'presentation', 'slides', or 'oferta' and the output is an HTML file (not .pptx). Also trigger when editing or improving existing HTML decks. This skill enforces MBB-grade (McKinsey/Bain/BCG) slide structure with action titles, narrative flow, and professional design standards. Always use this skill for HTML presentations — it contains the design system, typography rules, color palettes, slide anatomy, and structural principles that prevent the most common AI presentation mistakes."
---

# HTML Deck Skill

Create professional, interactive HTML slide presentations with MBB-grade structure and premium design quality.

**Before writing any code, read this file completely.**

## Quick Start

1. Read this SKILL.md fully (structure, narrative, slide anatomy, design system)
2. Plan the storyline using the Narrative Architecture section below
3. Write action titles for every slide BEFORE coding
4. Build the HTML deck
5. QA against the checklist at the bottom

---

## Core Philosophy

This skill merges two traditions:

1. **MBB Consulting Structure** (McKinsey, Bain, BCG) — organize information so a reader understands the full argument by reading only the slide titles
2. **Premium Web Design** — beautiful animations, typography, and layout that feel designed, not generated

The result: presentations that are both *structurally rigorous* and *visually stunning*.

---

## Narrative Architecture

Every deck tells a story. Before touching code, plan the narrative.

### The SCQA Framework

Use Situation → Complication → Question → Answer to structure the overall deck:

| Element | Purpose | Example |
|---------|---------|---------|
| Situation | Shared context the audience already knows | "Poland produces world-class STEM talent" |
| Complication | What has changed or what's at stake | "But 70% leave for jobs abroad within 5 years" |
| Question | What must be addressed (often implicit) | "How do we retain and develop this talent?" |
| Answer | Your recommendation / proposal | "Bison Fellowship — an 8-week AI mentorship program" |

### Deck Flow Template

A typical partnership/sponsorship deck follows this arc:

```
1. COVER          — Title, partner name, date
2. CREDIBILITY    — Who we are (team, track record)
3. PROBLEM/VISION — Why this matters (the SCQA)
4. PROGRAM        — What it is, how it works
5. SOCIAL PROOF   — Mentors, past events, testimonials
6. STRUCTURE      — Detailed mechanics (timeline, pillars)
7. PARTNER ROLE   — What the partner specifically does
8. PARTNER VALUE  — What the partner gets back
9. MEDIA/REACH    — Audience, channels, numbers
10. PROMOTION     — Specific deliverables for the partner
11. TERMS         — Pricing, conditions
12. EVENT/CTA     — Upcoming milestone, call to action
13. CLOSING       — Tagline, contact
```

Not every deck needs all sections. But the ORDER matters — lead with credibility, establish opportunity, then detail the ask.

### Slide-to-Slide Flow

Each slide title should flow into the next, forming a readable narrative. Test by reading ONLY the titles in sequence — they should tell the complete story.

---

## Action Titles (Most Important Rule)

Every slide MUST have an **action title** — a complete sentence stating the insight or conclusion of that slide.

### ❌ Bad titles (topic labels):
- "Our Team"
- "The Program"
- "Market Size"
- "Why Partner With Us"

### ✅ Good action titles (insights):
- "Two founders combine Wharton economics with Poland's largest science platform"
- "Bison Fellowship selects the top 1% of Polish AI students through a 3-stage process"
- "The Polish AI talent market will grow 4x by 2028, yet retention remains under 30%"
- "Partners receive 6 months of branded touchpoints with Poland's highest-potential students"

### Rules for action titles:
1. Must be a full sentence (subject + verb + insight)
2. Readable in 5 seconds or less
3. Connects logically to the previous and next slide title
4. Contains the key takeaway — reading only this title, you learn something real
5. Styling: smaller than body content, gray/muted color — it's a label, not a headline
6. The MAIN visual element illustrates or supports the action title

### Slide Anatomy

```
┌─────────────────────────────────────────────────┐
│  [Section tag — small, uppercase, accent color]  │
│                                                  │
│  Action title: Full sentence stating the         │  ← Small, gray, top
│  insight of this slide                           │
│                                                  │
│                                                  │
│     MAIN VISUAL / KEY STAT / DIAGRAM             │  ← Large, dominant
│                                                  │
│                                                  │
│  Supporting text or sub-points if needed         │  ← Small, secondary
│                                                  │
│  [Logo]                          [  3 / 12  ]   │
└─────────────────────────────────────────────────┘
```

---

## Navigation & Interaction

Every HTML deck MUST include:

```javascript
let current = 0;
const slides = document.querySelectorAll('.slide');

function goTo(n) {
  slides[current].classList.remove('active');
  current = Math.max(0, Math.min(n, slides.length - 1));
  slides[current].classList.add('active');
  updateCounter();
  updateProgress();
  // Re-trigger entrance animations
  slides[current].querySelectorAll('.animate').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';
  });
}

document.addEventListener('keydown', e => {
  if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
  if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
});

// Click right 80% = advance, left 20% = back
document.querySelector('.presentation').addEventListener('click', e => {
  if (e.clientX > window.innerWidth * 0.2) goTo(current + 1);
  else goTo(current - 1);
});

function updateCounter() {
  document.getElementById('counter').textContent = `${current + 1} / ${slides.length}`;
}
function updateProgress() {
  document.getElementById('progress').style.width = `${((current + 1) / slides.length) * 100}%`;
}
goTo(0);
```

Required UI chrome:
- **Progress bar** — bottom of viewport, 3px tall, accent color
- **Slide counter** — bottom-right, "3 / 12" format
- **Nav dots** — bottom-center (optional, good for decks < 20 slides)

---

## Design System

### Typography

```css
:root {
  /* Fonts — load from Google Fonts */
  --font-display: 'Instrument Serif', Georgia, serif;  /* Hero numbers, covers */
  --font-heading: 'Geist', 'Inter', sans-serif;        /* Headings */
  --font-body:    'Geist', 'Inter', sans-serif;        /* Body */
  --font-mono:    'Geist Mono', 'Courier New', mono;   /* Tags, labels */

  /* Scale */
  --text-xs:   clamp(11px, 1vw, 13px);
  --text-sm:   clamp(13px, 1.2vw, 15px);
  --text-base: clamp(16px, 1.6vw, 20px);
  --text-lg:   clamp(20px, 2vw, 26px);
  --text-xl:   clamp(26px, 3vw, 36px);
  --text-2xl:  clamp(36px, 4.5vw, 56px);
  --text-3xl:  clamp(52px, 6vw, 80px);
  --text-stat: clamp(64px, 8vw, 120px);  /* Big numbers */
}
```

### Color Palettes

**Default: Navy/Gold (Corporate/Consulting)**
```css
:root {
  --bg-dark:    #0a0e1a;
  --bg-medium:  #111827;
  --bg-light:   #f8f7f4;
  --navy:       #1a2744;
  --gold:       #c9a84c;
  --gold-light: #e8c97a;
  --cream:      #f5f0e8;
  --text-dark:  #1a1a2e;
  --text-light: #f0f0f0;
  --text-muted: #8892a4;
  --border:     rgba(255,255,255,0.08);
}
```

**Science/Editorial (This Is World)**
```css
:root {
  --bg-dark:  #0d1117;
  --surface:  #161b22;
  --accent:   #4493f8;
  --accent-2: #f7914f;
  --text:     #e6edf3;
  --muted:    #7d8590;
}
```

**Warm/Wellness (Mos Health)**
```css
:root {
  --earthy-1: #6b615c; --earthy-2: #8e817b; --earthy-3: #a59b97;
  --cream-1:  #ddd2ca; --cream-2:  #f5ede9; --cream-3:  #f9f4f2;
  --peach-1:  #ffb685; --peach-2:  #ffc197; --peach-3:  #ffd1ab;
}
```

### Dark/Light Alternation

Alternate slides for visual rhythm:
```css
.slide        { background: var(--bg-dark);  color: var(--text-light); }
.slide.light  { background: var(--bg-light); color: var(--text-dark);  }
```

Pattern: Cover=dark, Problem=dark, Solution=light, Stats=dark, Team=light, CTA=dark

---

## Components

### Stat Card
```html
<div class="stat-card">
  <div class="stat-number" data-target="16600000">0</div>
  <div class="stat-label">monthly views</div>
</div>
```
```css
.stat-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-top: 3px solid var(--gold);
  border-radius: 16px;
  padding: 32px 28px;
  text-align: center;
}
.stat-number { font-family: var(--font-display); font-size: var(--text-stat); color: var(--gold); line-height: 1; }
.stat-label  { font-size: var(--text-base); color: var(--text-muted); margin-top: 8px; }
```

### Tier Card (Sponsorship/Pricing)
```html
<div class="tier-card tier-gold">
  <div class="tier-badge">GOLD</div>
  <div class="tier-price">180 000 PLN</div>
  <ul class="tier-benefits">
    <li>Exclusive title sponsorship</li>
    <li>Logo on all materials</li>
    <li>4 delegate spots</li>
  </ul>
</div>
```

### Pull Quote
```html
<blockquote class="pull-quote">
  <p>"Poland produces world-class AI engineers. Bison Fellowship keeps them here."</p>
  <cite>— Dr. Maciej Kawecki, Founder</cite>
</blockquote>
```

### Logo Row (Partners)
```html
<div class="logo-row">
  <img src="logo1.svg" alt="Partner" class="partner-logo">
</div>
```
```css
.logo-row { display: flex; align-items: center; gap: 48px; flex-wrap: wrap; }
.partner-logo { height: 40px; opacity: 0.7; filter: grayscale(1); transition: all 0.3s; }
.partner-logo:hover { opacity: 1; filter: none; }
```

---

## Animations

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate           { opacity: 0; animation: fadeInUp 0.5s ease forwards; }
.animate-delay-1   { animation-delay: 0.1s; }
.animate-delay-2   { animation-delay: 0.2s; }
.animate-delay-3   { animation-delay: 0.3s; }
.animate-delay-4   { animation-delay: 0.4s; }
```

Animated stat counters:
```javascript
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (time) => {
    const p = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
// Trigger on slide enter for all [data-target] elements
```

Slide transition:
```css
.slide { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; }
.slide.active { opacity: 1; pointer-events: all; }
```

**Banned:** 3D transforms, bounce/elastic effects, auto-playing loops, parallax.

---

## PDF Export Mode

```javascript
if (new URLSearchParams(window.location.search).get('pdf') === 'true') {
  document.querySelectorAll('.slide').forEach(s => {
    s.style.position = 'relative';
    s.style.opacity = '1';
    s.style.height = '100vh';
    s.style.pageBreakAfter = 'always';
  });
  document.querySelector('.slide-nav')?.remove();
  document.getElementById('progress')?.remove();
}
```

---

## Quality Checklist

Before writing any code:
- [ ] Full slide sequence planned with action titles written out
- [ ] Narrative follows SCQA or Pyramid Principle
- [ ] Dark/light alternation decided per slide
- [ ] Client brand colors identified

While coding:
- [ ] CSS variables used throughout (no hardcoded colors)
- [ ] Font sizes from the type scale
- [ ] Border-radius 16–24px on cards
- [ ] `.animate` + `.animate-delay-N` on all key elements
- [ ] Slide counter showing "X / Y" at all times
- [ ] Logo consistent position every slide

After coding:
- [ ] Keyboard navigation tested (arrows, space)
- [ ] Click navigation tested
- [ ] No text overflow at 1280px and 1920px
- [ ] PDF mode (`?pdf=true`) renders all slides
- [ ] Stat counters animate on slide entry

---

## Common Mistakes to Avoid

| ❌ Never | ✅ Always |
|---|---|
| Topic label titles ("Our Team") | Action titles with full sentence insight |
| All slides same background | Alternate dark/light for rhythm |
| Hardcoded hex colors | CSS variables only |
| Text-heavy slides (>40 words) | Max 40 words, lead with visuals |
| No animation | Entrance animations on every key element |
| Generic fonts (Arial, Times) | Instrument Serif + Geist or brand fonts |
| Cramped layouts | Generous padding `clamp(48px, 7vw, 120px)` |
| Static stat numbers | Animated counters |
| No PDF mode | Always include `?pdf=true` support |
| Inconsistent logo placement | Same position every slide |
