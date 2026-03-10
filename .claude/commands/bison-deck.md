# /bison-deck — Generator prezentacji sprzedażowych Bison Fellowship

Tworzysz spersonalizowaną prezentację sprzedażową (sales deck) dla potencjalnego sponsora programu Bison Fellowship. Deck to standalone HTML z 13 slajdami + PDF.

---

## KROK 1: DISCOVERY — Zapytaj użytkownika

Zanim cokolwiek wygenerujesz, zadaj pytania:

1. **Dla jakiej firmy tworzymy prezentację?** (pełna nazwa firmy)
2. **Jaki jest koncept na tę firmę?** — Jakie wyzwania AI byłyby sensowne dla tej firmy? (np. "predykcja awarii maszyn", "analiza ryzyka kredytowego", "optymalizacja łańcucha dostaw")
3. **Czy mamy już gotowy background (obrazek) dla tej firmy w assets/?** — sprawdź `ls assets/ | grep -i [slug]`

Następnie wypisz użytkownikowi pełną listę personalizowanych elementów decku:

```
PERSONALIZACJA DECKU DLA: [FIRMA]
────────────────────────────────
Slug:                  [slug do nazw plików i folderów]
Nazwa firmy:           [pełna nazwa, użyta ~14 razy w decku]
Wyzwanie (Slide 7):   "[Firma] definiuje wyzwania technologiczne — np. [x], [y]"
Background (Slide 7):  assets/[slug]-background.png
Oferta (Slide 8):      "buduje dla [Firma] rozwiązanie AI..."
Promocja (Slide 9):    "[Firma] zyska widoczność..."
Warunki (Slide 11):    180 000 PLN + 23% VAT
Closing (Slide 13):    "Bison Fellowship × [Firma]"
```

Poczekaj na potwierdzenie użytkownika przed kontynuacją.

---

## KROK 2: FRESH STATS Z NOTION

Spróbuj pobrać aktualne zasięgi z Notion:

```
Użyj narzędzia: mcp__claude_ai_Notion__notion-fetch
ID: https://www.notion.so/Dane-i-zasi-gi-30fb2696f85f800a815de0ad5aee128d
```

Sprawdź toggle'e: Youtube This is IT, Youtube This is World, Facebook - Maciej Kawecki, Linkedin - Maciej Kawecki, TikTok, Instagram.

**Jeśli Notion ma dane** — zaktualizuj tabelę zasięgów na Slide 10.
**Jeśli Notion jest pusty** — użyj domyślnych statystyk z szablonu:

| Platforma | Obserwujący | Wyświetlenia/mies. | Śr. na post |
|---|---|---|---|
| Dr Maciej Kawecki — LinkedIn | 175 tys. | 1M | 100 tys. |
| Maciej Kawecki — Facebook | 310 tys. | >29M | >1M |
| This is IT | 315 tys. | >1.5M | 100 tys. |
| This is the World — YouTube | 40 tys. | >1M | 150 tys. |
| Maciej Kawecki — Twitter | 55 tys. | >500 tys. | >100 tys. |
| Maciej Kawecki — TikTok | 190 tys. | >600 tys. | 80 tys. |

---

## KROK 3: GENEROWANIE ILUSTRACJI PARTNERSKIEJ

### 3a. Stwórz Scene Description

Wygeneruj opis sceny według WSZYSTKICH poniższych zasad. Zasady zapobiegają driftowi stylistycznemu — opis sceny musi zawierać instrukcje stylistyczne wbudowane w samą scenę, nie tylko polegać na style blocku.

#### KOMPOZYCJA — ZAWSZE:
- Postacie są MAŁE, pozycjonowane w dolnej 1/3 kompozycji
- Postacie widziane OD TYŁU — widzimy plecy, tyły głów, ramiona. NIGDY profili, NIGDY twarzy, NIGDY oczu/nosów/ust
- Obiekt partnera jest DUŻY i dominuje kompozycję — zajmuje górne 2/3
- Skala: ludzie są znacząco mniejsi od obiektu
- Krajobraz MINIMALNY — linia horyzontu z paru kresek, nic więcej
- Brak tła, brak nieba, brak detali otoczenia

#### OPIS OBIEKTU PARTNERA — ZAWSZE:
- Opisz obiekt jako "simplified and gestural — just the essential silhouette"
- Dodaj "NOT technically precise, NOT a blueprint/diagram/rendering"
- Opisuj obiekt przez KSZTAŁT i SYLWETKĘ, nie przez detale mechaniczne/architektoniczne
- Używaj fraz typu: "suggested by a few confident/loose/bold crayon strokes"
- Pozwól na niedokładność: "drawn from memory, imprecise proportions"

