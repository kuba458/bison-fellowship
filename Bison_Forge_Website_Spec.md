# BISON FORGE — Website Implementation Spec

*Specification for Claude Code / developer handoff*

---

## Overview

Single-page landing site for Bison Forge — an elite fellowship program that identifies Poland's best engineers and places them as founding engineers in high-growth startups. The page targets candidates (engineers, CS students, olympiad alumni) and must communicate extreme selectivity, prestige, and quality.

The visual identity is built around a pixel art bison walking through Białowieża forest with warm amber lighting. A looping video of this bison serves as the hero background. The entire page is dark, atmospheric, and cinematic — closer to a luxury brand or a Nolan film than a typical startup program page.

**Tech stack:** Next.js (or plain HTML/CSS/JS if simpler), Tailwind CSS, deployed on Vercel or Cloudflare Pages.

**Key assets provided:**
- `bison-walk.mp4` — looping video of pixel art bison walking through forest (hero background)
- `bison-hero.webp` — static fallback image (the pixel art forest + bison)
- Fonts: Monument Extended (Ultra Bold), Satoshi, JetBrains Mono

---

## Design Tokens

### Colors

```css
:root {
  --bg-primary: #0A0F0D;
  --bg-surface: #111916;
  --bg-elevated: #182420;
  --border-subtle: #1E2B24;
  --border-accent: #E8A838;

  --text-primary: #F0F0EC;
  --text-secondary: #A0A89C;
  --text-muted: #5C665E;

  --accent-amber: #E8A838;
  --accent-amber-hover: #F0B848;
  --accent-amber-glow: rgba(232, 168, 56, 0.15);
  --accent-green: #3D7A4A;
  --accent-ember: #D4542A;

  --gradient-forest-forge: linear-gradient(180deg, #0A0F0D 0%, #111916 40%, #1A1510 70%, #1C1208 100%);
}
```

### Typography

```css
/* Headlines — Monument Extended Ultra Bold */
.h-display {
  font-family: 'Monument Extended', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--text-primary);
}

/* Body — Satoshi */
.body {
  font-family: 'Satoshi', sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Mono/Stats — JetBrains Mono */
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: var(--accent-amber);
}

/* Pixel accent — Press Start 2P (Google Fonts, use VERY sparingly) */
.pixel-label {
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-amber);
}
```

### Font sizes (desktop → mobile)

```
Display (hero H1):   clamp(48px, 7vw, 96px)
H2 (section heads):  clamp(32px, 4.5vw, 56px)
H3 (subsections):    clamp(20px, 2.5vw, 28px)
Body:                17px (desktop), 16px (mobile)
Small/Caption:       14px
Pixel label:         10px
Stat numbers:        clamp(40px, 6vw, 72px)
```

### Spacing system

Use 8px grid. Common spacings: 8, 16, 24, 32, 48, 64, 96, 128, 160.

### Max content width

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Wider for stats/full-bleed sections */
.container-wide {
  max-width: 1400px;
}
```

---

## Global Elements

### Navigation (sticky)

Fixed top bar. Transparent initially, transitions to `var(--bg-primary)` with `backdrop-filter: blur(16px)` after scrolling past hero.

```
Layout (desktop):
[Logo: "BISON FORGE" in Monument Extended, 16px, tracking wide]     [Program]  [Event]  [About]  [APPLY →]

Layout (mobile):
[Logo: "BISON FORGE"]                                               [APPLY →]  [☰]
```

- Logo: text only, white, Monument Extended. No image logo needed — the name IS the logo.
- "APPLY →" is always visible — amber background, dark text, rounded-sm (4px radius). This is the most important element on the entire page.
- Nav links: `var(--text-secondary)`, hover → `var(--text-primary)`. Scroll to section on click.
- Mobile: hamburger collapses nav links, but APPLY button remains visible at all times.
- Z-index: above everything.

### Smooth scroll

All anchor links use smooth scroll with slight offset for sticky nav height.

### Cursor

Default cursor everywhere. No custom cursors. Clean and professional.

---

## Page Sections

---

### SECTION 1: HERO

**Height:** 100vh (full viewport)

**Background:** The pixel art bison video (`bison-walk.mp4`) playing on loop, muted, autoplaying. Covers full viewport. `object-fit: cover`. Fallback: static `bison-hero.webp`.

**Overlays on top of video (in order):**
1. Dark gradient overlay from top: `linear-gradient(180deg, rgba(10,15,13,0.8) 0%, rgba(10,15,13,0.2) 40%, rgba(10,15,13,0.1) 60%, rgba(10,15,13,0.7) 100%)` — ensures text readability at top and bottom, middle is more transparent so bison is visible
2. Subtle noise texture overlay (optional, 2-3% opacity) for grain

**Content (centered vertically and horizontally, z-index above overlays):**

```
[pixel-label]  FELLOWSHIP FOR FOUNDING ENGINEERS

