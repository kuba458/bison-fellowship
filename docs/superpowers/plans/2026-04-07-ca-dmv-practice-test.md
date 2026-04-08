# CA DMV Practice Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file mobile-first web app for studying and simulating the California DMV driving test with ~200 questions across 9 categories.

**Architecture:** Single `ca-dmv-test.html` file with inline CSS and JS. Vanilla JS with no dependencies. Questions stored as a JS array. Two modes: Study (immediate feedback, category filtering, progress tracking) and Exam (46 random questions, 30-min timer, pass/fail). All state persisted in localStorage.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, localStorage

---

### Task 1: HTML Shell + CSS Foundation

**Files:**
- Create: `ca-dmv-test.html`

- [ ] **Step 1: Create the HTML file with base structure and all CSS**

Create `ca-dmv-test.html` with:
- DOCTYPE, viewport meta, title "CA DMV Practice Test"
- Complete `<style>` block with all CSS:
  - CSS variables for colors: `--bg: #f9f9f9`, `--card: #ffffff`, `--text: #1a1a1a`, `--correct: #16a34a`, `--wrong: #dc2626`, `--accent: #2563eb`, `--flagged: #f59e0b`
  - System font stack on body
  - `.container` — max-width 640px, centered, padding 16px
  - `.screen` — hidden by default (`display: none`), `.screen.active` visible
  - Home screen: `.home-stats` grid, `.mode-btn` large buttons (min-height 80px, full-width, border-radius 12px, font-size 18px, 44px+ touch targets)
  - Study mode: `.category-pills` horizontal scroll flex, `.pill` buttons (border-radius 20px, padding 8px 16px), `.pill.active` with accent bg
  - `.progress-bar` container (height 6px, bg #e5e7eb, border-radius 3px) and `.progress-fill` (height 100%, bg accent, transition width 0.3s)
  - `.question-card` — bg white, border 1px solid #e5e7eb, border-radius 12px, padding 24px, box-shadow 0 1px 3px rgba(0,0,0,0.08)
  - `.question-text` — font-size 18px, font-weight 600, margin-bottom 20px
  - `.option-btn` — full width, text-align left, padding 14px 16px, border 2px solid #e5e7eb, border-radius 8px, margin-bottom 10px, font-size 16px, min-height 44px, cursor pointer, transition all 0.2s, bg white
  - `.option-btn:hover` — border-color #d1d5db
  - `.option-btn.selected` — border-color var(--accent), bg #eff6ff
  - `.option-btn.correct` — border-color var(--correct), bg #f0fdf4
  - `.option-btn.wrong` — border-color var(--wrong), bg #fef2f2
  - `.explanation` — margin-top 16px, padding 16px, bg #f0fdf4, border-left 4px solid var(--correct), border-radius 0 8px 8px 0, font-size 14px, line-height 1.5
  - `.nav-buttons` — flex, gap 12px, margin-top 20px
  - `.nav-btn` — flex 1, padding 14px, border-radius 8px, font-size 16px, min-height 44px, cursor pointer, border none
  - `.btn-primary` — bg var(--accent), color white
  - `.btn-secondary` — bg #e5e7eb, color var(--text)
  - `.btn-danger` — bg var(--wrong), color white
  - Exam mode: `.exam-header` sticky top 0, bg white, border-bottom, padding 12px 16px, display flex, justify-content space-between, align-items center, z-index 10
  - `.timer` — font-weight 600, font-size 16px, font-variant-numeric tabular-nums
  - `.timer.warning` — color var(--wrong)
  - `.flag-btn` — padding 8px, border-radius 6px, border 1px solid #e5e7eb, cursor pointer
  - `.flag-btn.flagged` — bg #fffbeb, border-color var(--flagged)
  - `.question-grid` — display grid, grid-template-columns repeat(auto-fill, 40px), gap 6px, padding 16px
  - `.grid-num` — width 40px, height 40px, border-radius 8px, border 1px solid #e5e7eb, display flex, align-items center, justify-content center, font-size 14px, cursor pointer
  - `.grid-num.answered` — bg var(--accent), color white, border-color var(--accent)
  - `.grid-num.current` — outline 2px solid var(--accent), outline-offset 2px
  - `.grid-num.flagged-dot::after` — content '', position absolute, top 2px, right 2px, width 8px, height 8px, bg var(--flagged), border-radius 50% (parent needs position relative)
  - Results: `.result-header` text-align center, `.pass` color var(--correct) font-size 48px, `.fail` color var(--wrong) font-size 48px
  - `.score-text` — font-size 24px, margin 12px 0
  - `.category-breakdown` — list-style none, padding 0
  - `.category-breakdown li` — flex, justify-content space-between, padding 10px 0, border-bottom 1px solid #e5e7eb
  - `.review-item` — margin-bottom 16px, padding 16px, border-radius 8px, border 1px solid #e5e7eb
  - Reset button: `.reset-link` — font-size 14px, color #6b7280, text-decoration underline, cursor pointer, border none, bg none
  - Responsive: `@media (max-width: 380px)` reduce padding to 12px, font-size adjustments
- Empty `<div id="app"></div>`
- Empty `<script>` tag (to be filled in subsequent tasks)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>CA DMV Practice Test</title>
  <style>
    /* All CSS as described above */
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    // JS will go here
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify blank page loads with no errors**

Open `ca-dmv-test.html` in browser. Verify:
- Page loads with #f9f9f9 background
- No console errors
- Viewport scales correctly on mobile

- [ ] **Step 3: Commit**

```bash
git add ca-dmv-test.html
git commit -m "feat: add HTML shell and CSS foundation for CA DMV practice test"
```

---

### Task 2: Question Bank (Part 1 — Categories 1-5)

**Files:**
- Modify: `ca-dmv-test.html` (inside `<script>` tag)

- [ ] **Step 1: Add question data for categories 1-5**

At the top of the `<script>` tag, create the `QUESTIONS` array and populate with questions for the first 5 categories (~25 each, ~125 total). Each question follows the data model:

```js
const QUESTIONS = [
  // === ROAD SIGNS & SIGNALS ===
  {
    id: 1,
    category: "road-signs",
    question: "What does a red octagonal (eight-sided) sign mean?",
    options: ["Stop completely before proceeding", "Yield to other traffic", "Road construction ahead", "No entry allowed"],
    correct: 0,
    explanation: "A red octagon is always a stop sign. You must come to a complete stop at the limit line or crosswalk. (CA Driver Handbook, Sec. 5)"
  },
  {
    id: 2,
    category: "road-signs",
    question: "What shape is a yield sign?",
    options: ["Triangle (point down)", "Diamond", "Circle", "Pentagon"],
    correct: 0,
    explanation: "A yield sign is a downward-pointing triangle. It means slow down and be prepared to stop if necessary. (CA Driver Handbook, Sec. 5)"
  },
  // ... continue with all questions for:
  // road-signs (~25 questions): traffic signals (red, yellow, green, flashing), sign shapes, sign colors, regulatory signs, warning signs, guide signs
  // right-of-way (~25 questions): intersection rules, pedestrian crosswalks, blind pedestrians, roundabouts, mountain roads, emergency vehicles, funeral processions
  // speed-limits (~25 questions): residential 25mph, school zones 25mph, alleys 15mph, blind intersections 15mph, railroad crossings 15mph, highway 65mph, two-lane undivided 55mph, near buses 10mph, basic speed law, conditions (wet/snow/ice/fog)
  // dui (~25 questions): BAC limits (0.08 adult, 0.01 under-21, 0.04 commercial), implied consent, penalties, license suspension, DUI programs, open container, drug impairment, 10-year record
  // parking (~25 questions): curb colors (red=no, yellow=commercial load/unload, white=passenger load, green=limited time, blue=disabled), uphill/downhill parking wheel direction, distance from fire hydrant (15ft), double parking, disabled placards
];
```

Source all facts from the official CA DMV Driver Handbook sections researched:
- **Road signs**: Sec. 5 (Introduction to Driving) — sign shapes, colors, and meanings
- **Right-of-way**: Sec. 7 — intersection rules, pedestrians, roundabouts, mountain roads
- **Speed limits**: Sec. 7 continued — all specific speed limits and the basic speed law
- **DUI**: Sec. 9 — BAC limits, penalties, implied consent, under-21 rules
- **Parking**: Sec. 7 — curb colors, hill parking, prohibited zones

Every question must have 4 options, one correct answer index, and an explanation citing the handbook section.

- [ ] **Step 2: Verify data integrity**

Add a temporary test at the bottom of the script:

```js
// Temporary validation
(() => {
  const cats = {};
  QUESTIONS.forEach((q, i) => {
    if (!q.id || !q.category || !q.question || !q.options || q.options.length !== 4 || q.correct < 0 || q.correct > 3 || !q.explanation) {
      console.error(`Invalid question at index ${i}:`, q);
    }
    cats[q.category] = (cats[q.category] || 0) + 1;
  });
  console.log('Question counts by category:', cats);
  console.log('Total questions:', QUESTIONS.length);
})();
```

Open in browser, check console: should see ~125 questions across 5 categories, no errors.

- [ ] **Step 3: Commit**

```bash
git add ca-dmv-test.html
git commit -m "feat: add question bank categories 1-5 (road signs, right-of-way, speed limits, DUI, parking)"
```

---

### Task 3: Question Bank (Part 2 — Categories 6-9)

**Files:**
- Modify: `ca-dmv-test.html` (inside `<script>`, append to `QUESTIONS` array)

- [ ] **Step 1: Add question data for categories 6-9**

Continue the `QUESTIONS` array with ~25 questions per remaining category:

```js
  // === SHARING THE ROAD ===
  // sharing-road (~25 questions): bicycles (3ft clearance, bike lane rules, 200ft before intersection), pedestrians (crosswalk rules, school zones), emergency vehicles (pull right and stop, 300ft following), motorcycles, large trucks (blind spots, stopping distance 400ft at 55mph)

  // === SPECIAL SITUATIONS ===
  // special-situations (~25 questions): school bus (red lights=stop from both directions, $1000 fine, exception for divided highway), railroad crossings (stop 15ft from tracks, look both ways), fog/rain driving (low beams, reduce speed 5-10mph wet, 30mph max if visibility <100ft), flooded roads, construction zones, skid recovery

  // === LANE CHANGES & HIGHWAY ===
  // lane-changes (~25 questions): signal before changing, check blind spots, merge at highway speed, one lane at a time, 400ft signal before exit, HOV lane rules (don't cross double solid), center left turn lane (200ft max), passing rules (not within 100ft of intersection/bridge/tunnel), pass on right only with 2+ lanes or one-way

  // === VEHICLE EQUIPMENT ===
  // vehicle-equipment (~25 questions): headlight use (required 30 min after sunset to 30 min before sunrise, and when visibility <1000ft), high/low beams, horn use, mirrors required, seat belts (driver responsible for passengers under 16), child car seats (under 2 rear-facing, under 8 in back seat), registration requirements, insurance (financial responsibility), bicycle equipment at night (white front light 300ft, rear red 500ft, pedal reflectors 200ft)
];
```

- [ ] **Step 2: Verify complete data integrity**

Refresh browser, check console validation output. Should show:
- ~200-225 total questions
- All 9 categories represented with ~25 each
- No validation errors

Remove the temporary validation code after confirming.

- [ ] **Step 3: Commit**

```bash
git add ca-dmv-test.html
git commit -m "feat: add question bank categories 6-9 (sharing road, special situations, lane changes, vehicle equipment)"
```

---

### Task 4: App State Management + Home Screen

**Files:**
- Modify: `ca-dmv-test.html` (inside `<script>`, after QUESTIONS array)

- [ ] **Step 1: Add state management and rendering engine**

After the QUESTIONS array, add:

```js
// Category metadata
const CATEGORIES = [
  { id: 'road-signs', name: 'Road Signs & Signals' },
  { id: 'right-of-way', name: 'Right-of-Way' },
  { id: 'speed-limits', name: 'Speed Limits & Safe Driving' },
  { id: 'dui', name: 'DUI & Drug Laws' },
  { id: 'parking', name: 'Parking Rules' },
  { id: 'sharing-road', name: 'Sharing the Road' },
  { id: 'special-situations', name: 'Special Situations' },
  { id: 'lane-changes', name: 'Lane Changes & Highway' },
  { id: 'vehicle-equipment', name: 'Vehicle & Equipment' }
];

// State
let state = {
  screen: 'home', // home | study | exam | results
  // Study
  studyCategory: 'all',
  studyIndex: 0,
  studyAnswered: null, // index of selected option or null
  // Exam
  examQuestions: [],
  examIndex: 0,
  examAnswers: {}, // { questionId: selectedOptionIndex }
  examFlagged: new Set(),
  examTimeLeft: 1800, // 30 min in seconds
  examTimerId: null,
  showGrid: false
};

// localStorage helpers
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('cadmv_study_progress')) || {};
  } catch { return {}; }
}
function saveProgress(progress) {
  localStorage.setItem('cadmv_study_progress', JSON.stringify(progress));
}
function loadExamHistory() {
  try {
    return JSON.parse(localStorage.getItem('cadmv_exam_history')) || [];
  } catch { return []; }
}
function saveExamHistory(history) {
  localStorage.setItem('cadmv_exam_history', JSON.stringify(history));
}
function getBestScore() {
  const history = loadExamHistory();
  if (history.length === 0) return null;
  return Math.max(...history.map(h => h.score));
}

// Render dispatcher
function render() {
  const app = document.getElementById('app');
  switch (state.screen) {
    case 'home': app.innerHTML = renderHome(); break;
    case 'study': app.innerHTML = renderStudy(); break;
    case 'exam': app.innerHTML = renderExam(); break;
    case 'results': app.innerHTML = renderResults(); break;
  }
  bindEvents();
}

function bindEvents() {
  // Attach click handlers via event delegation on #app
  // (implemented per screen in subsequent steps)
}
```

- [ ] **Step 2: Add home screen renderer**

```js
function renderHome() {
  const progress = loadProgress();
  const totalAnswered = Object.keys(progress).length;
  const totalCorrect = Object.values(progress).filter(v => v).length;
  const bestScore = getBestScore();
  const examCount = loadExamHistory().length;

  return `
    <div class="container">
      <div style="text-align:center; padding: 40px 0 24px;">
        <h1 style="font-size:28px; margin:0 0 4px;">CA DMV Practice Test</h1>
        <p style="color:#6b7280; margin:0; font-size:14px;">California Driver License Knowledge Test</p>
      </div>
      <button class="mode-btn btn-primary" data-action="start-study" style="width:100%; margin-bottom:12px; font-size:18px; padding:20px; border-radius:12px; border:none; cursor:pointer; color:white;">
        Study Mode
        <div style="font-size:13px; opacity:0.85; margin-top:4px;">Learn at your own pace</div>
      </button>
      <button class="mode-btn" data-action="start-exam" style="width:100%; margin-bottom:24px; font-size:18px; padding:20px; border-radius:12px; border:2px solid var(--accent); cursor:pointer; color:var(--accent); background:white;">
        Practice Exam
        <div style="font-size:13px; opacity:0.7; margin-top:4px;">46 questions, 30 minutes</div>
      </button>
      <div class="question-card" style="text-align:center;">
        <div style="font-size:14px; color:#6b7280; margin-bottom:8px;">Your Progress</div>
        <div style="display:flex; justify-content:space-around;">
          <div>
            <div style="font-size:24px; font-weight:700;">${totalAnswered}</div>
            <div style="font-size:12px; color:#6b7280;">Questions Studied</div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:700;">${totalAnswered > 0 ? Math.round(totalCorrect / totalAnswered * 100) : 0}%</div>
            <div style="font-size:12px; color:#6b7280;">Accuracy</div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:700;">${bestScore !== null ? bestScore + '/46' : '—'}</div>
            <div style="font-size:12px; color:#6b7280;">Best Exam</div>
          </div>
        </div>
      </div>
      ${totalAnswered > 0 ? '<div style="text-align:center; margin-top:16px;"><button class="reset-link" data-action="reset-all">Reset All Progress</button></div>' : ''}
    </div>
  `;
}
```

- [ ] **Step 3: Add event delegation for home screen**

```js
function bindEvents() {
  const app = document.getElementById('app');
  app.onclick = function(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'start-study') {
      state.screen = 'study';
      state.studyCategory = 'all';
      state.studyIndex = 0;
      state.studyAnswered = null;
      render();
    }
    else if (action === 'start-exam') {
      startExam();
    }
    else if (action === 'reset-all') {
      if (confirm('Reset all study progress and exam history?')) {
        localStorage.removeItem('cadmv_study_progress');
        localStorage.removeItem('cadmv_exam_history');
        localStorage.removeItem('cadmv_best_score');
        render();
      }
    }
    // (More actions added in subsequent tasks)
  };
}

// Initialize
render();
```

- [ ] **Step 4: Verify home screen renders**

Open in browser. Should see:
- "CA DMV Practice Test" heading
- Study Mode button (blue)
- Practice Exam button (outlined)
- Progress card showing 0 questions, 0%, —
- No console errors

- [ ] **Step 5: Commit**

```bash
git add ca-dmv-test.html
git commit -m "feat: add state management, localStorage helpers, and home screen"
```

---

### Task 5: Study Mode

**Files:**
- Modify: `ca-dmv-test.html` (inside `<script>`)

- [ ] **Step 1: Add study mode renderer**

Add the `renderStudy()` function:

```js
function getStudyQuestions() {
  if (state.studyCategory === 'all') return QUESTIONS;
  return QUESTIONS.filter(q => q.category === state.studyCategory);
}

function renderStudy() {
  const questions = getStudyQuestions();
  const progress = loadProgress();
  const q = questions[state.studyIndex];

  if (!q) {
    state.studyIndex = 0;
    return renderStudy();
  }

  // Progress stats for current filter
  const answeredInSet = questions.filter(q => progress[q.id] !== undefined).length;
  const progressPct = questions.length > 0 ? Math.round(answeredInSet / questions.length * 100) : 0;

  const isAnswered = state.studyAnswered !== null;
  const isCorrect = isAnswered && state.studyAnswered === q.correct;

  let optionsHtml = q.options.map((opt, i) => {
    let cls = 'option-btn';
    if (isAnswered) {
      if (i === q.correct) cls += ' correct';
      else if (i === state.studyAnswered) cls += ' wrong';
    } else if (state.studyAnswered === i) {
      cls += ' selected';
    }
    return `<button class="${cls}" data-action="study-answer" data-index="${i}" ${isAnswered ? 'disabled' : ''}>${opt}</button>`;
  }).join('');

  return `
    <div class="container">
      <div style="display:flex; align-items:center; margin-bottom:16px;">
        <button data-action="go-home" style="background:none; border:none; font-size:24px; cursor:pointer; padding:8px; margin-right:8px;">←</button>
        <h2 style="font-size:18px; margin:0; flex:1;">Study Mode</h2>
        <span style="font-size:14px; color:#6b7280;">${state.studyIndex + 1} / ${questions.length}</span>
      </div>
      <div class="category-pills" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:16px;">
        <button class="pill ${state.studyCategory === 'all' ? 'active' : ''}" data-action="filter-category" data-cat="all" style="white-space:nowrap; padding:8px 16px; border-radius:20px; border:1px solid #e5e7eb; cursor:pointer; font-size:13px; ${state.studyCategory === 'all' ? 'background:var(--accent); color:white; border-color:var(--accent);' : 'background:white;'}">All</button>
        ${CATEGORIES.map(c => `<button class="pill ${state.studyCategory === c.id ? 'active' : ''}" data-action="filter-category" data-cat="${c.id}" style="white-space:nowrap; padding:8px 16px; border-radius:20px; border:1px solid #e5e7eb; cursor:pointer; font-size:13px; ${state.studyCategory === c.id ? 'background:var(--accent); color:white; border-color:var(--accent);' : 'background:white;'}">${c.name}</button>`).join('')}
      </div>
      <div class="progress-bar" style="height:6px; background:#e5e7eb; border-radius:3px; margin-bottom:20px;">
        <div class="progress-fill" style="height:100%; width:${progressPct}%; background:var(--accent); border-radius:3px; transition:width 0.3s;"></div>
      </div>
      <div class="question-card">
        <div class="question-text">${q.question}</div>
        ${optionsHtml}
        ${isAnswered ? `<div class="explanation">${isCorrect ? '✓ Correct!' : '✗ Incorrect.'} ${q.explanation}</div>` : ''}
      </div>
      <div class="nav-buttons" style="display:flex; gap:12px; margin-top:20px;">
        <button class="nav-btn btn-secondary" data-action="study-prev" ${state.studyIndex === 0 ? 'disabled style="opacity:0.5; flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:#e5e7eb;"' : 'style="flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:#e5e7eb;"'}>Previous</button>
        <button class="nav-btn btn-primary" data-action="study-next" style="flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:var(--accent); color:white;">${state.studyIndex === questions.length - 1 ? 'Back to Start' : 'Next'}</button>
      </div>
    </div>
  `;
}
```

- [ ] **Step 2: Add study mode event handlers**

In the `bindEvents` `onclick` handler, add these cases:

```js
    else if (action === 'study-answer') {
      const idx = parseInt(btn.dataset.index);
      state.studyAnswered = idx;
      // Save progress
      const q = getStudyQuestions()[state.studyIndex];
      const progress = loadProgress();
      if (progress[q.id] === undefined) {
        progress[q.id] = idx === q.correct;
        saveProgress(progress);
      }
      render();
    }
    else if (action === 'study-next') {
      const questions = getStudyQuestions();
      if (state.studyIndex >= questions.length - 1) {
        state.studyIndex = 0;
      } else {
        state.studyIndex++;
      }
      state.studyAnswered = null;
      render();
    }
    else if (action === 'study-prev') {
      if (state.studyIndex > 0) {
        state.studyIndex--;
        state.studyAnswered = null;
        render();
      }
    }
    else if (action === 'filter-category') {
      state.studyCategory = btn.dataset.cat;
      state.studyIndex = 0;
      state.studyAnswered = null;
      render();
    }
    else if (action === 'go-home') {
      state.screen = 'home';
      if (state.examTimerId) {
        clearInterval(state.examTimerId);
        state.examTimerId = null;
      }
      render();
    }
```

- [ ] **Step 3: Verify study mode works**

Open in browser, click "Study Mode". Verify:
- Category pills scroll horizontally, "All" is active (blue)
- First question shows with 4 options
- Clicking an option shows green/red + explanation
- Next/Previous buttons work
- Switching categories resets to first question
- Progress bar updates as you answer questions
- Back arrow returns to home
- Home screen stats update after answering questions

- [ ] **Step 4: Commit**

```bash
git add ca-dmv-test.html
git commit -m "feat: add study mode with category filtering and progress tracking"
```

---

### Task 6: Exam Mode

**Files:**
- Modify: `ca-dmv-test.html` (inside `<script>`)

- [ ] **Step 1: Add exam starter and renderer**

```js
function startExam() {
  // Pick 46 random questions, distributed across categories
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  state.examQuestions = shuffled.slice(0, 46);
  state.examIndex = 0;
  state.examAnswers = {};
  state.examFlagged = new Set();
  state.examTimeLeft = 1800;
  state.showGrid = false;
  state.screen = 'exam';

  // Start timer
  if (state.examTimerId) clearInterval(state.examTimerId);
  state.examTimerId = setInterval(() => {
    state.examTimeLeft--;
    if (state.examTimeLeft <= 0) {
      clearInterval(state.examTimerId);
      state.examTimerId = null;
      submitExam();
      return;
    }
    // Update timer display without full re-render
    const timerEl = document.querySelector('.timer');
    if (timerEl) {
      const min = Math.floor(state.examTimeLeft / 60);
      const sec = state.examTimeLeft % 60;
      timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
      timerEl.className = state.examTimeLeft <= 300 ? 'timer warning' : 'timer';
    }
  }, 1000);

  render();
}

function renderExam() {
  const q = state.examQuestions[state.examIndex];
  const min = Math.floor(state.examTimeLeft / 60);
  const sec = state.examTimeLeft % 60;
  const isFlagged = state.examFlagged.has(q.id);
  const selectedAnswer = state.examAnswers[q.id];

  let optionsHtml = q.options.map((opt, i) => {
    let cls = 'option-btn';
    if (selectedAnswer === i) cls += ' selected';
    return `<button class="${cls}" data-action="exam-answer" data-index="${i}">${opt}</button>`;
  }).join('');

  const gridHtml = state.showGrid ? `
    <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:20; display:flex; align-items:center; justify-content:center;" data-action="close-grid">
      <div style="background:white; border-radius:16px; padding:24px; max-width:400px; width:90%; max-height:80vh; overflow-y:auto;" onclick="event.stopPropagation()">
        <h3 style="margin:0 0 16px; font-size:16px;">Questions</h3>
        <div class="question-grid">
          ${state.examQuestions.map((eq, i) => {
            let cls = 'grid-num';
            if (state.examAnswers[eq.id] !== undefined) cls += ' answered';
            if (i === state.examIndex) cls += ' current';
            if (state.examFlagged.has(eq.id)) cls += ' flagged-dot';
            return `<button class="${cls}" data-action="exam-jump" data-index="${i}" style="position:relative; width:40px; height:40px; border-radius:8px; border:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; ${state.examAnswers[eq.id] !== undefined ? 'background:var(--accent); color:white; border-color:var(--accent);' : 'background:white;'} ${i === state.examIndex ? 'outline:2px solid var(--accent); outline-offset:2px;' : ''}">${i + 1}</button>`;
          }).join('')}
        </div>
        <div style="margin-top:16px; display:flex; gap:12px; font-size:12px; color:#6b7280; justify-content:center;">
          <span>● Answered: ${Object.keys(state.examAnswers).length}/46</span>
          <span>⚑ Flagged: ${state.examFlagged.size}</span>
        </div>
      </div>
    </div>
  ` : '';

  return `
    <div class="exam-header" style="position:sticky; top:0; background:white; border-bottom:1px solid #e5e7eb; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; z-index:10;">
      <button data-action="go-home" style="background:none; border:none; font-size:20px; cursor:pointer; padding:4px 8px;">←</button>
      <span class="timer ${state.examTimeLeft <= 300 ? 'warning' : ''}" style="font-weight:600; font-size:16px; font-variant-numeric:tabular-nums;">${min}:${sec.toString().padStart(2, '0')}</span>
      <button data-action="toggle-grid" style="font-size:14px; padding:6px 12px; border-radius:6px; border:1px solid #e5e7eb; cursor:pointer; background:white;">${state.examIndex + 1}/46</button>
      <button class="flag-btn ${isFlagged ? 'flagged' : ''}" data-action="toggle-flag" style="padding:8px; border-radius:6px; border:1px solid #e5e7eb; cursor:pointer; ${isFlagged ? 'background:#fffbeb; border-color:var(--flagged);' : 'background:white;'}">⚑</button>
    </div>
    <div class="container" style="padding-top:16px;">
      <div class="question-card">
        <div class="question-text">${q.question}</div>
        ${optionsHtml}
      </div>
      <div class="nav-buttons" style="display:flex; gap:12px; margin-top:20px; padding-bottom:24px;">
        <button class="nav-btn btn-secondary" data-action="exam-prev" ${state.examIndex === 0 ? 'disabled style="opacity:0.5; flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:#e5e7eb;"' : 'style="flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:#e5e7eb;"'}>Previous</button>
        ${state.examIndex === 45
          ? `<button class="nav-btn btn-primary" data-action="submit-exam" style="flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:var(--accent); color:white;">Submit</button>`
          : `<button class="nav-btn btn-primary" data-action="exam-next" style="flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:var(--accent); color:white;">Next</button>`
        }
      </div>
    </div>
    ${gridHtml}
  `;
}
```

- [ ] **Step 2: Add exam event handlers**

Add to the `bindEvents` onclick handler:

```js
    else if (action === 'exam-answer') {
      const idx = parseInt(btn.dataset.index);
      const q = state.examQuestions[state.examIndex];
      state.examAnswers[q.id] = idx;
      render();
    }
    else if (action === 'exam-next') {
      if (state.examIndex < 45) {
        state.examIndex++;
        render();
      }
    }
    else if (action === 'exam-prev') {
      if (state.examIndex > 0) {
        state.examIndex--;
        render();
      }
    }
    else if (action === 'toggle-flag') {
      const q = state.examQuestions[state.examIndex];
      if (state.examFlagged.has(q.id)) state.examFlagged.delete(q.id);
      else state.examFlagged.add(q.id);
      render();
    }
    else if (action === 'toggle-grid') {
      state.showGrid = !state.showGrid;
      render();
    }
    else if (action === 'close-grid') {
      state.showGrid = false;
      render();
    }
    else if (action === 'exam-jump') {
      state.examIndex = parseInt(btn.dataset.index);
      state.showGrid = false;
      render();
    }
    else if (action === 'submit-exam') {
      const unanswered = 46 - Object.keys(state.examAnswers).length;
      if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`)) return;
      submitExam();
    }