#### OPIS POSTACI — ZAWSZE:
- "The figures wear [ubrania pasujące do branży] — and are drawn loosely, seen from behind so no faces needed"
- Opisz 1-2 małe gesty różnicujące (ręce na biodrach, wskazywanie, ręka zasłaniająca oczy)
- NIGDY nie opisuj twarzy, wyrazu twarzy, oczu, profili
- NIGDY nie używaj słów: cute, cartoon, young, boy, girl — ZAWSZE: figures, people, person

#### NASTRÓJ — ZAWSZE:
- Jedno zdanie o emocji: "The mood is [przymiotnik] — [jedno zdanie rozwinięcia]"
- Dozwolone nastroje: awe, ambition, forward-looking, pride, possibility, wonder, focused energy

#### DETALE SCENY — NIGDY:
- NIGDY nie opisuj mebli (biurka, krzesła, półki)
- NIGDY nie opisuj małych przedmiotów (kubki, papiery, długopisy, książki)
- NIGDY nie opisuj wnętrz — scena jest ZAWSZE na zewnątrz lub w abstrakcyjnej pustej przestrzeni
- NIGDY nie opisuj więcej niż jednego głównego obiektu
- Jedyny wyjątek od "na zewnątrz": jeśli firma jest stricte cyfrowa (mBank, XTB), postacie mogą być pochylone nad laptopem — ale widziane Z GÓRY I OD TYŁU, bez twarzy, bez otoczenia

#### WBUDOWANE INSTRUKCJE STYLISTYCZNE W SCENIE — ZAWSZE dodaj:
- "Some areas filled in more densely — especially [co] — others left loose and sketchy"
- Minimum jedna fraza z: "suggested by a few [przymiotnik] strokes"
- Minimum jedno negatywne ograniczenie: "NOT [czego nie chcemy]"

#### MAPOWANIE PARTNER → SCENA (referencja):

| Partner | Postacie | Ubrania | Obiekt | Kluczowy kształt |
|---|---|---|---|---|
| PSE | 3 osoby | kurtki, casual | słupy przesyłowe i linie energetyczne | kratownica słupa + łuki kabli |
| KGHM | 3 osoby | kurtki, kaski | masywna koparka górnicza | blokowa bryła + ramię z łyżką |
| PKP Intercity | 3 osoby | kurtki | pociąg intercity na peronie | wydłużona sylwetka pociągu + zbiegające się tory |
| LOT | 3 osoby | kurtki, szaliki | samolot startujący | sylwetka pod kątem 30° + smugi silników |
| PKN Orlen | 3 osoby | kurtki, kaski | rafineria | kolumny destylacyjne + płomień na kominie |
| mBank | 3 osoby | bluzy, t-shirty | laptop (widok z góry) | otwarty ekran jako gołe kremowe tło |
| Santander | 3 osoby | płaszcze | neoklasyczny budynek banku z kolumnami | kolumny + fronton |
| PZU | 2 dorosłych + dziecko trzymające się za ręce | kurtki | dom w oddali | spadzisty dach + drzwi |
| Benefit Systems | 5-6 osób z boku | stroje sportowe | różne sporty (horyzontalny fryz) | dynamiczne sylwetki w ruchu |
| L'Oréal | 3 osoby | płaszcze | panorama Paryża | Wieża Eiffla + dachy |
| XTB | 3 osoby | bluzy | masywny ekran tradingowy wysoko nad nimi | prostokąt ekranu + zygzak wykresu |

### 3b. Złóż pełny prompt

Połącz scene description ze STYLE BLOCK (NIGDY nie modyfikuj style blocka):