[h-display, max-width 900px, centered]
BISON
FORGE

[body, max-width 560px, centered, text-secondary, margin-top 24px]
Poland's most selective engineering fellowship.
We find exceptional talent and forge founding
engineers for the world's best startups.

[Two buttons, horizontal on desktop, stacked on mobile, margin-top 40px]
[PRIMARY: "APPLY NOW" — amber bg, dark text, large padding (16px 48px), Monument Extended 14px uppercase]
[SECONDARY: "LEARN MORE ↓" — transparent bg, white border 1px, white text, same sizing]
```

**"BISON FORGE" treatment:** These two words are the centerpiece of the entire page. Massive — `clamp(64px, 10vw, 140px)`. Each word on its own line. Line-height tight (0.9). Slight text-shadow or subtle amber glow behind letters to lift them off the dark background: `text-shadow: 0 0 80px rgba(232,168,56,0.15)`.

**Scroll indicator:** Bottom center, subtle. Thin line (1px, 24px tall, white, 40% opacity) with slow pulse animation (opacity 0.2 → 0.5 → 0.2, 3s loop). Disappears on scroll.

**Performance:** Video should be compressed WebM (primary) with MP4 fallback. Max 4-6MB for the loop. `playsinline` attribute for iOS. Preload `metadata` only.

```html
<video autoplay muted loop playsinline poster="bison-hero.webp">
  <source src="bison-walk.webm" type="video/webm">
  <source src="bison-walk.mp4" type="video/mp4">
</video>
```

---

### SECTION 2: MANIFESTO

**Purpose:** Emotional hook. Why this exists. Short, punchy, no fluff.

**Background:** `var(--bg-primary)`, solid. Clean break from the video hero.

**Layout:** Centered text, narrow column (max-width 680px).

**Padding:** 160px top, 160px bottom (lots of breathing room).

**Content:**

```
[h2, Monument Extended, centered]
THE BEST ENGINEERS
ARE HIDDEN

[body, centered, text-secondary, margin-top 32px, line-height 1.7]
Poland produces some of the world's best programmers.
Olympiad winners. ICPC competitors. Builders of complex systems.

[body, centered, text-secondary, margin-top 16px]
They end up at consulting firms, big tech, and hedge funds —
because nobody showed them a different path.

[body, centered, text-primary (white), margin-top 32px, font-weight 500]
Bison Forge is that path.
```

The last line is white (text-primary) and slightly bolder — it's the punch line. Everything before it is text-secondary (muted).

**Optional:** A single thin horizontal line (1px, 80px wide, centered, `var(--border-subtle)`) above the section as a divider.

---

### SECTION 3: WHAT YOU GET

**Purpose:** Concrete value prop. Four pillars. No fluff, no corporate speak.

**Background:** `var(--bg-surface)` — slightly lighter than primary, creates visual separation.

**Padding:** 128px top/bottom.

**Content:**

```
[pixel-label, centered]  PROGRAM

[h2, Monument Extended, centered]
WHAT FORGE
GIVES YOU

[4 cards in a row (desktop) / stacked (mobile), margin-top 64px]
```

**Card design:**
- Background: `var(--bg-elevated)`
- Border: 1px solid `var(--border-subtle)`
- Border-top: 2px solid `var(--accent-amber)` (accent stripe at top of each card)
- Border-radius: 2px (barely rounded — sharp, precise)
- Padding: 40px 32px
- Hover: border color transitions to `var(--border-accent)`, subtle `box-shadow: 0 0 40px var(--accent-amber-glow)`

**Card content (4 cards):**

```
CARD 1:
[h3, Monument Extended, 18px, uppercase, text-primary]
STARTUP IMMERSION
[body, text-secondary, margin-top 16px]
Learn how startups actually work — from equity to architecture
decisions. Case studies, not theory. Taught by founders who've
built and scaled.

CARD 2:
[h3] ELITE SESSIONS
[body]
Workshops with exceptional minds — founders of billion-dollar
companies, AI researchers, top CS professors. 20 minutes of input,
40 minutes of building together.

CARD 3:
[h3] INTERVIEW PREP
[body]
Mock interviews with real startup founders — recorded, with
detailed feedback. You'll go through 2-3 rounds before any
real conversation. Nobody goes in unprepared.

