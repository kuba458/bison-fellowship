#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CLIENTS_DIR = path.join(__dirname, '..', 'clients');
const TEMPLATE_PATH = path.join(CLIENTS_DIR, 'pse', 'index.html');
const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

const PSE_CHALLENGE = 'PSE definiuje wyzwania technologiczne \u2014 np. analiza przy\u0142\u0105cze\u0144, optymalizacja sieci, analiza danych';
const PSE_BACKGROUND = 'pse-slide-background-navy.png';

const clients = [
  {
    slug: 'loreal',
    name: "L\u2019Or\u00e9al",
    pdfName: 'Bison_Fellowship_LOreal.pdf',
    background: 'loreal-background.png',
    challenge: "L\u2019Or\u00e9al definiuje wyzwania technologiczne \u2014 np. personalizacja rekomendacji z AI, analiza trend\u00f3w beauty, optymalizacja \u0142a\u0144cucha dostaw",
  },
  {
    slug: 'santander',
    name: 'Santander',
    pdfName: 'Bison_Fellowship_Santander.pdf',
    background: 'bank-general-background.png',
    challenge: 'Santander definiuje wyzwania technologiczne \u2014 np. analiza ryzyka kredytowego, automatyzacja proces\u00f3w bankowych, optymalizacja obs\u0142ugi klienta z AI',
  },
  {
    slug: 'mbank',
    name: 'mBank',
    pdfName: 'Bison_Fellowship_mBank.pdf',
    background: 'mbank-background.png',
    challenge: 'mBank definiuje wyzwania technologiczne \u2014 np. analiza ryzyka kredytowego, automatyzacja proces\u00f3w bankowych, optymalizacja obs\u0142ugi klienta z AI',
  },
  {
    slug: 'benefit-systems',
    name: 'Benefit Systems',
    pdfName: 'Bison_Fellowship_Benefit_Systems.pdf',
    background: 'benefit-systems-background.png',
    challenge: 'Benefit Systems definiuje wyzwania technologiczne \u2014 np. personalizacja oferty benefitowej, analiza zachowa\u0144 u\u017cytkownik\u00f3w, optymalizacja platformy',
  },
  {
    slug: 'bgk',
    name: 'BGK',
    pdfName: 'Bison_Fellowship_BGK.pdf',
    background: 'bank-general-background.png',
    challenge: 'BGK definiuje wyzwania technologiczne \u2014 np. analiza ryzyka, automatyzacja proces\u00f3w, optymalizacja finansowania rozwoju z AI',
  },
  {
    slug: 'alior-bank',
    name: 'Alior Bank',
    pdfName: 'Bison_Fellowship_Alior_Bank.pdf',
    background: 'bank-general-background.png',
    challenge: 'Alior Bank definiuje wyzwania technologiczne \u2014 np. analiza ryzyka kredytowego, automatyzacja proces\u00f3w bankowych, optymalizacja obs\u0142ugi klienta z AI',
  },
  {
    slug: 'bank-pekao',
    name: 'Bank Pekao',
    pdfName: 'Bison_Fellowship_Bank_Pekao.pdf',
    background: 'bank-general-background.png',
    challenge: 'Bank Pekao definiuje wyzwania technologiczne \u2014 np. analiza ryzyka kredytowego, automatyzacja proces\u00f3w bankowych, optymalizacja obs\u0142ugi klienta z AI',
  },
  {
    slug: 'kghm',
    name: 'KGHM',
    pdfName: 'Bison_Fellowship_KGHM.pdf',
    background: 'kghm-background.png',
    challenge: 'KGHM definiuje wyzwania technologiczne \u2014 np. analiza danych z czujnik\u00f3w IoT, predykcja awarii maszyn',
  },
  {
    slug: 'pko-bp',
    name: 'PKO Bank Polski',
    pdfName: 'Bison_Fellowship_PKO_Bank_Polski.pdf',
    background: 'bank-general-background.png',
    challenge: 'PKO Bank Polski definiuje wyzwania technologiczne \u2014 np. analiza ryzyka kredytowego, automatyzacja proces\u00f3w bankowych, optymalizacja obs\u0142ugi klienta z AI',
  },
  {
    slug: 'lot',
    name: 'LOT Polish Airlines',
    pdfName: 'Bison_Fellowship_LOT.pdf',
    background: 'lot-background.png',
    challenge: 'LOT Polish Airlines definiuje wyzwania technologiczne \u2014 np. optymalizacja siatki po\u0142\u0105cze\u0144, dynamiczny pricing, automatyzacja obs\u0142ugi pasa\u017cer\u00f3w z AI',
  },
  {
    slug: 'pge',
    name: 'PGE',
    pdfName: 'Bison_Fellowship_PGE.pdf',
    background: 'pse-slide-background-navy.png',
    challenge: 'PGE definiuje wyzwania technologiczne \u2014 np. optymalizacja sieci energetycznej, predykcja zu\u017cycia energii, analiza danych z inteligentnych licznik\u00f3w',
  },
  {
    slug: 'pzu',
    name: 'PZU',
    pdfName: 'Bison_Fellowship_PZU.pdf',
    background: 'pzu-background.png',
    challenge: 'PZU definiuje wyzwania technologiczne \u2014 np. analiza ryzyka ubezpieczeniowego, automatyzacja obs\u0142ugi szk\u00f3d, personalizacja oferty z AI',
  },
  {
    slug: 'pkn-orlen',
    name: 'PKN Orlen',
    pdfName: 'Bison_Fellowship_PKN_Orlen.pdf',
    background: 'orlen-background.png',
    challenge: 'PKN Orlen definiuje wyzwania technologiczne \u2014 np. optymalizacja proces\u00f3w rafineryjnych, predykcja popytu na paliwa, analiza danych z sieci stacji',
  },
];

for (const client of clients) {
  let html = TEMPLATE;

  // 1. Replace background image path (before PSE text replacement)
  html = html.split(PSE_BACKGROUND).join(client.background);

  // 2. Replace challenge description (contains "PSE", must be before global replacement)
  html = html.replace(PSE_CHALLENGE, client.challenge);

  // 3. Replace all remaining uppercase "PSE" (word boundary) with company name
  html = html.replace(/\bPSE\b/g, client.name);

  // Create directory and write file
  const dir = path.join(CLIENTS_DIR, client.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');

  console.log(`Created ${client.slug}/index.html`);
}

// Export client config for use by generate-pdf.js
module.exports = { clients };
console.log('\nDone! Created ' + clients.length + ' client decks.');