```

- [ ] **Step 3: Add exam submission and results**

```js
function submitExam() {
  if (state.examTimerId) {
    clearInterval(state.examTimerId);
    state.examTimerId = null;
  }

  // Calculate score
  let correct = 0;
  state.examQuestions.forEach(q => {
    if (state.examAnswers[q.id] === q.correct) correct++;
  });

  // Save to history
  const history = loadExamHistory();
  state.examResult = {
    score: correct,
    total: 46,
    passed: correct >= 38,
    timeTaken: 1800 - state.examTimeLeft,
    date: new Date().toISOString(),
    questions: state.examQuestions,
    answers: { ...state.examAnswers }
  };
  history.push(state.examResult);
  saveExamHistory(history);

  state.screen = 'results';
  render();
}

function renderResults() {
  const r = state.examResult;
  const pct = Math.round(r.score / r.total * 100);
  const minUsed = Math.floor(r.timeTaken / 60);
  const secUsed = r.timeTaken % 60;

  // Category breakdown
  const catScores = {};
  CATEGORIES.forEach(c => catScores[c.id] = { correct: 0, total: 0, name: c.name });
  r.questions.forEach(q => {
    catScores[q.category].total++;
    if (r.answers[q.id] === q.correct) catScores[q.category].correct++;
  });

  // Wrong answers for review
  const wrongQuestions = r.questions.filter(q => r.answers[q.id] !== q.correct);

  return `
    <div class="container" style="padding-top:32px;">
      <div style="text-align:center; margin-bottom:32px;">
        <div class="${r.passed ? 'pass' : 'fail'}" style="font-size:48px; font-weight:700; color:${r.passed ? 'var(--correct)' : 'var(--wrong)'};">${r.passed ? 'PASSED!' : 'FAILED'}</div>
        <div class="score-text" style="font-size:24px; margin:12px 0;">${r.score} / ${r.total} (${pct}%)</div>
        <div style="font-size:14px; color:#6b7280;">Need 38/46 (83%) to pass · Time: ${minUsed}m ${secUsed}s</div>
      </div>

      <div class="question-card" style="margin-bottom:20px;">
        <h3 style="margin:0 0 12px; font-size:16px;">Score by Category</h3>
        <ul class="category-breakdown" style="list-style:none; padding:0; margin:0;">
          ${Object.values(catScores).filter(c => c.total > 0).map(c => `
            <li style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #e5e7eb;">
              <span>${c.name}</span>
              <span style="font-weight:600; color:${c.correct === c.total ? 'var(--correct)' : c.correct / c.total < 0.5 ? 'var(--wrong)' : 'var(--text)'};">${c.correct}/${c.total}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      ${wrongQuestions.length > 0 ? `
        <h3 style="font-size:16px; margin:24px 0 12px;">Review Wrong Answers (${wrongQuestions.length})</h3>
        ${wrongQuestions.map(q => `
          <div class="review-item" style="margin-bottom:16px; padding:16px; border-radius:8px; border:1px solid #e5e7eb;">
            <div style="font-weight:600; margin-bottom:8px;">${q.question}</div>
            <div style="color:var(--wrong); font-size:14px;">Your answer: ${r.answers[q.id] !== undefined ? q.options[r.answers[q.id]] : 'Not answered'}</div>
            <div style="color:var(--correct); font-size:14px;">Correct: ${q.options[q.correct]}</div>
            <div class="explanation" style="margin-top:8px; font-size:13px;">${q.explanation}</div>
          </div>
        `).join('')}
      ` : '<div style="text-align:center; color:var(--correct); font-weight:600; font-size:18px; margin:24px 0;">Perfect score! 🎉</div>'}

      <div class="nav-buttons" style="display:flex; gap:12px; margin-top:24px; padding-bottom:32px;">
        <button class="nav-btn btn-secondary" data-action="go-home" style="flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:#e5e7eb;">Home</button>
        <button class="nav-btn btn-primary" data-action="start-exam" style="flex:1; padding:14px; border-radius:8px; font-size:16px; min-height:44px; cursor:pointer; border:none; background:var(--accent); color:white;">Retake Exam</button>
      </div>
    </div>
  `;
}
```

- [ ] **Step 4: Verify exam mode end-to-end**

Open in browser, click "Practice Exam". Verify:
- Timer counts down from 30:00
- Timer turns red at 5:00 remaining
- Can select answers (blue highlight, no feedback)
- Flag button toggles amber
- Question grid shows answered (blue) / flagged (amber dot) / current (outline)
- Can jump to questions via grid
- Previous/Next navigation works
- "Submit" appears on question 46
- Submitting shows pass/fail, score, category breakdown
- Wrong answers shown with explanations
- Retake starts a fresh exam
- Home button returns to home with updated best score

- [ ] **Step 5: Commit**

```bash
git add ca-dmv-test.html
git commit -m "feat: add exam mode with timer, flagging, navigation grid, and results screen"
```

---

### Task 7: Polish and Final Verification

**Files:**
- Modify: `ca-dmv-test.html`

- [ ] **Step 1: Add touch and UX polish**

Add these finishing touches:

```js
// Prevent double-tap zoom on buttons (mobile)
document.addEventListener('touchend', function(e) {
  if (e.target.closest('button')) e.preventDefault();
}, { passive: false });
```

Add to CSS:
```css
/* Smooth transitions */
button { -webkit-tap-highlight-color: transparent; }
.option-btn { transition: border-color 0.2s, background 0.2s; }

/* Scrollbar hide for category pills */
.category-pills { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.category-pills::-webkit-scrollbar { display: none; }

/* Prevent text selection on buttons */
button { user-select: none; -webkit-user-select: none; }
```

- [ ] **Step 2: Add keyboard navigation for desktop**

```js
document.addEventListener('keydown', function(e) {
  if (state.screen === 'study' || state.screen === 'exam') {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const nextBtn = document.querySelector('[data-action="study-next"], [data-action="exam-next"]');
      if (nextBtn && !nextBtn.disabled) nextBtn.click();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const prevBtn = document.querySelector('[data-action="study-prev"], [data-action="exam-prev"]');
      if (prevBtn && !prevBtn.disabled) prevBtn.click();
    }
    if (e.key >= '1' && e.key <= '4') {
      const optBtns = document.querySelectorAll('.option-btn:not([disabled])');
      const idx = parseInt(e.key) - 1;
      if (optBtns[idx]) optBtns[idx].click();
    }
  }
});
```

- [ ] **Step 3: Test on mobile viewport**

Using browser dev tools mobile emulation (iPhone SE, iPhone 14, Pixel 5):
- All buttons are thumb-reachable (44px+ targets)
- Category pills scroll smoothly
- No horizontal overflow
- Question card is readable
- Timer and exam header don't overlap content
- Grid overlay is centered and scrollable

- [ ] **Step 4: Test full flow end-to-end**

1. Home → Study → answer 5 questions → go home → verify stats update
2. Home → Study → filter by category → verify questions change → verify progress bar
3. Home → Exam → answer all 46 → submit → verify pass/fail → verify wrong answer review
4. Home → verify best exam score shown
5. Home → Exam → answer 20 → let timer run → verify auto-submit at 0:00 (can test by setting timer to 10 seconds temporarily)
6. Reload page → verify study progress persisted in localStorage

- [ ] **Step 5: Commit**

```bash
git add ca-dmv-test.html
git commit -m "feat: add touch/keyboard polish and finalize CA DMV practice test"
```