CARD 4:
[h3] STARTUP MATCHING
[body]
Direct introductions to startups actively hiring founding
engineers — from Polish companies scaling globally to
YC-backed teams in the Bay Area. We match deliberately,
not randomly.
```

No icons. No pixel art here. Clean cards, strong typography, amber accent stripe. The content speaks for itself.

---

### SECTION 4: STATS BAR

**Purpose:** Social proof through numbers. Creates a rhythm break between content sections.

**Background:** `var(--bg-primary)` with very subtle amber gradient glow at the bottom (foreshadowing the next section's warmth).

**Layout:** Horizontal row of 4 stats, evenly spaced. Full-width container (container-wide).

**Padding:** 96px top/bottom.

```
[stat]              [stat]              [stat]              [stat]
10                  <10%                6                   4+
FELLOWS             ACCEPTANCE          WEEKS               STARTUP
PER COHORT          RATE                                    PARTNERS

```

**Stat number:** JetBrains Mono, bold, `var(--accent-amber)`, large (`clamp(40px, 6vw, 72px)`)
**Stat label:** Satoshi, 13px, uppercase, `var(--text-muted)`, letter-spacing 0.08em, margin-top 8px

**Animation:** Numbers count up on scroll into view. Quick — 800ms, ease-out. Use Intersection Observer to trigger.

**Dividers:** Thin vertical lines (1px, 40px tall, `var(--border-subtle)`) between stats on desktop. Hidden on mobile (stats stack 2x2 grid).

---

### SECTION 5: THE PROCESS

**Purpose:** Show candidates what the application process looks like. Don't reveal challenge details — just the steps.

**Background:** Gradient begins shifting warmer here — `var(--bg-surface)` with subtle warm tint.

**Padding:** 128px top/bottom.

**Content:**

```
[pixel-label, centered]  HOW IT WORKS

[h2, Monument Extended, centered]
THE APPLICATION
PROCESS

[Vertical timeline, max-width 640px, centered, margin-top 64px]
```

**Timeline design:** Vertical line on the left (2px, `var(--border-subtle)`). Each step has a node (small circle, 12px, amber fill) on the line, with content to the right.

```
STEP 1
● ── APPLY
     Submit your profile — background, projects, ambitions.
     Rolling applications. We review every one personally.

STEP 2
● ── TECHNICAL CHALLENGE
     You'll receive a challenge designed to reveal how you think.
     AI tools welcome. We evaluate your approach, not just output.
     7-10 days to complete.

STEP 3
● ── CONVERSATION
     30-45 minutes with our team. Not a technical grind —
     we want to understand what drives you and where
     you want to go.

STEP 4
● ── WELCOME TO THE FORGE
     10 engineers per cohort. 6 weeks of intensive sessions,
     mock interviews, mentorship, and direct startup introductions.
```

**Step title:** Monument Extended, 16px, uppercase, `var(--text-primary)`
**Step body:** Satoshi, 16px, `var(--text-secondary)`, line-height 1.6
**Active/upcoming steps:** amber node. Future idea: animate nodes sequentially on scroll.

---

### SECTION 6: WHO WE'RE LOOKING FOR

**Purpose:** Self-selection. The right candidates see themselves here. The wrong ones don't apply.

**Background:** `var(--bg-primary)`

**Padding:** 128px top/bottom.

**Layout:** Two columns on desktop, stacked on mobile. Max-width 1000px.

```
[h2, Monument Extended, centered, full width]
WHO THIS
IS FOR

[Two columns, margin-top 64px]

LEFT COLUMN:                              RIGHT COLUMN:
[h3, 16px, uppercase, amber]             [h3, 16px, uppercase, amber]
STUDENTS & GRADUATES                      ENGINEERS

[body, text-secondary]                    [body, text-secondary]
You study CS, math, or physics            You have 2-5 years in a corporation
at a top Polish university.               or software house. You're very good
You've competed in olympiads,             at what you do — but you see the
ICPC, or built serious open               industry changing. AI is reshaping
source projects.                          everything.

You're considering Google,                You want ownership. You want to
a consulting firm, or a hedge             build something that matters.
fund — but something doesn't              You're ready for the founding
feel right.                               engineer path.

You want to build.                        You want more.
```

**Last line of each column** ("You want to build." / "You want more.") — `var(--text-primary)`, font-weight 500. Punch lines.

---

### SECTION 7: KICK-OFF EVENT

**Purpose:** Prestige signal. Show that serious people are involved.

**Background:** Slightly warmer — `#12100D` base with very subtle amber ambient glow.

