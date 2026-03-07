/**
 * gmail.js — Integracja z Gmail API
 *
 * Dwa tryby autoryzacji (probuje w kolejnosci):
 *   1. gcloud ADC — `gcloud auth application-default login --scopes=...gmail...`
 *   2. OAuth2 client_secret.json + tokens.json (fallback)
 *
 * Dziala na kontach @thisisit.edu.pl (Maciej i Jarek).
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'client_secret.json');
const TOKENS_PATH = path.join(__dirname, 'tokens.json');
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
// Auth — ADC (preferred) or OAuth2 client
// ---------------------------------------------------------------------------

let _cachedAdcAuth = null;

async function getAdcClient() {
  if (_cachedAdcAuth) return _cachedAdcAuth;
  if (!fs.existsSync(ADC_PATH)) return null;

  try {
    const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
    const client = await auth.getClient();
    // Verify it actually works by requesting a token
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
 * Priorytet: ADC > OAuth2 client_secret.json
 */
async function getAuthenticatedClient() {
  const adc = await getAdcClient();
  if (adc) return adc;
  return getOAuth2Client();
}

async function getAuthenticatedEmail() {
  const auth = await getAuthenticatedClient();
  if (!auth) return null;
  try {
    const gmail = google.gmail({ version: 'v1', auth });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    return profile.data.emailAddress;
  } catch {
    return null;
  }
}

async function getAuthStatus() {
  // Check ADC first
  if (fs.existsSync(ADC_PATH)) {
    try {
      const adc = await getAdcClient();
      if (adc) {
        const email = await getAuthenticatedEmail();
        return { status: 'connected', method: 'adc', email, message: 'Gmail polaczony (gcloud ADC)' };
      }
    } catch {}
  }

  // Check OAuth2 fallback
  const creds = loadCredentials();
  const hasTokens = fs.existsSync(TOKENS_PATH);
  if (creds && hasTokens) {
    const email = await getAuthenticatedEmail();
    return { status: 'connected', method: 'oauth2', email, message: 'Gmail polaczony (OAuth2)' };
  }
  if (creds && !hasTokens) return { status: 'not_authenticated', message: 'Wymaga autoryzacji Google' };

  return {
    status: 'disconnected',
    message: 'Brak konfiguracji Gmail',
  };
}

// ---------------------------------------------------------------------------
// Wyslij maila HTML
// ---------------------------------------------------------------------------

async function sendEmail({ to, subject, bodyHtml, attachmentPath }) {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error('Gmail nie podlaczony. Zaloguj sie przez /auth/google');

  const gmail = google.gmail({ version: 'v1', auth });
  const profile = await gmail.users.getProfile({ userId: 'me' });
  const from = profile.data.emailAddress;

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

  const raw = Buffer.from(mimeLines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
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
  logout,
};