```
[SCENE_DESCRIPTION — wygenerowany wg zasad powyżej]

--- STYLE BLOCK (DO NOT MODIFY) ---

The object/building/machine and the figures must be drawn in EXACTLY the same style and with the same level of detail — the same crayon pressure, the same line weight, the same density of strokes. If the people have visible crayon linework with some areas filled densely and others left loose and sketchy, then everything else in the scene must have the same treatment. They should look like they were drawn by the same hand in the same sitting, at the same speed. The entire illustration must feel like one unified sketch, not two elements collaged together.

The whole scene is rendered in deep navy blue wax crayon on cream-colored paper. The crayon texture must be HEAVY — thick waxy strokes with visible gaps where the paper tooth resists the crayon. NOT clean lines, NOT pen-and-ink, NOT digital illustration. Every line should look like it was made by pressing a fat wax crayon hard against rough paper. Uneven pressure, rough edges, grainy fills. NOT an icon or pictogram. NOT geometric or clean shapes. NOT a children's book illustration, NOT cartoon, NOT cute.

The style is expressive and gestural like a quick reportage sketch or editorial illustration in a literary magazine — imprecise but full of character and warmth. Drawn from memory, not from reference — imprecise proportions, simplified details, the charm is in the imperfection. Grainy porous crayon texture with visible paper tooth where the off-white background shows through.

All figures must have normal adult proportions — no oversized heads, no cute stylization, no cartoon features. No faces visible — only backs of heads, shoulders, posture.

Isolated on off-white background, generous white space around the edges. No text, no logos, no branding, no lettering of any kind. Single color only: deep navy blue (#1B2A4A). Flat composition, no photorealism, no 3D, no gradients, no color except navy blue.
```

**Przykład pełnego promptu — XTB:**
```
A simple illustration of three figures seen from behind, standing together and looking up at a massive trading screen mounted high above them. The figures are small in the composition, positioned in the lower third, gazing upward at the screen — creating a sense of scale and focused intensity. The screen is a large bold rectangle dominating the upper half of the composition, with a jagged upward-trending line chart inside — simplified and gestural, just sharp zigzag strokes suggesting a stock price graph. NOT a real UI, NOT readable numbers — just the iconic silhouette of a trading chart suggested by a few confident crayon strokes. No desk, no furniture, no coffee cups, no office environment — just the figures and the screen in abstract space. The mood is focused ambition — people reading the market, watching something unfold. The figures wear hoodies and jackets, drawn loosely, seen from behind so no faces needed. One might have arms crossed, another pointing upward at the chart. Some areas filled in more densely — especially the figures and the frame of the screen — others left loose and sketchy.

--- STYLE BLOCK (DO NOT MODIFY) ---

The object/building/machine and the figures must be drawn in EXACTLY the same style and with the same level of detail — the same crayon pressure, the same line weight, the same density of strokes. If the people have visible crayon linework with some areas filled densely and others left loose and sketchy, then everything else in the scene must have the same treatment. They should look like they were drawn by the same hand in the same sitting, at the same speed. The entire illustration must feel like one unified sketch, not two elements collaged together.

The whole scene is rendered in deep navy blue wax crayon on cream-colored paper. The crayon texture must be HEAVY — thick waxy strokes with visible gaps where the paper tooth resists the crayon. NOT clean lines, NOT pen-and-ink, NOT digital illustration. Every line should look like it was made by pressing a fat wax crayon hard against rough paper. Uneven pressure, rough edges, grainy fills. NOT an icon or pictogram. NOT geometric or clean shapes. NOT a children's book illustration, NOT cartoon, NOT cute.

The style is expressive and gestural like a quick reportage sketch or editorial illustration in a literary magazine — imprecise but full of character and warmth. Drawn from memory, not from reference — imprecise proportions, simplified details, the charm is in the imperfection. Grainy porous crayon texture with visible paper tooth where the off-white background shows through.

All figures must have normal adult proportions — no oversized heads, no cute stylization, no cartoon features. No faces visible — only backs of heads, shoulders, posture.

Isolated on off-white background, generous white space around the edges. No text, no logos, no branding, no lettering of any kind. Single color only: deep navy blue (#1B2A4A). Flat composition, no photorealism, no 3D, no gradients, no color except navy blue.
```

### 3c. Wygeneruj obrazek przez Gemini Image API

Dostępne modele (w kolejności preferencji):
1. `gemini-3-pro-image-preview` — Nano Banana Pro, najlepsza jakość (4K, lepsza spójność postaci), ale wolny i może timeoutować
2. `gemini-2.5-flash-image` — **REKOMENDOWANY** — szybki, stabilny, dobra jakość

Zacznij od `gemini-3-pro-image-preview` z `--max-time 120`. Jeśli timeout lub błąd `IMAGE_RECITATION` — fallback na `gemini-2.5-flash-image`.

```bash
# Próba 1: gemini-3-pro-image-preview (Nano Banana Pro)
curl -s --max-time 120 -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "Generate this image: [FULL_PROMPT_HERE]"}]}],
    "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
  }' > /tmp/gemini-response.json 2>&1
```