**Padding:** 128px top/bottom.

**Layout:** Centered, narrow (max-width 720px).

```
[pixel-label]  MARCH 2026 · WARSAW

[h2, Monument Extended]
THE FORGE
OPENS

[body, text-secondary, margin-top 24px, centered]
Join the launch of Bison Forge. Keynotes from founders
who've built billion-dollar companies, a premiere screening,
and the first cohort announcement.

[Speaker cards — horizontal on desktop, margin-top 48px]
```

**Speaker cards:** Two cards side by side. Minimal.

```
┌──────────────────────────┐  ┌──────────────────────────┐
│  RAFAŁ MODRZEWSKI        │  │  ALEKSANDER KWAŚNIEWSKI   │
│  CEO, ICEYE              │  │  President of Poland      │
│                          │  │  (1995-2005)              │
│  Built a satellite       │  │                           │
│  company worth billions. │  │                           │
└──────────────────────────┘  └──────────────────────────┘
```

**Card design:** `var(--bg-elevated)`, 1px border `var(--border-subtle)`, padding 32px. Name in Monument Extended 16px uppercase. Title in Satoshi 14px text-muted. Optional one-line description in Satoshi 15px text-secondary.

No photos. Names and titles are enough — the caliber speaks for itself.

```
[Below cards, centered, margin-top 48px]

[body, text-muted, 14px]
80 seats. 30 invited. The rest earned through application.

[CTA button, amber, margin-top 24px]
APPLY FOR A SEAT →
```

---

### SECTION 8: ABOUT / CREDIBILITY

**Purpose:** Who's behind this. Why you should trust us.

**Background:** `var(--bg-surface)`

**Padding:** 128px top/bottom.

**Layout:** Centered, then two columns for people.

```
[pixel-label]  ABOUT

[h2, Monument Extended, centered]
WHO'S BEHIND
THE FORGE

[body, centered, max-width 600px, text-secondary, margin-top 24px]
Bison Forge is built by This is the World — part of the
This is IT ecosystem founded by Dr. Maciej Kawecki, Poland's
most-followed voice in technology.

[Two person blocks, side by side on desktop, margin-top 64px]
```

**Person blocks:** Not cards — cleaner. No borders. Just text.

```
LEFT:                                     RIGHT:
[name, Monument Extended, 18px]           [name]
DR MACIEJ KAWECKI                         MICHAŁ WYRĘBKOWSKI

[role, Satoshi 14px, text-muted]          [role]
Founder, This is the World                Head of Talent, Bison Forge

[body, Satoshi 15px, text-secondary]      [body]
Poland's largest tech audience            Wharton MBA. AI researcher.
on LinkedIn. Digital Ambassador           Former mechanistic interpretability
of the European Union.                    at [grant institution]. Connects
Lives in Białowieża — home of             Poland's best engineers with the
the last wild European bison.             startups that need them.
```

Below: logos or names of associated institutions/brands (This is IT, This is the World, Wharton, etc.) in a subtle row — small, `var(--text-muted)`, as trust signals. No color logos — mono/gray only.

---

### SECTION 9: CTA / APPLY

**Purpose:** Final push. Everything converges to the apply button.

**Background:** The warmest section on the page. Background is `#1C1208` (dark amber-brown) with a very subtle radial gradient of amber glow in the center: `radial-gradient(ellipse at center, rgba(232,168,56,0.06) 0%, transparent 70%)`.

**Padding:** 160px top, 128px bottom.

**Layout:** Centered, narrow.

```
[h2, Monument Extended, centered, large — same size as hero]
READY TO
BUILD?

[body, centered, text-secondary, max-width 480px, margin-top 24px]
Applications are open. 10 spots. Rolling review.
We read every application personally.

[PRIMARY CTA, large, centered, margin-top 48px]
APPLY TO BISON FORGE →

[sub-text, 13px, text-muted, margin-top 16px]
Cohort #1 kicks off March 2026.
```

**CTA button styling (this is the biggest button on the page):**
- Background: `var(--accent-amber)`
- Text: `#0A0F0D` (dark), Monument Extended, 15px, uppercase, tracking 0.06em
- Padding: 20px 56px
- Border-radius: 4px
- Hover: `var(--accent-amber-hover)`, slight scale (1.02), box-shadow amber glow
- This button links to application form (Typeform/Google Form, external link, opens in new tab)

---

### SECTION 10: FOOTER

**Background:** `var(--bg-primary)`

**Padding:** 64px top/bottom.

**Layout:** Centered, minimal.

