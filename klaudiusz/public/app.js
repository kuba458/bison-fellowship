(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  let drafts = [];
  let filter = 'pending';
  let expandedId = null;
  let editingId = null;
  let gmailUser = null;
  let pdfViewer = null;
  let currentPdfUrl = null;
  let activeIndex = -1; // For keyboard navigation

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------

  const $feed = document.getElementById('feed');
  const $empty = document.getElementById('empty');
  const $count = document.getElementById('filter-count');
  const $hsPending = document.getElementById('hs-pending');
  const $hsSent = document.getElementById('hs-sent');
  const $toasts = document.getElementById('toasts');
  const $pills = document.querySelectorAll('.pill');
  const $sidePanel = document.getElementById('side-panel');

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------

  init();

  function init() {
    loadStats();
    loadDrafts();
    loadGmailStatus();

    $pills.forEach(p => {
      p.addEventListener('click', () => {
        $pills.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        filter = p.dataset.status;
        loadDrafts();
      });
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', handleGlobalKeydown);

    // Gmail connection toast
    if (new URLSearchParams(location.search).get('gmail') === 'connected') {
      toast('Gmail connected');
      history.replaceState(null, '', '/');
    }

    window.addEventListener('resize', () => {
      if (pdfViewer) pdfViewer._renderPage();
    });
  }

  // ---------------------------------------------------------------------------
  // Keyboard Navigation
  // ---------------------------------------------------------------------------

  function handleGlobalKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      if (e.key === 'Escape') {
        e.target.blur();
        cancelEdit();
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && editingId) {
        e.preventDefault();
        send(editingId);
      } else if (e.key === 'Enter' && editingId && e.target.tagName === 'INPUT') {
        e.preventDefault();
        save(editingId);
      }
      return;
    }

    // Navigation
    if (e.key === 'j') {
      moveActive(1);
    } else if (e.key === 'k') {
      moveActive(-1);
    } else if (e.key === 'Enter' || e.key === 'o') {
      if (editingId) { save(editingId); return; }
      if (activeIndex >= 0) toggle(drafts[activeIndex].id);
    } else if (e.key === 'Escape') {
      if (expandedId) { toggle(expandedId); }
      else if (document.body.classList.contains('has-deck')) { closeDeck(); }
    } else if (e.key === 'ArrowLeft') {
      if (pdfViewer) { e.preventDefault(); pdfViewer.prev(); }
    } else if (e.key === 'ArrowRight') {
      if (pdfViewer) { e.preventDefault(); pdfViewer.next(); }
    }

    // Actions
    if (expandedId) {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(expandedId); }
      if (e.key === 'x') { e.preventDefault(); reject(expandedId); }
    }

    // Go shortcuts (Superhuman style)
    if (e.key === 'g') {
      const onNextKey = (ev) => {
        if (ev.key === 'p') { setFilter('pending'); }
        else if (ev.key === 's') { setFilter('sent'); }
        else if (ev.key === 'a') { setFilter(''); }
        document.removeEventListener('keydown', onNextKey);
      };
      document.addEventListener('keydown', onNextKey);
    }
  }

  function moveActive(delta) {
    activeIndex = Math.max(0, Math.min(drafts.length - 1, activeIndex + delta));
    const cards = document.querySelectorAll('.card');
    cards.forEach((c, i) => {
      c.classList.toggle('is-active', i === activeIndex);
    });
    const activeCard = cards[activeIndex];
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function setFilter(val) {
    filter = val;
    $pills.forEach(p => {
      p.classList.toggle('active', p.dataset.status === val);
    });
    loadDrafts();
  }

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  async function loadStats() {
    try {
      const r = await fetch('/api/stats');
      const s = await r.json();
      $hsPending.textContent = s.total_pending;
      $hsSent.textContent = s.today_sent;
    } catch (e) { console.error(e); }
  }

  async function loadGmailStatus() {
    const $label = document.getElementById('gmail-label');
    try {
      const r = await fetch('/api/auth/status');
      const s = await r.json();
      if (s.status === 'connected') {
        gmailUser = s.email;
        $label.innerHTML = `${esc(gmailUser || 'Gmail')} <a href="#" onclick="K.logout();return false" style="color:inherit;opacity:.5;margin-left:6px;font-size:10px;">logout</a>`;
      } else {
        $label.innerHTML = '<a href="/auth/google" style="color:inherit;text-decoration:underline;">Connect Gmail</a>';
      }
    } catch (e) { console.error(e); }
  }

  async function loadDrafts() {
    try {
      const url = filter ? `/api/drafts?status=${filter}` : '/api/drafts';
      const r = await fetch(url);
      drafts = await r.json();
      activeIndex = -1;
      render();
    } catch (e) { console.error(e); }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  function render() {
    if (drafts.length === 0) {
      $feed.innerHTML = '';
      $empty.style.display = 'block';
      $count.textContent = '';
      return;
    }

    $empty.style.display = 'none';
    $count.textContent = `${drafts.length} messages`;

    updateDeckPreview();

    $feed.innerHTML = drafts.map((d, i) => {
      const expanded = d.id === expandedId;
      const editing = d.id === editingId;
      const pending = d.status === 'pending';

      return `
        <article class="card ${expanded ? 'is-expanded' : ''} is-${d.status}" data-id="${d.id}">
          <div class="card-row" onclick="K.toggle(${d.id})">
            <div class="card-who">
              <span class="card-company">${esc(d.company)}</span>
              <span class="card-contact">${esc(d.contact_name)}</span>
            </div>
            <div class="card-subject-wrap">
              <span class="card-subject">${esc(d.subject)}</span>
            </div>
            <div class="card-meta-right">
              <span class="card-status">${d.status}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="email-header">
              <div class="email-line">
                <span class="email-label">To</span>
                ${editing
                  ? `<input class="edit-field" id="edit-to-${d.id}" value="${attr(d.contact_email)}">`
                  : `<span class="email-value">${esc(d.contact_email)}</span>`
                }
              </div>
              <div class="email-line">
                <span class="email-label">Subject</span>
                ${editing
                  ? `<input class="edit-field" id="edit-subject-${d.id}" value="${attr(d.subject)}">`
                  : `<span class="email-subject">${esc(d.subject)}</span>`
                }
              </div>
            </div>

            <div class="email-content ${editing ? 'is-editing' : ''}" id="edit-body-${d.id}" ${editing ? 'contenteditable="true"' : ''}>
              ${d.body_html}
            </div>

            ${pending ? `
              <div class="actions-footer">
                <div style="flex:1"></div>
                <button class="btn btn-danger" onclick="K.reject(${d.id})">Reject (X)</button>
                <button class="btn btn-primary" onclick="K.send(${d.id})">Send (⌘↵)</button>
              </div>
            ` : `
              <div class="actions-footer">
                <span style="font-size:12px;color:#999;">
                  ${d.status === 'sent' ? 'Sent on ' + fmtDate(d.sent_at) : 'Rejected on ' + fmtDate(d.rejected_at)}
                </span>
              </div>
            `}
          </div>
        </article>
      `;
    }).join('');
  }

  // ---------------------------------------------------------------------------
  // Deck preview
  // ---------------------------------------------------------------------------

  function updateDeckPreview() {
    const expanded = expandedId ? drafts.find(d => d.id === expandedId) : null;
    const deckUrl = expanded && expanded.deck_url;

    if (deckUrl) {
      const pdfUrl = deckUrl.replace(/\/index\.html$/, '/deck.pdf');
      document.body.classList.add('has-deck');

      if (pdfUrl !== currentPdfUrl) {
        currentPdfUrl = pdfUrl;
        $sidePanel.innerHTML = `
          <div class="side-panel-header">
            <span class="side-panel-title">Bison Fellowship Deck</span>
            <button class="close-btn" onclick="K.closeDeck()">&times;</button>
          </div>
          <div class="pdf-container" id="pdf-container"></div>
          <div class="pdf-controls" id="pdf-controls"></div>`;

        if (pdfViewer) pdfViewer.destroy();
        pdfViewer = new MinimalPDFViewer(
          document.getElementById('pdf-container'),
          document.getElementById('pdf-controls')
        );
        pdfViewer.load(pdfUrl);
      }
    } else {
      closeDeck();
    }
  }

  function closeDeck() {
    document.body.classList.remove('has-deck');
    currentPdfUrl = null;
    if (pdfViewer) { pdfViewer.destroy(); pdfViewer = null; }
    $sidePanel.innerHTML = '';
  }

  // ---------------------------------------------------------------------------
  // MinimalPDFViewer
  // ---------------------------------------------------------------------------

  class MinimalPDFViewer {
    constructor(container, controls) {
      this._container = container;
      this._controls = controls;
      this._pdf = null;
      this._page = 1;
      this._total = 0;
    }

    async load(url) {
      try {
        this._pdf = await pdfjsLib.getDocument(url).promise;
        this._total = this._pdf.numPages;
        this._page = 1;
        await this._renderPage();
      } catch (e) {
        this._container.innerHTML = '<p style="padding:40px; color:#999">Failed to load PDF</p>';
      }
    }

    async _renderPage() {
      if (!this._pdf) return;
      this._container.innerHTML = '';
      const page = await this._pdf.getPage(this._page);
      const dpr = window.devicePixelRatio || 1;
      
      // Calculate scale to fit container width
      const padding = 48; // 24px each side
      const containerWidth = this._container.clientWidth - padding;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / unscaledViewport.width;
      
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.className = 'pdf-page-canvas';
      this._container.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height * dpr;
      canvas.width = viewport.width * dpr;
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      ctx.scale(dpr, dpr);
      await page.render({ canvasContext: ctx, viewport }).promise;
      this._renderControls();
    }

    _renderControls() {
      this._controls.innerHTML = `
        <button class="pdf-btn" onclick="K.pdfPrev()" ${this._page <= 1 ? 'disabled' : ''}>Prev</button>
        <span style="font-size:12px; font-weight:600">${this._page} / ${this._total}</span>
        <button class="pdf-btn" onclick="K.pdfNext()" ${this._page >= this._total ? 'disabled' : ''}>Next</button>`;
    }

    async prev() { if (this._page > 1) { this._page--; await this._renderPage(); } }
    async next() { if (this._page < this._total) { this._page++; await this._renderPage(); } }
    destroy() { this._pdf = null; }
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async function toggle(id) {
    // Auto-save on collapse
    if (editingId && expandedId === id) {
      await save(editingId);
    }
    const wasExpanded = expandedId === id;
    expandedId = wasExpanded ? null : id;
    const draft = drafts.find(d => d.id === id);
    editingId = !wasExpanded ? id : null;
    activeIndex = drafts.findIndex(d => d.id === id);
    render();
    if (expandedId) {
      setTimeout(() => {
        const el = document.querySelector(`.card[data-id="${id}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  function edit(id) { editingId = id; render(); }
  function cancelEdit() { editingId = null; render(); }

  async function save(id) {
    const subj = document.getElementById(`edit-subject-${id}`).value;
    const body = document.getElementById(`edit-body-${id}`).innerHTML;
    const to = document.getElementById(`edit-to-${id}`).value;
    try {
      await fetch(`/api/drafts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subj, body_html: body, contact_email: to }),
      });
      editingId = null;
      toast('Saved');
      loadDrafts();
    } catch (e) { toast('Error saving', 'error'); }
  }

  async function send(id) {
    // Auto-save before sending
    if (editingId === id) await save(id);
    if (!confirm('Send this message?')) return;
    try {
      await fetch(`/api/drafts/${id}/send`, { method: 'POST' });
      expandedId = null;
      editingId = null;
      toast('Sent');
      await Promise.all([loadDrafts(), loadStats()]);
    } catch (e) { toast('Error sending', 'error'); }
  }

  async function reject(id) {
    if (!confirm('Reject this draft?')) return;
    try {
      await fetch(`/api/drafts/${id}/reject`, { method: 'POST' });
      expandedId = null;
      toast('Rejected');
      loadDrafts();
      loadStats();
    } catch (e) { toast('Error rejecting', 'error'); }
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $toasts.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function attr(s) { return (s || '').replace(/"/g, '&quot;'); }
  function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : ''; }

  async function logout() {
    if (!confirm('Disconnect Gmail?')) return;
    await fetch('/api/auth/logout', { method: 'POST' });
    location.reload();
  }

  window.K = {
    toggle, edit, cancelEdit, save, send, reject, closeDeck, logout,
    pdfPrev: () => pdfViewer && pdfViewer.prev(),
    pdfNext: () => pdfViewer && pdfViewer.next(),
  };

})();
