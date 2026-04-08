# California DMV Practice Test — Design Spec

## Overview

A single-file web app (`ca-dmv-test.html`) that helps the user study for and simulate the California driving license test. Mobile-first, no dependencies, clean minimal design.

## Goals

- Comprehensive question bank (~200-250 questions) sourced from official CA DMV handbook topics
- Two modes: Study (learn at your pace) and Exam (simulate the real test)
- Mobile-friendly with great touch UX
- Persistent progress via localStorage
- Zero build step, zero dependencies — one HTML file

## Architecture

### File Structure

Single file at project root: `/ca-dmv-test.html`

Internal structure:
- Inline `<style>` — mobile-first responsive CSS
- Inline `<script>` — vanilla JS, question data as JS array at top

### Question Data Model

```js
{
  id: 1,
  category: "road-signs",       // one of 9 categories
  question: "What does a solid yellow line on your side of the road mean?",
  options: ["No passing", "Slow down", "Road narrows", "Construction ahead"],
  correct: 0,                    // index into options array
  explanation: "A solid yellow line on your side means no passing. (CA Driver Handbook, Ch. 7)"
}
```

### Categories (9 total, ~25 questions each)

1. `road-signs` — Road signs & signals
2. `right-of-way` — Right-of-way rules
3. `speed-limits` — Speed limits & safe driving
4. `dui` — DUI/drug laws & penalties
5. `parking` — Parking rules
6. `sharing-road` — Sharing the road (bikes, pedestrians, emergency vehicles)
7. `special-situations` — School zones, railroad crossings, fog/rain
8. `lane-changes` — Lane changes, merging & highway driving
9. `vehicle-equipment` — Vehicle equipment & registration requirements

## Two Modes

### Study Mode

- Questions presented one at a time as cards
- Select an answer → immediate feedback (green/red + explanation with handbook reference)
- Next/Previous buttons to navigate
- Filter by category via pill buttons at top
- Progress bar for current category
- Progress persisted in localStorage — can close and resume
- "Reset Progress" option per category or all

### Exam Mode

- 46 random questions (matching real CA DMV test)
- 30-minute countdown timer
- No feedback during test
- Flag questions for review before submitting
- Question navigation grid (tap number to jump)
- Submit → results screen:
  - Pass/Fail (38/46 = 83% required, matching real DMV)
  - Score breakdown by category
  - Review wrong answers with explanations
- Retake with fresh random set

### Home Screen

- Two large buttons: "Study" and "Practice Exam"
- Quick stats: questions studied, best exam score
- Pulled from localStorage

## UI Design

### Layout

- Max-width 640px container, centered
- Min 44px touch targets
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Question Card

- White card, subtle border + light shadow
- Question text: 18px bold
- Options: full-width stacked buttons
- Study mode: green (correct) / red (wrong) highlighting, explanation slides in below
- Exam mode: selected = blue outline, no feedback

### Exam Mode UI

- Sticky top bar: timer, question count ("12 / 46"), flag toggle
- Bottom nav: Previous / Next / Submit (on last question)
- Question grid overlay: answered = filled, flagged = amber dot, current = blue outline

### Colors

| Role       | Value     |
|------------|-----------|
| Background | `#f9f9f9` |
| Cards      | `#ffffff` |
| Text       | `#1a1a1a` |
| Correct    | `#16a34a` |
| Wrong      | `#dc2626` |
| Accent     | `#2563eb` |
| Flagged    | `#f59e0b` |

### Responsive

- Works 320px+ to desktop
- No horizontal scrolling
- Large thumb-friendly buttons

## Data Persistence

### localStorage Keys

- `cadmv_study_progress` — questions answered, correct/wrong per category
- `cadmv_exam_history` — array of past exam results (score, date, time)
- `cadmv_best_score` — highest exam score

### In-Memory State

- Current mode (home / study / exam)
- Current question index
- Selected answers array
- Flagged questions (exam)
- Timer state (exam)
- Active category filter (study)

No backend, no accounts. All data browser-local.

## Question Sourcing

~200-250 questions compiled from official CA DMV Driver Handbook topics, distributed equally across all 9 categories. Each question includes an explanation referencing the relevant handbook chapter.