```
[Logo: "BISON FORGE" in Monument Extended, 14px, text-muted]

[below, 13px, text-muted]
by This is the World

[links row, 13px, text-muted, margin-top 24px]
LinkedIn  ·  YouTube  ·  Contact

[quote, italic, Satoshi, 15px, text-muted, margin-top 48px, max-width 400px]
"The next great engineers won't come from the usual places."

[copyright, 12px, text-muted, margin-top 32px]
© 2026 This is the World. All rights reserved.
```

Everything in the footer is `var(--text-muted)` — quiet, understated. No amber. The page ends on a whisper, not a shout.

---

## Animations & Interactions

### Page load sequence
1. Page loads with black screen
2. Video starts playing (or static image on slow connections)
3. "BISON FORGE" fades in (opacity 0→1, 600ms, ease-out, 200ms delay)
4. Subtitle and buttons fade in (opacity 0→1, 600ms, ease-out, 500ms delay)
5. Nav fades in (opacity 0→1, 400ms, ease-out, 800ms delay)

### Scroll animations
- Sections fade in on scroll (Intersection Observer, threshold 0.15)
- Fade-in is subtle: `opacity: 0, transform: translateY(20px)` → `opacity: 1, transform: translateY(0)`, 500ms, ease-out
- Stats count up when section enters viewport
- Timeline nodes illuminate sequentially (200ms stagger between nodes)

### Hover states
- Buttons: slight brightness increase, subtle box-shadow glow
- Cards: border color transitions to amber (300ms)
- Nav links: color transition to text-primary (200ms)
- No transforms on hover except the final CTA (slight scale 1.02)

### Video background
- Plays infinitely, muted, no controls visible
- On mobile: consider replacing with static image for performance (check connection speed or just use `prefers-reduced-motion` media query)
- Overlay gradient ensures text is always readable regardless of video frame

### Performance rules
- No heavy libraries. No GSAP (overkill). Intersection Observer + CSS transitions.
- Video: WebM primary (smaller), MP4 fallback. Max 5MB.
- Fonts: subset Monument Extended to uppercase Latin only (it's only used for headlines in uppercase). Self-host, preload.
- Images: WebP, lazy-loaded below fold.
- Target: Lighthouse 95+ on performance.

---

## Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm — small tablets */ }
@media (min-width: 768px)  { /* md — tablets */ }
@media (min-width: 1024px) { /* lg — small desktop */ }
@media (min-width: 1280px) { /* xl — desktop */ }
```

### Key responsive changes

| Element | Desktop | Mobile |
|---|---|---|
| Hero "BISON FORGE" | ~120px | ~56px |
| Nav | Full links + apply | Apply + hamburger |
| Cards (What You Get) | 4 columns | Stack vertically |
| Stats | 4 in a row | 2x2 grid |
| Who It's For | 2 columns | Stacked |
| Speaker cards | Side by side | Stacked |
| Person blocks | Side by side | Stacked |
| Video background | Full video | Static image fallback |

---

## External Links

| Element | Links to |
|---|---|
| APPLY buttons (all) | Application form (Typeform URL — TBD) |
| LinkedIn (footer) | Maciej Kawecki's LinkedIn |
| YouTube (footer) | This is IT YouTube channel |
| Contact (footer) | mailto: or contact form |
| "Program" nav link | Scrolls to Section 3 (What You Get) |
| "Event" nav link | Scrolls to Section 7 (Kick-off Event) |
| "About" nav link | Scrolls to Section 8 (About) |

---

## Files Needed Before Build

| Asset | Format | Status |
|---|---|---|
| `bison-walk.webm` | WebM, loop-ready, max 5MB | VIDEO — from Midjourney/Runway extend |
| `bison-walk.mp4` | MP4 fallback | Convert from WebM |
| `bison-hero.webp` | Static fallback image, 1920px+ wide | FROM MIDJOURNEY — the pixel art bison image |
| Monument Extended font files | .woff2 (subset uppercase Latin) | LICENSE NEEDED — commercial font |
| Satoshi font files | .woff2 | Free from Fontshare |
| JetBrains Mono font files | .woff2 | Free from Google Fonts / JetBrains |
| Application form URL | Typeform/Google Form link | TO BE CREATED |

---

## Final Notes

This page should feel like walking into a place that's been here longer than you think. Not loud, not flashy — quiet confidence. Every element earns its place. The bison walks. The text breathes. The amber glows. Someone scrolls through and thinks: "I want to be part of this."

The single most important element on the page is the APPLY button. Everything else exists to make someone click it. If every word, every animation, every pixel of this page doesn't serve that goal — remove it.
