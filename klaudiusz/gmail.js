/**
 * gmail.js — Integracja z Gmail API
 *
 * Trzy tryby autoryzacji (probuje w kolejnosci):
 *   1. Service Account z Domain-Wide Delegation (impersonacja dowolnego usera w domenie)
 *   2. gcloud ADC — `gcloud auth application-default login --scopes=...gmail...`
 *   3. OAuth2 client_secret.json + tokens.json (fallback, wymaga logowania w przegladarce)
 *
 * Env vars:
 *   GMAIL_SENDER — email usera do impersonacji przez service account (np. maciej@bisongroup.pl)
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'client_secret.json');
const TOKENS_PATH = path.join(__dirname, 'tokens.json');
const SA_PATH = path.join(__dirname, 'service-account.json');
const ADC_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.config', 'gcloud', 'application_default_credentials.json'
);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.readonly',
];

const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';

// ---------------------------------------------------------------------------
// Auth — Service Account (preferred) > ADC > OAuth2
// ---------------------------------------------------------------------------

let _cachedSaClient = null;
let _cachedAdcAuth = null;

/**
 * Service Account z Domain-Wide Delegation.
 * Wymaga: service-account.json + GMAIL_SENDER env var.
 * W Admin Console: Security > API Controls > Domain-Wide Delegation > dodaj Client ID SA.
 */
async function getServiceAccountClient(impersonateEmail) {
  const sender = impersonateEmail || process.env.GMAIL_SENDER;
  if (!fs.existsSync(SA_PATH) || !sender) return null;

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SA_PATH,
      scopes: SCOPES,
      clientOptions: { subject: sender },
    });
    const client = await auth.getClient();
    await client.getAccessToken();
    return client;
  } catch (e) {
    console.error('[SA] Service account auth failed:', e.message);
    return null;
  }
}

async function getAdcClient() {
  if (_cachedAdcAuth) return _cachedAdcAuth;
  if (!fs.existsSync(ADC_PATH)) return null;

  try {
    const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
    const client = await auth.getClient();
    await client.getAccessToken();
    _cachedAdcAuth = client;
    return client;
  } catch {
    return null;
  }
}

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) return null;
  const raw = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  return raw.web || raw.installed || null;
}

function createOAuth2Client() {
  const creds = loadCredentials();
  if (!creds) return null;
  return new google.auth.OAuth2(creds.client_id, creds.client_secret, REDIRECT_URI);
}

function getAuthUrl() {
  const client = createOAuth2Client();
  if (!client) return null;
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
}

async function handleCallback(code) {
  const client = createOAuth2Client();
  const { tokens } = await client.getToken(code);
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
  return tokens;
}

function getOAuth2Client() {
  const client = createOAuth2Client();
  if (!client) return null;
  if (!fs.existsSync(TOKENS_PATH)) return null;
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  client.setCredentials(tokens);
  client.on('tokens', (newTokens) => {
    const merged = { ...tokens, ...newTokens };
    fs.writeFileSync(TOKENS_PATH, JSON.stringify(merged, null, 2));
  });
  return client;
}

/**
 * Zwraca najlepszy dostepny klient auth.
 * Priorytet: Service Account > ADC > OAuth2
 */
async function getAuthenticatedClient(impersonateEmail) {
  const sa = await getServiceAccountClient(impersonateEmail);
  if (sa) return { client: sa, method: 'service-account' };
  const adc = await getAdcClient();
  if (adc) return { client: adc, method: 'adc' };
  const oauth = getOAuth2Client();
  if (oauth) return { client: oauth, method: 'oauth2' };
  return null;
}

async function getAuthenticatedEmail(auth) {
  if (!auth) return null;
  try {
    const gm = google.gmail({ version: 'v1', auth: auth.client || auth });
    const profile = await gm.users.getProfile({ userId: 'me' });
    return profile.data.emailAddress;
  } catch {
    return null;
  }
}

