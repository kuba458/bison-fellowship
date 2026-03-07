/**
 * server.js — Glowny serwer Express dla dashboardu Klaudiusz
 *
 * Serwuje strone HTML, API REST do zarzadzania szkicami,
 * oraz integracje z Gmail API przez OAuth2.
 */

const express = require('express');
const path = require('path');
const {
  getAllDrafts,
  getDraftById,
  createDraft,
  updateDraft,
  markAsSent,
  markAsRejected,
  getStats,
} = require('./db');
const gmail = require('./gmail');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const bisonRoot = path.resolve(__dirname, '..', '..', 'this-is-world-bison-prezentacja', 'bison-fellowship');
app.use('/decks', express.static(path.join(bisonRoot, 'clients')));
app.use('/assets', express.static(path.join(bisonRoot, 'assets')));

// ---------------------------------------------------------------------------
// Strona glowna
// ---------------------------------------------------------------------------

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ---------------------------------------------------------------------------
// OAuth2 — autoryzacja Gmail
// ---------------------------------------------------------------------------

app.get('/auth/google', (_req, res) => {
  const url = gmail.getAuthUrl();
  if (!url) {
    return res.status(500).send('Brak pliku client_secret.json. Pobierz go z Google Cloud Console.');
  }
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    await gmail.handleCallback(req.query.code);
    res.redirect('/?gmail=connected');
  } catch (err) {
    console.error('[AUTH] Blad autoryzacji:', err);
    res.status(500).send('Blad autoryzacji: ' + err.message);
  }
});

app.get('/api/auth/status', async (_req, res) => {
  res.json(await gmail.getAuthStatus());
});

app.post('/api/auth/logout', (_req, res) => {
  gmail.logout();
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// API — Szkice (Drafts)
// ---------------------------------------------------------------------------

app.get('/api/drafts', (req, res) => {
  try {
    const drafts = getAllDrafts(req.query.status);
    res.json(drafts);
  } catch (err) {
    console.error('[API] Blad pobierania szkicow:', err);
    res.status(500).json({ error: 'Blad serwera' });
  }
});

app.get('/api/drafts/:id', (req, res) => {
  try {
    const draft = getDraftById(Number(req.params.id));
    if (!draft) return res.status(404).json({ error: 'Szkic nie znaleziony' });
    res.json(draft);
  } catch (err) {
    console.error('[API] Blad pobierania szkicu:', err);
    res.status(500).json({ error: 'Blad serwera' });
  }
});

app.post('/api/drafts', (req, res) => {
  try {
    const { company, contact_name, contact_email, from_email, subject, body_html } = req.body;
    if (!company || !contact_name || !contact_email || !from_email || !subject || !body_html) {
      return res.status(400).json({
        error: 'Brakujace wymagane pola: company, contact_name, contact_email, from_email, subject, body_html',
      });
    }
    const draft = createDraft(req.body);
    res.status(201).json(draft);
  } catch (err) {
    console.error('[API] Blad tworzenia szkicu:', err);
    res.status(500).json({ error: 'Blad serwera' });
  }
});

app.patch('/api/drafts/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = getDraftById(id);
    if (!existing) return res.status(404).json({ error: 'Szkic nie znaleziony' });
    if (existing.status !== 'pending') {
      return res.status(400).json({ error: 'Mozna edytowac tylko szkice ze statusem "pending"' });
    }
    const subject = req.body.subject || existing.subject;
    const body_html = req.body.body_html || existing.body_html;
    const contact_email = req.body.contact_email || existing.contact_email;
    const updated = updateDraft(id, { subject, body_html, contact_email });
    res.json(updated);
  } catch (err) {
    console.error('[API] Blad aktualizacji szkicu:', err);
    res.status(500).json({ error: 'Blad serwera' });
  }
});

/**
 * POST /api/drafts/:id/send
 * Wysyla maila przez Gmail API, potem oznacza jako wyslany w DB.
 */
app.post('/api/drafts/:id/send', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = getDraftById(id);
    if (!existing) return res.status(404).json({ error: 'Szkic nie znaleziony' });
    if (existing.status !== 'pending') {
      return res.status(400).json({ error: 'Mozna wyslac tylko szkice ze statusem "pending"' });
    }

    // Resolve PDF attachment from deck_url if present
    let attachmentPath = null;
    if (existing.deck_url) {
      // deck_url: "/decks/ing/index.html" → clients/ing/deck.pdf
      const pdfFile = existing.deck_url.replace(/^\/decks\//, '').replace(/\/index\.html$/, '/deck.pdf');
      const pdfPath = path.join(bisonRoot, 'clients', pdfFile);
      if (require('fs').existsSync(pdfPath)) {
        attachmentPath = pdfPath;
      }
    }

    // Wyslij przez Gmail API (from = konto OAuth)
    const gmailResult = await gmail.sendEmail({
      to: existing.contact_email,
      subject: existing.subject,
      bodyHtml: existing.body_html,
      attachmentPath,
    });

    const updated = markAsSent(id);
    console.log(`[SEND] Szkic #${id} wyslany do ${existing.contact_email} (Gmail ID: ${gmailResult.id})`);
    res.json(updated);
  } catch (err) {
    console.error('[API] Blad wysylania:', err);
    const msg = err.message || 'Blad serwera';
    res.status(500).json({ error: msg });
  }
});

app.post('/api/drafts/:id/reject', (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = getDraftById(id);
    if (!existing) return res.status(404).json({ error: 'Szkic nie znaleziony' });
    if (existing.status !== 'pending') {
      return res.status(400).json({ error: 'Mozna odrzucic tylko szkice ze statusem "pending"' });
    }
    const updated = markAsRejected(id);
    console.log(`[REJECT] Szkic #${id} odrzucony.`);
    res.json(updated);
  } catch (err) {
    console.error('[API] Blad odrzucania szkicu:', err);
    res.status(500).json({ error: 'Blad serwera' });
  }
});

app.get('/api/stats', (_req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (err) {
    console.error('[API] Blad pobierania statystyk:', err);
    res.status(500).json({ error: 'Blad serwera' });
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, async () => {
  const auth = await gmail.getAuthStatus();
  console.log(`\n  Klaudiusz Dashboard`);
  console.log(`  -------------------`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Gmail: ${auth.message}\n`);
});
