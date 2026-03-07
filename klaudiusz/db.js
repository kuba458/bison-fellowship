/**
 * db.js — Warstwa bazy danych SQLite dla Klaudiusza
 *
 * Inicjalizacja schematu, dane testowe (seed) i funkcje pomocnicze
 * do operacji CRUD na szkicach wiadomosci.
 */

const Database = require('better-sqlite3');
const path = require('path');

// Baza danych przechowywana w katalogu dashboard/
const DB_PATH = path.join(__dirname, 'klaudiusz.db');

const db = new Database(DB_PATH);

// Wlacz WAL dla lepszej wydajnosci przy rownoczesnych odczytach
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS drafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    from_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    channel TEXT DEFAULT 'email' CHECK(channel IN ('email', 'linkedin', 'both')),
    linkedin_message TEXT,
    deck_url TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'rejected')),
    notion_crm_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME,
    rejected_at DATETIME
  );
`);

// ---------------------------------------------------------------------------
// Seed — wstaw testowy szkic jesli tabela jest pusta
// ---------------------------------------------------------------------------

const count = db.prepare('SELECT COUNT(*) AS cnt FROM drafts').get();

if (count.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO drafts (company, contact_name, contact_email, from_email, subject, body_html, channel, linkedin_message, deck_url)
    VALUES (@company, @contact_name, @contact_email, @from_email, @subject, @body_html, @channel, @linkedin_message, @deck_url)
  `);

  insert.run({
    company: 'This is IT (test)',
    contact_name: 'Micha\u0142 Wyr\u0119bkowski',
    contact_email: 'michal.wyrebkowski@thisisit.edu.pl',
    from_email: 'maciej.kawecki@thisisit.edu.pl',
    subject: 'Test Klaudiusza \u2014 sprawdzenie systemu wysy\u0142ki',
    body_html: `<p>Cze\u015b\u0107 Micha\u0142,</p>
<p>To jest testowa wiadomo\u015b\u0107 wygenerowana przez system <strong>Klaudiusz</strong>, \u017ceby sprawdzi\u0107 czy ca\u0142y pipeline dzia\u0142a poprawnie \u2014 od podgl\u0105du w dashboardzie, przez edycj\u0119, a\u017c po wysy\u0142k\u0119 przez Gmail API.</p>
<p>Je\u015bli to widzisz w skrzynce, znaczy \u017ce wszystko gra.</p>
<p style="margin-top:24px;">Pozdrawiam,</p>
<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #1a1a1a; margin-top: 4px;">
  <tr>
    <td style="padding-right: 16px; border-right: 2px solid #1a1a1a;">
      <strong style="font-size: 14px;">Maciej Kawecki</strong><br>
      <span style="color: #666;">CEO & Founder</span>
    </td>
    <td style="padding-left: 16px;">
      <strong>This is IT</strong> | This is the World<br>
      <a href="mailto:maciej.kawecki@thisisit.edu.pl" style="color: #666; text-decoration: none;">maciej.kawecki@thisisit.edu.pl</a><br>
      <a href="https://thisisit.edu.pl" style="color: #666; text-decoration: none;">thisisit.edu.pl</a>
    </td>
  </tr>
</table>`,
    channel: 'email',
    linkedin_message: null,
    deck_url: '/decks/ing/index.html',
  });

  console.log('[db] Wstawiono testowy szkic.');
}

// ---------------------------------------------------------------------------
// Funkcje pomocnicze (prepared statements dla wydajnosci)
// ---------------------------------------------------------------------------

const stmts = {
  getAll: db.prepare('SELECT * FROM drafts ORDER BY created_at DESC'),

  getByStatus: db.prepare('SELECT * FROM drafts WHERE status = ? ORDER BY created_at DESC'),

  getById: db.prepare('SELECT * FROM drafts WHERE id = ?'),

  insert: db.prepare(`
    INSERT INTO drafts (company, contact_name, contact_email, from_email, subject, body_html, channel, linkedin_message, deck_url, notion_crm_url)
    VALUES (@company, @contact_name, @contact_email, @from_email, @subject, @body_html, @channel, @linkedin_message, @deck_url, @notion_crm_url)
  `),

  updateDraft: db.prepare(`
    UPDATE drafts SET subject = @subject, body_html = @body_html, contact_email = @contact_email WHERE id = @id
  `),

  markSent: db.prepare(`
    UPDATE drafts SET status = 'sent', sent_at = datetime('now') WHERE id = ?
  `),

  markRejected: db.prepare(`
    UPDATE drafts SET status = 'rejected', rejected_at = datetime('now') WHERE id = ?
  `),

  // Statystyki — dzisiejsze
  todayStats: db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'sent'     AND date(sent_at) = date('now') THEN 1 ELSE 0 END) AS today_sent,
      SUM(CASE WHEN status = 'rejected' AND date(rejected_at) = date('now') THEN 1 ELSE 0 END) AS today_rejected,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS total_pending
    FROM drafts
  `),

  // Statystyki — ten tydzien (poniedzialek do teraz)
  weekStats: db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'sent' AND sent_at >= date('now', 'weekday 0', '-6 days') THEN 1 ELSE 0 END) AS week_sent,
      COUNT(*) AS total
    FROM drafts
  `),
};

/**
 * Pobierz wszystkie szkice, opcjonalnie filtrowane po statusie.
 */
function getAllDrafts(status) {
  if (status && ['pending', 'sent', 'rejected'].includes(status)) {
    return stmts.getByStatus.all(status);
  }
  return stmts.getAll.all();
}

/**
 * Pobierz pojedynczy szkic po ID.
 */
function getDraftById(id) {
  return stmts.getById.get(id);
}

/**
 * Utworz nowy szkic.
 */
function createDraft(data) {
  const result = stmts.insert.run({
    company: data.company,
    contact_name: data.contact_name,
    contact_email: data.contact_email,
    from_email: data.from_email,
    subject: data.subject,
    body_html: data.body_html,
    channel: data.channel || 'email',
    linkedin_message: data.linkedin_message || null,
    deck_url: data.deck_url || null,
    notion_crm_url: data.notion_crm_url || null,
  });
  return getDraftById(result.lastInsertRowid);
}

/**
 * Aktualizuj temat i tresc szkicu.
 */
function updateDraft(id, { subject, body_html, contact_email }) {
  stmts.updateDraft.run({ id, subject, body_html, contact_email });
  return getDraftById(id);
}

/**
 * Oznacz szkic jako wyslany.
 */
function markAsSent(id) {
  stmts.markSent.run(id);
  return getDraftById(id);
}

/**
 * Oznacz szkic jako odrzucony.
 */
function markAsRejected(id) {
  stmts.markRejected.run(id);
  return getDraftById(id);
}

/**
 * Pobierz statystyki dashboardu.
 */
function getStats() {
  const today = stmts.todayStats.get();
  const week = stmts.weekStats.get();

  return {
    today_sent: today.today_sent || 0,
    today_rejected: today.today_rejected || 0,
    total_pending: today.total_pending || 0,
    week_sent: week.week_sent || 0,
    week_total: week.total || 0,
  };
}

module.exports = {
  db,
  getAllDrafts,
  getDraftById,
  createDraft,
  updateDraft,
  markAsSent,
  markAsRejected,
  getStats,
};