async function getAuthStatus() {
  // 1. Service Account
  const sender = process.env.GMAIL_SENDER;
  if (fs.existsSync(SA_PATH) && sender) {
    const sa = await getServiceAccountClient(sender);
    if (sa) {
      return {
        status: 'connected',
        method: 'service-account',
        email: sender,
        message: `Gmail polaczony (Service Account → ${sender})`,
      };
    }
  }

  // 2. ADC
  if (fs.existsSync(ADC_PATH)) {
    try {
      const adc = await getAdcClient();
      if (adc) {
        const email = await getAuthenticatedEmail({ client: adc });
        return { status: 'connected', method: 'adc', email, message: 'Gmail polaczony (gcloud ADC)' };
      }
    } catch {}
  }

  // 3. OAuth2
  const creds = loadCredentials();
  const hasTokens = fs.existsSync(TOKENS_PATH);
  if (creds && hasTokens) {
    const oauth = getOAuth2Client();
    const email = await getAuthenticatedEmail({ client: oauth });
    return { status: 'connected', method: 'oauth2', email, message: 'Gmail polaczony (OAuth2)' };
  }
  if (creds && !hasTokens) return { status: 'not_authenticated', message: 'Wymaga autoryzacji Google' };

  return { status: 'disconnected', message: 'Brak konfiguracji Gmail' };
}

// ---------------------------------------------------------------------------
// Build MIME message (shared between send and draft)
// ---------------------------------------------------------------------------

function buildRawMime({ from, to, subject, bodyHtml, attachmentPath }) {
  const boundary = '----=_Part_' + Date.now().toString(36);

  const mimeLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(bodyHtml).toString('base64'),
  ];

  if (attachmentPath && fs.existsSync(attachmentPath)) {
    const filename = path.basename(attachmentPath);
    const pdfData = fs.readFileSync(attachmentPath).toString('base64');
    mimeLines.push(
      '',
      `--${boundary}`,
      `Content-Type: application/pdf; name="${filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${filename}"`,
      '',
      pdfData,
    );
  }

  mimeLines.push('', `--${boundary}--`);

  return Buffer.from(mimeLines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function resolveAuth(fromEmail) {
  const authResult = await getAuthenticatedClient(fromEmail);
  if (!authResult) throw new Error('Gmail nie podlaczony. Zaloguj sie przez /auth/google');
  const { client: auth, method } = authResult;
  const gm = google.gmail({ version: 'v1', auth });
  let from;
  if (method === 'service-account' && fromEmail) {
    from = fromEmail;
  } else {
    const profile = await gm.users.getProfile({ userId: 'me' });
    from = profile.data.emailAddress;
  }
  return { gm, from };
}

// ---------------------------------------------------------------------------
// Wyslij maila HTML
// ---------------------------------------------------------------------------

async function sendEmail({ to, subject, bodyHtml, attachmentPath, fromEmail }) {
  const { gm, from } = await resolveAuth(fromEmail);
  const raw = buildRawMime({ from, to, subject, bodyHtml, attachmentPath });
  const result = await gm.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
  return result.data;
}

// ---------------------------------------------------------------------------
// Utworz draft w Gmail (pojawia sie w Drafts nadawcy)
// ---------------------------------------------------------------------------

async function createGmailDraft({ to, subject, bodyHtml, attachmentPath, fromEmail }) {
  const { gm, from } = await resolveAuth(fromEmail);
  const raw = buildRawMime({ from, to, subject, bodyHtml, attachmentPath });
  const result = await gm.users.drafts.create({
    userId: 'me',
    requestBody: {
      message: { raw },
    },
  });
  return result.data;
}

function logout() {
  if (fs.existsSync(TOKENS_PATH)) {
    fs.unlinkSync(TOKENS_PATH);
  }
}

module.exports = {
  getAuthUrl,
  handleCallback,
  getAuthStatus,
  getAuthenticatedClient,
  sendEmail,
  createGmailDraft,
  logout,
};