Jeśli timeout (exit code 28) lub plik < 1KB lub zawiera `IMAGE_RECITATION`:
```bash
# Fallback: gemini-2.5-flash-image (szybszy, stabilniejszy)
curl -s --max-time 120 -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "Generate this image: [FULL_PROMPT_HERE]"}]}],
    "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
  }' > /tmp/gemini-response.json 2>&1
```

Następnie wyciągnij obrazek z odpowiedzi:
```bash
node -e '
const data = JSON.parse(require("fs").readFileSync("/tmp/gemini-response.json","utf8"));
if (data.error) { console.error("ERROR:", JSON.stringify(data.error)); process.exit(1); }
const parts = data.candidates[0].content.parts;
for (const p of parts) {
  if (p.inlineData) {
    const buf = Buffer.from(p.inlineData.data, "base64");
    require("fs").writeFileSync("assets/[SLUG]-background-raw.png", buf);
    console.log("Image saved! Size:", buf.length, "bytes");
  }
}
'
```

**UWAGA:** `responseModalities: ["IMAGE", "TEXT"]` jest kluczowe — bez tego model zwróci sam tekst bez obrazka.

Jeśli oba modele zawiodą, poinformuj użytkownika i zaproponuj:
- Ręczne wygenerowanie w Google AI Studio (https://aistudio.google.com/) z tym samym promptem
- Użycie istniejącego `bank-general-background.png` jako fallback

### 3d. Usuń tło przez Clipdrop API

```bash
curl -s -X POST \
  "https://clipdrop-api.co/remove-background/v1" \
  -H "x-api-key: c75a4746331305db2cc6d7b9e8fe960bb698160ed0a9d26bf35220f1443a0d15e34f951e9f8f0047ced6cf1f135c54b8" \
  -F "image_file=@assets/[SLUG]-background-raw.png" \
  -o "assets/[SLUG]-background.png"
```

Zweryfikuj, że plik wynikowy ma sensowny rozmiar (>10KB). Jeśli Clipdrop nie zadziała, użyj raw wersji obrazka.

---

## KROK 4: GENEROWANIE HTML

Użyj szablonu PSE (`clients/pse/index.html`) jako bazy. Zastosuj te zamiany:

1. **Background image**: `pse-slide-background-navy.png` → `[SLUG]-background.png`
2. **Challenge description** (Slide 7, item 1): Zamień opis wyzwania PSE na opis dla nowej firmy
3. **Uppercase PSE** (word boundary `\bPSE\b`): Zamień na nazwę firmy (case-sensitive, nie ruszaj CSS klas `pse-`)
4. **Stats** (Slide 10): Jeśli Notion miał dane, zaktualizuj tabelę
5. Zapisz do `clients/[SLUG]/index.html`

Kod generujący:
```javascript
const fs = require('fs');
const path = require('path');
const TEMPLATE = fs.readFileSync('clients/pse/index.html', 'utf-8');
let html = TEMPLATE;
html = html.split('pse-slide-background-navy.png').join('[SLUG]-background.png');
html = html.replace('PSE definiuje wyzwania technologiczne — np. analiza przyłączeń, optymalizacja sieci, analiza danych', '[CHALLENGE_TEXT]');
html = html.replace(/\bPSE\b/g, '[COMPANY_NAME]');
fs.mkdirSync('clients/[SLUG]', { recursive: true });
fs.writeFileSync('clients/[SLUG]/index.html', html, 'utf-8');
```

---

## KROK 5: GENEROWANIE PDF

Upewnij się, że `scripts/generate-pdf.js` ma wpis dla nowego klienta. Jeśli nie, dodaj:
```javascript
'[SLUG]': {
  url: 'http://localhost:5173/clients/[SLUG]/',
  output: 'Bison_Fellowship_[PDF_NAME].pdf',
},
```

Następnie:
```bash
npx vite --port 5173 &
sleep 3
node scripts/generate-pdf.js [SLUG]
```

Zamknij Vite po zakończeniu lub pozwól mu się zamknąć.

---

## KROK 6: OUTPUT — PODSUMOWANIE DLA UŻYTKOWNIKA

Po wygenerowaniu HTML i PDF, wypisz podsumowanie:

```
═══════════════════════════════════════════
  DECK WYGENEROWANY: [FIRMA] × Bison Fellowship
═══════════════════════════════════════════

📁 Pliki:
   HTML: clients/[SLUG]/index.html
   PDF:  Bison_Fellowship_[NAME].pdf

🤝 ŚWIADCZENIA SPONSORSKIE W DECKU:
   • Dedykowany 3-osobowy zespół AI — 8 tygodni pracy nad wyzwaniem
   • Prezentacja rozwiązania na Demo Day (Gala Bison Fellowship)
   • Partnerstwo medialne — logo + obecność na kanałach (~800 tys. obserwujących)
   • 4 wstawki sponsorskie (2× This is IT, 2× This is the World)
   • 4 posty w social media (1 dedykowany + 3 wzmianki)
   • 1 materiał wideo z prac zespołu (do wykorzystania w employer brandingu)
   • Dostęp do talentów — kontakt z najzdolniejszymi studentami + możliwość rekrutacji

📅 DATA I MIEJSCE WYDARZENIA:
   24 marca — Rotunda PKO BP, Warszawa

💰 CENA:
   180 000 PLN + 23% VAT

📊 ZASIĘGI (użyte w decku):
   [Tabela z aktualnymi lub domyślnymi statystykami]

👥 WŚRÓD GOŚCI DEMO DAY:
   • Wicepremier Krzysztof Gawkowski (Min. Cyfryzacji)
   • Rafał Brzoska (CEO, InPost)
   • Mentorzy programu i przedstawiciele firm partnerskich
```

---

## STRUKTURA DECKU (13 slajdów)

| # | Slajd | Personalizowany? | Opis |
|---|---|---|---|
| 1 | Cover | nie | Logo Bison Fellowship + tagline "Stypendium dla najzdolniejszych młodych Polaków" |
| 2 | Problem | nie | Dlaczego Polska traci talenty — brain drain, brak inwestycji w młodych |
| 3 | Founder | nie | Dr Maciej Kawecki — CEO This is IT, 310 tys. na LinkedIn, 11 noblistów |
| 4 | Video | nie | Film z YouTube (origin story), auto-advances po 35s |
| 5 | Mentorzy | nie | 8 mentorów ze zdjęciami + loga uniwersytetów (Cambridge, Oxford, CMU, MIT, NYU, UMK, UW) |
| 6 | Jak działa | nie | 3 filary: Mentoring, Wyzwanie od Partnera, Wyjazd do Doliny Krzemowej |
| 7 | **Rola Partnera** | **TAK** | [Firma] × Bison Fellowship, opis wyzwania, harmonogram, ilustracja w tle |
| 8 | **Oferta** | **TAK** | "Sponsorując, [Firma] otrzymuje:" — zespół AI, Demo Day, media, talenty |
| 9 | **Promocja** | **TAK** | "[Firma] zyska widoczność" — wstawki, posty, materiał wideo |
| 10 | Zasięgi | opcjonalnie | Tabela social media stats (aktualizowalny z Notion) |
| 11 | Warunki | nie | 180 000 PLN + 23% VAT |
| 12 | Demo Day | nie | Gala 24 marca, Rotunda PKO BP, goście: Gawkowski, Brzoska, mentorzy |
| 13 | **Closing** | **TAK** | "Bison Fellowship × [Firma]" |

## MENTORZY W DECKU (aktualna lista)

1. prof. Maciej Dunajski — Profesor matematyki, Uniwersytet Cambridge
2. prof. Dawid Kielak — Profesor matematyki, Uniwersytet Oksfordzki
3. prof. Włodzisław Duch — Profesor neuronauk, UMK Toruń
4. dr Krzysztof Geras — Współzałożyciel Ataraxis AI, Uniwersytet Nowojorski
5. prof. Artur Dubrawski — Badacz AI, Carnegie Mellon University
6. dr Janusz Pętkowski — Ekspert ds. AI i astrobiolog, MIT
7. prof. Marek Cygan — Badacz AI, Uniwersytet Warszawski
8. Luke Kowalski — Wiceprezes, Oracle

---

## NOTATKI TECHNICZNE

- Szablon bazowy: `clients/pse/index.html` (ma 180k PLN, zaktualizowanych mentorów, Gawkowskiego wśród gości)
- CSS klasy `pse-` zostają we wszystkich deckach (standalone pliki, nie kolidują)
- Zamiana `\bPSE\b` (uppercase, word boundary) nie rusza CSS klas (są lowercase `pse-`)
- Skrypt masowej generacji: `scripts/generate-clients.js`
- Skrypt PDF: `scripts/generate-pdf.js` (obsługuje `node generate-pdf.js [slug]` lub `node generate-pdf.js all`)
- Assets: wszystkie obrazki w `assets/`, referencje z HTML przez `../../assets/`
- PDF: Puppeteer screenshotuje każdy slajd w 1440×810 @2x, łączy pdf-lib
